# Beckman — Game Plan (DRAFT, pending arbitration)

**Status:** DRAFT. Cross-model review has been run; reviewer objections are listed in §7 and are
**unresolved on purpose** — Xander arbitrates, not me.
**Drafted:** 2026-08-20
**Opponent:** Beckman
**Film base:** 2 logged sessions, both `filmDate` 2026-08-13, both `week: "0"`
- `bb52a4e2` — Beckman vs SHHS v BPHS — 19 entries
- `92718f87` — Beckman vs Buena Park — 17 entries
- `60e6f0a4` — Irvine Scrimmage — **0 entries, contributes nothing**

**Total usable sample: 36 logged reps.** Two games. That is a small sample and every count below is
stated as a raw count for that reason. 3 reps is 3 reps.

**Also on the table:** the coaches' Beckman offensive scouting report (pasted by Xander 2026-08-20).
It is treated here as a *separate source* from the film log, and every place the two agree or fail
to touch is marked. **The coaches' report outranks this document. This is prep, not a call sheet.**

---

## 0. The one thing to read first — the split

| Unit logged | Entries | What it feeds |
|---|---|---|
| Opponent **offense** | **36** | The defensive prep sheet (§1–§3) — real |
| Opponent **defense** | **0** | The offensive prep sheet (§4) — **empty** |

Both prep sheets are below because you need to be ready for both. But §4 has no film behind it and
says so rather than inventing coverages.

---

# PART A — DEFENSIVE PREP SHEET
*(built from the 36 logged Beckman-offense reps: how to cover and beat them)*

## 1. Base tendencies, with counts

### 1.1 Overall play type — 36 reps

| Type | Count | Share |
|---|---|---|
| Pass (dropback) | 20 | 56% |
| Run | 10 | 28% |
| Screen | 5 | 14% |
| Broken (bad snap/blown) | 1 | 3% |

**Pass + screen = 25 of 36 (69%).** This is a throwing team in the logged sample.

**Caveat that matters:** "screen" in this log is mostly *bubble/perimeter* screen, which behaves
like a pass in your coverage rules but like a run in your fit rules. Do not bucket them with
dropbacks when you set your alignment.

### 1.2 Formation family — 36 reps

| Family | Count | Share | Play type inside that family |
|---|---|---|---|
| **Trey / Trips (3x1)** | 16 | 44% | mixed — run 4, pass 8, screen 3, broken 1 |
| **Dubs (2x2)** | 11 | 31% | **pass 8, screen 1, run 1, broken-snap pass 1** |
| **Wing** | 6 | 17% | **run 4, pass 2** |
| Heavy / FB-only | 3 | 8% | run 2, pass 1 |

*(The two "2 fullbacks – dubs" reps are counted inside Dubs, not Heavy. Formation strings in the
log are free-text and inconsistently cased — `"try right "` on play 40 is read as a typo for
`trey right`. Flagged as a data-quality note, see §6.)*

**The two live reads here:**

- **Dubs (2x2) = throw.** 10 of 11 logged 2x2 reps were pass or screen. One QB-keep run
  (927, "QB read the DE and then the QB ran the ball") is the lone exception.
- **Wing = run.** 4 of 6 logged Wing reps were runs, and **both** Wing passes came off a
  **stretch/fake-stretch action** (see §2.1). Wing is their run-look, and their play-action comes
  from inside it.

### 1.3 Down and distance — where a down was actually logged

| Down | Reps | Pass | Run | Screen |
|---|---|---|---|---|
| 1st | 10 | 5 | 3 | 2 |
| 2nd | 7 | 4 | 2 | 1 |
| 3rd | **2** | 1 | 0 | 1 |
| 4th | **2** | 1 | 1 | 0 |

**1st down is 70% pass/screen (7 of 10).** Do not sell out to the run on 1st-and-10 against this
team on the strength of "it's first down."

