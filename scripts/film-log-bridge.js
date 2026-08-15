// Local-only bridge: a browser tab can't spawn processes, so this tiny Node server
// runs alongside `npm run dev` and does the one thing the app can't -- call out to
// Nexus's own Codex CLI for the real semantic recurring-issue pass over self-improvement
// film notes. Everything else (tendency counts, play matching) stays pure client-side.
// Start with: node scripts/film-log-bridge.js
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = 5199
const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SESSIONS_DIR = path.join(PROJECT_ROOT, 'film-log', 'sessions')
const CODEX_RUN = 'C:\\Users\\Xander\\OneDrive\\Hermes Agent\\nexus\\scripts\\codex-run.js'

function entryRevisionHash(entries) { return createHash('sha256').update(JSON.stringify(entries.map((e) => [e.id, e.body, e.tags, e.situation]))).digest('hex').slice(0, 16) }

function buildPrompt(session, entries) {
  const notes = entries.map((e, i) => `[entry ${i + 1} id=${e.id}] ${e.body}${e.tags?.length ? ` (tags: ${e.tags.join(', ')})` : ''}`).join('\n')
  return `You are analyzing a football player's self-improvement film notes for recurring technique/execution issues -- NOT opponent scouting. Session context: subject=self, context=${session.context || 'unspecified'}.

These are the logged notes, oldest first:
${notes}

Find recurring issues: the same underlying technique/execution problem (a skill, a phase of play, a symptom) showing up across two or more separate entries -- semantic matching, not just shared keywords. A single one-off mistake mentioned once is NOT a recurring issue; it needs real repetition across entries.

Respond with ONLY a JSON array between the markers below, no other text. Each element:
{"skill": "short skill name e.g. tackling, leverage, footwork", "phaseOfPlay": "e.g. pass rush, run fit, or null", "symptom": "what keeps happening, one sentence", "suspectedCause": "one sentence or null if unclear", "confidence": "low"|"medium"|"high", "entryIds": ["the real entry ids from above that support this pattern"]}
If nothing recurs, respond with an empty array: []

===JSON_START===
[]
===JSON_END===`
}

function runCodex(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CODEX_RUN, '-a', 'on-request', 'exec', '-m', 'gpt-5.6-terra', '-s', 'read-only', prompt], { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    child.stdout.on('data', (chunk) => { out += chunk })
    child.on('error', reject)
    child.on('close', (code) => code === 0 ? resolve(out) : reject(new Error(`codex-run.js exited with code ${code}`)))
  })
}

function parseIssues(output) {
  const match = output.match(/===JSON_START===\s*([\s\S]*?)\s*===JSON_END===/)
  if (!match) throw new Error('Codex response did not contain the expected JSON markers.')
  const parsed = JSON.parse(match[1])
  if (!Array.isArray(parsed)) throw new Error('Codex response JSON was not an array.')
  return parsed
}

async function analyzeSession(sessionId) {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`)
  const session = JSON.parse(await readFile(sessionPath, 'utf8'))
  if (session.subject !== 'self') return { skipped: true, reason: 'Recurring-issue detection only runs on self-improvement sessions.', issues: [] }
  const selfEntries = session.entries || []
  const hash = entryRevisionHash(selfEntries)
  if (session.analysisRun?.entryRevisionHash === hash && session.analysisRun?.status === 'current') return { skipped: true, issues: session.issues || [] }
  if (!selfEntries.length) return { skipped: true, issues: [] }
  const output = await runCodex(buildPrompt(session, selfEntries))
  const found = parseIssues(output)
  const existing = session.issues || []
  const merged = found.map((issue) => {
    const prior = existing.find((old) => old.skill === issue.skill && old.phaseOfPlay === issue.phaseOfPlay)
    return prior ? { ...prior, ...issue, id: prior.id, status: prior.status === 'resolved' ? 'recurred' : prior.status || 'open', updatedAt: new Date().toISOString() } : { ...issue, id: randomUUID(), status: 'open', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  })
  session.issues = merged
  session.analysisRun = { id: randomUUID(), sessionId, triggeredBy: 'manual', entryRevisionHash: hash, status: 'current', ranAt: new Date().toISOString() }
  await writeFile(sessionPath, JSON.stringify(session, null, 2))
  return { skipped: false, issues: merged }
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'POST' || req.url !== '/analyze') { res.writeHead(404); res.end('not found'); return }
  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', async () => {
    try {
      const { sessionId } = JSON.parse(body || '{}')
      if (!sessionId) throw new Error('sessionId is required')
      const result = await analyzeSession(sessionId)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    }
  })
})

server.listen(PORT, '127.0.0.1', () => console.log(`Film Log analysis bridge listening on http://127.0.0.1:${PORT}`))
