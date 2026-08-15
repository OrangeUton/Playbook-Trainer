# Film Log + Scouting — plan

Written 2026-08-15 while Xander was away, per his direct ask: figure out the right level of plan, write it, have it ready for when he's back. Updated the same night once he got back and gave real feedback on this draft. Calling it a **log**, not "notes" — that's the word he actually used.

Scope is everything from his messages tonight, in his own words, reduced to a buildable shape:

- Play-linked receiver/assignment notes, matched against plays already in the system.
- Voice-dictated film notes that come out organized, not a wall of raw transcript.
- Attach a screenshot + the film's date/link to a specific note, so it still makes sense a month later.
- Opponent film → tendencies → a real game plan to attack them.
- Own film → same idea, aimed at what to fix in practice.

## The one architecture call that shapes everything else

**This is one log with a type flag, not four separate ones.** A log entry about an opponent's Cover 2 tendency and one about your own footwork on a rep are the same shape: date, optional play reference, optional screenshot, optional video link, body text, tags. Confirmed with Xander directly — he's never watching his own film and an opponent's at the same time, so which mode he's in is always obvious to him, and the two "pretty much work the same way, just different end results." The only real difference is `subject: 'opponent' | 'self'`. One shared tendency/pattern view (Phase 2) works for both without extra code. Lands as a 4th tab next to Practice / Draw / Manage: **Film Log**.

**One real addition inside `self`:** practice film and your own game film are both "self," but game film will run way higher volume ("games are there's a lot more reps than practice") and is a separate watching session. Added `context: 'practice' | 'game'` under `subject: 'self'` so the two don't blur together in the tendency view, without making game film a whole separate system.

## Data model (extends the existing seed/deck, doesn't replace it)

**Real correction from Xander, 2026-08-15 night, after seeing the first draft:** date and video link don't belong on every single entry — they belong on the **session** (one film watched, one sitting), with multiple entries nested inside it. His words: "I would provide a film a day, which would have the link and the date. I would have all those notes come together." Watching one film and taking five notes should produce one session with five entries, not five copies of the same date and link.

```
session = {
  id, subject: 'opponent' | 'self',
  context: 'practice' | 'game' | null,  // only meaningful for subject: 'self'
  opponentName: string | null,          // only for subject: 'opponent'
  filmDate: string | null,              // ISO date, whatever he says or types
  videoLink: string | null,             // Hudl link etc, just a URL field
  createdAt
}
entry = {
  id, sessionId,                        // which session this note belongs to
  playId: string | null,                // matched against the existing 79-card deck's full prompt, not just name
  playNameSnapshot: string | null,       // frozen copy of the matched play's prompt, so a later deck edit/reset never orphans this entry
  playMatchConfidence: 'exact' | 'fuzzy' | 'none' | 'insufficient', // real 4th state -- the system is allowed to not know
  screenshots: [{ id, blob, thumbnail, caption }],  // compressed Blob + thumbnail, not a raw base64 dataUrl -- real storage-size win
  body: string,                         // the actual log text, voice or typed
  tags: string[],                       // auto + manual
  situation: {                          // optional, extracted from body text and offered back for confirmation, never a separate form
    down: number | null, distance: number | null, quarter: number | null,
    personnel: string | null, coverage: string | null, fieldOrBoundary: 'field' | 'boundary' | null,
  },
  createdAt
}
issue = {                               // the recurring-issue unit itself -- a real record, not a live text comparison
  id, skill: string, phaseOfPlay: string | null, symptom: string, suspectedCause: string | null,
  confidence: 'low' | 'medium' | 'high', entryIds: string[],           // every supporting entry, always shown
  status: 'open' | 'improving' | 'resolved' | 'recurred', createdAt, updatedAt,
}
```