**3rd and 4th down: 4 total logged reps.** That is not enough to build a third-down plan from.
The coaches' report says they pass on 3rd/4th-and-long and the four reps do not contradict it
(3&20 screen, 3&7 pass-sacked, 4&7 pass, 4&3 run) — but **that's the coaches' read carrying it,
not mine.** Take the coaches' number.

**One correction worth making out loud:** on 3rd-and-20 they threw a **screen**, not a dropback.
If your 3rd-and-long call is built to defend a deep dropback, a bubble screen on 3rd-and-20 with
blockers in front of it is exactly the play that beats it. "They pass on 3rd and long" is true and
still lets a screen kill you.

---

## 2. Repeated formation → outcome patterns
*(This is the section that only exists because a thing showed up more than once.)*

### 2.1 Wing → stretch, and fake-stretch off the same look — **3 reps**
- 927: `Wing Right`, 2nd & 2 — "They ran stretch to the side of the wing." (run)
- 927: `Wing Right`, 1st & 10 — "They ran a fake stretch." (`qbDetail: "fake stretch"`, pass)
- bb52 play 9: `dubs right` — "fake stretch to pass the Y in the flat - **Naked**" (pass)

**Read:** they show stretch, and the play-action off it works back to the **Y in the flat**.
Same-formation run and same-formation PA fake. **3 reps.**
**Key:** if the O-line steps zone/stretch and the Y doesn't stay in to block — he's your man in
the flat. Do not chase the mesh.
**Directly corroborates the coaches' report:** *"H- #9 and RB-#16 need to be keyed out of backfield
as pass targets in the flat."*

### 2.2 Backside / away-from-strength fade — **4 reps** (all from one game)
- 927: `Trey Right` screen — "Bubble to the number two receiver. **The number one receiver ran a fade.**"
- 927: `trey left - flex`, 2nd & 1 — "The side with three receivers ran Hitches to get to the first
  down and **the backside ran a fade.**"
- 927: `Wing left.`, 1st & 10 (run) — "**Backside receiver ran a fade.** Could potentially just be
  doing that as a substitute for blocking." *(Xander's own hedge, kept.)*
- 927: `dubs left`, 2nd & 2 — "Pass to number nine. He ran a **slot fade**."

**This is the pattern from your own worked example** — a repeated formation-to-outcome that surfaces
because it repeated, not because someone decided it was interesting: *strength one way, fade away
from it.*

**Three honest limits on it:**
1. **All 4 reps are from the Buena Park game.** Zero fade reps logged in the SHHS/BPHS game. This
   may be a one-opponent plan, not a Beckman identity.
2. **One of the four is explicitly hedged by you** as possibly a route-instead-of-blocking, on a
   run play. Call it 3 real reps and one maybe.
3. **They have a counter to it already** — see §2.3.

**Key:** on any 3x1 or strength-declared look, the single/backside receiver is not a throwaway.
Corner to that side does not squeeze inside on the run action.

### 2.3 The fade may be a decoy — **1 rep, but it changes how you play §2.2**
- bb52 play 8: `2 fullbacks - dubs left` — "#2 **maybe raises his hand to fake a Fade route when
  running a comeback** - ran comeback to the yard marker - 15 yards"

**One rep. Xander's own note already says "maybe."** Not a tendency. But it is the specific thing
that punishes a DB who has been coached all week to jump the fade. Worth knowing, not worth
game-planning.
**Key:** if the outside receiver throws the flag/hand up, **do not turn and run blind** — play the
top of the route and stay square until he actually stems past you. The comeback hit for 15.

### 2.4 Motion side = throw side — **3 reps** (all from one game)
- 927: `Trey left` — "The guy that motioned to the side that they threw the ball"
  (`qbDetail: "threw to the motion side"`)
- 927: `Dubs left - stack`, 1st & 10 — "He passed it to the side that the guy motioned to"
- 927: `trey left `, 3rd & 7 — "QB **rolled out to the side of the motion** and was going to pass
  but just got sacked."

