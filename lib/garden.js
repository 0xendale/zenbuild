// lib/garden.js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'
const DIM   = '\x1b[2m'

const GARDEN_DIR  = join(homedir(), '.zenbuild')
const GARDEN_FILE = join(GARDEN_DIR, 'garden.json')

export const GRID_W = 44
export const GRID_H = 6
export const MAX_ELEMENTS = 40

const CYCLE  = ['stone', 'sprout', 'grass', 'bamboo', 'tree', 'lotus']
const GLYPHS = {
  stone: '◦', sprout: '🌱', grass: 'ⁿ', bamboo: '┃',
  tree: '🌲', lotus: '✿', koi: '🐟',
}
const NOTICES = {
  stone:  'a stone settles in your garden',
  sprout: 'a sprout takes root in your garden',
  grass:  'grass whispers up through the sand',
  bamboo: 'bamboo rises in your garden',
  tree:   'a tree stands quietly in your garden',
  lotus:  'a lotus blooms in your garden',
  koi:    'a koi arrives — rare and unbothered',
}

// ── pure core ─────────────────────────────────────────────────────────────────

export function nextElementType(count) {
  if ((count + 1) % 10 === 0) return 'koi'
  return CYCLE[count % CYCLE.length]
}

export function parseGarden(raw) {
  try {
    const data = JSON.parse(raw)
    if (!Array.isArray(data.elements)) throw new Error('bad shape')
    return {
      elements:    data.elements,
      totalBuilds: Number(data.totalBuilds) || 0,
      plantedAt:   data.plantedAt || new Date().toISOString(),
    }
  } catch {
    return { elements: [], totalBuilds: 0, plantedAt: new Date().toISOString() }
  }
}

export function placeElement(elements, rng = Math.random) {
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(rng() * GRID_W)
    const y = Math.floor(rng() * GRID_H)
    if (!elements.some(e => e.x === x && e.y === y)) return { x, y }
  }
  return null
}

export function renderGarden(state) {
  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(`${DIM}˜${RESET}`))
  for (const e of state.elements) {
    if (e.y >= 0 && e.y < GRID_H && e.x >= 0 && e.x < GRID_W) {
      grid[e.y][e.x] = GLYPHS[e.type] || '◦'
    }
  }
  return grid.map(row => '  ' + row.join('')).join('\n')
}

export function growthNotice(type, total) {
  return `${GLYPHS[type]} ${NOTICES[type]} (${total} element${total === 1 ? '' : 's'})`
}

// ── IO shell ──────────────────────────────────────────────────────────────────

function loadGarden() {
  try {
    return parseGarden(readFileSync(GARDEN_FILE, 'utf8'))
  } catch {
    return parseGarden('')
  }
}

function saveGarden(state, file = GARDEN_FILE) {
  if (!existsSync(GARDEN_DIR)) mkdirSync(GARDEN_DIR, { recursive: true })
  writeFileSync(file, JSON.stringify(state, null, 2))
}

// Adds one element after a successful build. Archives + resets a full garden.
// Silent null on any failure — the garden never blocks a build.
export function growGarden(rng = Math.random) {
  try {
    const state = loadGarden()
    const type  = nextElementType(state.elements.length)
    const pos   = placeElement(state.elements, rng)
    if (!pos) return null
    state.elements.push({ type, x: pos.x, y: pos.y, addedAt: new Date().toISOString() })
    state.totalBuilds += 1
    const completed = state.elements.length >= MAX_ELEMENTS
    if (completed) {
      let n = 1
      while (existsSync(join(GARDEN_DIR, `garden-${n}.json`))) n++
      saveGarden(state, join(GARDEN_DIR, `garden-${n}.json`))
      saveGarden({ elements: [], totalBuilds: state.totalBuilds, plantedAt: new Date().toISOString() })
    } else {
      saveGarden(state)
    }
    return { type, total: state.elements.length, completed }
  } catch {
    return null
  }
}

export function showGarden() {
  const state = loadGarden()
  console.log(`\n  ${BOLD}your zen garden${RESET}\n`)
  console.log(renderGarden(state))
  console.log(`\n  ${DIM}${state.elements.length} elements · ${state.totalBuilds} mindful builds · planted ${state.plantedAt.slice(0, 10)}${RESET}\n`)
}
