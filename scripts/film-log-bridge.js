// Local-only bridge: a browser tab can't spawn processes, so this tiny Node server
// runs alongside `npm run dev` and does the one thing the app can't -- call out to
// Nexus's own Codex CLI for the real semantic recurring-issue pass over self-improvement
// film notes. Everything else (tendency counts, play matching) stays pure client-side.
// Start with: node scripts/film-log-bridge.js
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = 5199
const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SESSIONS_DIR = path.join(PROJECT_ROOT, 'film-log', 'sessions')
const CODEX_RUN = 'C:\\Users\\Xander\\OneDrive\\Hermes Agent\\nexus\\scripts\\codex-run.js'
const NEXUS_DIR = 'C:\\Users\\Xander\\OneDrive\\Hermes Agent\\nexus'
// Real bug, found live: a spawned `claude` process inherits whatever CLAUDE_CONFIG_DIR is set in
// the shell that started this bridge -- fine from a plain terminal, but silently hangs/collides if
// the bridge itself was started from inside an already-account-scoped session (exactly what
// happened here). Pin it explicitly to the same dedicated base account telegram-bridge.js already
// uses for this same reason, so this bridge's identity never depends on how it was launched.
const AGENT_CLAUDE_CONFIG_DIR = path.join(process.env.USERPROFILE || '', '.claude')
// Real bug, found live: without an explicit broad permission grant, a headless -p session default-
// denies file access outside its own trusted root -- football-scout got real "permission denied"
// reading this project's own Film Log/research files, not "file not found". Mirrors the exact fix
// telegram-bridge.js already uses for the same cross-project reason.
const AGENT_SETTINGS_PATH = 'C:\\Users\\Xander\\OneDrive\\Hermes Agent\\nexus\\scripts\\football-agent-settings.json'
const AGENT_SESSIONS_FILE = path.join(PROJECT_ROOT, 'scripts', '.agent-chat-sessions.json')
const VALID_AGENTS = ['football-scout', 'self-improvement-coach', 'game-plan-coordinator']
// Real fix, found live 2026-08-15/16: the earlier inline --agents-JSON fast path ran the agent as a
// nested Task dispatch inside a throwaway top-level session -- that dropped the real .md file's
// `memory: project` frontmatter entirely, and separately, nested dispatches under --permission-mode
// dontAsk deny Write by default even when the top-level session has it allow-listed (confirmed live:
// football-scout's own memory-write attempts were silently blocked). The actual fix is structural,
// not another workaround: mirror each agent's real .md file into this project's own .claude/agents/
// (kept in sync from the real nexus source below) and run the CLI's own --agent flag directly, no
// nested dispatch at all. Confirmed live: this is both faster (7-9s, no orchestrator hop) AND gives
// real native memory read+write for free -- a fresh session with a new session-id correctly recalled
// what an earlier, separate session wrote. Memory now lives in this project's own
// .claude/agent-memory/<agent>/, which is arguably more correct anyway: it's Football-specific data.
const LOCAL_AGENTS_DIR = path.join(PROJECT_ROOT, '.claude', 'agents')
async function syncAgentFile(agentName) {
  await mkdir(LOCAL_AGENTS_DIR, { recursive: true })
  await copyFile(path.join(NEXUS_DIR, '.claude', 'agents', `${agentName}.md`), path.join(LOCAL_AGENTS_DIR, `${agentName}.md`))
}

function entryRevisionHash(entries) { return createHash('sha256').update(JSON.stringify(entries.map((e) => [e.id, e.body, e.tags, e.situation]))).digest('hex').slice(0, 16) }

const VOCAB_PRIMER = `Football vocabulary primer:
#1/#2/#3 = receivers counted from the sideline inward, #1 is always outside-most. 2x2/3x1 = receiver distribution ("doubles"/"trips"). MOFO/MOFC = middle of field open/closed (two-high vs one-high safety). Field/boundary = wide side/short side of the field from the ball's hash. Personnel: first digit = RBs, second = TEs (11 personnel = 1 RB 1 TE 3 WR). Common formation names: Ace, Trips, Bunch, Dubs, Tight, Wing, Pro, King, Empty, Queen, Georgia, Stack. Common coverages: Cover 0/1/2/3/4/6, 2-Man, quarters, man, zone. Common routes: fade, hitch, slant, dig, out, comeback, seam, post, corner, curl, flat, wheel, mesh.`

