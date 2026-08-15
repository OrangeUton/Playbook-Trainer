# Football Strategy Knowledge Base — Coverages, Coverage Logic, Beaters, and Reads

**Written:** 2026-08-15 · **For:** Xander (player) + the future `football-scout` agent
**Scope:** pass coverage at the high school / college level. Everything here is sourced with links.

## How to read this file

- Every factual claim links to where it came from. If a claim has no link, it is a synthesis of two or more linked sources and is marked as such.
- **Confidence is labeled per section.** Where coaching sources genuinely disagree, the disagreement is stated, not flattened. §7 lists what could NOT be verified.
- **Freshness note:** coverage structure is one of the most stable bodies of knowledge in the sport — the Cover 2 rules written in 2014 are still the Cover 2 rules. So older sources (2014–2021) are fine for *structure* and *technique*. Only the **usage-rate statistics** in §2.6 need to be current, and those are NFL 2025 numbers, which describe the NFL, not a high school opponent. Do not cite NFL usage rates as if they describe a high school defense.
- **Level warning that applies to the whole file:** most published X's-and-O's writing is about the NFL and top-tier college. High school defenses are simpler, use fewer checks, and execute technique less consistently. That means the textbook weaknesses below are usually *more* open at the high school level, not less — but also that a high school defense may fail in ways no scheme diagram predicts (a safety who doesn't get depth, a corner who doesn't jam). Scout the players, not just the call.

---

## Quick notation key (full vocabulary in §5)

| Term | Meaning |
|---|---|
| **#1 / #2 / #3** | Receivers counted from the sideline inward on each side. #1 is always the outside-most. |
| **2x2 / 3x1** | Receiver distribution. 2x2 = two each side ("doubles"). 3x1 = trips to one side. |
| **MOFO / MOFC** | Middle Of Field Open (two-high safeties) / Closed (one-high safety). The single most important pre-snap read. |
| **Field / boundary** | Wide side of the field / short side, measured from the hash the ball is on. |
| **Leverage** | Which shoulder a defender is shaded to. "Inside leverage" = he's between you and the middle. |
| **Match / pattern-match** | Zone that converts to man based on how routes distribute. Looks like zone, plays like man. |
| **Spot-drop** | True zone — defenders run to a landmark and read the QB. |
| **11 / 12 / 21 personnel** | Offensive personnel. First digit = RBs, second = TEs. WRs = 5 minus the sum. |

---

# 1. The Core Coverages

