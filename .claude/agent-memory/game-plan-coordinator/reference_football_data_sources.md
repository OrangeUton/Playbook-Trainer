---
name: football-data-sources-and-gotchas
description: Where game-plan source data lives, plus three real gotchas that will silently corrupt tendency counts if not handled
metadata:
  type: reference
---

Sources for a weekly game plan, and the traps in each.

**Film Log sessions** — `Football/film-log/sessions/*.json`. Opponent film is `subject: "opponent"`;
Nick's self-improvement data is `subject: "self"`.

**Gotcha 1 — the app's own `summary.offenseByFormation` undercounts badly.** `formation` is
free-text, so `"trey right "`, `"trey right"`, `"Trey Right"` and typos like `"try right "` all
count as distinct values. On the Beckman film the app reported Trey Right = 3 when the true
Trey/Trips family count was 16. **Always hand-normalize formation strings before quoting a count;
never quote `offenseByFormation` directly.**

**Gotcha 2 — most situation fields go unfilled.** On the first 36 logged entries, `personnel`,
`coverage`, `front`, `hash`, `quarter`, and `result` were empty on every single one, and
`screenshots` was `[]` on all of them. There is also **no under-center/shotgun field at all.** Check
which fields are actually populated before promising analysis that depends on them.

**Playbook deck** — `Football/src/data/playbook-trainer-seed.json` (~557KB, too big for one Read;
grep `"category"`/`"name"` instead). **The deck is offense-only** — categories are `formation`,
`concept`, `fullfield`. It contains no defensive calls, no screen cards, and no run cards. Notably
absent despite being standard concepts: Smash, Spot, Hank, Dagger, Pin, Scissors, Yankee, NCAA.
Never recommend those as "in your deck."

**Knowledge base** — `Football/research-football-strategy.md`. §3.1 is the coverage→beater master
table, §4.1 the pre-snap ladder, §2.3 formation/motion tells, §2.4 the HS wide-hash consequences.

**Cross-model review dispatch** — `nexus/scripts/codex-run.js` via Bash. **This gets denied under
"don't ask" sandbox mode.** If it's blocked, say so and stop; do not substitute a self-critique for
the independent pass.

Related: [[xander-player-profile]], [[beckman-week0-game-plan]]
