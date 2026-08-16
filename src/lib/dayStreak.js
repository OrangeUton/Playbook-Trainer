const KEY = 'playbook-trainer-day-streak-v1'
function today() { return new Date().toISOString().slice(0, 10) }
function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10) }
export function loadDayStreak() { try { return JSON.parse(localStorage.getItem(KEY)) || { lastActiveDate: null, current: 0, best: 0 } } catch { return { lastActiveDate: null, current: 0, best: 0 } } }
export function recordActivity() {
  const value = loadDayStreak(), t = today()
  if (value.lastActiveDate === t) return value
  const current = value.lastActiveDate === yesterday() ? value.current + 1 : 1
  const next = { lastActiveDate: t, current, best: Math.max(value.best, current) }
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
