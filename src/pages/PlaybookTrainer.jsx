import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import './playbookTrainer.css'
import seed from '../data/playbook-trainer-seed.json'

// Self-contained personal drill tool -- no IPC, no main-process involvement. Everything (deck,
// progress, drawings) lives in localStorage. Visual/UX pattern borrowed from Nexus's
// RoutingTrainer.jsx (header, HUD, PillGroup radiogroup pills, card layout) but the backend is
// intentionally nothing: this isn't graded against an external rubric, it's a personal
// memorization drill.
const STORAGE_KEY = 'playbook-trainer-deck-v1'
const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'formation', label: 'Formations' },
  { value: 'concept', label: 'Pass Concepts' },
  { value: 'fullfield', label: 'Full-Field' },
]
const CATEGORY_SELECT_OPTIONS = [
  { value: 'formation', label: 'Formation' },
  { value: 'concept', label: 'Pass Concept' },
  { value: 'fullfield', label: 'Full-Field' },
]
const SIDE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

function loadDeck() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(raw)) return raw
  } catch { /* corrupt -- fall back to the seed deck */ }
  return structuredClone(seed)
}
function saveDeck(deck) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck))
  } catch {
    // ponytail: quota/storage failure -- surface it immediately instead of swallowing it, so a
    // save that didn't stick (diagrams as data URLs can fill localStorage fast) is never mistaken
    // for one that did. Found by independent review 2026-08-14, never fixed before the crash.
    window.alert('Could not save -- storage is full or unavailable. This change was NOT saved. Delete an old diagram to free space, then try again.')
  }
}
function blankSession() { return { attempts: 0, correct: 0, streak: 0, best: 0 } }

// Leitner-box weighted random pick: lower box (new / recently missed) draws far more often than a
// mastered (box 5) card. Avoids repeating the just-shown card when the pool has more than one.
function weightedPick(pool, excludeId) {
  // Excluding the previous card only kicks in above 2 candidates -- with exactly 2, strict
  // no-repeat and the box weighting are mathematically incompatible, and weighting wins.
  const candidates = pool.length > 2 ? pool.filter((c) => c.id !== excludeId) : pool
  const list = candidates.length ? candidates : pool
  const total = list.reduce((sum, c) => sum + (6 - c.box), 0)
  let roll = Math.random() * total
  for (const c of list) {
    roll -= (6 - c.box)
    if (roll <= 0) return c
  }
  return list[list.length - 1]
}

// Side is folded in here (as an "L"/"R" suffix, same shorthand the seed data already uses) so
// that re-saving a card via CardForm without touching name/variation can't silently drop it.
function buildPrompt(name, variation, side) {
  const suffix = variation || (side === 'left' ? 'L' : side === 'right' ? 'R' : null)
  return suffix ? `${name} — ${suffix}` : name
}
const humanizeSide = (side) => (side === 'left' ? 'Left' : side === 'right' ? 'Right' : null)
function tagsFor(card) { return [humanizeSide(card.side), card.variation].filter(Boolean) }

