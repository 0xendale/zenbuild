// lib/gates.js
import { createInterface }                    from 'readline'
import { readFileSync, writeFileSync,
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
  const now    = Date.now()
  const raw    = readHistory()
  const recent = raw.filter(ts => now - new Date(ts).getTime() < TEN_MIN_MS)

  if (recent.length >= MAX_BUILDS) {
    console.log(`\n  ${YELLOW}🔥 Five builds in ten minutes.`)
    console.log(`     You are not a compiler. You are a human being.\n`)
    console.log(`     I'm locking the keyboard for 60 seconds.`)
    console.log(`     Stand up. Wiggle your toes. Look at something 20 feet away.\n${RESET}`)
    await countdown(60)
    writeHistory([]) // clear history after cooldown so the next build can proceed
    process.exit(0)
  }

  recent.push(new Date().toISOString())
  writeHistory(recent)
}

export async function checkHydration() {
  if (Math.random() >= 0.1) return

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
