import { useEffect, useMemo, useState } from "react";
import {
  getConnectionStatus,
  listSessions,
  readScreenshot,
  updateSession,
  createWeek,
  updateWeek,
  listWeeks,
  deleteWeek,
} from "../lib/filmLogStorage";
import { DOWN_NAME, computeTendencies } from "../lib/filmLogTendencies";
import "./filmLogLibrary.css";

function Screenshot({ screenshot }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let active = true,
      objectUrl = "";
    readScreenshot(screenshot.thumbnailFilename || screenshot.thumbnail)
      .then((file) => {
        objectUrl = URL.createObjectURL(file);
        if (active) setUrl(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch(() => {});
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [screenshot.thumbnailFilename, screenshot.thumbnail]);
  return url ? (
    <img className="library__thumb" src={url} alt="Attached film screenshot" />
  ) : null;
}
function sessionLabel(session) {
  return session.subject === "opponent"
    ? `vs ${session.opponentName || "Opponent"}`
    : `Self · ${session.context || "Film"}`;
}
function resultSessionLabel(session) {
  return [
    session.week || "No week set",
    session.subject === "opponent"
      ? `vs ${session.opponentName || "Opponent"}`
      : `Self · ${session.context || "Film"}`,
    session.filmDate,
  ]
    .filter(Boolean)
    .join(" · ");
}
const COACHES = [
  {
    id: "football-scout",
    label: "Football Scout",
    hint: "Opponent tendencies and scouting",
  },
  {
    id: "self-improvement-coach",
    label: "Nick",
    hint: "Your own recurring patterns, practice prep",
  },
  {
    id: "game-plan-coordinator",
    label: "Game Plan Coordinator",
    hint: "Drafts the actual weekly plan",
  },
];
// Fast, deterministic, no AI wait -- a glance-able counterpart to asking a coach, not a replacement
// for one. Real sample-size discipline throughout: every number shows its own real N, no fraction
// or "tends to" claim stands alone, and a by-down pattern only surfaces at 3+ logged reps for that
// down, same bar football-scout itself uses. tally/byDownPattern/computeTendencies now live in
// ../lib/filmLogTendencies so FilmLog.jsx's single-session summary can reuse the exact same logic.
function TallyRow({ label, list, total }) {
  return list.length ? (
    <p className="library__tendency-row">
      <span>{label}</span>
      {list.map(([value, count]) => (
        <b key={value}>
          {value} ({count}/{total})
        </b>
      ))}
    </p>
  ) : null;
}
function WeekTendencies({ group }) {
  const stats = useMemo(
    () => computeTendencies(group.sessions),
    [group.sessions],
  );
  if (!stats.offenseCount && !stats.defenseCount)
    return (
      <p className="library__empty">
        No opponent film logged for this week yet -- tendencies show up once you
        log offense or defense reps.
      </p>
    );
  return (
    <div className="library__tendencies">
      <div className="library__tendencies-col">
        <h3>
          Their offense <small>{stats.offenseCount} logged reps</small>
        </h3>
        {!stats.offenseCount ? (
          <p className="library__empty">No offense reps logged yet.</p>
        ) : (
          <>
            {stats.playType.length > 0 && (
              <TallyRow
                label="Run/pass"
                list={stats.playType}
                total={stats.offenseCount}
              />
            )}
            <TallyRow
              label="Formation"
              list={stats.formation}
              total={stats.offenseCount}
            />
            <TallyRow
              label="Personnel"
              list={stats.personnel}
              total={stats.offenseCount}
            />
            {stats.offenseByDown.map((d) => (
              <p className="library__tendency-note" key={d.down}>
                On {DOWN_NAME[d.down] || d.down} down, {d.top[0]} {d.top[1]} of{" "}
                {d.total} logged times.
              </p>
            ))}
          </>
        )}
      </div>
      <div className="library__tendencies-col">
        <h3>
          Their defense <small>{stats.defenseCount} logged reps</small>
        </h3>
        {!stats.defenseCount ? (
          <p className="library__empty">No defense reps logged yet.</p>
        ) : (
          <>
            <TallyRow
              label="Coverage"
              list={stats.coverage}
              total={stats.defenseCount}
            />
            <TallyRow
              label="Front"
              list={stats.front}
              total={stats.defenseCount}
            />
            {stats.defenseByDown.map((d) => (
              <p className="library__tendency-note" key={d.down}>
                On {DOWN_NAME[d.down] || d.down} down, {d.top[0]} {d.top[1]} of{" "}
                {d.total} logged times.
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
// Module-level, not component state -- Xander's real complaint: switching tabs reset the whole
// conversation and dropped an in-flight reply. A React tab component unmounts/remounts every time
// he leaves and returns to Library; a plain module object survives that (it only resets on a real
// page reload), and a reply that lands while unmounted still updates here so it's there when he
// comes back, instead of silently vanishing into a dead component instance.
const coachStore = { chats: {}, busy: {}, error: {}, listeners: new Set() };
function notifyCoachStore() {
  for (const listener of coachStore.listeners) listener();
}
function useCoachStore() {
  const [, tick] = useState(0);
  useEffect(() => {
    const listener = () => tick((n) => n + 1);
    coachStore.listeners.add(listener);
    return () => coachStore.listeners.delete(listener);
  }, []);
  return coachStore;
}
async function sendToCoach(agent, text) {
  coachStore.chats[agent] = [
    ...(coachStore.chats[agent] || []),
    { role: "you", text },
  ];
  coachStore.busy[agent] = true;
  coachStore.error[agent] = "";
  notifyCoachStore();
  try {
    const response = await fetch("http://127.0.0.1:5199/ask-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, message: text }),
      }),
      payload = await response.json();
    if (!response.ok)
      throw new Error(payload.error || "Could not reach that agent.");
    coachStore.chats[agent] = [
      ...(coachStore.chats[agent] || []),
      { role: "coach", text: payload.reply },
    ];
  } catch (err) {
    const bridgeOffline =
      err instanceof TypeError ||
      /failed to fetch|networkerror/i.test(err.message);
    coachStore.error[agent] = bridgeOffline
      ? "Analysis bridge isn't running -- start it with `npm run dev`."
      : err.message || "Could not reach that agent.";
  } finally {
    coachStore.busy[agent] = false;
    notifyCoachStore();
  }
}

// Real memory files for one agent, fetched from the bridge's /agent-memory endpoint. Cached per
// agent in local state so re-opening "What I know" for a coach already visited this session is
// instant, but a coach never-yet-opened fetches fresh.
function MemoryPanel({ agent, memory, onRetry }) {
  return (
    <aside className="library__memory-panel">
      <div className="library__panel-heading">
        <span className="label">What {agent.label} knows</span>
        <small>Real memory files this agent has saved -- not a placeholder.</small>
      </div>
      {memory?.loading && (
        <p className="library__search-loading" role="status">
          <span className="library__spinner" aria-hidden="true" />
          Reading memory…
        </p>
      )}
      {memory?.error && (
        <>
          <p className="library__search-error" role="alert">
            {memory.error}
          </p>
          <button
            type="button"
            className="library__coach-tab"
            onClick={onRetry}
          >
            Retry
          </button>
        </>
      )}
      {memory?.loaded && !memory.loading && !memory.error && memory.files.length === 0 && (
        <p className="library__empty">
          No memory saved yet -- {agent.label} hasn't written anything down
          about you or this project so far.
        </p>
      )}
      {memory?.files.map((file) => (
        <details className="library__memory-file" key={file.filename}>
          <summary>{file.filename}</summary>
          <pre>{file.content.trim() || "(empty file)"}</pre>
        </details>
      ))}
    </aside>
  );
}

function CoachChat() {
  const store = useCoachStore();
  const [openCoach, setOpenCoach] = useState(null),
    [draft, setDraft] = useState(""),
    [memoryOpen, setMemoryOpen] = useState(false),
    [memoryByAgent, setMemoryByAgent] = useState({});
  const coach = COACHES.find((c) => c.id === openCoach);
  const messages = openCoach ? store.chats[openCoach] || [] : [],
    busy = openCoach ? !!store.busy[openCoach] : false,
    error = openCoach ? store.error[openCoach] || "" : "";
  const loadMemory = (agentId) => {
    setMemoryByAgent((prev) => ({
      ...prev,
      [agentId]: { loading: true, files: [], error: "", loaded: false },
    }));
    fetch("http://127.0.0.1:5199/agent-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent: agentId }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Could not read that agent's memory.");
        setMemoryByAgent((prev) => ({
          ...prev,
          [agentId]: {
            loading: false,
            files: payload.files || [],
            error: "",
            loaded: true,
          },
        }));
      })
      .catch((err) => {
        const bridgeOffline =
          err instanceof TypeError ||
          /failed to fetch|networkerror/i.test(err.message);
        setMemoryByAgent((prev) => ({
          ...prev,
          [agentId]: {
            loading: false,
            files: [],
            error: bridgeOffline
              ? "Analysis bridge isn't running -- start it with `npm run dev`."
              : err.message || "Could not read that agent's memory.",
            loaded: true,
          },
        }));
      });
  };
  const openCoachView = (id) => {
    setOpenCoach(id);
    setMemoryOpen(false);
  };
  const toggleMemory = () => {
    if (!memoryOpen && !memoryByAgent[openCoach]) loadMemory(openCoach);
    setMemoryOpen((value) => !value);
  };
  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy || !openCoach) return;
    setDraft("");
    sendToCoach(openCoach, text);
  };

  if (openCoach) {
    return (
      <div className="library__chat-takeover">
        <div className="library__chat-takeover-header">
          <button
            type="button"
            className="library__coach-back"
            onClick={() => setOpenCoach(null)}
          >
            ← Back to Library
          </button>
          <div className="library__chat-takeover-title">
            <b>{coach.label}</b>
            <small>{coach.hint}</small>
          </div>
          <button
            type="button"
            className={`library__coach-tab library__memory-toggle${memoryOpen ? " is-selected" : ""}`}
            onClick={toggleMemory}
          >
            What I know
          </button>
        </div>
        <div className="library__chat-takeover-body">
          <div className="library__coach-thread library__coach-thread--full">
            {messages.length === 0 && (
              <p className="library__empty">
                No messages yet -- ask about an opponent, your own recurring
                issues, or this week's game plan.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                className={`library__coach-message library__coach-message--${message.role}`}
                key={index}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {busy && (
              <p className="library__search-loading" role="status">
                <span className="library__spinner" aria-hidden="true" />
                Waiting on a real reply -- this can take a couple of minutes.
                Safe to switch tabs, it'll still be here.
              </p>
            )}
          </div>
          {memoryOpen && (
            <MemoryPanel
              agent={coach}
              memory={memoryByAgent[openCoach]}
              onRetry={() => loadMemory(openCoach)}
            />
          )}
        </div>
        {error && (
          <p className="library__search-error" role="alert">
            {error}
          </p>
        )}
        <form className="library__search-form library__chat-takeover-form" onSubmit={send}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask a question…"
            disabled={busy}
            autoFocus
          />
          <button
            type="submit"
            className="library__primary-btn"
            disabled={busy || !draft.trim()}
          >
            {busy ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="library__panel library__coach">
      <div className="library__panel-heading">
        <span className="label">Talk to your coaches</span>
        <small>
          Pick one to go into a real conversation -- expect a genuine wait,
          this is not instant. Switching tabs won't lose it.
        </small>
      </div>
      <div className="library__coach-picker">
        {COACHES.map((c) => {
          const count = (store.chats[c.id] || []).length;
          return (
            <button
              type="button"
              key={c.id}
              className="library__coach-card"
              onClick={() => openCoachView(c.id)}
            >
              <b>{c.label}</b>
              <small>{c.hint}</small>
              {store.busy[c.id] ? (
                <span className="library__coach-card-status library__coach-card-status--busy">
                  Replying…
                </span>
              ) : (
                count > 0 && (
                  <span className="library__coach-card-status library__coach-card-status--count">
                    {count} message{count === 1 ? "" : "s"}
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function FilmLogLibrary() {
  const [status, setStatus] = useState({
      state: "loading",
      message: "Checking Film Log folder…",
    }),
    [sessions, setSessions] = useState([]),
    [weeks, setWeeks] = useState([]),
    [expanded, setExpanded] = useState(() => new Set()),
    [expandedSession, setExpandedSession] = useState(() => new Set()),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState({
      loading: false,
      results: [],
      error: "",
      searched: false,
    }),
    [editingId, setEditingId] = useState(null),
    [editDraft, setEditDraft] = useState(null),
    [newWeek, setNewWeek] = useState(null),
    [editingWeek, setEditingWeek] = useState(null),
    [weekDraft, setWeekDraft] = useState(null);
  const connected = status.state === "connected";
  useEffect(() => {
    let active = true;
    const load = async () => {
      const nextStatus = await getConnectionStatus();
      if (!active) return;
      setStatus(nextStatus);
      if (nextStatus.state === "connected") {
        try {
          const [savedSessions, savedWeeks] = await Promise.all([
            listSessions(),
            listWeeks(),
          ]);
          if (active) {
            setSessions(savedSessions);
            setWeeks(savedWeeks);
          }
        } catch (error) {
          if (active)
            setStatus({
              state: "disconnected",
              message: error.message || "Could not read Film Log sessions.",
            });
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  const groups = useMemo(() => {
    const byWeek = new Map();
    for (const week of weeks)
      if (!byWeek.has(week.label))
        byWeek.set(week.label, { sessions: [], week });
    for (const session of sessions) {
      const label = session.week?.trim() || "No week set";
      if (!byWeek.has(label)) byWeek.set(label, { sessions: [], week: null });
      byWeek.get(label).sessions.push(session);
    }
    return [...byWeek.entries()].sort(([a], [b]) => {
      if (a === "No week set") return 1;
      if (b === "No week set") return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }, [sessions, weeks]);
  const addWeek = async (event) => {
    event.preventDefault();
    const label = newWeek.label.trim();
    if (!label) return;
    const created = await createWeek({
      label,
      opponent: newWeek.opponent.trim() || null,
      gameDate: newWeek.gameDate || null,
    });
    setWeeks((list) => [...list, created]);
    setNewWeek(null);
  };
  const removeWeek = async (event, label, group) => {
    event.stopPropagation();
    if (group.week) {
      if (
        !window.confirm(
          `Delete "${group.week.label}"? Sessions already using this week label are not affected.`,
        )
      )
        return;
      await deleteWeek(group.week.id);
      setWeeks((list) => list.filter((item) => item.id !== group.week.id));
    } else {
      if (group.sessions.length === 0) return;
      if (
        !window.confirm(
          `Clear the week label "${label}" from ${group.sessions.length} session(s)? The sessions themselves are not deleted.`,
        )
      )
        return;
      for (const session of group.sessions) {
        const next = await updateSession(session.id, { week: null });
        setSessions((list) =>
          list.map((item) => (item.id === next.id ? next : item)),
        );
      }
    }
  };
  const startWeekEdit = (event, label, group) => {
    event.stopPropagation();
    setEditingWeek(label);
    setWeekDraft({
      label: group.week?.label ?? (label === "No week set" ? "" : label),
      opponent: group.week?.opponent || "",
      gameDate: group.week?.gameDate || "",
    });
  };
  const cancelWeekEdit = (event) => {
    event?.stopPropagation();
    setEditingWeek(null);
    setWeekDraft(null);
  };
  const saveWeekEdit = async (event, label, group) => {
    event.preventDefault();
    event.stopPropagation();
    const nextLabel = weekDraft.label.trim();
    if (!nextLabel) return;
    const patch = {
      label: nextLabel,
      opponent: weekDraft.opponent.trim() || null,
      gameDate: weekDraft.gameDate || null,
    };
    const saved = group.week
      ? await updateWeek(group.week.id, patch)
      : await createWeek(patch);
    setWeeks((list) =>
      group.week
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [...list, saved],
    );
    if (nextLabel !== label)
      for (const session of group.sessions) {
        const next = await updateSession(session.id, { week: nextLabel });
        setSessions((list) =>
          list.map((item) => (item.id === next.id ? next : item)),
        );
      }
    setEditingWeek(null);
    setWeekDraft(null);
  };
  const toggle = (setValue, key) =>
    setValue((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const startEdit = (event, session) => {
    event.stopPropagation();
    setEditingId(session.id);
    setEditDraft({
      week: session.week || "",
      opponentName: session.opponentName || "",
      filmDate: session.filmDate || "",
      videoLink: session.videoLink || "",
    });
  };
  const cancelEdit = (event) => {
    event?.stopPropagation();
    setEditingId(null);
    setEditDraft(null);
  };
  const saveEdit = async (event, session) => {
    event.preventDefault();
    event.stopPropagation();
    const patch = {
      week: editDraft.week.trim() || null,
      filmDate: editDraft.filmDate || null,
      videoLink: editDraft.videoLink.trim() || null,
      ...(session.subject === "opponent"
        ? { opponentName: editDraft.opponentName.trim() || null }
        : {}),
    };
    const next = await updateSession(session.id, patch);
    setSessions((list) =>
      list.map((item) => (item.id === next.id ? next : item)),
    );
    setEditingId(null);
    setEditDraft(null);
  };
  const knownWeeks = useMemo(
    () => [...new Set(sessions.map((item) => item.week).filter(Boolean))],
    [sessions],
  );
  const runSearch = async (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setSearch({ loading: true, results: [], error: "", searched: true });
    try {
      const response = await fetch("http://127.0.0.1:5199/search-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: value }),
        }),
        payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Could not search Film Log notes.");
      setSearch({
        loading: false,
        results: payload.results || [],
        error: "",
        searched: true,
      });
    } catch (error) {
      const bridgeOffline =
        error instanceof TypeError ||
        /failed to fetch|networkerror/i.test(error.message);
      setSearch({
        loading: false,
        results: [],
        error: bridgeOffline
          ? "Analysis bridge isn't running -- start it with `npm run dev`."
          : error.message || "Could not search Film Log notes.",
        searched: true,
      });
    }
  };
  return (
    <div className="library">
      <div
        className={`library__connection library__connection--${status.state}`}
        role={connected ? "status" : "alert"}
      >
        {status.message}
      </div>
      <CoachChat />
      <section className="library__panel library__search">
        <div className="library__panel-heading">
          <span className="label">Find similar notes</span>
          <small>
            Search every logged Film Log session with a plain-language question.
          </small>
        </div>
        <form className="library__search-form" onSubmit={runSearch}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. opponent tendencies against pressure"
          />
          <button
            type="submit"
            className="library__primary-btn"
            disabled={search.loading || !query.trim()}
          >
            {search.loading ? "Searching notes…" : "Find similar notes"}
          </button>
        </form>
        {search.loading && (
          <p className="library__search-loading" role="status">
            <span className="library__spinner" aria-hidden="true" />
            Searching every logged note. This can take 30–90 seconds.
          </p>
        )}
        {search.error && (
          <p className="library__search-error" role="alert">
            {search.error}
          </p>
        )}
        {search.searched &&
          !search.loading &&
          !search.error &&
          search.results.length === 0 && (
            <p className="library__empty">No relevant notes found.</p>
          )}
        {search.results.map((result) => (
          <article className="library__result" key={result.entryId}>
            <div className="library__result-heading">
              <span>{resultSessionLabel(result.session)}</span>
              <small>{result.reason}</small>
            </div>
            <div className="library__result-entry">
              {result.entry.screenshots?.[0] && (
                <Screenshot screenshot={result.entry.screenshots[0]} />
              )}
              <div>
                {result.entry.unit && <i>{result.entry.unit}</i>}
                {result.entry.playNameSnapshot && (
                  <b>{result.entry.playNameSnapshot}</b>
                )}
                <p>{result.entry.body}</p>
                {result.entry.tags?.length > 0 && (
                  <div className="library__tags">
                    {result.entry.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
      <datalist id="library-known-weeks">
        {knownWeeks.map((week) => (
          <option key={week} value={week} />
        ))}
      </datalist>
      <section className="library__sessions">
        <div className="library__panel-heading">
          <span className="label">Film Log library</span>
          <small>
            {connected
              ? `${sessions.length} saved ${sessions.length === 1 ? "session" : "sessions"}, organized by week.`
              : "Connect the Football project folder in Film Log to browse saved sessions."}
          </small>
        </div>
        {connected && (
          <>
            {newWeek ? (
              <form className="library__edit-form" onSubmit={addWeek}>
                <label className="label">
                  Week
                  <input
                    autoFocus
                    value={newWeek.label}
                    onChange={(event) =>
                      setNewWeek((value) => ({
                        ...value,
                        label: event.target.value,
                      }))
                    }
                    placeholder="e.g. Week 1"
                  />
                </label>
                <label className="label">
                  Opponent (optional)
                  <input
                    value={newWeek.opponent}
                    onChange={(event) =>
                      setNewWeek((value) => ({
                        ...value,
                        opponent: event.target.value,
                      }))
                    }
                    placeholder="Who you're playing"
                  />
                </label>
                <label className="label">
                  Game date (optional)
                  <input
                    type="date"
                    value={newWeek.gameDate}
                    onChange={(event) =>
                      setNewWeek((value) => ({
                        ...value,
                        gameDate: event.target.value,
                      }))
                    }
                  />
                </label>
                <div className="library__edit-actions">
                  <button
                    type="button"
                    className="library__coach-tab"
                    onClick={() => setNewWeek(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="library__primary-btn">
                    Add week
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="library__primary-btn"
                onClick={() =>
                  setNewWeek({ label: "", opponent: "", gameDate: "" })
                }
              >
                + Add week
              </button>
            )}
          </>
        )}
        {connected && groups.length === 0 && (
          <p className="library__empty">No saved Film Log sessions yet.</p>
        )}
        {groups.map(([label, group]) => {
          const isOpen = expanded.has(label);
          return (
            <div
              className={`library__week${isOpen ? " is-open" : ""}`}
              key={label}
            >
              <div
                className="library__week-header"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => toggle(setExpanded, label)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") toggle(setExpanded, label);
                }}
              >
                <svg
                  className="library__week-caret"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                >
                  <path
                    d="M3 1.5 7 5 3 8.5"
                    fill="none"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  {label}
                  {group.week?.opponent ? ` · vs ${group.week.opponent}` : ""}
                  {group.week?.gameDate ? ` · ${group.week.gameDate}` : ""}
                </span>
                <small>{group.sessions.length}</small>
                {label !== "No week set" && (
                  <>
                    <button
                      type="button"
                      className="library__session-edit"
                      onClick={(event) => startWeekEdit(event, label, group)}
                    >
                      Manage
                    </button>
                    <button
                      type="button"
                      className="library__session-edit"
                      onClick={(event) => removeWeek(event, label, group)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              {editingWeek === label && (
                <form
                  className="library__edit-form"
                  onSubmit={(event) => saveWeekEdit(event, label, group)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <label>
                    Week
                    <input
                      autoFocus
                      value={weekDraft.label}
                      onChange={(event) =>
                        setWeekDraft((value) => ({
                          ...value,
                          label: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Opponent (optional)
                    <input
                      value={weekDraft.opponent}
                      onChange={(event) =>
                        setWeekDraft((value) => ({
                          ...value,
                          opponent: event.target.value,
                        }))
                      }
                      placeholder="Who you're playing"
                    />
                  </label>
                  <label>
                    Game date (optional)
                    <input
                      type="date"
                      value={weekDraft.gameDate}
                      onChange={(event) =>
                        setWeekDraft((value) => ({
                          ...value,
                          gameDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="library__edit-actions">
                    <button
                      type="button"
                      className="library__coach-tab"
                      onClick={cancelWeekEdit}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="library__primary-btn">
                      Save
                    </button>
                  </div>
                </form>
              )}
              {isOpen && (
                <div className="library__week-sessions">
                  {label !== "No week set" && <WeekTendencies group={group} />}
                  {group.sessions.length === 0 && (
                    <p className="library__empty">
                      No film sessions logged for this week yet.
                    </p>
                  )}
                  {group.sessions.map((session) => {
                    const sessionOpen = expandedSession.has(session.id);
                    return (
                      <div
                        className={`library__session${sessionOpen ? " is-open" : ""}`}
                        key={session.id}
                      >
                        <div
                          className="library__session-header"
                          role="button"
                          tabIndex={0}
                          aria-expanded={sessionOpen}
                          onClick={() => toggle(setExpandedSession, session.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter")
                              toggle(setExpandedSession, session.id);
                          }}
                        >
                          <div>
                            <b>{sessionLabel(session)}</b>
                            <span>{session.filmDate || "No film date"}</span>
                          </div>
                          <small>
                            {session.entries?.length || 0}{" "}
                            {session.entries?.length === 1 ? "note" : "notes"}
                          </small>
                          <button
                            type="button"
                            className="library__session-edit"
                            onClick={(event) => startEdit(event, session)}
                          >
                            Edit
                          </button>
                        </div>
                        {editingId === session.id && (
                          <form
                            className="library__edit-form"
                            onSubmit={(event) => saveEdit(event, session)}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <label>
                              Week
                              <input
                                value={editDraft.week}
                                onChange={(event) =>
                                  setEditDraft((value) => ({
                                    ...value,
                                    week: event.target.value,
                                  }))
                                }
                                placeholder="e.g. Week 0"
                                list="library-known-weeks"
                              />
                            </label>
                            {session.subject === "opponent" && (
                              <label>
                                Opponent
                                <input
                                  value={editDraft.opponentName}
                                  onChange={(event) =>
                                    setEditDraft((value) => ({
                                      ...value,
                                      opponentName: event.target.value,
                                    }))
                                  }
                                />
                              </label>
                            )}
                            <label>
                              Film date
                              <input
                                type="date"
                                value={editDraft.filmDate}
                                onChange={(event) =>
                                  setEditDraft((value) => ({
                                    ...value,
                                    filmDate: event.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label>
                              Video link
                              <input
                                type="url"
                                value={editDraft.videoLink}
                                onChange={(event) =>
                                  setEditDraft((value) => ({
                                    ...value,
                                    videoLink: event.target.value,
                                  }))
                                }
                                placeholder="https://…"
                              />
                            </label>
                            <div className="library__edit-actions">
                              <button
                                type="button"
                                className="library__coach-tab"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="library__primary-btn"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        )}
                        {sessionOpen && (
                          <div className="library__entries">
                            {(session.entries || []).length === 0 ? (
                              <p className="library__empty">
                                No notes in this session.
                              </p>
                            ) : (
                              (session.entries || []).map((entry) => (
                                <article
                                  className="library__entry"
                                  key={entry.id}
                                >
                                  {entry.screenshots?.[0] && (
                                    <Screenshot
                                      screenshot={entry.screenshots[0]}
                                    />
                                  )}
                                  <div>
                                    <div className="library__entry-meta">
                                      <i>{entry.unit || "self"}</i>
                                      <small>
                                        {entry.playNameSnapshot ||
                                          "not matched"}
                                      </small>
                                    </div>
                                    <p>{entry.body}</p>
                                    {entry.tags?.length > 0 && (
                                      <div className="library__tags">
                                        {entry.tags.map((tag) => (
                                          <span key={tag}>{tag}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </article>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
