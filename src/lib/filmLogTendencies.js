// Shared tendency-computation helpers -- used by FilmLogLibrary.jsx (week-level, multi-session
// tendencies) and FilmLog.jsx (single-session summary, persisted onto the session file for
// football-scout to read). Real sample-size discipline throughout: every finding carries its own
// real N, no "tends to" claim below a 3-rep bar for that specific bucket.
export const DOWN_NAME = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

// Lead with the percentage, keep the real N alongside it -- sample-size discipline stays visible,
// it just isn't the only number shown anymore.
export function pct(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0
}

export function tally(entries, key) {
  const counts = new Map()
  for (const entry of entries) {
    const value = entry.situation?.[key]
    if (!value) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

export function byDownPattern(entries, key) {
  const result = []
  for (let down = 1; down <= 4; down++) {
    const atDown = entries.filter((entry) => entry.situation?.down === down)
    if (atDown.length < 3) continue
    const counts = tally(atDown, key)
    if (counts.length) result.push({ down, total: atDown.length, top: counts[0] })
  }
  return result
}

const DISTANCE_BUCKETS = [
  ['short', (distance) => distance >= 1 && distance <= 3],
  ['medium', (distance) => distance >= 4 && distance <= 7],
  ['long', (distance) => distance >= 8],
]

// Down AND distance combined, e.g. "3rd & long" is its own bucket -- a down-only or distance-only
// tally would hide exactly the cross-referenced pattern Xander asked for (down+distance -> play type).
export function byDownDistancePattern(entries, key = 'playType') {
  const result = []
  for (let down = 1; down <= 4; down++) {
    for (const [distance, inBucket] of DISTANCE_BUCKETS) {
      const bucket = entries.filter((entry) => entry.situation?.down === down && inBucket(entry.situation?.distance))
      if (bucket.length < 3) continue
      const counts = tally(bucket, key)
      if (counts.length) result.push({ down, distance, total: bucket.length, top: counts[0] })
    }
  }
  return result
}

export function byFormationPattern(entries, key = 'playType') {
  const result = []
  for (const [formation] of tally(entries, 'formation')) {
    const atFormation = entries.filter((entry) => entry.situation?.formation === formation)
    if (atFormation.length < 3) continue
    const counts = tally(atFormation, key)
    if (counts.length) result.push({ formation, total: atFormation.length, top: counts[0] })
  }
  return result
}

function computeUnitTendencies(entries) {
  const offense = entries.filter((entry) => entry.unit === 'offense'),
    defense = entries.filter((entry) => entry.unit === 'defense')
  return {
    offenseCount: offense.length,
    defenseCount: defense.length,
    playType: tally(offense, 'playType'),
    formation: tally(offense, 'formation').slice(0, 5),
    personnel: tally(offense, 'personnel').slice(0, 5),
    offenseByDown: byDownPattern(offense, 'playType'),
    offenseByDownDistance: byDownDistancePattern(offense, 'playType'),
    offenseByFormation: byFormationPattern(offense, 'playType'),
    coverage: tally(defense, 'coverage').slice(0, 5),
    front: tally(defense, 'front').slice(0, 5),
    defenseByDown: byDownPattern(defense, 'coverage'),
  }
}

// Week-level, across every opponent session in the group.
export function computeTendencies(sessions) {
  const entries = sessions.filter((session) => session.subject === 'opponent').flatMap((session) => session.entries || [])
  return computeUnitTendencies(entries)
}

// Single-session, saved onto that session's own JSON file (`summary`) -- the only shape football-scout
// actually reads, since it reads session files directly and never sees anything React-only.
export function computeSessionSummary(entries) {
  return { generatedAt: new Date().toISOString(), ...computeUnitTendencies(entries) }
}
