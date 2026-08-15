// One command starts both the Vite dev server and the film-log analysis bridge,
// so `npm run dev` alone is enough -- no second terminal needed for real use.
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const isWin = process.platform === 'win32'

const vite = isWin ? spawn('npx vite', { cwd: ROOT, stdio: 'inherit', shell: true }) : spawn('npx', ['vite'], { cwd: ROOT, stdio: 'inherit' })
const bridge = spawn('node', [path.join(ROOT, 'scripts', 'film-log-bridge.js')], { cwd: ROOT, stdio: 'inherit' })

function shutdown() { vite.kill(); bridge.kill(); process.exit(0) }
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
vite.on('exit', (code) => { bridge.kill(); process.exit(code ?? 0) })
bridge.on('exit', (code) => { if (code && code !== 0) console.error(`film-log-bridge exited with code ${code}`) })