**3 for 3 in the logged sample, all Buena Park.** The third one is the most useful: the QB
physically moved to the motion side, meaning it isn't just where he looked — the whole launch point
travels.
**Key:** motion is a *declaration* here, not a disguise. Get your strength/leverage adjustment made
and expect the ball to that side. On the rollout rep they got him — pressure to the motion side
worked once.

### 2.5 Tight/reduced splits → crossers — **3 reps** (all from the *other* game)
- bb52 play 35: `dubs` — "receivers line up closer together to run **crosser routes**"
- bb52 play 38: `trey right - wing ` — "receivers lined up tighter to run **crosser routes**"
- bb52 play 36: `dubs left ` — "#1 receiver lines up tighter when wanting to create more space"

**3 reps, all from the SHHS/BPHS game, zero from Buena Park.** Mirror image of §2.2's problem.
**This is a pre-snap key you can actually use** — the split is visible before the snap.
**Corroborates the coaches' report:** *"Purple coverage works for their concepts flood, levels,
crossers."* The log independently found the crossers.
**Note:** 2 of 3 crosser reps came from **Dubs (2x2)** — which lines up with the coaches' line
*"Plays that did not go strong were in 2x2 MOF passes."* 2x2 + tight splits = middle-of-field, and
that is the one look where they are NOT going strong/wide.

### 2.6 RB / back into the flat and bubble game — **3 bubble reps, 5 screens total**
- bb52 play 5: `trey left` — "rb run a bubble"
- bb52 play 32: `dubs Right`, 1st & 10 — "running back ran a **bubble to the wide side**"
- 927: `Trey Right` — "Bubble to the number two receiver"
- 927: `dubs right`, 1st & 10 — "The outside receivers ran a **force route**" (screen)
- bb52 plays 2 & 3: `trey right` screens, 2&15 and 3&20 — no detail logged

**Key:** the RB is a receiver. Coaches' report names **RB-#16** specifically. The log has 3 bubble
reps but **never records a jersey number for the back** — so I can confirm the behavior and not the
player.

### 2.7 2-back personnel → a back releases — **3 reps**
- 927: `2 full backs`, 4th & 7 — "One of the fullbacks actually **went out for a route** so we have
  to be alert for that."
- bb52 play 8: `2 fullbacks - dubs left` — "**1 of the fullbacks go out for a route**"
- bb52 play 7: `2 fullbacks -dubs right `, 2nd & 40 — "Two fullbacks just became **pass blockers**
  to give the QB more time to throw."

**2 of 3 released, 1 of 3 stayed in to protect.**
**Directly corroborates the coaches' report:** *"In 2-back personnel both backs will delay release
into a route. #16 especially."*
**Key:** in 2-back, **do not declare your fit until they declare.** The tell is delayed release, so
the LB who commits downhill at the snap is the one who gets beat. Note the one exception is a
2nd-and-40 max-protect — down/distance tells you which version you're getting.

---

## 3. Pre-snap and post-snap keys — the short list to actually carry

**Pre-snap, in order:**
1. **Count the receivers.** 3x1 (Trey/Trips) = 44% of their snaps, mixed run/pass — stay honest.
   2x2 (Dubs) = 31% and it's a **throw** (10/11).
2. **Is it Wing?** Wing = run-first (4/6) and PA-stretch is the change-up. §2.1.
3. **Splits.** Tight/compressed splits → crossers, middle of the field. §2.5. Normal/plus splits →
   perimeter and the backside fade is live. §2.2.
4. **Backfield count.** 2 backs → §2.7, delayed release, don't over-commit the LB.
5. **Motion.** If someone motions, expect the ball that way. §2.4.

**Post-snap, first three steps:**
1. **O-line stretch step + Y leaks** → fake stretch, Y in the flat, **Naked**. §2.1.
2. **QB launch point travels to the motion side** → the whole progression is over there. §2.4.
3. **Outside receiver's hand goes up** → play the top of the route, do not turn and run. §2.3.
4. **Bubble/blockers releasing outside on any down including 3rd-and-long** → §1.3, screen.

---

## 4. Plays already in your deck that map to what they run

