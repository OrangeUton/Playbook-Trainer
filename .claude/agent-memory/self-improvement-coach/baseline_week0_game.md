---
name: baseline-week0-game
description: Week 0 game (2026-08-20) is the first-ever self-subject logged session — baseline for longitudinal tracking going forward
metadata:
  type: project
---

Session `bc66cbce-649a-4954-aaf4-a45b0d94bbcf` (Week 0, game, filmDate 2026-08-20) is the **first self-subject session ever logged** in the film log. There is no prior self-session to compare against yet — this is the baseline, not a recurrence.

Two high-confidence issues came out of the app's semantic pass on that session:
1. **Leverage discipline** (`2afd5351-6c6e-4a10-b966-55e08d1aa5f6`, status: open) — losing assigned leverage (inside leverage in coverage AND special teams) across plays 25, 14/15, 10. Entries: 831d7ef9, 5caf4ce2, 32b15752.
2. **Hand placement / holding past 5 yards** (`1143febf-dcb9-40ec-9607-5e6faab312a7`, status: open) — contact past the 5-yard window turning into holding instead of controlled hand-on-hip. Plays 37, 15. Entries: 02e2393b, bceb2448.

Two entries were one-off notes NOT rolled into an issue (don't overstate these as patterns unless they recur): play 50 "don't reach to get hands on it, slows you down" (072d39b5), play 39 "commit to a coverage even if unsure" (adcf5a42).

**Why:** this is the anchor point for "this is the Nth time X has come up" tracking in future weeks. Next self session (Week 1+), check whether leverage/hand-placement issues recur, status changes (open → improving/resolved/recurred), or new patterns emerge.

**How to apply:** when a future session's issues mention leverage or hand-placement/holding, cite this Week 0 baseline explicitly (play numbers + session date) rather than treating it as a new finding.
