import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStroke } from "perfect-freehand";
import "./playbookTrainer.css";
import FilmLog from "./FilmLog";
import FilmLogLibrary from "./FilmLogLibrary";
import seed from "../data/playbook-trainer-seed.json";
import { loadDayStreak, recordActivity } from "../lib/dayStreak";

const STORAGE_KEY = "playbook-trainer-deck-v1";
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "formation", label: "Formations" },
  { value: "concept", label: "Pass Concepts" },
  { value: "fullfield", label: "Full-Field" },
];
const CATEGORY_SELECT_OPTIONS = [
  { value: "formation", label: "Formation" },
  { value: "concept", label: "Pass Concept" },
  { value: "fullfield", label: "Full-Field" },
];
const CANVAS_W = 480,
  BOARD_W = 580,
  CANVAS_H = 300,
  SNAP_DISTANCE = 22,
  FORMATION_SNAP_DISTANCE = 34;
// Starts generous (55s at box 1, real time to visualize + draw) and tightens as a card's own box
// climbs, floor of 45s at box 5 -- Xander's own standard: "as the streak goes on that number gets
// smaller," never so fast it's impossible. Bumped +15s across the board from the original 40/30
// after his own first live test: the auto-fail logic worked correctly, the starting number was
// just too tight for someone still learning the actual drawing motion, not just the play. Snap-to-
// formation off means hand-placing every player from memory, genuinely slower even at full mastery,
// so it gets a real bonus, not a token one.
const SNAP_OFF_BONUS_SECONDS = 15;
function timeLimitSeconds(box, snapEnabled) {
  return (
    Math.max(45, 55 - (Math.max(1, box) - 1) * 3) +
    (snapEnabled ? 0 : SNAP_OFF_BONUS_SECONDS)
  );
}
const BASE_BUBBLES = [
  ["QB", 240, 218],
  ["OL_LT", 176, 180],
  ["OL_LG", 208, 180],
  ["OL_RG", 272, 180],
  ["OL_RT", 304, 180],
].map(([type, x, y]) => ({ id: type.toLowerCase(), type, x, y }));
const SKILL_TRAY = [
  ["X", 520, 56],
  ["H", 520, 112],
  ["Y", 520, 168],
  ["Z", 520, 224],
  ["T", 520, 280],
];
// The OL sits on the 30-yard line (y=180) -- that IS the line of scrimmage. These are
// deliberately few, useful football alignments rather than a loose pixel grid.
const FORMATION_SLOTS = {
  QB: [
    [240, 218],
    [240, 240],
    [220, 218],
    [260, 218],
  ],
  OL_LT: [
    [176, 180],
    [176, 166],
  ],
  OL_LG: [
    [208, 180],
    [208, 166],
  ],
  OL_RG: [
    [272, 180],
    [272, 166],
  ],
  OL_RT: [
    [304, 180],
    [304, 166],
  ],
  X: [
    [56, 56],
    [56, 104],
    [96, 56],
    [96, 104],
    [132, 126],
  ],
  H: [
    [140, 116],
    [158, 136],
    [186, 118],
    [188, 174],
    [112, 154],
    [292, 154],
    [322, 118],
    [340, 136],
  ],
  Y: [
    [154, 126],
    [170, 142],
    [200, 118],
    [280, 118],
    [310, 142],
    [326, 126],
  ],
  Z: [
    [424, 56],
    [424, 104],
    [384, 56],
    [384, 104],
    [348, 126],
  ],
  T: [
    [160, 180],
    [320, 180],
    [148, 166],
    [332, 166],
    [186, 156],
    [294, 156],
  ],
};