function situationPrompt(text) {
  return `${VOCAB_PRIMER}

Extract structured situation data from this single football film note. The note may be casual, dictated speech -- interpret real football terminology, don't just keyword-match.

Note: "${text}"

Respond with ONLY a JSON object between the markers below, no other text. Use null for anything not mentioned or not confidently inferable -- do not guess. Fields:
{"down": 1-4 or null, "distance": number of yards or null, "quarter": 1-4 or null, "personnel": e.g. "11" or null, "coverage": e.g. "Cover 2" or null, "fieldOrBoundary": "field"|"boundary"|null, "formation": the formation name mentioned or null, "front": defensive front if mentioned or null, "result": brief outcome e.g. "incomplete", "15 yard gain" or null, "playType": "run"|"pass"|null, "hash": "left"|"middle"|"right"|null, "qbDetail": e.g. "rolled right, threw to flat" or "play action, deep left" or null}

===JSON_START===
{"down": null, "distance": null, "quarter": null, "personnel": null, "coverage": null, "fieldOrBoundary": null, "formation": null, "front": null, "result": null, "playType": null, "hash": null, "qbDetail": null}
===JSON_END===`
}

function parseSituation(output) {
  const match = output.match(/===JSON_START===\s*([\s\S]*?)\s*===JSON_END===/)
  if (!match) throw new Error('Codex response did not contain the expected JSON markers.')
  return JSON.parse(match[1])
}

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

function runCodex(prompt, model = 'gpt-5.6-terra') {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CODEX_RUN, '-a', 'on-request', 'exec', '-m', model, '-s', 'read-only', prompt], { stdio: ['ignore', 'pipe', 'pipe'] })
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