// Tracks "the current card" for a given filtered pool: picks a fresh weighted card whenever the
// pool's membership (its set of ids, not box values -- grading updates boxes but shouldn't yank
// the revealed card out from under the user) changes, and exposes advance() for the drill flow.
function useDrillCard(pool) {
  const [currentId, setCurrentId] = useState(null)
  const poolRef = useRef(pool)
  useEffect(() => { poolRef.current = pool })
  const advance = useCallback((excludeId) => {
    const p = poolRef.current
    setCurrentId(p.length ? weightedPick(p, excludeId).id : null)
  }, [])
  const poolIds = pool.map((c) => c.id).join(',')
  useEffect(() => {
    if (!pool.length) { setCurrentId(null); return }
    if (!pool.some((c) => c.id === currentId)) advance(currentId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolIds])
  return { current: pool.find((c) => c.id === currentId) || null, advance }
}

// Same accessible radiogroup/radio pill pattern as Nexus's RoutingTrainer.jsx PillGroup.
function PillGroup({ label, options, value, onChange }) {
  return <div className="playbook-trainer__pillgroup">
    {label && <span className="playbook-trainer__pillgroup-label">{label}</span>}
    <div className="playbook-trainer__pills" role="radiogroup" aria-label={label}>
      {options.map((opt) => (
        <button key={String(opt.value)} type="button" role="radio" aria-checked={value === opt.value}
          className={`playbook-trainer__pill${value === opt.value ? ' is-selected' : ''}`}
          onClick={() => onChange(opt.value)}>{opt.label}</button>
      ))}
    </div>
  </div>
}

const CANVAS_W = 480, CANVAS_H = 300, PEN_COLOR = '#c39aff', PEN_WIDTH = 3

// Lightweight static field: a handful of evenly-spaced yard lines and hash-mark ticks under the
// canvas -- doesn't need to be regulation, just enough to feel like a field instead of a void.
function FieldBackground() {
  const lines = Array.from({ length: 9 }, (_, i) => (i + 1) * (CANVAS_W / 10))
  return <svg className="playbook-trainer__field-bg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} aria-hidden="true">
    <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} className="playbook-trainer__field-turf" />
    {lines.map((x) => <line key={`y${x}`} x1={x} y1={0} x2={x} y2={CANVAS_H} className="playbook-trainer__field-yardline" />)}
    {lines.map((x) => <line key={`ht${x}`} x1={x - 7} y1={CANVAS_H * 0.32} x2={x + 7} y2={CANVAS_H * 0.32} className="playbook-trainer__field-hash" />)}
    {lines.map((x) => <line key={`hb${x}`} x1={x - 7} y1={CANVAS_H * 0.68} x2={x + 7} y2={CANVAS_H * 0.68} className="playbook-trainer__field-hash" />)}
  </svg>
}

// Tiny fresh freehand canvas, built from scratch (pointer capture + 2d context lineTo/stroke).
// Stores nothing itself; the parent reads pixels via the ref (toDataURL) on demand. Used both for
// Draw-mode practice and for sketching a card's saved answer diagram in Manage.
const DrawCanvas = forwardRef(function DrawCanvas({ initialSrc }, ref) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    if (!initialSrc) return
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.src = initialSrc
  }, [initialSrc])

  useImperativeHandle(ref, () => ({
    clear: () => canvasRef.current.getContext('2d').clearRect(0, 0, CANVAS_W, CANVAS_H),
    toDataURL: () => canvasRef.current.toDataURL('image/png'),
  }), [])

  const point = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (CANVAS_W / r.width), y: (e.clientY - r.top) * (CANVAS_H / r.height) }
  }
  const start = (e) => {
    if (e.button !== 0) return
    drawing.current = true
    const p = point(e), ctx = canvasRef.current.getContext('2d')
    ctx.beginPath(); ctx.moveTo(p.x, p.y)
    canvasRef.current.setPointerCapture(e.pointerId)
  }
  const draw = (e) => {
    if (!drawing.current) return
    const p = point(e), ctx = canvasRef.current.getContext('2d')
    ctx.strokeStyle = PEN_COLOR; ctx.lineWidth = PEN_WIDTH; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.lineTo(p.x, p.y); ctx.stroke()
  }
  const stop = (e) => {
    drawing.current = false
    if (canvasRef.current.hasPointerCapture?.(e.pointerId)) canvasRef.current.releasePointerCapture(e.pointerId)
  }

  return <div className="playbook-trainer__canvas-wrap">
    <FieldBackground />
    <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="playbook-trainer__canvas"
      onPointerDown={start} onPointerMove={draw} onPointerUp={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()} />
  </div>
})

function Hud({ session, mastered, total }) {
  const accuracy = session.attempts ? Math.round((session.correct / session.attempts) * 100) : null
  return <div className="playbook-trainer__hud">
    <div className="playbook-trainer__hud-stat"><b>{accuracy === null ? '—' : `${accuracy}%`}</b><small>accuracy this session</small></div>
    <div className="playbook-trainer__hud-stat"><b>{session.streak}</b><small>streak</small></div>
    <div className="playbook-trainer__hud-stat"><b>{mastered}/{total}</b><small>mastered</small></div>
  </div>
}

function EmptyState({ children }) {
  return <p className="playbook-trainer__status">{children}</p>
}