Cross-referenced against the real `playbook-trainer-seed.json`. **Your installed deck is
offense-only** — categories are `formation`, `concept`, and `fullfield`. There are **zero defensive
calls in it.** That has one important consequence, stated in §6.

The value here is recognition speed: **you already rep these concepts as an offensive player, so
you can identify them faster than a defender who's only seen them on a scout card.**

| What Beckman showed (evidence) | In your deck as | Confidence |
|---|---|---|
| bb52 p9 "fake stretch to pass the Y in the flat - **Naked**" (`playMatchConfidence: "exact"`) | **Naked**, **H - Naked** | **Exact — logged by name** |
| Crossers off compressed splits, 3 reps (§2.5) | **Mesh**, **Shallow**, **Drive**, **China** | Concept family match |
| Coaches' report: "flood, levels, crossers" | **Flood**, **Levels** | Named in coaches' report, both installed |
| Coaches' report: three-level to one side | **Sail** | Named concept family |
| 927 "3-receiver side ran Hitches... backside ran a fade" (§2.2) | **Curls**, **Stick**, **Snag** | Loose — hitch/spot family |
| 927 "slot fade to #9", 2&2 (§2.2) | **Bow**, **Solo**, **Z - Choice** | Loose |
| Bubble/perimeter screens, 3 reps (§2.6) | *No screen card in the deck* | **No match — say so** |
| Coaches' calls: Cheetah, Purple, Bay Red, Fire, Base Purple | **Not in the deck at all** | **No match — deck has no defense** |
| Coaches' report: "counter, pulling guard" | *No run cards in the deck* | **No match** |

**Formations Beckman used that are already installed as cards** (so you can pull them up and see
them): Trey Left/Right, Dubs Left/Right, Wing Left/Right, Trips Left/Right, Stack Left/Right.
Also installed but not seen on this film: Bunch L/R, Empty L/R, Ace, Tight, Pro, King, Queen, Tank.

---

