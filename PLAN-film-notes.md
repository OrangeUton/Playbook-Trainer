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

```
entry = {
  id, subject: 'opponent' | 'self',
  context: 'practice' | 'game' | null,  // only meaningful for subject: 'self'
  opponentName: string | null,          // only for subject: 'opponent'
  filmDate: string | null,              // ISO date, whatever he says or types
  videoLink: string | null,             // Hudl link etc, just a URL field
  playId: string | null,                // matched against the existing 79-card deck
  playMatchConfidence: 'exact' | 'fuzzy' | 'none',
  screenshots: [{ id, dataUrl, caption }],
  body: string,                         // the actual log text, voice or typed
  tags: string[],                       // auto + manual
  createdAt
}
```

Lives in its own storage key, separate from the deck, so a log-format change never risks the play data. **Storage engine: IndexedDB, not localStorage** (see Phase 1's risk note) — this holds regardless of whether the app stays a localhost dev build or later becomes a packaged app; IndexedDB is a real browser API either way (the Nexus dashboard itself is Electron, which is just Chromium — same API, no change needed if this app ever gets packaged the same way).

## Phase 1 — capture (the actual blocker right now: "I need to be able to log this")

Xander's real correction to the original draft of this phase, kept honest rather than smoothed over:

- **Voice does NOT need to be a live-listening microphone.** His words: "that doesn't have to have like a live microphone thing... I can just use Whisper to talk into it and then it can paste into a thing." **The real Phase 1 MVP is just a text field** — type it, or paste in whatever he already transcribed with Whisper or anything else. Zero new capability needed for that part.
- **A nice-to-have on top, not a blocker:** "if there is like a button I could just press on the screen and it would voice it and then auto log it, that'd probably be better... I'm not sure how complicated that would be." A press-to-talk button using the browser's built-in speech recognition is a real, buildable add-on (same free, no-API-key mechanism as originally planned) — but it's explicitly optional and comes after the plain text field works, not instead of it.
- **Screenshot attach must be near-zero effort — his words, "really, really simple... I don't want to waste a bunch of time."** He already has the screenshot on his clipboard the moment he takes it. **Primary mechanism: paste directly into the log form (Ctrl+V)** — a paste-event listener that pulls an image straight off the clipboard, no file picker, no upload dialog. A file-picker fallback can exist but paste is the real UX target.
- **Play matching, not full AI tagging:** all 79 plays are already named in the system — match spoken/typed text against that known list (exact match first, then fuzzy/substring) and suggest the play. This is the same "smart tagging without manual effort" pattern real voice-note tools use, just scoped to data already in the app instead of a generic tagger.
- This alone solves: "I need to log this while watching film" and "a month later I won't remember what I meant" — an entry now has the date, the play, and a picture proving it.

**Real risk, unchanged from the original draft, still real:** screenshots are much heavier than the line drawings already in the app, and localStorage has a hard ~5-10MB ceiling — the exact failure mode already fixed once tonight (`saveDeck`'s silent-failure bug). IndexedDB (already in the data model above) is the fix, done once, up front, not discovered after it breaks.

## Phase 2 — tendencies AND recurring-issue detection (read-only view over Phase 1's data)

Two real jobs for this same view, both raised directly:

- **Scouting side:** grouped by opponent, by play, by formation category — "everything tagged to Cover 2," "X's route depth vs this opponent."
- **Self-improvement side, and this is the actual point of logging at all, his words:** "if I need to improve something it's all going to go in here and it needs to be logged and saved, so then say one week I have one issue and it resurfaces next week, since I logged that, I could actually go back and look... it also shows my reoccurring mistakes." **This needs a real recurring-issue surfacing pass, not just a filter:** when a new self-improvement entry shares a play, tag, or close text match with an older one, flag it — "this came up before, on [date], on this same play" — with a link straight to the old entry (and its screenshot/film link, since those are what make the old entry legible a month later).
- Real workflow this supports, stated directly: film gets watched over the weekend, logged as it's watched, and by Monday he already knows what to fix at practice and what to expect from the opponent — the log is the thing that makes that possible without re-watching anything.

## Phase 3 — game plan: AI-assisted, drafted together, by a real specialist agent

**Correcting my own earlier framing — this was wrong.** I originally flagged AI-assistance as "the first piece of this app that would cost money." Xander corrected that directly: it doesn't need a new API integration inside the React app at all — it uses the same Claude/Codex/Kimi access this whole project already runs on (the existing Nexus usage pool), the same way tonight's build and design pass did. No new cost, no new key.

**What he actually wants is more specific than a generic chat call, though — a real, load-bearing distinction:**

- "I'll just do it myself" for the raw film-watching — he's already flagged, honestly, that catching subtle visual tells on film isn't something a model reliably does today, and he's fine owning that part.
- What he wants the AI for is **synthesis over what's already logged**: read the accumulated log entries (tendencies, recurring self-issues, play references) and help draft the actual game plan — the part that's reasoning over structured text, which is a real, current strength.
- He wants **real football expertise behind it**, not a cold generic dispatch each time — "I need an agent that understands all the rules, understands what teams do in certain positions, why they do those things." This maps directly onto Nexus's own existing specialist-agent system (`.claude/agents/*.md`, the same mechanism as `build-specialist`/`qa-verifier`/etc.) — a real, persistent, file-backed **football-scout agent** with football-domain instructions and its own memory that accumulates real knowledge of Xander's team/opponents over the season, instead of a fresh generic agent every time.
- He also mentioned wanting **multiple models, "kind of diverse"** for this — open question below on exactly what that means in practice.

## Phase 4 — self-scouting

Not a separate build — Phase 1-2 with `subject: 'self'` (`context: 'practice'` or `'game'`), and Phase 3 pointed at practice/self-improvement instead of an opponent. No new engineering once Phase 1-3 exist.

## Explicitly out of scope for now, confirmed by Xander directly

A full visual/logo redesign of the whole app — his words, "we'll do that at the end when all the functions and everything are actually set up." Noted, not forgotten, not started.

## Open questions — answered directly by Xander, 2026-08-15

1. **Agent roster and memory — answered.** Not one generic agent: a real small team, each with its own persistent memory ("I want to keep everything organized"), but sharing the same underlying football knowledge so they don't drift apart ("they need to... solve the same amount of knowledge, at least ask them"). Proposed roster, his own call to correct if this isn't the right shape:
   - **Football Scout** — opponent analysis. Its own memory of what's been learned about specific opponents over the season.
   - **Self-Improvement Coach** — Xander's own practice/game film. Its own memory of his recurring patterns over time.
   - **Game Plan Coordinator** — the one that actually drafts the weekly plan, pulling from both of the above plus the shared knowledge base. This is the one that does the multi-model collaboration (below), since drafting the plan is the actual synthesis step, not the note-taking.
   All three read the same shared football-strategy knowledge (research dispatched tonight, see below) rather than each re-deriving it, but keep separate memory for what's specific to their own job.
2. **"Multi-model" for game-plan drafting — answered** (his "multimodal" was almost certainly dictation drift for "multi-model," matching what he said earlier in the same conversation about wanting it "diverse"). Real multi-model collaboration specifically at the Game Plan Coordinator step, not throughout every football task.
3. **Recurring-issue matching threshold — answered, and it's a real theme-matching problem, not a simple play-lookup.** His own words: "it could be something about tackling, something about form, could be offense or defense, could just be keeping your leverage — there's tons of things, and I'll probably use similar words, so that could be one signal... if you're ever unsure, just ask me." So: match on theme/wording similarity across entries, not just shared play ID, and when the match is genuinely uncertain, surface it as a question rather than silently deciding either way.

**Research dispatched, 2026-08-15 night:** a real, source-grounded football strategy knowledge base (coverages, why a defense picks one based on formation/personnel, real beater concepts per coverage, pre/post-snap reads) — this is what actually makes the Scout/Coordinator agents useful instead of generic, per his direct ask to "do all the research online." Landing in `research-football-strategy.md` in this same folder; the 3 agent files above get built once it's in and reviewed, not before.

## Build order

1. Film Log tab + form (text-first, paste-a-screenshot, IndexedDB storage, play matching) — Phase 1's real MVP
2. Voice-button capture as a layered add-on once the text-first version works
3. Tendency + recurring-issue view (Phase 2)
4. The football-scout agent (once the 3 open questions above are answered) + game-plan drafting (Phase 3)
5. Nothing new for Phase 4 — falls out of 1-3 once they exist

Sources on the voice/auto-organize research: [Voicenotes](https://voicetonotes.ai/blog/best-voice-to-notes-app/), [VOXI](https://apps.apple.com/pl/app/voxi-ai-notes-transcribe/id6742537168), [Speechnotes](https://speechnotes.co/).