function PracticeTab({ deck, category, session, gradeAndAdvance }) {
  const pool = useMemo(() => (category === 'all' ? deck : deck.filter((c) => c.category === category)), [deck, category])
  const drill = useDrillCard(pool)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => { setRevealed(false) }, [drill.current?.id])
  const mastered = pool.filter((c) => c.box === 5).length

  return <>
    <Hud session={session} mastered={mastered} total={pool.length} />
    {!pool.length
      ? <EmptyState>No cards in this category yet — add some in Manage.</EmptyState>
      : drill.current && <div className="playbook-trainer__card">
        <p className="playbook-trainer__card-name">{drill.current.prompt}</p>
        {tagsFor(drill.current).length > 0 && <div className="playbook-trainer__tags">{tagsFor(drill.current).map((t) => <i key={t}>{t}</i>)}</div>}
        {!revealed
          ? <button type="button" className="playbook-trainer__reveal-btn" onClick={() => setRevealed(true)}>Reveal answer</button>
          : <div className="playbook-trainer__reveal">
            <p className="playbook-trainer__answer-text">{drill.current.answerText}</p>
            {drill.current.answerDiagram && <img className="playbook-trainer__answer-diagram" src={drill.current.answerDiagram} alt={`${drill.current.name} diagram`} />}
            <div className="playbook-trainer__grade-row">
              <button type="button" className="playbook-trainer__grade-btn playbook-trainer__grade-btn--miss" onClick={() => gradeAndAdvance(drill, drill.current, false)}>Missed it</button>
              <button type="button" className="playbook-trainer__grade-btn playbook-trainer__grade-btn--got" onClick={() => gradeAndAdvance(drill, drill.current, true)}>Got it</button>
            </div>
          </div>}
      </div>}
  </>
}

