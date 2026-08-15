# Film Notes + Scouting — plan

Written 2026-08-15 while Xander was away, per his direct ask: figure out the right level of plan, write it, have it ready for when he's back. Scope is everything from his messages tonight, in his own words, reduced to a buildable shape:

- Play-linked receiver/assignment notes, matched against plays already in the system.
- Voice-dictated film notes that come out organized, not a wall of raw transcript.
- Attach a screenshot + the film's date/link to a specific note, so it still makes sense a month later.
- Opponent film → tendencies → a real game plan to attack them.
- Own film → same idea, aimed at what to fix in practice.

## The one architecture call that shapes everything else

**This is one system with a type flag, not four separate ones.** A note about an opponent's Cover 2 tendency and a note about your own footwork on a rep are the same shape: date, optional play reference, optional screenshot, optional video link, body text, tags. The only real difference is `subject: 'opponent' | 'self'`. Building one Notes feature that both scouting and self-improvement sit on top of is less code and means the tendency-aggregation view (Phase 2) works for both without extra work. Lands as a 4th tab next to Practice / Draw / Manage: **Film Notes**.

## Data model (extends the existing seed/deck, doesn't replace it)

```
note = {
  id, subject: 'opponent' | 'self',
  opponentName: string | null,        // only for subject: 'opponent'
  filmDate: string | null,             // ISO date, whatever he says or types
  videoLink: string | null,            // Hudl link etc, just a URL field
  playId: string | null,               // matched against the existing 79-card deck
  playMatchConfidence: 'exact' | 'fuzzy' | 'none',
  screenshots: [{ id, dataUrl, caption }],
  body: string,                        // the actual note, voice or typed
  tags: string[],                      // auto + manual
  createdAt
}
```

Lives in its own localStorage key (`playbook-notes-v1`), separate from the deck, so a notes-format change never risks the play data.

## Phase 1 — capture (the actual blocker right now: "I need to be able to take notes")

- New Film Notes tab: a note form (subject toggle, optional play picker, optional opponent name, optional film date/link) plus a body textarea.
- **Voice input via the browser's built-in Web Speech API** (`SpeechRecognition`) — free, no API key, no new cost, works live while typing is inconvenient (watching film). This is the same base mechanism every voice-notes tool researched tonight uses for capture; the "auto-organize" part (below) is what they layer on top, not a different capture method.
- **Play matching, not full AI tagging:** since all 79 plays are already named in the system, match spoken/typed text against that known list (exact match first, then fuzzy/substring) and suggest the play — this is the "smart tagging without manual work" pattern real voice-note tools use, just scoped to data we already have instead of a generic tagger.
- Screenshot attach: paste or upload an image, stored as a data URL on the note (same mechanism the play diagrams already use).
- This alone solves: "I need to take notes while watching film" and "a month later I won't remember what I meant" — a note now has the date, the play, and a picture proving it.

**Real risk to flag now, not discover later:** screenshots are much heavier than the line drawings already in the app, and localStorage has a hard ~5-10MB ceiling — the exact failure mode already fixed once tonight (`saveDeck`'s silent-failure bug). A handful of screenshots will hit that ceiling fast. **Recommendation: move notes (not the deck) to IndexedDB**, which has effectively no practical size limit for a personal tool like this. Same browser, no new dependency, just a different storage API — worth doing as part of Phase 1, not bolted on after it breaks.

## Phase 2 — tendencies (read-only view over Phase 1's data, no new capture needed)

- A filtered/grouped view: by opponent, by play, by formation category. "Show me every note tagged to Cover 2" or "everything on X's route depth vs this opponent."
- This is the actual scouting value — patterns only show up once notes are grouped, not one at a time.

## Phase 3 — game plan (the part with a real open decision)

Two honest options, not a fake one-path plan:

- **Manual:** a "Game Plan" note type that references a set of tendency notes and lets Xander write the plan himself, informed by Phase 2's grouped view. Zero new cost, zero new integration, ships immediately after Phase 2.
- **AI-assisted:** a button that sends the grouped tendency notes to an LLM and asks for a drafted game plan. Real value, but a real new decision: which model, and it's the first piece of this app that would need an API key/cost instead of being fully local and free like everything else so far. Not a Phase-1-quality call to make solo while he's away — flagging it here as the actual open question for when he's back, not deciding it for him.

## Phase 4 — self-scouting

Not a separate build — it's Phase 1-2 with `subject: 'self'`, and Phase 3's manual option pointed at practice instead of an opponent. No new engineering once Phase 1-2 exist.

## Build order

1. Film Notes tab + form + IndexedDB storage + play matching (Phase 1)
2. Screenshot attach + voice capture polish
3. Tendency/grouped view (Phase 2)
4. Manual game-plan note type (Phase 3, manual half)
5. AI-assisted game plan — only after Xander picks a direction on cost/model

Sources on the voice/auto-organize research: [Voicenotes](https://voicetonotes.ai/blog/best-voice-to-notes-app/), [VOXI](https://apps.apple.com/pl/app/voxi-ai-notes-transcribe/id6742537168), [Speechnotes](https://speechnotes.co/).
