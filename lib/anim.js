// lib/anim.js
import { stdout } from 'process'

const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'
const DIM   = '\x1b[2m'
const GREEN = '\x1b[32m'

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── breathing circle ──────────────────────────────────────────────────────────
// 5 frames, radius 1..5. Fixed 5-line height and constant line width so the
// animation can redraw in place with cursor-up.

const CIRCLE_FRAMES = [
  [
    '                   ',
    '                   ',
    '         ◯         ',
    '                   ',
    '                   ',
  ],
  [
    '                   ',
    '         ·         ',
    '       · ◯ ·       ',
    '         ·         ',
    '                   ',
  ],
  [
    '        · ·        ',
    '      ·     ·      ',
    '     ·   ◯   ·     ',
    '      ·     ·      ',
    '        · ·        ',
  ],
  [
    '       ∙ ∙ ∙       ',
    '     ∙       ∙     ',
    '    ∙    ◯    ∙    ',
    '     ∙       ∙     ',
    '       ∙ ∙ ∙       ',
  ],
  [
    '      ∙  ∙  ∙      ',
    '    ∙         ∙    ',
    '   ∙     ◯     ∙   ',
    '    ∙         ∙    ',
    '      ∙  ∙  ∙      ',
  ],
]

export function circleFrame(radius) {
  const r = Math.min(Math.max(radius, 1), 5)
  return CIRCLE_FRAMES[r - 1].join('\n')
}

// 5 circle lines + blank + label line
const FRAME_H = 7

function drawBreathFrame(radius, label, dim = false) {
  const tint  = dim ? DIM : GREEN
  const block = circleFrame(radius)
    .split('\n')
    .map(l => `   ${tint}${l}${RESET}\x1b[K`)
    .join('\n')
  stdout.write(`\x1b[${FRAME_H}A\r` + block + `\n\n   ${BOLD}${label.padEnd(12)}${RESET}\x1b[K\n`)
}

async function animateBreath() {
  stdout.write('\n'.repeat(FRAME_H))
  for (let r = 1; r <= 5; r++) {        // inhale: 4s
    drawBreathFrame(r, 'Inhale...')
    await sleep(800)
  }
  for (let i = 0; i < 4; i++) {         // hold: 2s, pulse
    drawBreathFrame(5, 'Hold...', i % 2 === 1)
    await sleep(500)
  }
  for (let r = 5; r >= 1; r--) {        // exhale: 4s
    drawBreathFrame(r, 'Exhale...')
    await sleep(800)
  }
}

export async function breathe() {
  console.log(`\n  🫁 ${BOLD}Breathe with me for a moment...${RESET}\n`)
  if (!stdout.isTTY) {
    for (const [label, ms] of [['Inhale...', 4000], ['Hold...', 2000], ['Exhale...', 4000]]) {
      console.log(`   ${label}`)
      await sleep(ms)
    }
    console.log()
    return
  }
  await animateBreath()
  console.log()
}

// ── animated intro ────────────────────────────────────────────────────────────

const TAGLINE = '"slow down to code faster"'

export async function intro(version) {
  console.log()
  if (!stdout.isTTY) {
    console.log(`        ${DIM}( zen )${RESET}`)
    console.log(`     ${DIM}∿∿∿  ◯  ∿∿∿${RESET}`)
    console.log(`   ${BOLD}zenbuild v${version}${RESET}`)
    console.log(`   ${DIM}${TAGLINE}${RESET}`)
    return
  }
  const waveFrames = [
    `     ${DIM}·∿·  ·  ·∿·${RESET}`,
    `     ${DIM}∿∿·  ○  ·∿∿${RESET}`,
    `     ${DIM}∿∿∿  ◯  ∿∿∿${RESET}`,
  ]
  console.log(`        ${DIM}( zen )${RESET}`)
  stdout.write('\n')
  for (const frame of waveFrames) {
    stdout.write(`\x1b[1A\r${frame}\x1b[K\n`)
    await sleep(250)
  }
  console.log(`   ${BOLD}zenbuild v${version}${RESET}`)
  stdout.write(`   ${DIM}`)
  for (const ch of TAGLINE) {           // type out, ~30ms/char
    stdout.write(ch)
    await sleep(25)
  }
  stdout.write(`${RESET}\n`)
}

// ── water ripple (hydration gate opener) ──────────────────────────────────────

export async function ripple() {
  if (!stdout.isTTY) return
  const frames = ['   💧', '    ◦', '  ◦ ◯ ◦', ' ◦  ◯  ◦']
  stdout.write('\n')
  for (const f of frames) {
    stdout.write(`\r\x1b[K  ${DIM}${f}${RESET}`)
    await sleep(200)
  }
  stdout.write('\r\x1b[K')
}