Both live in their own storage keys, separate from the deck, so a log-format change never risks the play data. **Storage engine: IndexedDB, not localStorage** (see Phase 1's risk note) — this holds regardless of whether the app stays a localhost dev build or later becomes a packaged app; IndexedDB is a real browser API either way (the Nexus dashboard itself is Electron, which is just Chromium — same API, no change needed if this app ever gets packaged the same way).

## Phase 1 — capture (the actual blocker right now: "I need to be able to log this")

Xander's real correction to the original draft of this phase, kept honest rather than smoothed over:

- **Voice does NOT need to be a live-listening microphone.** His words: "that doesn't have to have like a live microphone thing... I can just use Whisper to talk into it and then it can paste into a thing." **The real Phase 1 MVP is just a text field** — type it, or paste in whatever he already transcribed with Whisper or anything else. Zero new capability needed for that part.
- **A nice-to-have on top, not a blocker:** "if there is like a button I could just press on the screen and it would voice it and then auto log it, that'd probably be better... I'm not sure how complicated that would be." A press-to-talk button using the browser's built-in speech recognition is a real, buildable add-on (same free, no-API-key mechanism as originally planned) — but it's explicitly optional and comes after the plain text field works, not instead of it.
- **Screenshot attach must be near-zero effort — his words, "really, really simple... I don't want to waste a bunch of time."** He already has the screenshot on his clipboard the moment he takes it. **Primary mechanism: paste directly into the log form (Ctrl+V)** — a paste-event listener that pulls an image straight off the clipboard, no file picker, no upload dialog. A file-picker fallback can exist but paste is the real UX target.
- **Play matching, not full AI tagging:** all 79 plays are already named in the system — match spoken/typed text against that known list (exact match first, then fuzzy/substring) and suggest the play. This is the same "smart tagging without manual effort" pattern real voice-note tools use, just scoped to data already in the app instead of a generic tagger.
- **The matching has to go further than play names — this is a real, confirmed requirement, not a nice-to-have.** Xander's own examples: he'll describe a screenshot as "number 1 is the outside receiver, number 2 is the inside receiver" (real terminology — receivers are numbered from the sideline inward, #1 always outside-most, confirmed in `research-football-strategy.md`), or "number 1 runs a fade, number 2 runs a comeback" and expects the system to know what that means well enough to help identify the formation and understand the routes. This is exactly what the football-strategy research already covers (personnel notation, route tree, receiver numbering) — it's not a future nice-to-have, it's the reason that research had to happen before this could actually work.
- This alone solves: "I need to log this while watching film" and "a month later I won't remember what I meant" — an entry now has the date (via its session), the play, and a picture proving it.

**Real risk, unchanged from the original draft, still real:** screenshots are much heavier than the line drawings already in the app, and localStorage has a hard ~5-10MB ceiling — the exact failure mode already fixed once tonight (`saveDeck`'s silent-failure bug). IndexedDB (already in the data model above) is the fix, done once, up front, not discovered after it breaks.

## Phase 2 — tendencies AND recurring-issue detection (read-only view over Phase 1's data)

Two real jobs for this same view, both raised directly:

- **Scouting side:** grouped by opponent, by play, by formation category — "everything tagged to Cover 2," "X's route depth vs this opponent."
- **Self-improvement side, and this is the actual point of logging at all, his words:** "if I need to improve something it's all going to go in here and it needs to be logged and saved, so then say one week I have one issue and it resurfaces next week, since I logged that, I could actually go back and look... it also shows my reoccurring mistakes." **This needs a real recurring-issue surfacing pass, not just a filter:** when a new self-improvement entry shares a play, tag, or close text match with an older one, flag it — "this came up before, on [date], on this same play" — with a link straight to the old entry (and its screenshot/film link, since those are what make the old entry legible a month later).
- **Confirmed 2026-08-15, Xander directly: this is the hardest technical piece in the whole plan, and it hasn't been designed deep enough yet — "you can build that."** Real design, not just the intent: theme-matching ("tackling," "leverage," "keeping outside contain") is a semantic judgment call, not a keyword lookup — it needs an actual model reading the entry text, not a script matching substrings. That's free on the existing toolkit, but it changes *when* it can run:
  - **Not live per keystroke** — too slow and pointless to re-check on every character typed.
  - **Not only at the very end either** — his own correction: "when I'm done watching the film, I can press Done and [the Self-Improvement Coach] can reason with all my notes... maybe not when I'm all the way done, but every other message or every couple of messages... if I'm watching a game and I don't want to go through the whole game saying something, you should have forwarded me a note that reoccurred in the beginning."
  - **The real shape: a "Done" checkpoint for a full session wrap-up, plus a periodic pass every few entries during a long session** (a game has far more reps than practice, so this matters most there) — proactively surfacing a recurring pattern *while he's still watching*, not only after everything's logged. Not a notification on every single entry — a real batch/interval pass, not live feedback per entry (his own words: "it's not like you need to give me feedback on every single entry").
- Real workflow this supports, stated directly: film gets watched over the weekend, logged as it's watched, and by Monday he already knows what to fix at practice and what to expect from the opponent — the log is the thing that makes that possible without re-watching anything.

## Phase 3 — game plan: AI-assisted, drafted together, by a real specialist agent

**Correcting my own earlier framing — this was wrong.** I originally flagged AI-assistance as "the first piece of this app that would cost money." Xander corrected that directly: it doesn't need a new API integration inside the React app at all — it uses the same Claude/Codex/Kimi access this whole project already runs on (the existing Nexus usage pool), the same way tonight's build and design pass did. No new cost, no new key.

**What he actually wants is more specific than a generic chat call, though — a real, load-bearing distinction:**

- "I'll just do it myself" for the raw film-watching — he's already flagged, honestly, that catching subtle visual tells on film isn't something a model reliably does today, and he's fine owning that part.
- What he wants the AI for is **synthesis over what's already logged**: read the accumulated log entries (tendencies, recurring self-issues, play references) and help draft the actual game plan — the part that's reasoning over structured text, which is a real, current strength.
- He wants **real football expertise behind it**, not a cold generic dispatch each time — "I need an agent that understands all the rules, understands what teams do in certain positions, why they do those things." This maps directly onto Nexus's own existing specialist-agent system (`.claude/agents/*.md`, the same mechanism as `build-specialist`/`qa-verifier`/etc.) — a real, persistent, file-backed **football-scout agent** with football-domain instructions and its own memory that accumulates real knowledge of Xander's team/opponents over the season, instead of a fresh generic agent every time.
- **"Multi-model" resolved, concretely, 2026-08-15:** not raw model diversity for its own sake. His words: "the multiple perspective is already built into the agent structure — that's kind of what I want, cross-model checking, the coordinator's plan, to add a different perspective in there." The concrete shape: the Game Plan Coordinator drafts, then a **second model reviews that draft** for blind spots before it's final — a real Review/Equal-Twin pattern at this one step, not a vague "use several models" requirement threaded through everything.
- **Xander named the Self-Improvement Coach "Nick"** during this conversation — worth confirming whether he wants the other two named as well, or if only this one has a name so far.
- **The concrete version of "collaborate," confirmed correct by Xander:** when the Coordinator drafts, it reads the Football Scout's memory, the Self-Improvement Coach's memory, the shared football-knowledge base, *and* the actual Film Log sessions/entries for that stretch of time — all of it, not a summary of one source.

## Phase 4 — self-scouting

Not a separate build — Phase 1-2 with `subject: 'self'` (`context: 'practice'` or `'game'`), and Phase 3 pointed at practice/self-improvement instead of an opponent. No new engineering once Phase 1-3 exist.

## Explicitly out of scope for now, confirmed by Xander directly

Any further design/redesign work, general, not just the logo — his words tonight: "we just save the redesign for the end, I don't want to stop us from filling all this stuff out." The 2 design passes already done (structural + the real audit-checklist pass) are enough for now. No more proactive design dispatches until the actual features (log, agents, game plan) are built.

## A standing principle, not a phase: drawings are for him, writing is for the system

On the existing playbook cards (not the log): "I think the drawings are for me and the writing is for you on storage." When Xander fills in a card's assignment/rule text, that plain-English `answerText` field is the channel this whole system (agents included) actually reads — the diagram is for his own visual memorization, not something an agent parses. Worth keeping in mind for any future agent work: read the text, don't try to interpret the drawing.

## Open questions — all now answered directly by Xander, 2026-08-15

1. **Agent roster and memory — confirmed, no changes.** A real small team, each with its own persistent memory ("I want to keep everything organized"), but sharing the same underlying football knowledge so they don't drift apart ("they need to... solve the same amount of knowledge, at least ask them"). Confirmed roster:
   - **Football Scout** — opponent analysis. Its own memory of what's been learned about specific opponents over the season.
   - **Self-Improvement Coach** — Xander's own practice/game film. Its own memory of his recurring patterns over time.
   - **Game Plan Coordinator** — the one that actually drafts the weekly plan, pulling from both of the above plus the shared knowledge base. This is the one that does the multi-model collaboration, since drafting the plan is the actual synthesis step, not the note-taking.
   - **No 4th "vocabulary/rules" agent.** He raised this directly and answered it himself: "maybe we need to know all the nuances and the vocab stuff, unless that's already built into these agents... they really should be built in." Confirmed — the shared football-strategy knowledge base (below) is read by all three, so rules/vocabulary/technique live there once, not as a separate agent to consult.
   - **Real requirement, stated directly, not to be dropped:** "all the knowledge is out there online... it's got to provide good intel, it can't just be my knowledge, it's got to be additional stuff as well." The knowledge base is not a container for what Xander already knows — it has to bring real outside coaching technique and strategy he doesn't already have. That's what research-scout actually did (53 tool calls, 20+ real sources, confidence-graded, not summarized from memory) — this bar carries forward to any future research passes for this project, not just the first one.
2. **"Multi-model" for game-plan drafting — confirmed, concrete shape in Phase 3 above:** the Coordinator drafts, a second model reviews it. Not diversity for its own sake.
3. **Recurring-issue matching — confirmed as the hardest real piece in this plan, design expanded in Phase 2 above:** semantic theme-matching (not exact-match), run as a "Done" checkpoint plus a periodic every-few-entries pass during a long session, not live per keystroke and not only at the very end. Asks him when a match is genuinely unclear rather than guessing.

**Research landed, 2026-08-15 night, reviewed and confirmed correct by Xander:** `research-football-strategy.md` — coverages, why a defense picks one based on formation/personnel, real beater concepts per coverage (his Cover 2 example verified correct, with the precise term and 2 real caveats added), pre/post-snap reads, and the personnel/route-tree vocabulary needed to parse how he'll actually describe screenshots and plays (see Phase 1 above). This is what the 3 agents above get built from.

## Independent review (Codex Sol, pre-mortem, 2026-08-15) — 8 real findings, not a rubber stamp

Xander asked for a genuine adversarial pass before committing, done by a model that hadn't written the plan (real distance, not self-review). Verdict: **capture (Phase 1) is solid as designed — the two novel pieces, recurring-issue detection and multi-agent game-plan generation, are not yet buildable as written.** Each finding below, and what happened to it:

1. **No defined bridge between the app and the agents — the most important finding.** The Film Log lives in browser IndexedDB; the 3 agents are Nexus file-backed agents that cannot read a browser's IndexedDB directly. "Uses the existing Claude/Codex/Kimi access" was true but incomplete — it never specified HOW a session's data actually reaches an agent. **Real open decision, not resolved here — needs Xander's call:** the simplest option, and the one this plan recommends, is a versioned JSON export (a real file written into this same project folder, the same way `research-football-strategy.md` and this plan file already live here) that an agent reads directly — no new sync service, no new infra. But this is a real architecture choice, not a detail, and it's his to confirm before Phase 2/3 get built.
2. **The data model can't actually produce real tendencies from free text alone.** Applied: entries get optional structured fields (down/distance, quarter, personnel, coverage/front, field/boundary, result) — extracted from what he types/says and offered back for confirmation, not a separate form to fill out. "They ran Cover 3 on first down" needs a real count behind it, not a vibe.
3. **Play matching will not work against the real deck as written — confirmed against actual data, not theoretical.** 42 of the 79 real cards share a duplicate name (`Georgia` alone has 6 variants); some cards carry their L/R distinction in `prompt` but not in `variation`. Applied: match against the full `prompt` (not just `name`) plus aliases, present candidates for confirmation instead of auto-picking, store a name snapshot on the entry so a later deck edit/reset can't make an old log entry unreadable, and the system has to be allowed to say "not enough information" — "#1 fade, #2 comeback" alone doesn't uniquely identify a play.
4. **Recurring-issue detection needs a real structured issue record, not repeated free-text comparison.** Applied: an issue is its own object (skill, phase of play, symptom, suspected cause, confidence, the entries it's built from, a lifecycle of `open` / `improving` / `resolved` / `recurred`), Xander confirms merges rather than the system silently deciding two things are the same issue, and every recurrence surfaced always shows its exact supporting entries — otherwise Nick accumulates false pattern-memory over a season.
5. **The second-model review step was underspecified — real risk of becoming "agreement theater."** Applied: the reviewer works from a fixed rubric (does every tendency have real evidence and a sample size, do conclusions overreach the film notes, does a recommendation actually exist in Xander's installed playbook, is scheme failure being confused with execution failure), the Coordinator has to explicitly accept or reject each objection with a reason, and Xander approves the final output. Not just "a second opinion."
6. **The game plan's actual output and authority boundary was never defined.** Applied, and this is a real, deliberate scoping choice for a high-school player: the system produces an evidence-backed personal prep sheet and coach-discussion questions — not something that reads as overriding a real coach's calls. Concrete output: opponent tendencies with real counts, likely situational calls, pre/post-snap keys, relevant plays already in the deck, personal technique priorities, open uncertainties, and questions to bring to a coach.
7. **No durable source of truth.** A season of notes, screenshots, and agent memory is too valuable to live only in one browser's IndexedDB, which can be cleared or evicted. Applied: the Film Log is the canonical source, agent memory is derived from it and rebuildable, not the other way around; versioned export/import from day one; screenshots stored as compressed images with thumbnails rather than raw base64 data URLs (real storage-size win on top of the IndexedDB move already planned).
8. **"Every few entries" and "Done" need real defined behavior, not a vibe.** Applied: sessions autosave and are resumable, a specific entry count (not a fuzzy "every so often") triggers a periodic pass, editing a note after analysis marks that result stale, and pressing Done twice is safe (idempotent), not a duplicate run.

## Build order

1. Film Log tab + form (text-first, paste-a-screenshot, IndexedDB storage, play matching) — Phase 1's real MVP
2. Voice-button capture as a layered add-on once the text-first version works
3. Tendency + recurring-issue view (Phase 2)
4. The football-scout agent (once the 3 open questions above are answered) + game-plan drafting (Phase 3)
5. Nothing new for Phase 4 — falls out of 1-3 once they exist

Sources on the voice/auto-organize research: [Voicenotes](https://voicetonotes.ai/blog/best-voice-to-notes-app/), [VOXI](https://apps.apple.com/pl/app/voxi-ai-notes-transcribe/id6742537168), [Speechnotes](https://speechnotes.co/).