# PART B — OFFENSIVE PREP SHEET
*(what your offense should expect from Beckman's defense)*

## 5. There is no film behind this section, and I'm not going to invent it

**Logged Beckman-defense entries: 0.**
- `coverage` field: empty across all 36 entries
- `front` field: empty across all 36 entries
- `defenseByDown` in both session summaries: `[]`
- Both sessions' `defenseCount`: **0**

Both games were charted entirely from the Beckman-offense side. The coaches' report you pasted is
also titled **"Beckman *Offensive* Scouting Report"** — it describes *their* offense and *our*
defensive answers to it (Cheetah purple, Bay Red, Base Purple, Fire). It contains **nothing about
their defense either.**

**So there are exactly zero facts available about how Beckman plays defense.** Any coverage tendency
I wrote here would be fabricated, and the whole point of this system is that a claim points at a
real logged rep.

**What to do instead — the actual action item:**

1. **Go back to the same two Hudl films and log the other side.** The video links are already in the
   sessions:
   - Beckman vs SHHS v BPHS — `hudl.com/watch/team/36635/analyze?v=96141003`
   - Beckman vs Buena Park — `hudl.com/watch/team/36635/analyze?v=96065381`
2. **Log with `unit: "defense"`** and fill the `coverage` and `front` fields — they're the fields
   that are currently 100% empty and they're what makes this section exist.
3. **The minimum useful chart, in priority order** (from the knowledge base §4.1, the pre-snap
   ladder — this is your read as a receiver):
   - **Safety count, every snap.** One-high vs two-high is 80% of the read. This one field alone
     turns §5 into a real prep sheet.
   - **Corner technique on you:** press/off, inside/outside leverage, eyes on you or on the QB.
   - **Did the post-snap coverage match the pre-snap picture?** The knowledge base's explicit
     charting rule: *"for each opponent, what percentage of snaps did the post-snap coverage match
     the pre-snap picture?"* At the HS level pre-snap reads are usually reliable — but you find out
     by charting it, not by assuming.
   - **What motion does to them** — travels (man) / bumps (zone) / nothing moves and the nickel
     stays field-side (field-boundary defense, motion won't move them).
4. **Baseline to hold until you have film:** the knowledge base's honest base rate is that
   **Cover 3 is the most common coverage at the high school level.** That is a prior, not a scouting
   report on Beckman, and it should not go on a wristband.

**Deck concepts you already have that would be your answers once you know the coverage** — listed
so it's a fast lookup after you chart it, **not** as a recommendation right now:
- vs **Cover 3** → **Flood**, **Sail**, **Drive**, **Shallow** (all installed)
- vs **Cover 1 / man** → **Mesh**, **Shallow**, **Whip**, **China** (all installed)
- vs **Cover 2** → four verts / **Bow**, **Smash-family** — *note: no card literally named "Smash"
  in the deck; closest installed are **Snag**, **Chair**, **Solo***
- vs **Cover 4** → **Flood**, quick game, **Stick**, **Curls** (all installed)
- Bunch/stack answers → **Snag**, **Spot** family — **Snag** is installed; **Bunch Left/Right**
  formations are installed

---

## 6. Open uncertainties — named honestly

1. **Sample size is 36 reps over 2 games.** Every tendency in §2 rests on 3–4 reps. None of these
   are stable numbers. They are *things to look for*, not probabilities.
2. **The two games barely overlap.** The fade pattern (§2.2) is 4-for-4 from Buena Park and 0-for-19
   from SHHS/BPHS. The crossers pattern (§2.5) is 3-for-3 from SHHS/BPHS and 0-for-17 from Buena
   Park. **Both "tendencies" might really be per-opponent game plans, not Beckman identity.** This
   is the single biggest weakness in this whole document.
3. **The coaches' "72% strong side / wide side" is not verified by the log.** The log has 2 explicit
   wide-side notes ("force to the wide side", "bubble to the wide side") plus 3 motion-side throws.
   Directionally consistent, nowhere near a verification of 72%. **Trust the coaches' number over
   mine — they charted it, I didn't.**
4. **"Under center will be a run" cannot be checked at all.** The Film Log has no under-center /
   shotgun field, and the `formation` free-text never records it. The closest data: `fullback`
   (1&15) run and `Heavy.` (2&9) run — 2 reps, and neither one states the QB's alignment.
   **Unverifiable from my data. Take the coaches' word.**
5. **The counter-vs-Cheetah / pulling-guard-stance tell is coaches'-report-only.** Zero film log
   entries mention a counter, a pulling guard, or a lineman's stance. I can't corroborate it and I
   can't dispute it. It's probably the highest-value item on the coaches' sheet and it exists
   entirely outside this system.
6. **#16 never appears in the film log.** Not once, by number. #9 appears exactly once (the slot
   fade). The coaches' personnel keys are real; my log just doesn't carry jersey numbers.
7. **`personnel` is empty on all 36 entries**, so "Fire can be used in 11 personnel but NOT
   AUTOMATIC" cannot be checked against film. Personnel is the field the coaches' report leans on
   hardest and the one the log never captured.
8. **Zero screenshots attached to any of the 36 entries.** No image evidence to sharpen any point in
   here. (Checked — every `screenshots` array is `[]`.)
9. **Data quality:** formation strings are free-text and inconsistent — `"trey right "`,
   `"trey right"`, `"try right "` (typo), `"Trey Left"` all appear as distinct values. The app's own
   `offenseByFormation` summary undercounts badly because of it (it reports Trey Right = 3 when the
   true Trey/Trips family count is 16). **My counts in §1.2 are hand-normalized.** Worth a fix in
   the app.
10. **No self-improvement (`subject: "self"`) sessions exist yet**, so §7 below is empty. See it.
11. **Week numbering:** both sessions carry `week: "0"`, which is the week the *film* is from. I
    named this file `week-0-beckman.md` to match the only real convention signal in the data.
    There was no existing `game-plans/` folder, so I created it — **if you want a different naming
    convention, say so now while there's exactly one file in it.**

---

## 7. Personal technique priorities

**Empty, and it should be.**

The spec for this section is that it pulls from self-improvement-coach (Nick) rather than
re-deriving anything. Two real checks:
- `Football/.claude/agent-memory/self-improvement-coach/` — **does not exist.** Nick has no
  accumulated memory yet.
- Nick's data source is Film Log sessions with `subject: "self"`. **All three existing sessions are
  `subject: "opponent"`.** There are zero self-logged sessions.

So there is no accumulated record of your own recurring patterns to pull from. Writing technique
priorities here would mean me re-deriving them from scratch, which is exactly what this section is
specified *not* to do.

**To make this section exist by next week:** log one `subject: "self"` session — practice or game.
Once there are two, Nick can start telling you what's actually recurring rather than what happened
once.

---

## 8. Questions to bring to a coach

Ordered by how much a one-sentence answer would change this document.

1. **Do we have any Beckman defensive film, or a defensive scouting report?** Part B is empty and
   that's half the game. This is the highest-leverage question on the list.
2. **The fade and the crossers each show up in only one of the two games.** Is that Beckman
   adapting to each opponent, or did the two games just get charted differently? You've seen more
   of them than I have.
3. **"72% to the strong/wide side" — is that strong side (formation) or wide side (field)?** They're
   different reads and my §2.4 motion note only helps if strength is declared by formation. The
   knowledge base flags this exact question: does the opponent set strength to the *formation* or to
   the *field*?
4. **Which of Cheetah purple / Bay Red / Base Purple is the call against 2x2 compressed splits?**
   That's their crossers/MOF look (§2.5) and the report says Purple works for crossers — I want to
   confirm the specific check.
5. **"Fire in 11 personnel but NOT AUTOMATIC" — what's the actual trigger to check out of it?**
   The report says base Purple works instead; I want the if/then.
6. **The pulling-guard stance tell on counter — can you show it to me on film?** It's the best item
   on your sheet and nothing in my log touches it.
7. **In 2-back, who has the delayed-releasing back — me or the LB?** §2.7 says 2 of 3 backs
   released. I want to know if that's my responsibility or if I'm passing him off.
8. **Is #16 the back in the bubble game?** My log has 3 bubble reps and no jersey numbers.

---

## 9. Cross-model review — reviewer objections, UNRESOLVED

**THE REVIEW HAS NOT RUN YET.** The dispatch was attempted and **blocked by the sandbox** — this
session is in "don't ask" mode and `node .../nexus/scripts/codex-run.js` was denied permission.

I am **not** substituting my own critique for it. The whole point of the review step is that the
same reasoning that wrote this draft doesn't get to grade objections against itself, so a
self-review here would be worse than nothing.

**To complete it, the exact command is:**

```
cd "C:/Users/Xander/OneDrive/Hermes Agent/Football"
node "C:/Users/Xander/OneDrive/Hermes Agent/nexus/scripts/codex-run.js" exec -m gpt-5.6-sol \
  "<rubric + this file's contents>" \
  --output-last-message ".codex-result-gameplan-beckman.txt"
```

Rubric to send with it:
1. Does every tendency claim have real evidence and a stated sample size?
2. Do any conclusions overreach what the film notes actually show?
3. Does a recommendation genuinely exist in the installed playbook? (Deck is **offense-only** —
   categories `formation`/`concept`/`fullfield`. No card named Smash, Spot, Hank, Dagger, Pin,
   Scissors, Yankee, or NCAA; no screen cards, no run cards, no defensive calls.)
4. Is scheme failure being confused with execution failure anywhere?

When the reviewer's objections come back they get pasted in here **unresolved**, and Xander rules on
each one. Only then does the `DRAFT` status at the top come off.

---

*Built from: 2 Film Log sessions (36 entries), the coaches' Beckman offensive scouting report
(2026-08-20), `research-football-strategy.md`, and `playbook-trainer-seed.json`. This is a player's
prep sheet for a coach conversation. It does not override a coach's calls.*
