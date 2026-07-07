// lib/gates.js
import { createInterface }                    from 'readline'
import { readFileSync, writeFileSync, appendFileSync,
         mkdirSync, existsSync }               from 'fs'
import { homedir }                             from 'os'
import { join }                                from 'path'

const RESET  = '\x1b[0m'
const YELLOW = '\x1b[33m'
const GREEN  = '\x1b[32m'
const BOLD   = '\x1b[1m'
const DIM    = '\x1b[2m'

const HISTORY_DIR  = join(homedir(), '.zenbuild')
const HISTORY_FILE = join(HISTORY_DIR, 'history.json')
const TEN_MIN_MS   = 10 * 60 * 1000
const MAX_BUILDS   = 5
const ONE_HOUR_MS    = 60 * 60 * 1000
const GRATITUDE_FILE = join(HISTORY_DIR, 'gratitude.log')

// ── internal helpers ──────────────────────────────────────────────────────────

function readHistory() {
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, 'utf8'))
  } catch {
    return []
  }
}

function writeHistory(timestamps) {
  if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true })
  writeFileSync(HISTORY_FILE, JSON.stringify(timestamps, null, 2))
}

function countdown(seconds) {
  const BAR_W = 22
  return new Promise(resolve => {
    let remaining = seconds
    const tick = setInterval(() => {
      const elapsed = seconds - remaining + 1
      const filled  = Math.round(BAR_W * elapsed / seconds)
      const bar     = GREEN + '█'.repeat(filled) + DIM + '░'.repeat(BAR_W - filled) + RESET
      remaining--
      process.stdout.write(`\r  ${DIM}[ ${bar}  ${YELLOW}${remaining}s left...${DIM} ]${RESET}  `)
      if (remaining <= 0) {
        clearInterval(tick)
        process.stdout.write('\n\n')
        resolve()
      }
    }, 1000)
  })
}

// ── exports ───────────────────────────────────────────────────────────────────

export function checkNight() {
  const hour = new Date().getHours()
  if (hour >= 23 || hour < 5) {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    console.log(`\n  ${YELLOW}🌙 It's ${time}. The code will still be broken tomorrow.`)
    console.log(`     Go sleep. Seriously.${RESET}\n`)
  }
}

export async function checkBurnout() {
  const now      = Date.now()
  const raw      = readHistory()
  const pastHour = raw.filter(ts => now - new Date(ts).getTime() < ONE_HOUR_MS)
  const recent   = pastHour.filter(ts => now - new Date(ts).getTime() < TEN_MIN_MS)

  if (recent.length >= MAX_BUILDS) {
    console.log(`\n  ${YELLOW}🔥 Five builds in ten minutes.`)
    console.log(`     You are not a compiler. You are a human being.\n`)
    console.log(`     I'm locking the keyboard for 60 seconds.`)
    console.log(`     Stand up. Wiggle your toes. Look at something 20 feet away.\n${RESET}`)
    await countdown(60)
    writeHistory([]) // clear history after cooldown so the next build can proceed
    process.exit(0)
  }

  pastHour.push(new Date().toISOString())
  writeHistory(pastHour)
}

export function getHistory() {
  return readHistory()
}

// One roll per run. Eye-rest is not random: it fires on every 3rd build in
// the rolling hour (3rd, 6th, 9th ...) and replaces the roll entirely.
export function pickGate(history, rng = Math.random, now = Date.now()) {
  const pastHour = history.filter(ts => now - new Date(ts).getTime() < ONE_HOUR_MS)
  if (pastHour.length >= 3 && pastHour.length % 3 === 0) return 'eye-rest'
  const roll = rng()
  if (roll < 0.10) return 'hydration'
  if (roll < 0.20) return 'stretch'
  if (roll < 0.25) return 'gratitude'
  return null
}

// Hydration prompt without the probability roll — pickGate owns probability.
export async function hydrationGate() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    const ask = () => {
      rl.question(
        `\n  ${GREEN}💧 hey. when did you last drink water?\n     (don't lie to me) ${BOLD}[y/n]:${RESET} `,
        (answer) => {
          const a = answer.trim().toLowerCase()
          if (a === 'y') {
            rl.close()
            resolve()
          } else if (a === 'n') {
            console.log(`\n  ${YELLOW}😮‍💨 Okay. Go drink some water first.`)
            console.log(`     I'll be here. The build will be here.`)
            console.log(`     We're not going anywhere.\n`)
            console.log(`     (exiting)${RESET}\n`)
            rl.close()
            process.exit(0)
          } else {
            ask()
          }
        }
      )
    }
    ask()
  })
}

const STRETCHES = [
  'roll your neck slowly, side to side',
  'shrug your shoulders up... and let them drop',
  'circle your wrists — builders need their wrists',
  'stand up and reach for the ceiling',
]

export async function stretchGate(rng = Math.random) {
  const s = STRETCHES[Math.floor(rng() * STRETCHES.length)]
  console.log(`\n  ${GREEN}🧘 quick stretch: ${s}${RESET}\n`)
  await countdown(15)
}

export async function eyeRestGate() {
  console.log(`\n  ${GREEN}👀 you've been at this a while.`)
  console.log(`     look at something 20 feet away. just 20 seconds.${RESET}\n`)
  await countdown(20)
}

export function formatGratitudeEntry(text, date = new Date()) {
  return `${date.toISOString()} — ${text}\n`
}

function appendGratitude(text) {
  try {
    if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true })
    appendFileSync(GRATITUDE_FILE, formatGratitudeEntry(text))
  } catch {} // gratitude never blocks a build
}

export async function gratitudeGate() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(`\n  ${GREEN}🙏 name one thing that worked today: ${RESET}`, (answer) => {
      rl.close()
      const text = answer.trim()
      if (text) {
        appendGratitude(text)
        console.log(`\n  ${DIM}noted. carry it with you.${RESET}`)
      }
      resolve()
    })
  })
}

export function readGratitude() {
  try {
    return readFileSync(GRATITUDE_FILE, 'utf8').trim().split('\n').filter(Boolean).reverse()
  } catch {
    return []
  }
}

const POSTURE_LINES = [
  '🧘 unclench your jaw. drop your shoulders. sit tall.',
  '🧘 feet flat. spine long. screen at eye level.',
  '🧘 relax your grip on the mouse. it already surrendered.',
]

// Non-blocking flavor, not a gate: ~15% chance, one dim line, no pause.
export function maybePosture(rng = Math.random) {
  if (rng() < 0.15) {
    const line = POSTURE_LINES[Math.floor(rng() * POSTURE_LINES.length)]
    console.log(`\n  ${DIM}${line}${RESET}`)
  }
}
