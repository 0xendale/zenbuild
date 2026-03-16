// lib/breath.js
import { stdout } from 'process'

const RESET = '\x1b[0m'
const GREEN = '\x1b[32m'
const DIM   = '\x1b[2m'
const BOLD  = '\x1b[1m'
const BAR_W = 30

function renderBar(filled) {
  return GREEN + '█'.repeat(filled) + DIM + '░'.repeat(BAR_W - filled) + RESET
}

function animatePhase(label, durationMs) {
  const stepMs = durationMs / BAR_W
  let filled = 0

  return new Promise(resolve => {
    const timer = setInterval(() => {
      filled++
      stdout.write(`\r   ${BOLD}${label.padEnd(12)}${RESET} [${renderBar(filled)}]`)
      if (filled >= BAR_W) {
        clearInterval(timer)
        stdout.write('\n')
        resolve()
      }
    }, stepMs)
  })
}

export async function breathe() {
  console.log(`\n  🫁 ${BOLD}Breathe with me for a moment...${RESET}\n`)
  await animatePhase('Inhale...', 4000)
  await animatePhase('Hold...', 2000)
  await animatePhase('Exhale...', 4000)
  console.log()
}