**Confidence: HIGH.** Every coverage below is corroborated by at least two independent sources, and the structural details (depths, leverage, responsibilities) come from Matt Bowen (7-year NFL safety, Bleacher Report's NFL 101 series) cross-checked against Weekly Spiral's Football 101 series.

**The naming rule:** the coverage number = **the number of deep zone defenders**. Cover 0 has zero, Cover 3 has three, Cover 4 has four. Cover 6 is the exception (see §1.7).

**The other big split — man vs. zone — is not the real split anymore.** The real modern split is **spot-drop zone vs. match zone**. In spot-drop, defenders run to a landmark and watch the QB, so there are static soft spots you can sit in. In match (pattern-match) zone, defenders read the route distribution and convert to man coverage on whoever enters their area — so the "zone hole" you were taught doesn't exist, and you have to beat the man in front of you. This distinction matters more for a receiver than knowing the coverage number ([USA Football on Saban's pattern-match Cover 3](https://blogs.usafootball.com/blog/5615/how-to-understand-nick-saban-s-pattern-match-cover-3-defense), [MatchQuarters](https://www.matchquarters.com/)).

---

## 1.1 Cover 0 — no deep help, man across, usually blitz

**Alignment / what it looks like:** No safety deeper than ~8 yards. Everybody in the secondary is matched up on a man. Extra defenders walked up on the line. Corners often play with inside or off leverage on #1 because there is no help ([Weekly Spiral](https://weeklyspiral.com/2021/08/02/cover-0/), [Kinetex](https://blog.kinetex.co/what-is-cover-0-why-are-nfl-teams-playing-more-of-it/)).

**Core strength:** Maximum rushers vs. a five-man protection = a free rusher, every time. It forces the offense into predictable hot routes and protection rules the defense has already game-planned against ([Kinetex](https://blog.kinetex.co/what-is-cover-0-why-are-nfl-teams-playing-more-of-it/)).

**Core weakness:** There is no margin. One missed tackle, one won matchup, one perfectly placed throw = a touchdown, because there is nobody behind the coverage ([Weekly Spiral](https://weeklyspiral.com/2021/08/02/cover-0/)). Also badly exposed to screens — blitzing into a screen is a disaster ([Kinetex](https://blog.kinetex.co/what-is-cover-0-why-are-nfl-teams-playing-more-of-it/)).

**Variation to know:** "Cover 0 Plug" — the defense shows all-out pressure, then some first- and second-level defenders drop into short zones to take away the quick game. It's a bluff, and it's specifically designed to punish an offense that has hot-routed everything short ([Weekly Spiral](https://weeklyspiral.com/2021/08/02/cover-0/)).

---

## 1.2 Cover 1 — "man free"

**Alignment:** One high safety in the deep middle. Everyone else is in man. DBs align on the **outside shoulder/outside eye** of their receiver and keep that leverage through the route, because the free safety is the inside help. In off-man they sit **7–8 yards** off and don't come out of the backpedal until the receiver eats that cushion ([Bowen, NFL 101: Cover 1](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)).

**The exception worth memorizing:** against a receiver in a **"plus split"** (2–3 yards outside the numbers), the defender can flip to *inside* leverage — the sideline becomes his help, so he takes away the slant and smash instead ([Bowen](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)). If you're split wide and the corner is suddenly inside, that's why.

**The extra defender:** there is usually a **"rat" / hole player**, typically the Mike, sitting underneath at 5–8 yards to take away slants and crossers. "Cover 1 Robber" is the same idea with the strong safety in the hole instead ([Bowen](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)).

**Core strength:** Man coverage with a safety net. Frees a defender to blitz or rob, and it's the most common red-zone/goal-line call because the field is short ([Football Toolbox](https://footballtoolbox.net/red-zone-pass-coverage-technique)).

**Core weakness:** Everything that makes man coverage hard — traffic, crossers, and rubs. Bowen names Hi-Lo crossing routes, stack/bunch alignments, and shallow crossers with vertical stacks as the concepts that challenge it ([Bowen](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)). Also: every defender has his back to the ball, so the QB scramble is a real answer.

---

## 1.3 Cover 2 — two deep halves, five under

**Alignment:** Two safeties splitting the field in half. Bowen's specific numbers: safeties align at **15 yards and work to 18 at the snap**, with the **top of the numbers as their landmark** ([Bowen, NFL 101: Cover 2](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)). Weekly Spiral gives a wider practical range of **12–18 yards depending on down, distance, and personnel** ([Weekly Spiral](https://weeklyspiral.com/2021/07/19/cover-2/)).

**Corners:** press or head-up, **jam #1 to force an inside release**, then **sink at a 45-degree angle** to cushion the safety before reacting to the flat. They funnel you inside toward help and they own outside contain in the run game ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2), [Weekly Spiral](https://weeklyspiral.com/2021/07/19/cover-2/)).

**Linebackers:** Sam/Will drop to **10–12 yards between the numbers and the hash** in seam-hook zones. The Mike opens his hips to the passing strength and carries the seam route down the middle ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)).

**Core strength:** With a four-man rush that gets home, Cover 2 limits explosive plays — everything is in front of two deep defenders, and every underneath defender has eyes on the QB and can jump routes ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2), [Weekly Spiral](https://weeklyspiral.com/2021/07/19/cover-2/)).

**Core weaknesses — there are two, and which one is "the" weakness is a real disagreement between sources (see §7):**

1. **The deep middle, between the two safeties.** Only two defenders cover what are effectively three deep lanes. A vertical from #2 or #3 splits them. This is Xander's example and it is correct — details in §3.
2. **The "hole shot" / "honey hole"** — deep along the sideline at roughly **12–20 yards**, behind the corner (who has sunk and is now reading the flat) but too far from the safety for him to break on it. [The Scouting Academy glossary](https://scoutingacademy.com/itp-glossary-honey-hole/) defines it as the soft area "deep along the sidelines, behind the cornerbacks and away from the two-deep safeties." It requires a throw on a rope; the throwing window is small.

Secondary weaknesses: only ~7 in the box against the run, and five underneath zones means there are throttle-down windows all over the intermediate field ([FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2)).

**The variation that changes everything — Tampa 2:** the Mike drops deep down the middle as a **third deep defender**, which frees the safeties to widen quickly to the outside verticals ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2), [Weekly Spiral](https://weeklyspiral.com/2021/07/19/cover-2/)). **This closes weakness #1.** So the very first scouting question about any Cover 2 team is: *does the Mike run to the deep middle, or does he stay at 10–12?* If he runs, attack the hole shot and the underneath windows he just vacated, not the seam ([FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2)).

---

## 1.4 2-Man (Cover 2 Man / "two-man under")

**Alignment:** Looks exactly like Cover 2 pre-snap — two deep-half safeties — but underneath is **man coverage with trail technique**, not zone ([Bowen, NFL 101: 2-Man](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)).

**Trail technique:** underneath defenders press with **inside leverage / inside eye**, sit on the inside hip, and deliberately play from a trailing position — inviting the throw over the top, where the safety is waiting ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage), [Jon Svec, "An Intro to Two-Man"](https://jonsvec.substack.com/p/an-intro-to-two-man)).

**Core strength:** Takes away every inside-breaking route — slants, digs, curls — while a safety caps the fade. It's a common third-down and sub-package call against 11 personnel ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)).

**Core weakness — and this is the key difference from Cover 2:** *there is no Mike in the deep middle.* Bowen states it directly: "there is no protection down the middle of the field in 2-Man." The inside seam from #3 or a tight end, against a linebacker running with his back to the ball, is the structural hole. It's especially stressed in the red zone, where the safeties get squeezed ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)).

Secondary weakness: it's man, so rubs, picks, and mesh work — plus the trail technique specifically invites the **back-shoulder** throw.

---

## 1.5 Cover 3 — three deep thirds, four under

**Alignment:** Corners take the deep outside thirds, free safety takes the deep middle third. Corners often start at **7–8 yards using a "press-bail" technique** — they show press, then bail to the third. Four underneath defenders play at **10–12 yards**: curl-flat defenders to the numbers, hook defenders outside the hashes ([Bowen, NFL 101: Cover 3](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3), [Weekly Spiral](https://weeklyspiral.com/2021/07/26/cover-3/)).

**Core strength:** It's a run defense that plays pass. Rushing four and dropping seven still leaves an eight-man front, which is why it's the most common early-down call at the high school and college level, where the run game dominates ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3), [Joe Daniel Football](https://www.joedanielfootball.com/blog/cover-3-defense)).

**Variations you must identify (they change where the hole is):**
- **Sky** — strong safety rolls down as the curl-flat player.
- **Buzz** — strong safety drops *inside* the numbers as a middle-hook robber, and a linebacker takes curl-flat instead. Shows a two-deep look pre-snap to disguise ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3), [Weekly Spiral](https://weeklyspiral.com/2021/07/26/cover-3/)).
- **Cloud** — the corner to one side plays a Cover 2 technique (jam #1, take the flat) with the safety over the top in that deep third. Used specifically against an elite outside receiver ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3)).

**Core weakness:** **Four verticals.** One free safety cannot cover two seams. This was so decisive that Belichick and Saban invented **Rip/Liz match** in 1994 specifically because four verts was destroying their Cover 3 ([Tomahawk Nation](https://www.tomahawknation.com/florida-state-football-fsu-noles/2020/5/21/21265925/fsu-nick-saban-rip-liz-pattern-matching-cover-adam-fuller-florida-state-seminoles-football-norvell), [Pats Pulpit](https://www.patspulpit.com/2019/3/4/18234062/film-room-pattern-match-zone-rip-liz-cover-3-match-mable-nick-saban-cleveland-browns)).

Second weakness: only four underneath defenders for the whole width of the field, which makes the **curl-flat defender** the most conflicted player in football — high-low him and he's wrong either way ([Weekly Spiral](https://weeklyspiral.com/2021/07/26/cover-3/), [Spread Offense](https://spreadoffensefootball.com/how-to-beat-cover-3-defense/)).

**Critical scouting question:** is it **spot-drop Cover 3 or Rip/Liz match Cover 3?** In match, the safety and outside linebacker split the two #2 verticals and four verts is dead ([USA Football](https://blogs.usafootball.com/blog/5615/how-to-understand-nick-saban-s-pattern-match-cover-3-defense)). Rip/Liz is now widespread at the high school level ([USA Football, defensive trends](https://blogs.usafootball.com/blog/7457/defensive-trends-coverages-fronts-and-pressures)). Tell: post-snap, does a defender *run with* the #2 vertical, or does he drop to a landmark and look at the QB?

---

## 1.6 Cover 4 (Quarters) — four deep, three under

**Alignment:** Corners **7–8 yards off with an outside shade**; safeties at **10–12 yards** (Weekly Spiral says 10–14) playing a **flat-footed read** of #2 ([Bowen, NFL 101: Cover 4](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4), [Weekly Spiral](https://weeklyspiral.com/2021/08/09/cover-4/)).

**The match rules — this is the whole coverage:**
- **Safety:** reads #2's release. If #2 goes **vertical past ~10–12 yards**, the safety takes him man-to-man. If #2 goes out, under, or flat, the safety comes off and **brackets/robs #1** on the curl, dig, or post ([Bowen](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4), [Weekly Spiral](https://weeklyspiral.com/2021/08/09/cover-4/)).
- **Corner:** matches #1's vertical release in the outside quarter, essentially man. If #1 doesn't stem vertical (smash, shallow), the corner sinks and helps inside ([Bowen](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4)).
- **Mike:** walls off crossers, and carries #3 in 3x1 ([Bowen](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4)).

**Core strength:** It is the best run-support coverage in football, because both safeties are run players in the alley — effectively a nine-man fit — while still having four bodies deep and the ability to double-team the other team's best receiver ([Weekly Spiral](https://weeklyspiral.com/2021/08/09/cover-4/)). Very hard to throw over.

**Core weakness — sources disagree on which is primary (see §7):**
1. **Only three underneath defenders.** The flats, the quick game, bubbles and RPOs are structurally open. [Weekly Spiral's Cover 6 article](https://weeklyspiral.com/2021/08/16/cover-6/) names the Cover 4 linebacker "not able to get out quickly enough" as the vulnerability.
2. **The #3 seam in 3x1 (trips).** [Bowen](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4) calls the inside vertical from #3 the primary vulnerability.
3. **Play-action.** The safeties have real run responsibility, so a good run fake pulls them down and the deep quarter opens ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)).

Both #1 and #2 are true; which one is open depends on whether the defense has a trips check installed (§2.3). At the high school level, assume many do not.

---

## 1.7 Cover 6 — "quarter-quarter-half"

**Alignment:** A split-field hybrid — **quarters (Cover 4) on one side, Cover 2 on the other**. Net result is three deep and four under, so it can *look* like Cover 3 pre-snap ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/), [Pro Style Spread Offense](https://prostylespreadoffense.com/coverage-recognition-quarter-quarter-half-cover-6/)).

Name origin: 4 + 2 = 6.

**The standard version** is quarters to the field/strength, Cover 2 to the boundary/weak side ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/), [Pro Style Spread Offense](https://prostylespreadoffense.com/coverage-recognition-quarter-quarter-half-cover-6/)). Teams do flip which side gets which — [X&O Labs](https://www.xandolabs.com/the-lab/defense/coverage/two-high-coverage-structures/defending-formations-into-the-boundary-fib-from-two-high-structures/) describes playing Cover 2 to the boundary and quarters to the field as a change-up specifically to catch offenses throwing the #2-to-the-flat. **Do not assume the sides.** Scout them.

**Core strength:** Extra deep help to the field where there's the most grass, a physical Cover 2 corner on the boundary X, help against 3x1, and safeties still active in run support ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)).

**The easiest coverage in football to identify pre-snap:** the two corners have *different jobs*, so their alignment and body language don't match. One is pressing/squatting (the Cover 2 side); the other is off with outside shade (the quarters side). [Pro Style Spread Offense](https://prostylespreadoffense.com/coverage-recognition-quarter-quarter-half-cover-6/) calls this out explicitly as the giveaway. **Non-matching corners = Cover 6 (or some other split-field call).**

**Core weakness:** Underneath, on the quarters side, where the flat defender can't get out ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)). And on the Cover 2 side, the corner is high-lowed by Smash exactly like he would be in real Cover 2.

---

## 1.8 Trap / "squat" coverage — the one that gets receivers intercepted

Worth its own entry because it's the coverage most likely to turn a well-run route into a pick-six.

**What it is:** the corner shows Cover 2, plays a **"soft squat"** — sinking, eyes inside, baiting the QB. He reads **#2's release**: if #2 breaks outside, the corner **abandons #1 and jumps the out route**. A safety caps the fade over the top ([Bowen, NFL 101: Trap Coverage](https://bleacherreport.com/articles/2486941-nfl-101-introducing-trap-coverage)).

**What it's baiting:** the first outside-breaking route — outs, flats, quick hitches ([Bowen](https://bleacherreport.com/articles/2486941-nfl-101-introducing-trap-coverage)).

**Receiver-level implication:** if the corner's eyes are inside on the QB and he isn't widening with you at all, your out route is the trap. Sit down inside or convert vertical instead.

---

# 2. Why a Defense Picks a Coverage

**Confidence: HIGH on personnel/down-distance/field logic; MEDIUM on the specific trips checks in §2.3 (paywalled sources — see §7).**

A defensive coordinator is not picking coverages at random. Every call is an answer to four inputs: **personnel, formation, down & distance, and field position.** This is the section a scouting agent should build tendency charts around.

## 2.1 Personnel grouping → defensive package

The offense substitutes first; the defense matches. This is the most mechanical, most predictable part of the whole game and the easiest thing to scout.

**Offensive notation:** first digit = running backs, second digit = tight ends. Wide receivers = 5 minus the two digits ([Kinetex](https://blog.kinetex.co/deciphering-footballs-personnel-codes-on-offense-and-defense/)).

| Offense | Means | Typical defensive answer | Why |
|---|---|---|---|
| **10** | 1 RB, 0 TE, 4 WR | Nickel or dime | Four receivers, no TE — defense can't stay heavy |
| **11** | 1 RB, 1 TE, 3 WR | **Nickel** (5 DBs) | The league-standard matchup ([Kinetex](https://blog.kinetex.co/deciphering-footballs-personnel-codes-on-offense-and-defense/), [Bulldawg Illustrated](https://bulldawgillustrated.com/understanding-the-complexities-of-the-nickel-and-dime-defensive-packages/2025/)) |
| **12** | 1 RB, 2 TE, 2 WR | Base, or nickel if the TEs are receivers | The real conflict grouping — it can be a run or pass look, which is exactly why offenses use it |
| **13 / 22 / 21** | Heavy | **Base**, single-high, 8-man box | Defense sells out to stop the run; expect Cover 3 or Cover 1 |
| **Empty (5 WR)** | 0 RB | Nickel/dime, and often pressure | No RB means five-man protection max — the defense knows it can get a free rusher |

**The scouting exploit:** because coordinators substitute predictably, offenses attack the substitution — running against a light nickel box, or throwing against a heavy base personnel that can't cover. Coordinators know this and try to stay unpredictable ([Bulldawg Illustrated](https://bulldawgillustrated.com/understanding-the-complexities-of-the-nickel-and-dime-defensive-packages/2025/)). **The single most valuable tendency to chart on an opponent's defense: what they do when they *can't* substitute — i.e., after a first down or a no-huddle tempo snap.**

## 2.2 Down & distance

- **1st down, 2nd-and-medium (run-first downs):** the defense wants numbers in the box. Expect **Cover 3** (eight-man front from a four-man rush) or **quarters** (nine-man fit with the safeties as run players). Bowen names Cover 3 explicitly as an early-down base coverage out of base personnel ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3)).
- **3rd-and-long:** run defense stops mattering. Expect two-high shells, **2-Man**, nickel/dime, and coverages that keep everything in front of the sticks. Bowen names 2-Man as a third-down sub-package call ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)); dime packages become more prevalent as distance grows ([Bulldawg Illustrated](https://bulldawgillustrated.com/understanding-the-complexities-of-the-nickel-and-dime-defensive-packages/2025/)).
- **3rd-and-short / 4th-and-short:** man and pressure — **Cover 1 or Cover 0**. Not enough field or time for zone to matter.
- **Bowen's specific in-scheme adjustment worth knowing:** Cover 2 has down-and-distance flavors. "**Red 2**" uses a flat-footed read with no backpedal (short field, protect the goal line, five-across look). "**Green 2**" drops the Mike to 10–12 yards and **voluntarily gives up the flat/check-down to protect the sticks** ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)). If a defense is giving you the flat for free on 3rd-and-12, that is a coaching decision, not a mistake.
- **Charting rule for the agent:** coordinators chart offenses by **down-and-distance × personnel × field position** — e.g. "65% pass on third-and-medium." Build the scouting tool's tendency buckets the same way, because that's the same grid the opposing coordinator is using on you ([Bulldawg Illustrated](https://bulldawgillustrated.com/understanding-the-complexities-of-the-nickel-and-dime-defensive-packages/2025/)).

## 2.3 Formation

**Trips (3x1)** is the single biggest formation problem a defense has to solve. Three receivers to one side means the defense must either **spin to a single-high coverage** (simple, but now you're in Cover 3 and vulnerable to verts) or **check into a specific quarters adjustment.** The three common families of quarters trips checks ([MatchQuarters / Cody Alexander](https://www.matchquarters.com/p/what-is-stubbie-coverage-special-mini-lock-x-trips-coverages), [MatchQuarters, Poach vs. Solo](https://www.matchquarters.com/p/coverage-101-poach-vs-solo-quarters-jets)):

- **Stress** — man-on-deep ("MOD") sky rules stretched across all three receivers.
- **Special / Stubbie** — the corner is locked on #1 in **MEG** ("Man Everywhere he Goes") while the safety and nickel play a 2-Read / Palms triangle over #2 and #3.
- **Solo / Poach** — the *backside* safety reads #3's release. If #3 goes vertical, the backside safety leaves his side and takes #3 man-to-man; anything underneath is left to the underneath defenders.

**The exploit:** in Solo/Poach the backside safety is committed to #3. That means the **backside X receiver is one-on-one with no help.** That's the single-receiver-side isolation shot. (Confidence MEDIUM — sourced from search-result summaries and MatchQuarters headlines; full articles are paywalled. Verify against film before betting a game plan on it.)

**Bunch** — receivers with tight splits. This forces man teams into zone principles, because you cannot legally chase a man through three bodies without getting picked. [CoachesInsider](https://coachesinsider.com/football/effective-strategies-for-dealing-with-man-coverage-beaters-stacks-bunches-and-mesh-article/) states it directly: "coming out in a bunch formation will make a defense that plays a lot of man coverage start using zone principles." **If you want to know whether a team is a man team, put them in bunch and watch what they do.**

**Empty** — no RB in the backfield means the offense has at most five blockers. Defenses that see empty know they can create a free rusher with a six-man pressure, so empty tends to draw pressure and man coverage. It also isolates every matchup — five defenders on five receivers with nowhere to hide.

**Motion is a diagnostic tool, not just a play call.** Whether motion actually moves anybody tells you what kind of defense you're playing:
- Defender **travels with the motion man** → man coverage.
- Defenders **bump/pass off** → zone.
- **Nothing moves at all, and the nickel stays to the wide side** → this is a **field/boundary** defense, not a formation-strength defense, and motion will not move them ([Kinetex, Passing Strength and Field-and-Boundary Defenses](https://blog.kinetex.co/passing-strength-and-field-and-boundary-defenses-a-quarterbacks-guide/)).

## 2.4 Field position and hash — and why this matters more in high school than anywhere else

**Hash mark spacing by level:**

| Level | Distance between hashes |
|---|---|
| **High school (NFHS)** | **53 ft 4 in** |
| College (NCAA) | 40 ft |
| NFL | 18 ft 6 in |

Source: [Athlon Sports](https://athlonsports.com/college-football/how-long-football-field), [CoverSports NFHS field guide](https://coversports.com/resources/field-guides/high-school-football-field-dimensions-guide).

**This is the most under-appreciated fact for a high school player.** High school hashes are the widest in football — the field is divided into thirds, and the hash is a full third of the way in. When the ball is on a hash in high school, the field side is *dramatically* wider than the boundary. The strategic consequences:

- The **boundary side is genuinely cramped** — there may only be ~15–20 yards of width. Boundary corners can play aggressively with inside leverage and let the sideline be their help. Deep outside throws to the boundary are extremely hard.
- The **field side is enormous** — which is exactly why defenses play **quarters or extra help to the field, and Cover 2 or a lock corner to the boundary** ([X&O Labs](https://www.xandolabs.com/the-lab/defense/coverage/two-high-coverage-structures/defending-formations-into-the-boundary-fib-from-two-high-structures/), [Weekly Spiral on Cover 6](https://weeklyspiral.com/2021/08/16/cover-6/)).
- Where the ball sits tells you where the space is: ball on the left hash → the space is right ([X&O Labs](https://www.xandolabs.com/the-lab/defense/coverage/two-high-coverage-structures/defending-formations-into-the-boundary-fib-from-two-high-structures/)).

**Practical scouting question:** does the opponent set strength to the **formation** (they follow the receivers) or to the **field** (they follow the ball)? That one answer determines whether motion and formation-into-boundary are useful weapons against them ([Kinetex](https://blog.kinetex.co/passing-strength-and-field-and-boundary-defenses-a-quarterbacks-guide/)).

## 2.5 Red zone, backed up, and 2-minute

- **Red zone:** the field vertically shrinks; the width never does. With less deep field to defend, deep zones stop being useful and zone holes become obvious, so defenses go to **man — Cover 1 and Cover 0** — and bring more pressure ([Football Toolbox, Red Zone Pass Coverage Technique](https://footballtoolbox.net/red-zone-pass-coverage-technique), [Game Plan with Duke](https://www.gameplanwithduke.com/post/why-the-red-zone-is-a-different-game)). Cover 2 in the red zone becomes "Red 2," a five-across look with the two half safeties, the Mike, and both corners ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)).
- **2-Man is *worse* in the red zone**, not better — Bowen specifically flags the 20-to-35 zone as where 2-Man stresses safeties, because there's no middle-of-field help ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)).
- **2-minute / protect a lead:** two-high shells, soft corners, keep everything in front and inbounds.

## 2.6 What the modern trend actually is (context, not a prediction about your opponent)

- NFL 2025: league-average **pre-snap two-high look = 57.5%**; static two-high (36.5%) now exceeds static single-high (33%). **Cover 4 and Cover 6 together are ~25% of coverage snaps on passing plays.** San Francisco disguises (shows two-high, rotates to single-high or vice versa) on **47% of snaps**, the highest rate in the league ([Fantasy Points DFS Coverage Shells](https://www.fantasypoints.com/nfl/articles/2025/week-10-dfs-coverage-shells), [PFF: five schematic trends of the 2025 season](https://www.pff.com/news/nfl-is-evolving-five-schematic-trends-that-have-shaped-the-2025-season)).
- High school / youth trends: **Rip/Liz Cover 3 match** is now widespread; **Cover 7 / quarters-family split-field** and general **match coverage** are trending; on the front side, the **Tite front (4i-0-4i)** is the most-adopted front, specifically to handle RPOs and perimeter passing ([USA Football, Defensive Trends](https://blogs.usafootball.com/blog/7457/defensive-trends-coverages-fronts-and-pressures)).
- Still true and still the most important base-rate for a high school scout: **Cover 3 is the most common coverage at the high school level**, largely because the run game is still dominant there ([Joe Daniel Football](https://www.joedanielfootball.com/blog/cover-3-defense), [Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/what-is-cover-3-in-football)).

---

# 3. Beater Concepts — What Attacks What

**Confidence: HIGH on the concept→coverage pairings (multiple independent sources agree). MEDIUM on exact route depths, which vary by playbook.**

## 3.1 The master table

| Coverage | The structural soft spot | Primary beater | Why it works |
|---|---|---|---|
| **Cover 0** | No deep help at all; DBs on islands; blitzers can't cover a screen | **Quick game + rubs** — slants, shallow crossers, mesh, pick/rub concepts, screens | The QB has no time, so the answer must be fast. Rubs create legal traffic; screens punish the blitz ([Kinetex](https://blog.kinetex.co/what-is-cover-0-why-are-nfl-teams-playing-more-of-it/), [Coach Kou on the Chiefs' Cover 0 answers](https://coachkoufootball.substack.com/p/2023-chiefs-dolphins-having-answers)) |
| **Cover 1** | Man defenders with their backs to the ball, in traffic | **Mesh** (two crossers at 4–6 yds in opposite directions, "slapping hands"); **Hi-Lo crossers**; **NCAA** (post–dig–drive) | Mesh forces man defenders to run through each other — they get picked, hesitate, or divert, and separation is automatic ([Football Film Room](https://footballfilmroom.substack.com/p/mesh), [Bowen route combinations](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |
| **Cover 1** | Rat/hole player sits inside | **Stack / bunch releases + wheel routes** | Bunch forces a man team into zone rules; the wheel out of bunch separates when the LB trails inside traffic ([CoachesInsider](https://coachesinsider.com/football/effective-strategies-for-dealing-with-man-coverage-beaters-stacks-bunches-and-mesh-article/), [Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |
| **Cover 2** | Deep middle between the two safeties | **Four Verticals** — outside 9s widen the safeties, the inside seams split them | Two safeties, three-plus vertical lanes. Bowen lists 4 Verts as *the* Cover 2 stress ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)) |
| **Cover 2** | Corner conflicted between flat and deep sideline | **Smash** (5-yd hitch by #1, corner route by #2) and **Flat-7** — Bowen: "one of the most common Cover 2 beaters" | The corner cannot cover the flat and the hole shot behind him. High-low, deep-to-short read ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations), [FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2)) |
| **Cover 2** | Mike vacates the middle hook (esp. Tampa 2) | **Dagger** (seam by #2 clears, deep dig by #1 at 12–15) and **Sucker** (seam + curl bait + deep dig) | The seam removes the Mike vertically; the dig lands exactly where he used to be ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |
| **2-Man** | No middle-of-field help — the inside seam | **Inside seam from #3 / TE** off 4 Verts | "There is no protection down the middle of the field in 2-Man." LBs run with their backs to the ball ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)) |
| **2-Man** | Trail technique deliberately plays from behind | **Back-shoulder fade**; **mesh/rubs** | The DB is trailing by design and cannot see the ball. Crossing routes kill man coverage ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage), [MUT.gg on Cover 2 Man](https://www.mut.gg/news/ask-huddle-35-how-to-beat-cover-2-man-every-time/)) |
| **Cover 3** | One FS, two seams | **Four Verticals** — the inside seam attacks the free safety directly | The reason Rip/Liz was invented ([Spread Offense](https://spreadoffensefootball.com/how-to-beat-cover-3-defense/), [Tomahawk Nation](https://www.tomahawknation.com/florida-state-football-fsu-noles/2020/5/21/21265925/fsu-nick-saban-rip-liz-pattern-matching-cover-adam-fuller-florida-state-seminoles-football-norvell)) |
| **Cover 3** | The curl-flat defender, conflicted vertically | **Flood / Sail** (9 clears the third, 7/sail at intermediate, arrow/flat underneath) | Three receivers at three levels to one side against four underneath defenders spread across the whole field. Bowen names Sail as the Cover 3 answer ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations), [Spread Offense](https://spreadoffensefootball.com/how-to-beat-cover-3-defense/)) |
| **Cover 3** | Hook defenders at 10–12, nothing behind them until the FS | **Post–Dig–Shallow** / **NCAA** / **Drive** | Layers the middle. The LB is caught between the dig above and the shallow below and has to pick ([Spread Offense](https://spreadoffensefootball.com/how-to-beat-cover-3-defense/), [Weekly Spiral](https://weeklyspiral.com/2021/07/26/cover-3/)) |
| **Cover 4** | Safety's eyes are on #2 | **Pin** (dig underneath + deep post with a "Dino" corner-then-post stem) — Bowen: "the No. 1 Cover 4 Beater" | The dig occupies the safety; the corner is then alone on the post from *outside* leverage, which is the wrong leverage for a post ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |
| **Cover 4** | Corner/safety deep exchange | **Scissors** (post by #1, corner by #2 off a hard inside stem) | Two deep routes crossing forces a communication switch between corner and safety; a missed exchange is a touchdown ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |
| **Cover 4** | Only three underneath defenders | **Flood / three-level sideline**, quick game, bubbles, RPOs, drags | Only two defenders are watching each side of the field underneath ([Win With The Pass](https://winwiththepass.com/cover-4-beaters/), [Football Advantage](https://footballadvantage.com/cover-4-beaters/)) |
| **Cover 4** | Safeties have run responsibility | **Play action deep shot** | Safeties bite on the fake and the deep quarter opens ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)) |
| **Cover 6** | Cover 2 corner on the half-field side | **Smash to the Cover 2 side** | Same high-low as against real Cover 2 ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)) |
| **Cover 6** | The quarters-side flat defender | **Curl-flat / Hank to the quarters side** | The Cover 4 linebacker can't get out to the flat in time ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)) |
| **Any single-high** | One safety, two deep threats | **Yankee** (deep over + deep post/corner off play action); **Smash-Divide**; **Pump-Seam** | Occupy the only deep defender with one route, throw behind him with the other ([Bowen](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations)) |

## 3.2 Xander's example, verified and expanded

> *"If a team is in cover two, the slot receiver might want to run a fade up the middle to split the two safeties."*

**This is correct**, and here's the precise version with the technical vocabulary and the caveats.

**The route is a seam (also called a "divide" or "bender"), not a fade.** A fade is an outside vertical to the sideline. What Xander is describing — the inside receiver running vertically *between* the two safeties — is the seam/divide route. Coaching point: the slot runs to about 10 yards and then **bends toward the middle** against a two-high look ([vIQtory Sports, Complete Guide to Football Routes](https://www.viqtorysports.com/the-complete-guide-to-football-routes-with-diagrams/)).

**Why it works:** Cover 2 has two deep defenders and, functionally, three deep lanes. Bowen's own writeup of Cover 2 lists **Four Verticals** — "two outside 9 routes, two inside seams" — as the concept that stresses both safeties and the Mike ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)). The outside 9s force the safeties to widen to their landmark (the top of the numbers), which is exactly what opens the middle for the seam. [FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2) states the general rule: only two safeties cover three deep zones.

**The three caveats that make this real football instead of a diagram:**

1. **It dies against Tampa 2.** If the Mike drops to the deep middle as a third deep defender, the seam is covered and the safeties are free to widen ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)). Against Tampa 2, throw the **hole shot** or the **dig behind the vacated Mike** instead. This is check #2 on FirstDown's "5 things we look for to defeat Cover 2" list — identify whether it's Tampa 2 *first* ([FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2)).
2. **It dies against a Mike who carries the seam.** Bowen describes the base Cover 2 Mike as opening his hips to the passing strength and **carrying the seam route down the middle** ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)). Against a Mike who is athletic enough to do that, the seam is contested. Against one who isn't, it's a touchdown. **This is a player-scouting question, not a scheme question.**
3. **The outside verticals are not decoration.** If the outside receivers don't threaten the deep sideline, the safeties never widen and the "gap" between them is 12 yards, not 25. Four Verts is a package deal.

**The bonus:** the seam is also the primary weakness of **2-Man**, for a different reason — there's no Mike in the hole at all in 2-Man ([Bowen](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)). So the same route beats two coverages that look identical pre-snap. Xander's read gets more valuable, not less, once you know the difference.

## 3.3 Concept glossary (route composition)

Composition is from [Bowen's NFL 101: Basic Route Combinations](https://bleacherreport.com/articles/2024638-nfl-101-introducing-the-basic-route-combinations) unless noted.

- **Four Verticals** — four vertical routes; outside receivers convert to comebacks outside the numbers vs. a three-deep look. Attacks Cover 2 and Cover 3.
- **Smash** — 5-yard hitch by #1 + corner (7) route by #2. High-lows the corner. Works vs. Cover 2, and also stresses the flat defender in Cover 3 and Cover 4 ([WRWR](https://wrwr.substack.com/p/its-time-to-smash-the-competition)).
- **Flat-7** — hard inside stem by #1 into a 7 cut, flat routes by #2/TE. Read deep-to-short. Bowen: one of the most common Cover 2 beaters.
- **Dagger** — clear-out seam by #2 + deep dig by #1 at 12–15 yards + shallow drive underneath. Vs. Cover 1/2/3.
- **Sucker** — vertical seam (occupies the Mike) + curl/hitch bait + deep dig as the real target. Vs. Cover 2.
- **Pin** — dig underneath + deep post off a "Dino" stem (corner-then-post) + hitch by #1. Bowen: the #1 Cover 4 beater.
- **Scissors** — post by #1, 7/corner by #2 off a hard inside stem, flat by the RB. Vs. Cover 4.
- **Sail / Flood** — 9 clear-out by #1, 7/sail at intermediate, flat/arrow underneath. Three levels to one side. Vs. Cover 3.
- **NCAA** — post by #1 (widened stem) + dig by the TE + drive/shallow backside. Short-intermediate-deep progression. Vs. Cover 1/3.
- **Levels** — 5-yard square-in by #1 from a plus split + intermediate dig + seam + 9/comeback. Two-level read.
- **Mesh** — two shallow crossers at 4–6 yards running opposite directions, slapping hands as they cross; one receiver "sets the mesh." Legal rub. The classic man-coverage beater ([Football Film Room](https://footballfilmroom.substack.com/p/mesh)).
- **Spot / Snag** — curl-7-flat triangle from a bunch. Third-down concept, uses the bunch as a legal pick.
- **Yankee** — play-action, two deep routes: inside stem to a 7 one side, deep over from the other. Kills single-high.
- **Smash-Divide** — smash by #1 from a plus split + 7 by #2 + seam/deep over by #3. The seam occupies the FS so he can't break on the 7.
- **Hank** — curl-flat combination. Attacks the conflicted curl-flat defender in Cover 3 and the quarters-side flat defender in Cover 6.

---

# 4. Reading Coverage as a Receiver — Pre-Snap and Post-Snap

**Confidence: HIGH on the tells (multiple sources agree, and they're the same tells taught at every level). MEDIUM on how reliably these hold at the high school level — see the warning at the end.**

## 4.1 The pre-snap ladder — run it in this order, every snap

Work from the deepest defender to the shallowest ([Cat Scratch Reader](https://www.catscratchreader.com/2012/8/11/3234761/how-to-read-coverages-pre-snap-and-post-snap), [American Football IQ](https://americanfootballiq.com/blogs/news/how-to-read-a-defense-a-step-by-step-guide-for-high-school-qbs)).

**Step 1 — Count the deep safeties. This is 80% of the read.**
- **One high (MOFC — middle of field closed):** Cover 1 or Cover 3. The deep middle is gone; inside vertical routes are contested.
- **Two high (MOFO — middle of field open):** Cover 2, Cover 4, Cover 6, or 2-Man. The deep middle is available; the sidelines have less help than you think.
- **Zero high:** Cover 0. Everything short, right now.
Sources: [The Phinsider](https://www.thephinsider.com/2016/6/27/12039106/football-101-defensive-cover-schemes-aka-how-a-quarterback-reads-a-defense), [Athletes Untapped](https://athletesuntapped.com/blog/deciphering-the-defense-mastering-football-coverage-recognition/).

**Step 2 — Read the safeties' depth and width, not just the count.**
Two-high safeties in a true two-deep alignment sit around **12–15 yards, over the numbers** ([American Football IQ](https://americanfootballiq.com/blogs/news/how-to-read-a-defense-a-step-by-step-guide-for-high-school-qbs)). Refinement:
- **Deeper (15–18) and wider (near the numbers)** → Cover 2 or 2-Man. They're playing deep halves; they're not coming down.
- **Shallower (10–12) and tighter to the hash** → Cover 4/quarters. They're at read depth so they can trigger on #2 and on the run.
- **Same number of safeties, but one is creeping down or leaning** → a rotation is coming. Distrust the picture.

**Step 3 — Read your corner: depth, leverage, eyes, and hips.** This is the read that's actually *yours*.

| What the corner shows | Most likely | Why |
|---|---|---|
| **Press, inside eye/head-up shade** | Man (Cover 1) or **2-Man** | Inside leverage with a safety over the top = they're taking the inside route away and capping the fade ([Bowen 2-Man](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)) |
| **Press, outside leverage, jams then sinks at 45°, eyes come inside to the QB** | **Cover 2** | The Cover 2 corner's job is jam-funnel-sink-flat ([Bowen Cover 2](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2)) |
| **Off 7–8 yards, outside shade, eyes in the backfield** | **Zone** — Cover 3 or Cover 4 | Eyes on the QB instead of on you is the single cleanest zone tell ([Athletes Untapped](https://athletesuntapped.com/blog/deciphering-the-defense-mastering-football-coverage-recognition/)) |
| **Press-bail — shows press, opens and runs to the deep third at the snap** | **Cover 3** | Press-bail is the standard Cover 3 corner technique ([Bowen Cover 3](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3)) |
| **Soft squat — sinking, not widening, eyes locked inside** | **Trap coverage.** Do not run an out route. | The corner is baiting the first outside-breaking route ([Bowen, Trap](https://bleacherreport.com/articles/2486941-nfl-101-introducing-trap-coverage)) |
| **The two corners are playing visibly different techniques** | **Cover 6** or another split-field call | Their jobs genuinely differ, so their body language does too ([Pro Style Spread Offense](https://prostylespreadoffense.com/coverage-recognition-quarter-quarter-half-cover-6/)) |

**The leverage-and-help rule that ties it together:** a corner with **outside leverage** almost always has inside/safety help. A corner with **inside leverage** is either playing man with no help and using the sideline as an extra defender, or is a boundary corner ([All Eyes DB Camp](https://alleyesdbcamp.com/teaching-leverage-and-alignment-across-multiple-coverages-a-blueprint-for-db-coaches/)). **Run away from the help, into the leverage he gave up.**

**Step 4 — Linebacker depth.**
- **~4 yards:** aggressive — blitz or downhill run fit. Find your hot route now.
- **~7 yards:** coverage-first, dropping.
Source: [American Football IQ](https://americanfootballiq.com/blogs/news/how-to-read-a-defense-a-step-by-step-guide-for-high-school-qbs).

**Step 5 — Who's over #2, and how?** A defender walked out over the slot with **outside leverage and eyes inside** is a curl-flat zone player. A defender pressed tight on the slot with **inside leverage and eyes on the slot** is man. A linebacker who walks out over a slot in empty is a man tell ([American Football IQ](https://americanfootballiq.com/blogs/news/how-to-read-a-defense-a-step-by-step-guide-for-high-school-qbs)).

**Step 6 — Use motion as a probe.** Covered in §2.3: travels = man, bumps = zone, nothing = field/boundary.

## 4.2 Post-snap — you have about three steps to confirm

**Safety rotation is the most important post-snap key** ([American Football IQ](https://americanfootballiq.com/blogs/news/how-to-read-a-defense-a-step-by-step-guide-for-high-school-qbs), [Cat Scratch Reader](https://www.catscratchreader.com/2012/8/11/3234761/how-to-read-coverages-pre-snap-and-post-snap)):
- **Backside safety rotates down/across into the middle** → it was disguised **Cover 3** (a Buzz or Sky rotation). Two-high picture, one-high reality.
- **Both safeties hold depth and width** → **Cover 2, Cover 4, or 2-Man**.
- **A safety triggers downhill on your slot's release** → **quarters match** (he's taking #2 vertical) or a **robber**.
- **Single safety stays centered** → Cover 1 or Cover 3.

**Then read your own defender:**
- **He turns and runs with you, eyes on you the whole way** → man, or a match rule that has become man (Cover 4 MEG, Cover 3 match). Beat him — don't look for a hole.
- **He opens at 45° and bails, eyes to the QB** → Cover 3 third.
- **He jams, sinks, then squares to the QB and flattens out** → Cover 2 corner going to the flat. Everything behind him at 12–20 is open.
- **He gets to a landmark and stops, head on a swivel to the QB** → spot-drop zone. **Sit down in the window.**

**The single most useful post-snap distinction:** *are the underneath defenders looking at you, or at the quarterback?* Looking at you = man/match: keep moving, never sit. Looking at the QB = spot-drop zone: find the hole between defenders, **throttle down, and show your numbers** ([FirstDown PlayBook](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2), [Weekly Spiral Cover 2](https://weeklyspiral.com/2021/07/19/cover-2/)).

## 4.3 The receiver's own conversion rules

**The seam-read "poem" — this is the best receiver-level teaching tool found in this research**, and it's explicitly written for high school receivers. At a designated landmark (typically 8–10 yards), on any vertical route where you're not the designated clear-out ([Complete Head Coach](https://www.completeheadcoach.com/keying-defender-seam-read-high-school-wide-receivers/)):

> **"If he is even, I'm leaving."** If you've eaten the cushion and are on the defender's toes, keep running — and throw your flag (raise the inside arm, one wave) to tell the QB the shot is on.
>
> **"If he's dropping, I'm stopping."** If he keeps his cushion and won't let you close, kill your vertical, turn inside, and hitch up with your numbers to the QB. Higher-percentage completion than the deep ball.
>
> **"If he crosses me, I cross him."** If a defender crosses your face to get to his two-deep zone, cross him back — get *inside* him and **between the two safeties**, then get vertical again.

**Note that the third rule is literally Xander's Cover 2 example, expressed as a receiver's in-route decision rather than a play call.** Same idea, but it's a reaction to what the defender does, not a pre-decided route. That's the difference between running a play and playing football.

**Beating leverage with your stem.** The stem — your first ~5 yards — is where you neutralize the defender's leverage before your break ever happens ([X&O Labs, WR Stem Drills to Access Leverage](https://www.xandolabs.com/the-lab/position-groups/wide-receivers/pass-game-mechanics-wide-receivers/wr-stem-drills-to-access-leverage/), [vIQtory Sports, Stem & Stack](https://www.viqtorysports.com/stem-stack-receivers/)). Rules of thumb:
- **DB has inside leverage** (he's between you and the middle): your slant and dig are contested. Attack outside — out, corner, comeback, back-shoulder fade. Or stem hard inside first to move him, then break out.
- **DB has outside leverage** (safety help inside): the slant, dig, and post are live if you can win inside — but understand there's help there. Stem at his outside shoulder to widen him, then break in.
- **DB is even/head-up in press:** you pick. Attack the shoulder he's weakest opening to.

**Against zone:** don't run through windows — settle in them. **Against man:** never stop moving; routes that change direction (mesh, crossers, whip/juke routes) are what shake man defenders ([Win With The Pass](https://winwiththepass.com/how-to-beat-man-coverage/), [CoachesInsider](https://coachesinsider.com/football/effective-strategies-for-dealing-with-man-coverage-beaters-stacks-bunches-and-mesh-article/)).

## 4.4 Honest limitation on all of §4

Every one of these tells can be a lie, and disguise is the fastest-growing part of modern defense — San Francisco disguised on 47% of snaps in 2025 ([Fantasy Points](https://www.fantasypoints.com/nfl/articles/2025/week-10-dfs-coverage-shells)). Cover 3 Buzz deliberately shows a two-deep picture ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3)). Trap coverage deliberately shows Cover 2 ([Bowen](https://bleacherreport.com/articles/2486941-nfl-101-introducing-trap-coverage)).

**Practical implication:** treat the pre-snap read as a *hypothesis with a probability*, not a fact — then spend the first three steps of your route confirming or killing it. At the high school level, disguise is far less common and pre-snap reads are far more reliable — but the way you find out whether *this specific opponent* disguises is film study, which is exactly what the log is for. **Chart it: for each opponent, what percentage of snaps did the post-snap coverage match the pre-snap picture?**

---

# 5. Vocabulary and Notation the Tool Must Get Right

**Confidence: HIGH on personnel notation and coverage-family terms. MEDIUM on route-tree numbering and formation names — both vary by team (see §7).**

## 5.1 Personnel groupings

Two digits. **First = running backs. Second = tight ends. Wide receivers = 5 − (first + second).** There are always 5 skill players besides the QB and the 5 linemen ([Kinetex](https://blog.kinetex.co/deciphering-footballs-personnel-codes-on-offense-and-defense/)).

| Code | RB | TE | WR | Common name |
|---|---|---|---|---|
| 10 | 1 | 0 | 4 | Spread / four-wide |
| **11** | 1 | 1 | 3 | The modern base grouping ("posse") |
| 12 | 1 | 2 | 2 | "Ace" / two-TE |
| 13 | 1 | 3 | 1 | Heavy |
| 20 | 2 | 0 | 3 | — |
| 21 | 2 | 1 | 2 | "Regular" / pro set |
| 22 | 2 | 2 | 1 | "Tank" / heavy |
| 00 | 0 | 0 | 5 | Empty |

Bowen also uses the older coaching names in his articles: **Regular = 21, Ace = 12, Tank = 22, Heavy = 13, Posse = 11** ([Bowen Cover 3](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3), [Bowen 2-Man](https://bleacherreport.com/articles/2154983-nfl-101-breaking-down-the-basics-of-2-man-coverage)). The agent should recognize both notations.

**Defensive packages** ([Kinetex](https://blog.kinetex.co/deciphering-footballs-personnel-codes-on-offense-and-defense/), [Bulldawg Illustrated](https://bulldawgillustrated.com/understanding-the-complexities-of-the-nickel-and-dime-defensive-packages/2025/)):
- **Base** — 4 DBs (a 4-3 or 3-4).
- **Nickel** — **5 DBs** (typically 4 DL, 2 LB, 5 DB).
- **Dime** — **6 DBs**.

## 5.2 Route tree

The standard tree numbers 0–9. **Odd numbers break outside; even numbers break inside; the 9 is the exception (straight vertical)** ([Sports Unlimited](https://www.sportsunlimitedinc.com/blog/the-complete-guide-to-the-football-route-tree/), [GoRout](https://gorout.com/football-route-tree/)).

| # | Route | Break |
|---|---|---|
| 0 | Hitch / stop | back to the QB |
| 1 | Flat / quick out | outside |
| 2 | Slant | inside |
| 3 | Comeback | back outside |
| 4 | Curl | inside/back |
| 5 | Out | outside |
| 6 | In / dig | inside |
| 7 | Corner ("flag") | outside, deep |
| 8 | Post | inside, deep |
| 9 | Go / fade / streak | straight |

**Read this caveat before the tool ever asserts a route number.** The route tree is a framework, not a standard. Teams adjust the numbering, the depths, and the names to fit their scheme — "what one team calls a dig route, another may label differently" ([GoRout](https://gorout.com/football-route-tree/), [Sports Unlimited](https://www.sportsunlimitedinc.com/blog/the-complete-guide-to-the-football-route-tree/)). **The scouting agent should use Xander's team's own terminology once it's known, and should never correct him on a route name based on the generic tree.**

Routes not on the numbered tree that still matter: **seam / divide / bender** (inside vertical), **wheel**, **shallow / drive** (4–6 yd cross), **over** (deep cross), **whip / pivot**, **sluggo** (slant-and-go), **arrow**, **swing**, **bubble**, **stick**, **option/choice route**.

## 5.3 Formation vocabulary

**Distribution first:** describe formations as **2x2** (balanced, "doubles") or **3x1** (trips). That notation is unambiguous; the names are not.

- **Trips** — three receivers to one side; the fourth eligible is alone backside. Purpose is to flood one side and stress zone coverage ([Wikipedia: Trips formation](https://en.wikipedia.org/wiki/Trips_formation), [The Scouting Academy](https://scoutingacademy.com/itp-glossary-trips/)).
- **Bunch** — three or more receivers with *tight* splits, clustered. The difference from trips is purely the width of the splits ([Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/the-complete-guide-to-offensive-football-formations)).
- **Stack** — one receiver aligned directly behind another. Guarantees a free release.
- **Empty** — five eligibles split out, no back in the backfield ([Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/the-complete-guide-to-offensive-football-formations)).
- **Ace / singleback / lone setback** — one RB, ~5 yards behind the QB. Confusingly, "Ace" is *also* used for any balanced 2x2 formation ([Wikipedia: Single set back](https://en.wikipedia.org/wiki/Single_set_back), [Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/the-complete-guide-to-offensive-football-formations)).
- **Trey / Trio / Han** — all 3x1 variants that include a tight end. **Terminology genuinely varies team to team** — "trey" or "trio" can mean one TE + two WRs *or* two TEs + one WR depending on the playbook ([Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/the-complete-guide-to-offensive-football-formations)). **The agent must not assume.** Ask, or describe by distribution.
- **Plus split / reduced split** — a receiver aligned 2–3 yards *outside* the numbers, or tightened toward the formation. Bowen uses these constantly and they change what routes are available and what leverage the DB can play ([Bowen Cover 1](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)).
- **Nub** — a tight end side with no receiver outside him.

## 5.4 Coverage and technique terms

- **MOFO / MOFC** — middle of field open (2 high) / closed (1 high).
- **Match / pattern-match** — zone that converts to man by route distribution.
- **Spot-drop** — true landmark zone.
- **MEG** — "Man Everywhere he Goes," a locked man rule inside a zone structure.
- **MOD** — "Man Only on Deep," the corner/safety plays man only if the receiver goes vertical.
- **Cap** — a deep defender staying on top of a vertical route.
- **Sky / Cloud / Buzz** — who has the flat and who has the deep zone in a rotation: **Sky** = safety down to curl-flat, **Cloud** = corner takes the flat with the safety over the top, **Buzz** = safety drops inside to the hook and a linebacker takes curl-flat ([Bowen Cover 3](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3), [Weekly Spiral](https://weeklyspiral.com/2021/07/26/cover-3/)).
- **Robber / rat / hole player** — an unblocked underneath defender sitting in the middle to take away crossers and digs ([Bowen Cover 1](https://bleacherreport.com/articles/2032934-nfl-101-introducing-the-basics-of-cover-1)).
- **Honey hole / hole shot** — the deep sideline void in a two-high shell, roughly 12–20 yards, behind the corner and away from the safety ([The Scouting Academy](https://scoutingacademy.com/itp-glossary-honey-hole/)).
- **Field / boundary** — wide side / short side, off the hash.
- **Passing strength** — the side with the most eligible receivers; how most defenses set their nickel and their coverage ([Kinetex](https://blog.kinetex.co/passing-strength-and-field-and-boundary-defenses-a-quarterbacks-guide/)).
- **Tite front (4i-0-4i)** — the trending front at the HS level; four defenders fill the inside gaps and spill the ball outside, built to handle RPOs and perimeter passing ([USA Football](https://blogs.usafootball.com/blog/7457/defensive-trends-coverages-fronts-and-pressures)).
- **Simulated pressure / fire zone** — a four-man rush where a LB or DB rushes and a DL drops / a five-man rush with six in zone behind it ([USA Football](https://blogs.usafootball.com/blog/7457/defensive-trends-coverages-fronts-and-pressures)).

---

# 6. Working Rules for the `football-scout` Agent

Not sourced — these are operating instructions derived from the research above.

1. **Never state a coverage from a formation alone.** State the coverage *family* with the evidence: "two-high shell with both corners at 7 off, outside shade — quarters or Cover 2; the safety triggering on #2 at 12 yards says quarters."
2. **Always ask "match or spot-drop?" before naming a soft spot.** Half the classic beaters don't work against match coverage.
3. **Always separate scheme failure from execution failure.** "The seam was open because the coverage was base Cover 2" and "the seam was open because their Mike is slow" produce completely different game plans. At the high school level, the second one is more often the real answer.
4. **Do not correct Xander's terminology to the generic textbook.** Route trees, formation names, and coverage labels vary by team. Learn his team's words and use them; flag a genuine difference only when it would cause a real misunderstanding.
5. **Use the level-correct numbers.** High school hashes are 53'4" apart. Field/boundary asymmetry is bigger than anything in the NFL film he'll watch for reference.
6. **Every tendency claim needs a sample size.** "They played Cover 3 on 4 of 6 first downs" is a real finding. "They're a Cover 3 team" from two clips is not.
7. **The most valuable recurring scouting questions**, in order: (a) formation-strength or field/boundary? (b) do they disguise, and how often does the post-snap picture match the pre-snap? (c) what's their trips check? (d) does the Mike carry the seam / drop to Tampa depth? (e) what do they do when they can't substitute?

---

# 7. Where the sources actually disagree, and what I could not verify

**This section exists so neither Xander nor the agent mistakes a contested point for settled fact.**

### Real disagreements between credible sources

1. **Cover 2's primary weakness: deep middle vs. hole shot.** Bowen and FirstDown PlayBook lead with the vertical seams and the two-safeties-three-lanes problem ([Bowen](https://bleacherreport.com/articles/2039934-nfl-101-introducing-the-basics-of-cover-2), [FirstDown](https://firstdown.playbooktech.com/coaches-community/5-things-we-look-for-to-defeat-cover-2)); The Scouting Academy and the "hole shot" literature lead with the deep sideline void ([Scouting Academy](https://scoutingacademy.com/itp-glossary-honey-hole/)). **Resolution: both are real, and which one is open is determined by whether the Mike carries the seam or drops to Tampa depth.** Determine that first, then pick.
2. **Cover 4's primary weakness: the #3 seam in trips vs. the underneath/flats.** Bowen names the #3 inside vertical in 3x1 ([Bowen](https://bleacherreport.com/articles/2094989-nfl-101-introducing-the-basics-of-cover-4)); Weekly Spiral names the flat defender who can't get out ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/)); Win With The Pass and Football Advantage lead with three-level flood concepts against only two side defenders ([Win With The Pass](https://winwiththepass.com/cover-4-beaters/)). **Resolution: it depends entirely on whether the defense has a trips check installed.** With a check, attack underneath. Without one, the #3 seam is free.
3. **Is Cover 3 a simple/"high school" coverage or an elite one?** Bowen writes that it's "often thought of as a 'high school' defense" ([Bowen](https://bleacherreport.com/articles/2047445-nfl-101-introducing-the-basics-of-cover-3)) — while Saban and Carroll built championship defenses on it ([Joe Daniel Football](https://www.joedanielfootball.com/blog/cover-3-defense)). **Resolution: they're describing different coverages that share a name.** Spot-drop Cover 3 is beatable by four verts; Rip/Liz match Cover 3 is not. Never treat them as the same call.
4. **Which side of the field gets quarters in Cover 6.** Weekly Spiral and Pro Style Spread Offense describe quarters-to-field / Cover-2-to-boundary as standard ([Weekly Spiral](https://weeklyspiral.com/2021/08/16/cover-6/), [Pro Style](https://prostylespreadoffense.com/coverage-recognition-quarter-quarter-half-cover-6/)); X&O Labs describes the reverse as a real change-up ([X&O Labs](https://www.xandolabs.com/the-lab/defense/coverage/two-high-coverage-structures/defending-formations-into-the-boundary-fib-from-two-high-structures/)). **Never assume the sides — read the two corners.**
5. **Route tree numbering is not standardized.** Sources agree on the odd-outside/even-inside logic but explicitly state that teams change the numbers, depths, and names ([GoRout](https://gorout.com/football-route-tree/), [Sports Unlimited](https://www.sportsunlimitedinc.com/blog/the-complete-guide-to-the-football-route-tree/)).
6. **3x1 formation names (trey / trio / han) genuinely conflict between playbooks** ([Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/the-complete-guide-to-offensive-football-formations)).

### What I could NOT verify well enough to trust

- **The full technical mechanics of the quarters trips checks (Solo, Poach, Special, Stubbie, Stress).** The authoritative source is Cody Alexander's MatchQuarters, and **the detailed articles are paywalled** — I have only search-result summaries and article headlines ([What is Stubbie Coverage?](https://www.matchquarters.com/p/what-is-stubbie-coverage-special-mini-lock-x-trips-coverages), [Poach vs. Solo](https://www.matchquarters.com/p/coverage-101-poach-vs-solo-quarters-jets)). §2.3 is directionally right but should not be treated as precise. **Confidence: MEDIUM.**
- **Fangio-family coverage labels ("Cover 8," "Cover 9").** MatchQuarters has articles on both, but I only saw the headlines — enough to know these labels exist and mean specific different things in that system, not enough to define them. **Confidence: LOW — do not define these terms without further research.**
- **Any high-school-specific coverage usage statistics.** No source found with real percentages for HS coverage distribution. The claim that Cover 3 is the most common HS coverage is a well-supported coaching consensus ([Joe Daniel Football](https://www.joedanielfootball.com/blog/cover-3-defense), [Throw Deep Publishing](https://throwdeeppublishing.com/blogs/football-glossary/what-is-cover-3-in-football)) but is **not** backed by a published dataset. Treat as a strong prior, not a number.
- **Exact route depths** for the named concepts. Bowen gives some (dig at 12–15, mesh at 4–6, smash hitch at 5), but depths are playbook-specific everywhere else. **Never assert a depth as universal.**
- **X&O Labs' "Dictating Coverage Based on Offensive Field Position & Personnel"** — this would have been the single best source for §2's decision logic, but the page returned HTTP 403. §2 is instead assembled from several smaller sources, each cited.

### Source quality note

The strongest sources here are **Matt Bowen's Bleacher Report NFL 101 series** (former NFL safety, written from a player's technique perspective, exceptionally specific about depths and leverage), **Weekly Spiral's Football 101 series** (clear, diagram-driven, good on strengths/weaknesses), **MatchQuarters / Cody Alexander** (the deepest quarters resource in existence, mostly paywalled), and **USA Football's coaching blogs** (the only sources here written specifically about the high school level). Sites like Football Advantage, Win With The Pass, and Spread Offense are useful for concept lists but are lower-rigor SEO content — cross-check anything from them before it becomes a game-plan decision.

---

*Sources are linked inline throughout. Research conducted 2026-08-15 via web search and direct page retrieval.*