async function analyzeSession(sessionId, triggeredBy = 'manual') {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`)
  const session = JSON.parse(await readFile(sessionPath, 'utf8'))
  if (session.subject !== 'self') return { skipped: true, reason: 'Recurring-issue detection only runs on self-improvement sessions.', issues: [] }
  const selfEntries = session.entries || []
  const hash = entryRevisionHash(selfEntries)
  if (session.analysisRun?.entryRevisionHash === hash && session.analysisRun?.status === 'current') {
    if (triggeredBy === 'done' && !session.doneAt) { session.doneAt = new Date().toISOString(); await writeFile(sessionPath, JSON.stringify(session, null, 2)) }
    return { skipped: true, issues: session.issues || [], doneAt: session.doneAt || null }
  }
  if (!selfEntries.length) return { skipped: true, issues: [], doneAt: session.doneAt || null }
  const output = await runCodex(buildPrompt(session, selfEntries))
  const found = parseIssues(output)
  const existing = session.issues || []
  const merged = found.map((issue) => {
    const prior = existing.find((old) => old.skill === issue.skill && old.phaseOfPlay === issue.phaseOfPlay)
    return prior ? { ...prior, ...issue, id: prior.id, status: prior.status === 'resolved' ? 'recurred' : prior.status || 'open', updatedAt: new Date().toISOString() } : { ...issue, id: randomUUID(), status: 'open', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  })
  session.issues = merged
  session.analysisRun = { id: randomUUID(), sessionId, triggeredBy, entryRevisionHash: hash, status: 'current', ranAt: new Date().toISOString() }
  if (triggeredBy === 'done') session.doneAt = new Date().toISOString()
  await writeFile(sessionPath, JSON.stringify(session, null, 2))
  return { skipped: false, issues: merged, doneAt: session.doneAt || null }
}

async function loadAgentSessions() { try { return JSON.parse(await readFile(AGENT_SESSIONS_FILE, 'utf8')) } catch { return {} } }
async function saveAgentSessions(sessions) { await writeFile(AGENT_SESSIONS_FILE, JSON.stringify(sessions, null, 2)) }

// A real, ongoing conversation with a named Claude subagent -- not a one-shot Codex call. Xander's
// own ask: talk to Nick and the other agents from inside the app, no terminal required. Mirrors the
// exact `claude -p --session-id`/`--resume` pattern already proven by this project's own
// telegram-bridge.js, just spawning `claude` instead of Codex, running as the agent directly via
// --agent (see the syncAgentFile comment above for why) instead of nexus's own heavier project dir.
function runClaude(prompt, sessionId, isNew, agentName) {
  return new Promise((resolve, reject) => {
    const continuityArgs = isNew ? ['--session-id', sessionId] : ['--resume', sessionId]
    const args = ['-p', prompt, '--agent', agentName, '--permission-mode', 'dontAsk', '--settings', AGENT_SETTINGS_PATH, ...continuityArgs]
    const child = spawn('claude', args, { cwd: PROJECT_ROOT, shell: false, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CLAUDE_CONFIG_DIR: AGENT_CLAUDE_CONFIG_DIR } })
    let output = '', settled = false
    const timer = setTimeout(() => { if (settled) return; settled = true; child.kill(); reject(new Error('Agent did not respond within 10 minutes.')) }, 600000)
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    child.on('error', (error) => { if (settled) return; settled = true; clearTimeout(timer); reject(error) })
    child.on('close', (code) => { if (settled) return; settled = true; clearTimeout(timer); code === 0 ? resolve(output.trim()) : reject(new Error(`claude exited with code ${code}: ${output.slice(-500)}`)) })
  })
}

async function askAgent(agentName, message) {
  if (!VALID_AGENTS.includes(agentName)) throw new Error(`Unknown agent: ${agentName}`)
  await syncAgentFile(agentName)
  const sessions = await loadAgentSessions()
  const isNew = !sessions[agentName]
  const sessionId = sessions[agentName] || randomUUID()
  const prompt = `This is a real-time chat reply from the Football app's chat panel, not a formal deliverable -- reply directly and concisely, no Recap/Body/Routing/Flags/Next structure, no headers, just answer the way a coach would text back.

Message: ${message}`
  const reply = await runClaude(prompt, sessionId, isNew, agentName)
  if (isNew) { sessions[agentName] = sessionId; await saveAgentSessions(sessions) }
  return reply
}

async function listAllSessions() {
  const { readdir } = await import('node:fs/promises')
  const names = await readdir(SESSIONS_DIR).catch(() => [])
  const sessions = []
  for (const name of names) { if (!name.endsWith('.json')) continue; try { sessions.push(JSON.parse(await readFile(path.join(SESSIONS_DIR, name), 'utf8'))) } catch { /* skip unreadable session files */ } }
  return sessions
}

function searchPrompt(query, sessions) {
  const corpus = sessions.flatMap((session) => (session.entries || []).map((entry) => `[entry id=${entry.id} session=${session.id} week=${session.week || 'unlabeled'} subject=${session.subject}${session.subject === 'opponent' ? ` opponent=${session.opponentName || 'unknown'} unit=${entry.unit || 'unknown'}` : ` context=${session.context || 'unknown'}`}] ${entry.body}`)).join('\n')
  return `${VOCAB_PRIMER}

You are searching a football player's full film-log history across every week of the season for notes relevant to this query: "${query}"

All logged notes, across all sessions:
${corpus || '(no notes logged yet)'}

Find the notes that are genuinely relevant to the query -- similar offensive/defensive tendencies, similar formations or concepts, similar technique issues, not just shared keywords. Rank by relevance.

Respond with ONLY a JSON array between the markers, no other text. Each element: {"entryId": "...", "sessionId": "...", "reason": "one sentence on why this is relevant"}. Return at most 8 results. If nothing is genuinely relevant, return [].

===JSON_START===
[]
===JSON_END===`
}

function parseSearchResults(output) {
  const match = output.match(/===JSON_START===\s*([\s\S]*?)\s*===JSON_END===/)
  if (!match) throw new Error('Codex response did not contain the expected JSON markers.')
  const parsed = JSON.parse(match[1])
  if (!Array.isArray(parsed)) throw new Error('Codex response JSON was not an array.')
  return parsed
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'POST' || !['/analyze', '/extract-situation', '/search-notes', '/ask-agent'].includes(req.url)) { res.writeHead(404); res.end('not found'); return }
  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', async () => {
    try {
      if (req.url === '/ask-agent') {
        const { agent, message } = JSON.parse(body || '{}')
        if (!agent || !message || !message.trim()) throw new Error('agent and message are required')
        const reply = await askAgent(agent, message.trim())
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ reply }))
        return
      }
      if (req.url === '/search-notes') {
        const { query } = JSON.parse(body || '{}')
        if (!query || !query.trim()) throw new Error('query is required')
        const sessions = await listAllSessions(), output = await runCodex(searchPrompt(query, sessions))
        const ranked = parseSearchResults(output).map((hit) => { const session = sessions.find((s) => s.id === hit.sessionId), entry = session?.entries?.find((e) => e.id === hit.entryId); return entry ? { ...hit, entry, session: { id: session.id, week: session.week, subject: session.subject, opponentName: session.opponentName, context: session.context, filmDate: session.filmDate } } : null }).filter(Boolean)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ results: ranked }))
        return
      }
      if (req.url === '/extract-situation') {
        const { text } = JSON.parse(body || '{}')
        if (!text || !text.trim()) throw new Error('text is required')
        const output = await runCodex(situationPrompt(text), 'gpt-5.6-luna')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ situation: parseSituation(output) }))
        return
      }
      const { sessionId, triggeredBy } = JSON.parse(body || '{}')
      if (!sessionId) throw new Error('sessionId is required')
      const result = await analyzeSession(sessionId, triggeredBy === 'done' || triggeredBy === 'periodic' ? triggeredBy : 'manual')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } catch (error) {
      if (res.headersSent || res.writableEnded) return
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    }
  })
})

// A single bad or aborted request must never take the whole bridge down --
// Xander relies on this running unattended in the background while using the app.
process.on('uncaughtException', (error) => console.error('film-log-bridge: recovered from an unhandled error:', error.message))

server.listen(PORT, '127.0.0.1', () => console.log(`Film Log analysis bridge listening on http://127.0.0.1:${PORT}`))