function DrawTab({ deck, category, session, gradeAndAdvance }) {
  const pool = useMemo(() => (category === 'all' ? deck : deck.filter((c) => c.category === category)), [deck, category])
  const drawPool = useMemo(() => pool.filter((c) => c.answerDiagram), [pool])
  const missingCount = pool.length - drawPool.length
  const drill = useDrillCard(drawPool)
  const [comparing, setComparing] = useState(false)
  const [drawnSrc, setDrawnSrc] = useState(null)
  const canvasRef = useRef(null)
  useEffect(() => { setComparing(false); setDrawnSrc(null) }, [drill.current?.id])
  const mastered = drawPool.filter((c) => c.box === 5).length

  const compare = () => { setDrawnSrc(canvasRef.current.toDataURL()); setComparing(true) }
  const grade = (gotIt) => { gradeAndAdvance(drill, drill.current, gotIt) }

  return <>
    <Hud session={session} mastered={mastered} total={drawPool.length} />
    {missingCount > 0 && <p className="playbook-trainer__note">{missingCount} card{missingCount === 1 ? '' : 's'} in this category don't have a saved diagram yet — add one in Manage to include them here.</p>}
    {!drawPool.length
      ? <EmptyState>No drawable cards in this category yet — add a diagram to a card in Manage.</EmptyState>
      : drill.current && <div className="playbook-trainer__card" key={drill.current.id}>
        <p className="playbook-trainer__card-name">{drill.current.prompt}</p>
        {tagsFor(drill.current).length > 0 && <div className="playbook-trainer__tags">{tagsFor(drill.current).map((t) => <i key={t}>{t}</i>)}</div>}
        <p className="playbook-trainer__draw-hint">Draw it from memory.</p>
        {!comparing
          ? <>
            <DrawCanvas ref={canvasRef} />
            <div className="playbook-trainer__draw-actions">
              <button type="button" className="playbook-trainer__secondary-btn" onClick={() => canvasRef.current.clear()}>Clear</button>
              <button type="button" className="playbook-trainer__reveal-btn" onClick={compare}>Compare to answer</button>
            </div>
          </>
          : <div className="playbook-trainer__reveal">
            <div className="playbook-trainer__compare-row">
              <div><span className="playbook-trainer__compare-label">Your drawing</span><img className="playbook-trainer__answer-diagram" src={drawnSrc} alt="Your drawing" /></div>
              <div><span className="playbook-trainer__compare-label">Answer</span><img className="playbook-trainer__answer-diagram" src={drill.current.answerDiagram} alt={`${drill.current.name} answer diagram`} /></div>
            </div>
            <p className="playbook-trainer__answer-text">{drill.current.answerText}</p>
            <div className="playbook-trainer__grade-row">
              <button type="button" className="playbook-trainer__grade-btn playbook-trainer__grade-btn--miss" onClick={() => grade(false)}>Missed it</button>
              <button type="button" className="playbook-trainer__grade-btn playbook-trainer__grade-btn--got" onClick={() => grade(true)}>Got it</button>
            </div>
          </div>}
      </div>}
  </>
}

function emptyForm() {
  return { id: null, category: 'formation', name: '', side: '', variation: '', answerText: '', answerDiagram: null }
}

function CardForm({ form, setForm, onSave, onCancel }) {
  const diagramRef = useRef(null)
  const ready = form.name.trim() && form.answerText.trim()
  return <div className="playbook-trainer__form">
    <label className="playbook-trainer__field">
      <span>Category</span>
      <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
        {CATEGORY_SELECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
    <label className="playbook-trainer__field">
      <span>Name</span>
      <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Trips Right" />
    </label>
    <PillGroup label="Side" options={SIDE_OPTIONS} value={form.side} onChange={(v) => setForm((f) => ({ ...f, side: v }))} />
    <label className="playbook-trainer__field">
      <span>Variation (optional)</span>
      <input type="text" value={form.variation} onChange={(e) => setForm((f) => ({ ...f, variation: e.target.value }))} placeholder="e.g. vs 2x2" />
    </label>
    <label className="playbook-trainer__field">
      <span>Answer / rule</span>
      <textarea value={form.answerText} onChange={(e) => setForm((f) => ({ ...f, answerText: e.target.value }))} rows={4} />
    </label>
    <div className="playbook-trainer__field">
      <span>Diagram (optional)</span>
      <DrawCanvas ref={diagramRef} initialSrc={form.answerDiagram} key={form.id || 'new'} />
      <div className="playbook-trainer__draw-actions">
        <button type="button" className="playbook-trainer__secondary-btn" onClick={() => diagramRef.current.clear()}>Clear / redraw</button>
        {form.answerDiagram && <button type="button" className="playbook-trainer__secondary-btn" onClick={() => { diagramRef.current.clear(); setForm((f) => ({ ...f, answerDiagram: null })) }}>Remove saved diagram</button>}
      </div>
    </div>
    <div className="playbook-trainer__form-actions">
      <button type="button" className="playbook-trainer__secondary-btn" onClick={onCancel}>Cancel</button>
      <button type="button" className="playbook-trainer__reveal-btn" disabled={!ready} onClick={() => onSave({ ...form, answerDiagram: diagramRef.current.toDataURL() === blankCanvasDataUrl() ? null : diagramRef.current.toDataURL() })}>Save</button>
    </div>
  </div>
}

let _blankCanvasCache = null
function blankCanvasDataUrl() {
  if (_blankCanvasCache) return _blankCanvasCache
  const c = document.createElement('canvas')
  c.width = CANVAS_W; c.height = CANVAS_H
  _blankCanvasCache = c.toDataURL('image/png')
  return _blankCanvasCache
}

function ManageTab({ deck, category, onAdd, onEdit, onDelete, onResetDeck }) {
  const [form, setForm] = useState(null)
  const grouped = useMemo(() => {
    const list = category === 'all' ? deck : deck.filter((c) => c.category === category)
    if (category !== 'all') return [[category, list]]
    return CATEGORY_SELECT_OPTIONS.map((o) => [o.value, list.filter((c) => c.category === o.value)]).filter(([, cards]) => cards.length)
  }, [deck, category])

  const startAdd = () => setForm(emptyForm())
  const startEdit = (card) => setForm({ id: card.id, category: card.category, name: card.name, side: card.side || '', variation: card.variation || '', answerText: card.answerText, answerDiagram: card.answerDiagram })
  const save = (values) => { (form.id ? onEdit : onAdd)(values); setForm(null) }

  return <div className="playbook-trainer__manage">
    <div className="playbook-trainer__manage-toolbar">
      <button type="button" className="playbook-trainer__reveal-btn" onClick={startAdd}>+ Add card</button>
      <button type="button" className="playbook-trainer__secondary-btn" onClick={onResetDeck}>Reset to example deck</button>
    </div>
    {form && <CardForm form={form} setForm={setForm} onSave={save} onCancel={() => setForm(null)} />}
    {grouped.length === 0 && <EmptyState>No cards in this category yet.</EmptyState>}
    {grouped.map(([cat, cards]) => <div className="playbook-trainer__manage-group" key={cat}>
      <h2>{CATEGORY_SELECT_OPTIONS.find((o) => o.value === cat)?.label}</h2>
      {cards.map((card) => <div className="playbook-trainer__manage-row" key={card.id}>
        <div className="playbook-trainer__manage-row-info">
          <span className="playbook-trainer__manage-row-name">{card.name}</span>
          {tagsFor(card).length > 0 && <span className="playbook-trainer__manage-row-tags">{tagsFor(card).join(' · ')}</span>}
          <span className="playbook-trainer__manage-row-box">Box {card.box}</span>
        </div>
        <div className="playbook-trainer__manage-row-actions">
          <button type="button" className="playbook-trainer__secondary-btn" onClick={() => startEdit(card)}>Edit</button>
          <button type="button" className="playbook-trainer__secondary-btn playbook-trainer__secondary-btn--danger" onClick={() => onDelete(card)}>Delete</button>
        </div>
      </div>)}
    </div>)}
  </div>
}

export default function PlaybookTrainerPage() {
  const [deck, setDeck] = useState(loadDeck)
  const [tab, setTab] = useState('practice')
  const [category, setCategory] = useState('all')
  const [session, setSession] = useState(blankSession)

  const gradeCard = useCallback((cardId, gotIt) => {
    setDeck((prev) => {
      const next = prev.map((c) => c.id !== cardId ? c : {
        ...c, box: gotIt ? Math.min(5, c.box + 1) : 1, attempts: c.attempts + 1, correct: c.correct + (gotIt ? 1 : 0),
      })
      saveDeck(next)
      return next
    })
    setSession((s) => { const streak = gotIt ? s.streak + 1 : 0; return { attempts: s.attempts + 1, correct: s.correct + (gotIt ? 1 : 0), streak, best: Math.max(s.best, streak) } })
  }, [])
  const gradeAndAdvance = useCallback((drill, card, gotIt) => { gradeCard(card.id, gotIt); drill.advance(card.id) }, [gradeCard])

  const addCard = (values) => {
    const name = values.name.trim(), variation = values.variation.trim() || null
    const card = { id: crypto.randomUUID(), category: values.category, name, side: values.side || null, variation, prompt: buildPrompt(name, variation, values.side || null), answerText: values.answerText, answerDiagram: values.answerDiagram, box: 1, attempts: 0, correct: 0 }
    setDeck((prev) => { const next = [...prev, card]; saveDeck(next); return next })
  }
  const editCard = (values) => {
    const name = values.name.trim(), variation = values.variation.trim() || null
    setDeck((prev) => {
      const next = prev.map((c) => c.id !== values.id ? c : { ...c, category: values.category, name, side: values.side || null, variation, prompt: buildPrompt(name, variation, values.side || null), answerText: values.answerText, answerDiagram: values.answerDiagram })
      saveDeck(next)
      return next
    })
  }
  const deleteCard = (card) => {
    if (!window.confirm(`Delete "${card.name}"? This cannot be undone.`)) return
    setDeck((prev) => { const next = prev.filter((c) => c.id !== card.id); saveDeck(next); return next })
  }
  const resetDeck = () => {
    if (!window.confirm('Reset to the example deck? This wipes all your saved cards and progress.')) return
    const fresh = structuredClone(seed)
    saveDeck(fresh)
    setDeck(fresh)
    setSession(blankSession())
  }

  const TABS = [['practice', 'Practice'], ['draw', 'Draw'], ['manage', 'Manage']]

  return <section className="playbook-trainer">
    <header className="playbook-trainer__header">
      <span className="playbook-trainer__eyebrow">PERSONAL / PLAYBOOK TRAINER</span>
      <h1>If you can't draw the play, you don't know it.</h1>
      <p>Drill your formations and pass concepts like flashcards, then draw them from memory.</p>
    </header>

    <div className="playbook-trainer__tabs" role="tablist" aria-label="Playbook Trainer mode">
      {TABS.map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={tab === value}
        className={`playbook-trainer__tab${tab === value ? ' is-selected' : ''}`} onClick={() => setTab(value)}>{label}</button>)}
    </div>

    <PillGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />

    <div role="tabpanel">
      {tab === 'practice' && <PracticeTab deck={deck} category={category} session={session} gradeAndAdvance={gradeAndAdvance} />}
      {tab === 'draw' && <DrawTab deck={deck} category={category} session={session} gradeAndAdvance={gradeAndAdvance} />}
      {tab === 'manage' && <ManageTab deck={deck} category={category} onAdd={addCard} onEdit={editCard} onDelete={deleteCard} onResetDeck={resetDeck} />}
    </div>
  </section>
}