function loadDeck() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(raw)) return raw;
  } catch {}
  return structuredClone(seed);
}
const SAVE_ERROR_EVENT = "playbook-trainer-save-error";
function saveDeck(deck) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch {
    window.dispatchEvent(new CustomEvent(SAVE_ERROR_EVENT));
  }
}
function blankSession() {
  return { attempts: 0, correct: 0, streak: 0, best: 0 };
}
function weightedPick(pool, excludeId) {
  const candidates =
    pool.length > 2 ? pool.filter((c) => c.id !== excludeId) : pool;
  const list = candidates.length ? candidates : pool;
  let roll = Math.random() * list.reduce((sum, c) => sum + (6 - c.box), 0);
  for (const c of list) {
    roll -= 6 - c.box;
    if (roll <= 0) return c;
  }
  return list.at(-1);
}
function buildPrompt(name, variation) {
  return variation ? `${name} — ${variation}` : name;
}
function tagsFor(card) {
  return [card.variation].filter(Boolean);
}
function createDiagram() {
  return {
    bubbles: [
      ...BASE_BUBBLES,
      ...SKILL_TRAY.map(([type, x, y]) => ({
        id: type.toLowerCase(),
        type,
        x,
        y,
      })),
    ],
    lines: [],
  };
}
function normalDiagram(diagram) {
  return diagram && typeof diagram === "object" ? diagram : null;
}
function pathFromStroke(points) {
  if (!points.length) return "";
  const d = points.reduce(
    (path, p, i) =>
      `${path}${i ? " L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
    "",
  );
  return `${d} Z`;
}
function strokePath(points) {
  return pathFromStroke(
    getStroke(
      points.map((p) => [p.x, p.y, 0.5]),
      { size: 3.6, smoothing: 0.9, streamline: 0.78, thinning: 0 },
    ),
  );
}

function useDrillCard(pool) {
  const [currentId, setCurrentId] = useState(null);
  const poolRef = useRef(pool);
  useEffect(() => {
    poolRef.current = pool;
  });
  const advance = useCallback((excludeId) => {
    const p = poolRef.current;
    setCurrentId(p.length ? weightedPick(p, excludeId).id : null);
  }, []);
  const poolIds = pool.map((c) => c.id).join(",");
  useEffect(() => {
    if (!pool.length) {
      setCurrentId(null);
      return;
    }
    if (!pool.some((c) => c.id === currentId)) advance(currentId);
  }, [poolIds]);
  return { current: pool.find((c) => c.id === currentId) || null, advance };
}
function PillGroup({ label, options, value, onChange }) {
  return (
    <div className="playbook-trainer__pillgroup">
      <span className="playbook-trainer__pillgroup-label label">{label}</span>
      <div
        className="playbook-trainer__pills"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={`playbook-trainer__pill${value === opt.value ? " is-selected" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
// Yard lines only, at the same y-positions as before (60/120/180/240 -- the OL/LOS at y=180
// is unmoved) but now labeled every 5 yards instead of every 10, so the field reads as ~20
// real yards of depth instead of ~40. That's the fix, not new lines -- the old thin five-yard
// sub-lines are gone since these ARE the five-yard marks now (a separate 2.5-yard tier isn't a
// real football unit). Bubble/FORMATION_SLOTS coordinates are untouched by this component.
function FieldBackground() {
  const lines = [60, 120, 180, 240];
  const bands = [0, 120, 240];
  const hashX = [CANVAS_W / 4, (CANVAS_W * 3) / 4];
  return (
    <svg
      className="playbook-trainer__field-bg"
      viewBox={`0 0 ${BOARD_W} ${CANVAS_H}`}
      aria-hidden="true"
    >
      <rect
        width={CANVAS_W}
        height={CANVAS_H}
        className="playbook-trainer__field-turf"
      />
      {bands.map((y) => (
        <rect
          key={y}
          y={y}
          width={CANVAS_W}
          height="60"
          className="playbook-trainer__field-band"
        />
      ))}
      {lines.map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2={CANVAS_W}
          y2={y}
          className="playbook-trainer__field-yardline"
        />
      ))}
      {hashX.map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2={CANVAS_H}
          className="playbook-trainer__field-hash"
        />
      ))}
      {lines.flatMap((y, i) => [
        <text
          key={`nl${y}`}
          x="9"
          y={y - 7}
          className="playbook-trainer__field-number"
        >
          {(i + 1) * 5}
        </text>,
        <text
          key={`nr${y}`}
          x={CANVAS_W - 9}
          y={y - 7}
          textAnchor="end"
          className="playbook-trainer__field-number"
        >
          {(i + 1) * 5}
        </text>,
      ])}
      <line
        x1={CANVAS_W + 1.5}
        y1="0"
        x2={CANVAS_W + 1.5}
        y2={CANVAS_H}
        className="playbook-trainer__field-trayline"
      />
    </svg>
  );
}
function Bubble({ bubble, editable, bubblesLocked, onDragStart }) {
  const isQb = bubble.type === "QB";
  return (
    <g
      className={`playbook-trainer__bubble playbook-trainer__bubble--${bubble.type.toLowerCase()}${editable && !bubblesLocked ? " is-editable" : ""}`}
      transform={`translate(${bubble.x} ${bubble.y})`}
      onPointerDown={(e) => editable && !bubblesLocked && onDragStart(e, bubble.id)}
    >
      {isQb ? (
        <rect x="-13" y="-10" width="26" height="20" rx="2" />
      ) : (
        <circle r={bubble.type.startsWith("OL_") ? 9 : 14} />
      )}
      <text dy=".35em">
        {isQb ? "QB" : bubble.type.startsWith("OL_") ? "" : bubble.type}
      </text>
    </g>
  );
}
function DiagramSvg({
  diagram,
  editable = false,
  onChange,
  tool = "freehand",
  snapFormation = true,
  bubblesLocked = false,
}) {
  const svgRef = useRef(null),
    activeLineRef = useRef(null),
    drag = useRef(null);
  const [activeLine, setActiveLine] = useState(null),
    [snap, setSnap] = useState(null),
    [formationSnap, setFormationSnap] = useState(null);
  const point = (event) => {
    const r = svgRef.current.getBoundingClientRect();
    return {
      x: Math.max(
        0,
        Math.min(BOARD_W, ((event.clientX - r.left) * BOARD_W) / r.width),
      ),
      y: Math.max(
        0,
        Math.min(CANVAS_H, ((event.clientY - r.top) * CANVAS_H) / r.height),
      ),
    };
  };
  const setWorkingLine = (line) => {
    activeLineRef.current = line;
    setActiveLine(line);
  };
  const snapPoint = (raw) => {
    const endpoints = diagram.lines.flatMap((line) =>
      Array.isArray(line.points) && line.points.length
        ? [line.points[0], line.points.at(-1)]
        : [],
    );
    const activeStart = activeLineRef.current?.points?.[0]
      ? [activeLineRef.current.points[0]]
      : [];
    const points = [...diagram.bubbles, ...endpoints, ...activeStart];
    const nearest = points.reduce(
      (best, candidate) => {
        const d = Math.hypot(raw.x - candidate.x, raw.y - candidate.y);
        return d < best.d ? { candidate, d } : best;
      },
      { d: Infinity },
    );
    if (nearest.d <= SNAP_DISTANCE) {
      setSnap(nearest.candidate);
      return { x: nearest.candidate.x, y: nearest.candidate.y };
    }
    setSnap(null);
    return raw;
  };
  const nearestFormationSlot = (bubble, raw) => {
    const slots = FORMATION_SLOTS[bubble.type] || [];
    const nearest = slots.reduce(
      (best, slot) => {
        const d = Math.hypot(raw.x - slot[0], raw.y - slot[1]);
        return d < best.d ? { slot, d } : best;
      },
      { d: Infinity },
    );
    return nearest.d <= FORMATION_SNAP_DISTANCE
      ? { x: nearest.slot[0], y: nearest.slot[1] }
      : null;
  };
  const startDraw = (e) => {
    if (!editable || e.button !== 0) return;
    const p = snapPoint(point(e));
    svgRef.current.setPointerCapture(e.pointerId);
    setWorkingLine({ id: crypto.randomUUID(), tool, points: [p] });
  };
  const move = (e) => {
    if (!editable) return;
    const raw = point(e);
    if (drag.current) {
      const bubble = diagram.bubbles.find((b) => b.id === drag.current);
      const locked = snapFormation ? nearestFormationSlot(bubble, raw) : null;
      setFormationSnap(locked);
      const position = locked || raw;
      onChange({
        ...diagram,
        bubbles: diagram.bubbles.map((b) =>
          b.id === drag.current ? { ...b, ...position } : b,
        ),
      });
      return;
    }
    const line = activeLineRef.current;
    if (!line) return;
    // Freehand points are pixel samples along the actual stroke -- snapping every one of them
    // to the nearest bubble/endpoint (like a straight line's live endpoint correctly does) made
    // the stroke visibly stick to a bubble for several samples any time it passed within
    // SNAP_DISTANCE, since the same nearby point kept winning. Only the real start (startDraw)
    // and the final released point (stop) snap for freehand now; the path in between follows the
    // cursor exactly.
    if (line.tool === "freehand") {
      setWorkingLine({ ...line, points: [...line.points, raw] });
      return;
    }
    const p = snapPoint(raw);
    setWorkingLine({ ...line, points: [line.points[0], p] });
  };
  const stop = (e) => {
    if (drag.current) {
      drag.current = null;
      setFormationSnap(null);
    }
    let line = activeLineRef.current;
    // Pointer-up is the authoritative final coordinate: this makes the visible lock exact
    // even when the browser did not dispatch a final pointer-move event.
    if (line && e.type === "pointerup") {
      const p = snapPoint(point(e));
      line = {
        ...line,
        points:
          line.tool === "freehand" ? [...line.points, p] : [line.points[0], p],
      };
    }
    if (
      line?.points.length > 1 &&
      Math.hypot(
        line.points.at(-1).x - line.points[0].x,
        line.points.at(-1).y - line.points[0].y,
      ) > 3
    )
      onChange({ ...diagram, lines: [...diagram.lines, line] });
    setWorkingLine(null);
    setSnap(null);
    if (svgRef.current?.hasPointerCapture?.(e.pointerId))
      svgRef.current.releasePointerCapture(e.pointerId);
  };
  const startDrag = (e, id) => {
    e.stopPropagation();
    drag.current = id;
    svgRef.current.setPointerCapture(e.pointerId);
  };
  const renderRoute = (line, active = false) => {
    const points = line.points || [],
      className = `playbook-trainer__route${active ? " is-active" : ""}`;
    if (points.length < 2) return null;
    if (line.tool === "line" || line.tool === "arrow")
      return (
        <line
          className={`${className} playbook-trainer__route--straight`}
          x1={points[0].x}
          y1={points[0].y}
          x2={points.at(-1).x}
          y2={points.at(-1).y}
          markerEnd={
            line.tool === "arrow" ? "url(#playbook-arrowhead)" : undefined
          }
        />
      );
    return <path className={className} d={strokePath(points)} />;
  };
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${BOARD_W} ${CANVAS_H}`}
      className={`playbook-trainer__diagram${editable ? " is-editable" : ""}${activeLine ? " is-drawing" : ""}`}
      onPointerDown={startDraw}
      onPointerMove={move}
      onPointerUp={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      <defs>
        <marker
          id="playbook-arrowhead"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 8 4 L 0 8 z"
            className="playbook-trainer__arrowhead"
          />
        </marker>
      </defs>
      {diagram.lines.map((line) => (
        <g key={line.id}>
          {renderRoute(line)}
          {Array.isArray(line.points) && line.points.length > 1 && (
            <circle
              className="playbook-trainer__connection"
              cx={line.points.at(-1).x}
              cy={line.points.at(-1).y}
              r="3"
            />
          )}
        </g>
      ))}
      {activeLine && renderRoute(activeLine, true)}
      {formationSnap && (
        <circle
          className="playbook-trainer__formation-snap"
          cx={formationSnap.x}
          cy={formationSnap.y}
          r="17"
        />
      )}
      {diagram.bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          bubble={bubble}
          editable={editable}
          bubblesLocked={bubblesLocked}
          onDragStart={startDrag}
        />
      ))}
      {snap && (
        <circle
          className="playbook-trainer__snap"
          cx={snap.x}
          cy={snap.y}
          r="6"
        />
      )}
    </svg>
  );
}
function DiagramBoard({
  diagram,
  editable,
  onChange,
  snapFormation = true,
  bubblesLocked = false,
}) {
  const [tool, setTool] = useState("freehand");
  const canUndo = editable && diagram.lines.length > 0;
  const undoLastLine = () =>
    onChange({ ...diagram, lines: diagram.lines.slice(0, -1) });
  return (
    <div className="playbook-trainer__diagram-editor">
      {editable && (
        <div
          className="playbook-trainer__tool-palette"
          role="toolbar"
          aria-label="Diagram drawing tools"
        >
          <span className="label">Draw</span>
          {[
            [
              "freehand",
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 2.5l2.5 2.5L4.5 12 2 9.5 9 2.5z" />
                <path d="M11.5 5L13 3.5c.8-.8.8-2 0-2.8l-.2-.2c-.8-.8-2-.8-2.8 0L8.5 2.5" />
              </svg>,
              "Freehand",
            ],
            [
              "line",
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="12" x2="12" y2="2" />
              </svg>,
              "Line",
            ],
            [
              "arrow",
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 7h8M7 3l5 4-5 4" />
              </svg>,
              "Arrow",
            ],
          ].map(([value, icon, label]) => (
            <button
              key={value}
              type="button"
              className={tool === value ? "is-selected" : ""}
              aria-pressed={tool === value}
              onClick={() => setTool(value)}
              title={label}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
          <button
            type="button"
            className="playbook-trainer__tool-undo"
            disabled={!canUndo}
            onClick={undoLastLine}
            title="Undo last route"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4L3 7l3 3" />
              <path d="M3 7h6c2.2 0 4 1.8 4 4" />
            </svg>
            <span>Undo</span>
          </button>
        </div>
      )}
      <div className="playbook-trainer__canvas-wrap">
        <FieldBackground />
        <DiagramSvg
          diagram={diagram}
          editable={editable}
          onChange={onChange}
          tool={tool}
          snapFormation={snapFormation}
          bubblesLocked={bubblesLocked}
        />
      </div>
      {editable && (
        <aside className="playbook-trainer__position-tray">
          <b>Personnel & routes</b>
          <span>
            {snapFormation
              ? "Drag players onto a highlighted formation slot. "
              : "Drag players freely to set the exact formation. "}
            Routes lock to bubbles and route endpoints; use Arrow for route
            direction.
          </span>
        </aside>
      )}
    </div>
  );
}
function DiagramView({ diagram, className = "" }) {
  const value = normalDiagram(diagram);
  return (
    value && (
      <div className={`playbook-trainer__answer-diagram ${className}`}>
        <DiagramBoard diagram={value} />
      </div>
    )
  );
}
function Hud({ session, mastered, total, dayStreak }) {
  const accuracy = session.attempts
    ? Math.round((session.correct / session.attempts) * 100)
    : null;
  return (
    <div className="playbook-trainer__hud">
      <div className="playbook-trainer__hud-stat">
        <b>{accuracy === null ? "—" : `${accuracy}%`}</b>
        <small>accuracy this session</small>
      </div>
      <div className="playbook-trainer__hud-stat">
        <b>{session.streak}</b>
        <small>streak</small>
      </div>
      <div className="playbook-trainer__hud-stat">
        <b>
          {mastered}/{total}
        </b>
        <small>mastered</small>
      </div>
      <div className="playbook-trainer__hud-stat">
        <b>{dayStreak?.current || 0}</b>
        <small>day streak</small>
      </div>
    </div>
  );
}
function SessionRail({ session, pool, dayStreak, title }) {
  const accuracy = session.attempts
    ? Math.round((session.correct / session.attempts) * 100)
    : null;
  const distribution = [1, 2, 3, 4, 5].map((box) => ({
    box,
    count: pool.filter((c) => c.box === box).length,
  }));
  return (
    <aside className="playbook-trainer__session-rail">
      <span className="playbook-trainer__rail-title label">{title}</span>
      <div className="playbook-trainer__rail-stat">
        <b>{accuracy === null ? "—" : `${accuracy}%`}</b>
        <small>accuracy this session</small>
      </div>
      <div className="playbook-trainer__rail-stat">
        <b>{session.streak}</b>
        <small>streak</small>
      </div>
      <div className="playbook-trainer__rail-stat">
        <b>{dayStreak?.current || 0}</b>
        <small>day streak</small>
      </div>
      <div className="playbook-trainer__rail-block">
        <span className="label">Box distribution</span>
        <div className="playbook-trainer__box-stack">
          {distribution.map(({ box, count }) => (
            <div className="playbook-trainer__box-row" key={box}>
              <span>Box {box}</span>
              <b>{count}</b>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
function EmptyState({ children }) {
  return <p className="playbook-trainer__status">{children}</p>;
}
function PracticeTab({ deck, category, session, gradeAndAdvance, dayStreak }) {
  const pool = useMemo(
    () =>
      category === "all" ? deck : deck.filter((c) => c.category === category),
    [deck, category],
  );
  const drill = useDrillCard(pool);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setRevealed(false), [drill.current?.id]);
  return (
    <div className="playbook-trainer__workspace">
      <SessionRail
        session={session}
        pool={pool}
        dayStreak={dayStreak}
        title="Practice session"
      />
      <div className="playbook-trainer__stage">
        {!pool.length ? (
          <EmptyState>
            No cards in this category yet — add some in Manage.
          </EmptyState>
        ) : (
          drill.current && (
            <div className="playbook-trainer__card">
              <FormationLabel card={drill.current} deck={deck} />
              <p className="playbook-trainer__card-name">
                {drill.current.prompt}
              </p>
              {tagsFor(drill.current).length > 0 && (
                <div className="playbook-trainer__tags">
                  {tagsFor(drill.current).map((t) => (
                    <i key={t}>{t}</i>
                  ))}
                </div>
              )}
              {!revealed ? (
                <button
                  type="button"
                  className="playbook-trainer__reveal-btn"
                  onClick={() => setRevealed(true)}
                >
                  Reveal answer
                </button>
              ) : (
                <div className="playbook-trainer__reveal">
                  <p className="playbook-trainer__answer-text">
                    {drill.current.answerText}
                  </p>
                  <DiagramView diagram={drill.current.answerDiagram} />
                  <GradeRow
                    onGrade={(gotIt) =>
                      gradeAndAdvance(drill, drill.current, gotIt)
                    }
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
function GradeRow({ onGrade }) {
  return (
    <div className="playbook-trainer__grade-row">
      <button
        type="button"
        className="playbook-trainer__grade-btn playbook-trainer__grade-btn--miss"
        onClick={() => onGrade(false)}
      >
        Missed it
      </button>
      <button
        type="button"
        className="playbook-trainer__grade-btn playbook-trainer__grade-btn--got"
        onClick={() => onGrade(true)}
      >
        Got it
      </button>
    </div>
  );
}
function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60),
    s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function DrawTab({ deck, category, session, gradeAndAdvance, dayStreak }) {
  const pool = useMemo(
    () =>
      category === "all" ? deck : deck.filter((c) => c.category === category),
    [deck, category],
  );
  const drawPool = useMemo(
    () =>
      pool.filter((c) => {
        if (!normalDiagram(c.answerDiagram) || c.drawHidden) return false;
        // A concept/full-field card tied to a specific formation (e.g. "Flood" paired with
        // Bunch Left) is only drawable while that formation is itself visible in Draw --
        // hiding the formation was silently doing nothing for the harder cards built on it.
        const pairedFormation = formationFor(c, deck);
        return !pairedFormation?.drawHidden;
      }),
    [pool, deck],
  );
  const missingDiagramCount = useMemo(
    () => pool.filter((c) => !normalDiagram(c.answerDiagram)).length,
    [pool],
  );
  const drill = useDrillCard(drawPool);
  const [comparing, setComparing] = useState(false),
    [drawing, setDrawing] = useState(createDiagram),
    [snapFormation, setSnapFormation] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0),
    [attemptElapsedMs, setAttemptElapsedMs] = useState(null),
    [noteText, setNoteText] = useState("");
  const cardShownAtRef = useRef(Date.now());
  const formation =
    drill.current?.category === "fullfield"
      ? formationFor(drill.current, deck)
      : null;
  const formationBubbles = snapFormation
    ? normalDiagram(formation?.answerDiagram)?.bubbles
    : null;
  const seedDiagram = () =>
    formationBubbles
      ? { bubbles: structuredClone(formationBubbles), lines: [] }
      : createDiagram();
  useEffect(() => {
    setComparing(false);
    setDrawing(seedDiagram());
    setAttemptElapsedMs(null);
    setElapsedMs(0);
    setNoteText("");
    cardShownAtRef.current = Date.now();
  }, [drill.current?.id, snapFormation, formation]);
  useEffect(() => {
    if (comparing || !drill.current) return;
    const timer = setInterval(
      () => setElapsedMs(Date.now() - cardShownAtRef.current),
      250,
    );
    return () => clearInterval(timer);
  }, [comparing, drill.current?.id]);
  const clear = () => setDrawing(seedDiagram());
  const compare = () => {
    const ms = Date.now() - cardShownAtRef.current;
    setAttemptElapsedMs(ms);
    setComparing(true);
  };
  const limitSeconds = drill.current
    ? timeLimitSeconds(drill.current.box, snapFormation)
    : 0;
  const priorTimes = drill.current?.drawTimes || [];
  const avgSeconds = priorTimes.length
    ? priorTimes.reduce((sum, ms) => sum + ms, 0) / priorTimes.length / 1000
    : null;
  const timedOut =
    attemptElapsedMs != null && attemptElapsedMs > limitSeconds * 1000;
  const grade = (gotIt) => {
    gradeAndAdvance(
      drill,
      drill.current,
      gotIt && !timedOut,
      attemptElapsedMs,
      noteText.trim(),
    );
  };
  return (
    <div className="playbook-trainer__workspace">
      <SessionRail
        session={session}
        pool={drawPool}
        dayStreak={dayStreak}
        title="Draw session"
      />
      <div className="playbook-trainer__stage">
        {missingDiagramCount > 0 && (
          <p className="playbook-trainer__note">
            {missingDiagramCount} card{missingDiagramCount === 1 ? "" : "s"} in
            this category don't have a saved diagram yet — add one in Manage to
            include them here.
          </p>
        )}
        {!drawPool.length ? (
          <EmptyState>
            No drawable cards in this category yet — add a diagram to a card in
            Manage.
          </EmptyState>
        ) : (
          drill.current && (
            <div className="playbook-trainer__card">
              <FormationLabel card={drill.current} deck={deck} />
              <p className="playbook-trainer__card-name">
                {drill.current.prompt}
              </p>
              <div className="playbook-trainer__draw-hint-row">
                <p className="playbook-trainer__draw-hint">
                  {snapFormation
                    ? formationBubbles
                      ? "Formation is set — draw the routes from memory."
                      : "Build the formation and draw it from memory."
                    : "Place every player from memory -- no snap assist this rep."}
                </p>
                <label className="playbook-trainer__snap-toggle">
                  <input
                    type="checkbox"
                    checked={snapFormation}
                    onChange={(event) => setSnapFormation(event.target.checked)}
                    disabled={comparing}
                  />
                  Snap to formation
                </label>
              </div>
              <p className="playbook-trainer__timer">
                {comparing
                  ? `Took ${formatSeconds(attemptElapsedMs / 1000)}`
                  : formatSeconds(elapsedMs / 1000)}{" "}
                <small>
                  / limit {formatSeconds(limitSeconds)}
                  {avgSeconds != null
                    ? ` · your avg ${formatSeconds(avgSeconds)}`
                    : ""}
                </small>
              </p>
              {!comparing ? (
                <>
                  <DiagramBoard
                    diagram={drawing}
                    editable
                    onChange={setDrawing}
                    snapFormation={snapFormation}
                    bubblesLocked={Boolean(formationBubbles)}
                  />
                  <div className="playbook-trainer__draw-actions">
                    <button
                      type="button"
                      className="playbook-trainer__secondary-btn"
                      onClick={clear}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="playbook-trainer__reveal-btn"
                      onClick={compare}
                    >
                      Compare to answer
                    </button>
                  </div>
                </>
              ) : (
                <div className="playbook-trainer__reveal">
                  <div className="playbook-trainer__compare-row">
                    <div>
                      <span className="playbook-trainer__compare-label label">
                        Your drawing
                      </span>
                      <DiagramView diagram={drawing} />
                    </div>
                    <div>
                      <span className="playbook-trainer__compare-label">
                        Answer
                      </span>
                      <DiagramView diagram={drill.current.answerDiagram} />
                    </div>
                  </div>
                  <p className="playbook-trainer__answer-text">
                    {drill.current.answerText}
                  </p>
                  {timedOut && (
                    <p className="playbook-trainer__timeout-note">
                      Over the {formatSeconds(limitSeconds)} limit (took{" "}
                      {formatSeconds(attemptElapsedMs / 1000)}) — counts as a
                      miss regardless of accuracy.
                    </p>
                  )}
                  <label className="playbook-trainer__field playbook-trainer__note-field">
                    <span>Note (optional) — what did you get wrong?</span>
                    <input
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                      placeholder="e.g. forgot the TE release, flipped the Y route"
                    />
                  </label>
                  <GradeRow onGrade={grade} />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
function emptyForm(category) {
  return {
    id: null,
    category: category && category !== "all" ? category : "formation",
    name: "",
    variation: "",
    formationId: null,
    answerText: "",
    answerDiagram: createDiagram(),
  };
}
function formationFor(card, deck) {
  return card &&
    (card.category === "concept" || card.category === "fullfield") &&
    card.formationId
    ? deck.find((c) => c.id === card.formationId)
    : null;
}
function FormationLabel({ card, deck }) {
  const formation = formationFor(card, deck);
  return formation ? (
    <p className="playbook-trainer__formation-label">
      Formation: {formation.prompt}
    </p>
  ) : null;
}
function CardForm({ form, setForm, onSave, onCancel, formations }) {
  const ready = form.name.trim() && form.answerText.trim();
  const diagram = normalDiagram(form.answerDiagram) || createDiagram();
  return (
    <div className="playbook-trainer__form">
      <label className="playbook-trainer__field">
        <span className="label">Category</span>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          {CATEGORY_SELECT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="playbook-trainer__field">
        <span className="label">Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Trips Right"
        />
      </label>
      <label className="playbook-trainer__field">
        <span className="label">Variation (optional)</span>
        <input
          value={form.variation}
          onChange={(e) =>
            setForm((f) => ({ ...f, variation: e.target.value }))
          }
          placeholder="e.g. vs 2x2"
        />
      </label>
      {(form.category === "concept" || form.category === "fullfield") && (
        <label className="playbook-trainer__field">
          <span className="label">Formation (optional)</span>
          <select
            value={form.formationId || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, formationId: e.target.value || null }))
            }
          >
            <option value="">No formation set</option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.prompt}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="playbook-trainer__field">
        <span className="label">Answer / rule</span>
        <textarea
          value={form.answerText}
          onChange={(e) =>
            setForm((f) => ({ ...f, answerText: e.target.value }))
          }
          rows={4}
        />
      </label>
      <div className="playbook-trainer__field">
        <span className="label">Diagram</span>
        <DiagramBoard
          diagram={diagram}
          editable
          snapFormation={false}
          onChange={(answerDiagram) =>
            setForm((f) => ({ ...f, answerDiagram }))
          }
        />
        <div className="playbook-trainer__draw-actions">
          <button
            type="button"
            className="playbook-trainer__secondary-btn"
            onClick={() =>
              setForm((f) => {
                const current =
                  normalDiagram(f.answerDiagram) || createDiagram();
                return { ...f, answerDiagram: { ...current, lines: [] } };
              })
            }
          >
            Clear routes
          </button>
          <button
            type="button"
            className="playbook-trainer__secondary-btn"
            onClick={() =>
              setForm((f) => {
                const current =
                  normalDiagram(f.answerDiagram) || createDiagram();
                return {
                  ...f,
                  answerDiagram: {
                    ...current,
                    bubbles: createDiagram().bubbles,
                  },
                };
              })
            }
          >
            Reset formation
          </button>
          <button
            type="button"
            className="playbook-trainer__secondary-btn"
            onClick={() => setForm((f) => ({ ...f, answerDiagram: null }))}
          >
            Remove diagram
          </button>
        </div>
      </div>
      <div className="playbook-trainer__form-actions">
        <button
          type="button"
          className="playbook-trainer__secondary-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="playbook-trainer__reveal-btn"
          disabled={!ready}
          onClick={() => onSave({ ...form, answerDiagram: form.answerDiagram })}
        >
          Save
        </button>
      </div>
    </div>
  );
}
const baseName = (name) => name.replace(/\s+(Left|Right)$/i, "").trim();
function ManageTab({
  deck,
  category,
  onAdd,
  onEdit,
  onDelete,
  onResetDeck,
  onToggleDraw,
  onImportDeck,
}) {
  const [form, setForm] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const importInputRef = useRef(null);
  const exportDeck = () => {
    const blob = new Blob([JSON.stringify(deck, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playbook-trainer-deck-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      onImportDeck(JSON.parse(await file.text()));
    } catch {
      window.alert("Couldn't read that file -- is it a Playbook Trainer export?");
    }
  };
  const grouped = useMemo(() => {
    const list =
      category === "all" ? deck : deck.filter((c) => c.category === category);
    const byCategory =
      category !== "all"
        ? [[category, list]]
        : CATEGORY_SELECT_OPTIONS.map((o) => [
            o.value,
            list.filter((c) => c.category === o.value),
          ]).filter(([, cards]) => cards.length);
    return byCategory.map(([cat, cards]) => {
      const byBase = new Map();
      for (const c of cards) {
        const display = baseName(c.name);
        const key = display.toLowerCase();
        if (!byBase.has(key)) byBase.set(key, { display, cards: [] });
        byBase.get(key).cards.push(c);
      }
      return [cat, [...byBase.values()].map((g) => [g.display, g.cards])];
    });
  }, [deck, category]);
  useEffect(() => {
    const firstKey = grouped[0]?.[1][0]
      ? `${grouped[0][0]}::${grouped[0][1][0][0]}`
      : null;
    if (firstKey && !selectedGroup) setSelectedGroup(firstKey);
  }, [grouped, selectedGroup]);
  useEffect(() => {
    setSelectedGroup(null);
  }, [category]);
  const selectedCards = useMemo(() => {
    for (const [cat, nameGroups] of grouped) {
      for (const [base, cards] of nameGroups) {
        if (`${cat}::${base}` === selectedGroup) return { cat, base, cards };
      }
    }
    return null;
  }, [grouped, selectedGroup]);
  const formations = useMemo(
    () => deck.filter((c) => c.category === "formation"),
    [deck],
  );
  return (
    <div className="playbook-trainer__manage">
      {form && (
        <div
          className="playbook-trainer__modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setForm(null);
          }}
        >
          <div className="playbook-trainer__modal">
            <CardForm
              form={form}
              setForm={setForm}
              formations={formations}
              onSave={(values) => {
                (form.id ? onEdit : onAdd)(values);
                setForm(null);
              }}
              onCancel={() => setForm(null)}
            />
          </div>
        </div>
      )}
      <div className="playbook-trainer__manage-master">
        <div className="playbook-trainer__manage-master-header">
          <span className="label">Groups</span>
          <span className="playbook-trainer__manage-count">
            {deck.length} card{deck.length === 1 ? "" : "s"}
          </span>
          <div className="playbook-trainer__manage-sync">
            <button
              type="button"
              className="playbook-trainer__secondary-btn"
              onClick={exportDeck}
            >
              Export deck
            </button>
            <button
              type="button"
              className="playbook-trainer__secondary-btn"
              onClick={() => importInputRef.current?.click()}
            >
              Import deck
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImportFile}
            />
          </div>
        </div>
        {grouped.map(([cat, nameGroups]) => (
          <div className="playbook-trainer__manage-category" key={cat}>
            <h2>
              {CATEGORY_SELECT_OPTIONS.find((o) => o.value === cat)?.label}
            </h2>
            <div className="playbook-trainer__manage-group-list">
              {nameGroups.map(([base, cards]) => {
                const key = `${cat}::${base}`;
                const isSelected = selectedGroup === key;
                const allHidden = cards.every((c) => c.drawHidden);
                return (
                  <div className="playbook-trainer__manage-group-row" key={key}>
                    <button
                      type="button"
                      className={`playbook-trainer__manage-group-btn${isSelected ? " is-selected" : ""}${allHidden ? " is-hidden" : ""}`}
                      onClick={() => setSelectedGroup(key)}
                    >
                      <span className="playbook-trainer__manage-group-btn-name">
                        {base}
                      </span>
                      <span className="playbook-trainer__manage-namegroup-count">
                        {cards.length}
                      </span>
                    </button>
                    <label
                      className="playbook-trainer__manage-group-toggle"
                      title={
                        allHidden ? `Show ${base} in Draw` : `Hide ${base} from Draw`
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={!allHidden}
                        aria-label={
                          allHidden
                            ? `Show ${base} in Draw`
                            : `Hide ${base} from Draw`
                        }
                        onChange={() => {
                          const shouldHide = !allHidden;
                          cards
                            .filter((c) => Boolean(c.drawHidden) !== shouldHide)
                            .forEach((c) => onToggleDraw(c));
                        }}
                      />
                      <span className="playbook-trainer__manage-group-toggle-track" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="playbook-trainer__manage-detail">
        <div className="playbook-trainer__manage-detail-header">
          <div>
            <span className="label">
              {selectedCards
                ? CATEGORY_SELECT_OPTIONS.find(
                    (o) => o.value === selectedCards.cat,
                  )?.label
                : "Cards"}
            </span>
            <h2>
              {selectedCards
                ? `${selectedCards.base} (${selectedCards.cards.length})`
                : "Select a group"}
            </h2>
          </div>
          <div className="playbook-trainer__manage-toolbar">
            <button
              type="button"
              className="playbook-trainer__reveal-btn"
              onClick={() => setForm(emptyForm(category))}
            >
              + Add card
            </button>
            <button
              type="button"
              className="playbook-trainer__secondary-btn"
              onClick={onResetDeck}
            >
              Reset to example deck
            </button>
          </div>
        </div>
        {!selectedCards ? (
          <EmptyState>
            Choose a group from the list to manage its cards.
          </EmptyState>
        ) : (
          <div className="playbook-trainer__manage-detail-rows">
            {selectedCards.cards.map((card) => (
              <div className="playbook-trainer__manage-row" key={card.id}>
                <div className="playbook-trainer__manage-row-main">
                  <div className="playbook-trainer__manage-row-info">
                    <span className="playbook-trainer__manage-row-name">
                      {card.name}
                    </span>
                    {card.variation && (
                      <span className="playbook-trainer__manage-row-variation">
                        [{card.variation}]
                      </span>
                    )}
                    {(card.category === "concept" ||
                      card.category === "fullfield") &&
                      (formationFor(card, deck) ? (
                        <span className="playbook-trainer__manage-row-variation">
                          Formation: {formationFor(card, deck).prompt}
                        </span>
                      ) : (
                        <span className="playbook-trainer__manage-row-variation">
                          No formation set
                        </span>
                      ))}
                    {card.drawHidden && (
                      <span className="playbook-trainer__manage-row-variation">
                        Hidden from Draw
                      </span>
                    )}
                    <span className="playbook-trainer__manage-row-box">
                      Box {card.box}
                    </span>
                  </div>
                  <div className="playbook-trainer__manage-row-actions">
                    <button
                      type="button"
                      className="playbook-trainer__secondary-btn"
                      onClick={() =>
                        setForm({
                          id: card.id,
                          category: card.category,
                          name: card.name,
                          variation: card.variation || "",
                          formationId: card.formationId || null,
                          answerText: card.answerText,
                          answerDiagram:
                            normalDiagram(card.answerDiagram) || createDiagram(),
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="playbook-trainer__secondary-btn"
                      onClick={() => onToggleDraw(card)}
                    >
                      {card.drawHidden ? "Show in Draw" : "Hide from Draw"}
                    </button>
                    <button
                      type="button"
                      className="playbook-trainer__secondary-btn playbook-trainer__secondary-btn--danger"
                      onClick={() => onDelete(card)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {normalDiagram(card.answerDiagram) ? (
                  <div className="playbook-trainer__manage-row-diagram">
                    <DiagramView diagram={card.answerDiagram} />
                  </div>
                ) : (
                  <div className="playbook-trainer__manage-row-diagram-empty">
                    No diagram set
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function dayKey(iso) {
  return iso ? iso.slice(0, 10) : "";
}
function formatDayLabel(key) {
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function buildTodayReps(deck) {
  const today = dayKey(new Date().toISOString());
  const reps = [];
  for (const card of deck) {
    for (const h of card.history || []) {
      if (dayKey(h.at) !== today) continue;
      reps.push({ at: new Date(h.at), gotIt: h.gotIt });
    }
  }
  reps.sort((a, b) => a.at - b.at);
  let correct = 0;
  return reps.map((r, i) => {
    if (r.gotIt) correct += 1;
    return {
      label: r.at.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
      value: Math.round((correct / (i + 1)) * 100),
      gotIt: r.gotIt,
      index: i + 1,
    };
  });
}
function buildTrend(deck, daysBack) {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - daysBack);
  const days = new Map();
  for (const card of deck) {
    for (const h of card.history || []) {
      const at = new Date(h.at);
      if (at < cutoff) continue;
      const key = dayKey(h.at);
      if (!days.has(key)) days.set(key, { key, reps: 0, correct: 0, at });
      const d = days.get(key);
      d.reps += 1;
      if (h.gotIt) d.correct += 1;
    }
  }
  const sorted = [...days.values()].sort((a, b) => a.at - b.at);
  return sorted.map((d) => ({
    label: formatDayLabel(d.key),
    reps: d.reps,
    accuracy: d.reps ? Math.round((d.correct / d.reps) * 100) : 0,
  }));
}
function AnimatedNumber({ value, suffix = "" }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (value == null) {
      setDisplay(value);
      return;
    }
    const start = display ?? 0;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 650;
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  if (value == null) return "—";
  return `${display}${suffix}`;
}
function SparkLine({
  data,
  color = "var(--nexus)",
  valueMax = null,
  suffix = "",
  decimals = 0,
  emptyLabel = "No data",
}) {
  const [hover, setHover] = useState(null);
  if (data.length < 2) {
    return (
      <div className="playbook-trainer__empty-chart">
        <span>{emptyLabel}</span>
      </div>
    );
  }
  const W = 280,
    H = 120,
    PAD = 24;
  const w = W - PAD * 2,
    h = H - PAD * 2;
  const max = valueMax ?? Math.max(...data.map((d) => d.value), 1);
  const x = (i) => PAD + (data.length === 1 ? 0 : i / (data.length - 1)) * w;
  const y = (v) => H - PAD - (v / max) * h;
  const d = data
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`)
    .join(" ");
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.max(
      0,
      Math.min(
        data.length - 1,
        Math.round(((px - PAD) / w) * (data.length - 1)),
      ),
    );
    setHover({ i, x: x(i), y: y(data[i].value), point: data[i] });
  };
  const format = (v) =>
    decimals ? v.toFixed(decimals) : String(Math.round(v));
  return (
    <div className="playbook-trainer__trend-chart">
      <svg
        className="playbook-trainer__trend-svg"
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        onTouchMove={handleMove}
        onTouchEnd={() => setHover(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD}
            y1={PAD + t * h}
            x2={W - PAD}
            y2={PAD + t * h}
            className="playbook-trainer__trend-grid"
          />
        ))}
        <path
          className="playbook-trainer__trend-line"
          d={d}
          pathLength="1"
          style={{ stroke: color }}
        />
        {data.map((p, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(p.value)}
            r="3"
            className="playbook-trainer__trend-dot"
            style={{ fill: color }}
          />
        ))}
        {hover && (
          <line
            x1={hover.x}
            y1={PAD}
            x2={hover.x}
            y2={H - PAD}
            className="playbook-trainer__trend-crosshair"
          />
        )}
      </svg>
      {hover && (
        <div
          className="playbook-trainer__trend-tooltip"
          style={{
            left: `${(hover.x / W) * 100}%`,
            top: `${(hover.y / H) * 100}%`,
          }}
        >
          <b>{hover.point.label}</b>
          <span>
            {format(hover.point.value)}
            {suffix}
          </span>
        </div>
      )}
    </div>
  );
}
function RepSpark({ reps }) {
  const W = 280,
    H = 120,
    PAD = 24,
    BAR_W = 10;
  const n = reps.length;
  if (n === 0)
    return (
      <div className="playbook-trainer__empty-chart">
        <span>No reps yet today.</span>
      </div>
    );
  const w = W - PAD * 2,
    h = H - PAD * 2;
  const step = n > 1 ? w / (n - 1) : 0;
  const x = (i) => PAD + (n === 1 ? w / 2 : i * step);
  const y = (v) => H - PAD - (v / 100) * h;
  const d = reps
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`)
    .join(" ");
  return (
    <div className="playbook-trainer__rep-chart">
      <svg className="playbook-trainer__rep-svg" viewBox={`0 0 ${W} ${H}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={PAD}
            y1={PAD + t * h}
            x2={W - PAD}
            y2={PAD + t * h}
            className="playbook-trainer__trend-grid"
          />
        ))}
        {reps.map((p, i) => (
          <rect
            key={i}
            x={x(i) - BAR_W / 2}
            y={PAD}
            width={BAR_W}
            height={h}
            className={`playbook-trainer__rep-bar${p.gotIt ? " is-hit" : " is-miss"}`}
            rx="2"
          />
        ))}
        <path className="playbook-trainer__trend-line" d={d} />
      </svg>
      <div className="playbook-trainer__rep-legend">
        <span>
          {reps.length} rep{reps.length === 1 ? "" : "s"} today
        </span>
        <span>
          {Math.round((reps.filter((r) => r.gotIt).length / reps.length) * 100)}
          % so far
        </span>
      </div>
    </div>
  );
}
function BoxProgress({ box }) {
  return (
    <div className="playbook-trainer__box-progress">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`playbook-trainer__box-step${i <= box ? " is-active" : ""}`}
        >
          <span>{i}</span>
        </div>
      ))}
    </div>
  );
}
function CardDetail({ card, onBack }) {
  const trend = useMemo(() => buildTrend([card], 30), [card]);
  const todayReps = useMemo(() => buildTodayReps([card]), [card]);
  const drawPoints = useMemo(
    () =>
      (card.drawTimes || [])
        .slice(-5)
        .map((ms, i) => ({ label: `#${i + 1}`, value: ms / 1000 })),
    [card],
  );
  const notes = useMemo(
    () => [...(card.notes || [])].reverse().slice(0, 5),
    [card],
  );
  return (
    <div className="playbook-trainer__stats playbook-trainer__stats--detail">
      <button
        type="button"
        className="playbook-trainer__detail-back"
        onClick={onBack}
      >
        <svg
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 3L3 7l4 4" />
          <path d="M3 7h8" />
        </svg>
        Back to stats
      </button>
      <div className="playbook-trainer__detail-header">
        <div>
          <span className="playbook-trainer__detail-category label">
            {
              CATEGORY_SELECT_OPTIONS.find((o) => o.value === card.category)
                ?.label
            }
          </span>
          <h2>{card.prompt}</h2>
        </div>
        <div className="playbook-trainer__detail-meta">
          <span>Box {card.box}</span>
          <span>{card.attempts} reps</span>
          <span>
            {card.attempts
              ? Math.round((card.correct / card.attempts) * 100)
              : 0}
            % accuracy
          </span>
        </div>
      </div>
      <section className="playbook-trainer__stats-section">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Box progression</span>
        </div>
        <BoxProgress box={card.box} />
      </section>
      <section className="playbook-trainer__stats-section">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Accuracy trend</span>
          <small>Last 30 days</small>
        </div>
        {trend.length < 2 ? (
          todayReps.length > 0 ? (
            <div className="playbook-trainer__trend-panel playbook-trainer__trend-panel--wide">
              <RepSpark reps={todayReps} />
            </div>
          ) : (
            <EmptyState>
              Not enough history yet — grade this card a few times to see a
              trend.
            </EmptyState>
          )
        ) : (
          <SparkLine
            data={trend.map((d) => ({ label: d.label, value: d.accuracy }))}
            color="var(--nexus)"
            valueMax={100}
            suffix="%"
          />
        )}
      </section>
      <section className="playbook-trainer__stats-section">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Draw times</span>
          <small>Last 5 attempts</small>
        </div>
        {drawPoints.length < 2 ? (
          <EmptyState>Not enough timed drawings yet.</EmptyState>
        ) : (
          <SparkLine
            data={drawPoints}
            color="var(--ok)"
            suffix="s"
            decimals={1}
          />
        )}
      </section>
      <section className="playbook-trainer__stats-section">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Notes timeline</span>
          <small>Last 5 notes</small>
        </div>
        {!notes.length ? (
          <EmptyState>No notes for this card yet.</EmptyState>
        ) : (
          <div className="playbook-trainer__notes-timeline">
            {notes.map((n, i) => (
              <div
                className={`playbook-trainer__timeline-entry${n.gotIt ? "" : " is-miss"}`}
                key={i}
              >
                <time>
                  {new Date(n.at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <p>{n.text}</p>
                <span>{n.gotIt ? "got it" : "missed"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
function StatsTab({ deck }) {
  const [selectedId, setSelectedId] = useState(null);
  const overall = useMemo(() => {
    const attempts = deck.reduce((s, c) => s + c.attempts, 0),
      correct = deck.reduce((s, c) => s + c.correct, 0);
    return {
      attempts,
      correct,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
    };
  }, [deck]);
  const byCategory = useMemo(
    () =>
      CATEGORY_SELECT_OPTIONS.map((o) => {
        const cards = deck.filter((c) => c.category === o.value),
          attempts = cards.reduce((s, c) => s + c.attempts, 0),
          correct = cards.reduce((s, c) => s + c.correct, 0);
        return {
          ...o,
          cardCount: cards.length,
          mastered: cards.filter((c) => c.box === 5).length,
          attempts,
          accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
        };
      }),
    [deck],
  );
  const trend = useMemo(() => buildTrend(deck, 14), [deck]);
  const todayReps = useMemo(() => buildTodayReps(deck), [deck]);
  const withNotes = useMemo(
    () =>
      deck
        .filter((c) => (c.notes || []).length > 0)
        .map((c) => ({ ...c, lastNoteAt: c.notes.at(-1)?.at || "" }))
        .sort((a, b) => b.lastNoteAt.localeCompare(a.lastNoteAt)),
    [deck],
  );
  const selected = useMemo(
    () => deck.find((c) => c.id === selectedId),
    [deck, selectedId],
  );
  if (selectedId && selected)
    return <CardDetail card={selected} onBack={() => setSelectedId(null)} />;
  return (
    <div className="playbook-trainer__stats">
      <div className="playbook-trainer__hero-tile">
        <span className="label">Overall accuracy</span>
        <b>
          <AnimatedNumber value={overall.accuracy} suffix="%" />
        </b>
        <div className="playbook-trainer__hero-meta">
          <div>
            <b>{overall.attempts}</b>
            <small>total reps</small>
          </div>
          <div>
            <b>
              {deck.filter((c) => c.box === 5).length}/{deck.length}
            </b>
            <small>mastered</small>
          </div>
        </div>
      </div>

      <div className="playbook-trainer__trend-tile">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Trends</span>
          <small>Last 14 days</small>
        </div>
        {trend.length < 2 ? (
          todayReps.length > 0 ? (
            <div className="playbook-trainer__trend-panel playbook-trainer__trend-panel--wide">
              <span className="playbook-trainer__trend-title label">
                Today's reps
              </span>
              <RepSpark reps={todayReps} />
            </div>
          ) : (
            <EmptyState>
              Not enough history yet — keep practicing to see trends.
            </EmptyState>
          )
        ) : (
          <div className="playbook-trainer__trend-charts">
            <div className="playbook-trainer__trend-panel">
              <span className="playbook-trainer__trend-title label">
                Accuracy
              </span>
              <SparkLine
                data={trend.map((d) => ({ label: d.label, value: d.accuracy }))}
                color="var(--nexus)"
                valueMax={100}
                suffix="%"
              />
            </div>
            <div className="playbook-trainer__trend-panel">
              <span className="playbook-trainer__trend-title label">Reps</span>
              <SparkLine
                data={trend.map((d) => ({ label: d.label, value: d.reps }))}
                color="var(--ok)"
                suffix=" reps"
              />
            </div>
          </div>
        )}
      </div>

      <div className="playbook-trainer__notes-tile">
        <div className="playbook-trainer__panel-heading">
          <span className="label">Recent notes</span>
          <small>Click a card for full history.</small>
        </div>
        {!withNotes.length ? (
          <EmptyState>No notes yet.</EmptyState>
        ) : (
          <div className="playbook-trainer__stats-card-list">
            {withNotes.map((c) => (
              <button
                type="button"
                className="playbook-trainer__stats-card"
                key={c.id}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="playbook-trainer__stats-card-heading">
                  <b>{c.prompt}</b>
                  <small>
                    {
                      CATEGORY_SELECT_OPTIONS.find(
                        (o) => o.value === c.category,
                      )?.label
                    }{" "}
                    · Box {c.box}
                  </small>
                </div>
                {[...c.notes]
                  .reverse()
                  .slice(0, 2)
                  .map((n, i) => (
                    <p
                      className={`playbook-trainer__stats-note${n.gotIt ? "" : " is-miss"}`}
                      key={i}
                    >
                      {n.text} <i>{n.gotIt ? "got it anyway" : "missed"}</i>
                    </p>
                  ))}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="playbook-trainer__bento-categories">
        {byCategory.map((c) => (
          <div
            className="playbook-trainer__stats-category"
            key={c.value}
            style={{ flex: Math.max(1, c.attempts) }}
          >
            <b>{c.label}</b>
            <span>{c.accuracy == null ? "—" : `${c.accuracy}%`}</span>
            <div className="playbook-trainer__category-bar-bg">
              <div
                className="playbook-trainer__category-bar"
                style={{ width: `${c.accuracy ?? 0}%` }}
              />
            </div>
            <small>
              {c.mastered}/{c.cardCount} mastered · {c.attempts} reps
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function PlaybookTrainerPage() {
  const [deck, setDeck] = useState(loadDeck),
    [tab, setTab] = useState("practice"),
    [category, setCategory] = useState("all"),
    [session, setSession] = useState(blankSession),
    [saveError, setSaveError] = useState(false),
    [dayStreak, setDayStreak] = useState(loadDayStreak);
  useEffect(() => {
    const onSaveError = () => setSaveError(true);
    window.addEventListener(SAVE_ERROR_EVENT, onSaveError);
    return () => window.removeEventListener(SAVE_ERROR_EVENT, onSaveError);
  }, []);
  const recordDayActivity = useCallback(
    () => setDayStreak(recordActivity()),
    [],
  );
  const gradeCard = useCallback(
    (cardId, gotIt, drawTimeMs, noteText) => {
      setDeck((prev) => {
        const next = prev.map((c) =>
          c.id !== cardId
            ? c
            : {
                ...c,
                box: gotIt ? Math.min(5, c.box + 1) : 1,
                attempts: c.attempts + 1,
                correct: c.correct + (gotIt ? 1 : 0),
                drawTimes:
                  drawTimeMs != null
                    ? [...(c.drawTimes || []), drawTimeMs].slice(-5)
                    : c.drawTimes,
                notes: noteText
                  ? [
                      ...(c.notes || []),
                      { text: noteText, gotIt, at: new Date().toISOString() },
                    ].slice(-5)
                  : c.notes,
                history: [
                  ...(c.history || []),
                  { at: new Date().toISOString(), gotIt },
                ].slice(-60),
              },
        );
        saveDeck(next);
        return next;
      });
      setSession((s) => {
        const streak = gotIt ? s.streak + 1 : 0;
        return {
          attempts: s.attempts + 1,
          correct: s.correct + (gotIt ? 1 : 0),
          streak,
          best: Math.max(s.best, streak),
        };
      });
      recordDayActivity();
    },
    [recordDayActivity],
  );
  const persist = (values, isEdit) => {
    const name = values.name.trim(),
      variation = values.variation.trim() || null;
    setDeck((prev) => {
      const card = {
        ...values,
        name,
        variation,
        prompt: buildPrompt(name, variation),
        answerText: values.answerText,
        answerDiagram: normalDiagram(values.answerDiagram),
      };
      const next = isEdit
        ? prev.map((c) => (c.id === card.id ? { ...c, ...card } : c))
        : [
            ...prev,
            {
              ...card,
              id: crypto.randomUUID(),
              box: 1,
              attempts: 0,
              correct: 0,
            },
          ];
      saveDeck(next);
      return next;
    });
  };
  const resetDeck = () => {
    if (
      !window.confirm(
        "Reset to the example deck? This wipes all your saved cards and progress.",
      )
    )
      return;
    const fresh = structuredClone(seed);
    saveDeck(fresh);
    setDeck(fresh);
    setSession(blankSession());
  };
  const toggleDrawHidden = (card) =>
    setDeck((prev) => {
      const next = prev.map((c) =>
        c.id === card.id ? { ...c, drawHidden: !c.drawHidden } : c,
      );
      saveDeck(next);
      return next;
    });
  // Deck only ever lives in this browser's localStorage -- Export/Import is the whole sync
  // story between devices (e.g. desktop -> phone) until there's a real backend for it.
  const importDeck = (cards) => {
    if (!Array.isArray(cards) || !cards.length) {
      window.alert("That file doesn't look like a Playbook Trainer export.");
      return;
    }
    if (
      !window.confirm(
        `Import ${cards.length} cards? This replaces everything currently in this deck on this device.`,
      )
    )
      return;
    saveDeck(cards);
    setDeck(cards);
    setSession(blankSession());
  };
  const tabIcons = {
    practice: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M7 8h6M7 12h4" />
      </svg>
    ),
    draw: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 3l3 3-9 9-4 1 1-4 9-9z" />
        <path d="M12 4l4 4" />
      </svg>
    ),
    manage: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path d="M7 9h6M7 12h4" />
      </svg>
    ),
    stats: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 16V10M8 16V6M13 16V12M18 16V4" />
      </svg>
    ),
    filmlog: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="6" width="16" height="9" rx="2" />
        <circle cx="7" cy="10.5" r="2" />
        <path d="M13 9l3 1.5-3 1.5V9z" />
      </svg>
    ),
    library: (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 16V6a2 2 0 012-2h2v12H6a2 2 0 01-2-2z" />
        <path d="M10 16V4h2a2 2 0 012 2v10" />
      </svg>
    ),
  };

  return (
    <section className="playbook-trainer">
      <aside className="playbook-trainer__sidebar">
        <header className="playbook-trainer__header">
          <span className="playbook-trainer__eyebrow">PLAYBOOK TRAINER</span>
          <h1>Draw the play.</h1>
          <p>Flashcards + diagram drill for your offense.</p>
        </header>
        <nav className="playbook-trainer__nav" role="tablist">
          {[
            ["practice", "Practice"],
            ["draw", "Draw"],
            ["manage", "Manage"],
            ["stats", "Stats"],
            ["filmlog", "Film Log"],
            ["library", "Library"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              className={`playbook-trainer__nav-item${tab === value ? " is-selected" : ""}`}
              onClick={() => setTab(value)}
            >
              {tabIcons[value]}
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="playbook-trainer__main">
        {!["filmlog", "library", "stats"].includes(tab) && (
          <PillGroup
            label="Category"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        )}
        {saveError && (
          <p className="playbook-trainer__save-error" role="alert">
            <span>
              Could not save — storage is full or unavailable. This change was
              NOT saved. Delete an old diagram to free space, then try again.
            </span>
            <button type="button" onClick={() => setSaveError(false)}>
              Dismiss
            </button>
          </p>
        )}
        <div role="tabpanel">
          {tab === "practice" && (
            <PracticeTab
              deck={deck}
              category={category}
              session={session}
              dayStreak={dayStreak}
              gradeAndAdvance={(drill, card, gotIt) => {
                gradeCard(card.id, gotIt);
                drill.advance(card.id);
              }}
            />
          )}
          {tab === "draw" && (
            <DrawTab
              deck={deck}
              category={category}
              session={session}
              dayStreak={dayStreak}
              gradeAndAdvance={(drill, card, gotIt, drawTimeMs, noteText) => {
                gradeCard(card.id, gotIt, drawTimeMs, noteText);
                drill.advance(card.id);
              }}
            />
          )}
          {tab === "manage" && (
            <ManageTab
              deck={deck}
              category={category}
              onAdd={(v) => persist(v, false)}
              onEdit={(v) => persist(v, true)}
              onImportDeck={importDeck}
              onDelete={(card) => {
                if (
                  window.confirm(
                    `Delete "${card.name}"? This cannot be undone.`,
                  )
                )
                  setDeck((prev) => {
                    const next = prev.filter((c) => c.id !== card.id);
                    saveDeck(next);
                    return next;
                  });
              }}
              onResetDeck={resetDeck}
              onToggleDraw={toggleDrawHidden}
            />
          )}
          {tab === "stats" && <StatsTab deck={deck} />}
          {tab === "filmlog" && (
            <FilmLog
              deck={deck}
              onActivity={recordDayActivity}
              onOpenLibrary={() => setTab("library")}
            />
          )}
          {tab === "library" && <FilmLogLibrary />}
        </div>
      </main>
    </section>
  );
}
