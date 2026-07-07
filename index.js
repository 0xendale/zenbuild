#!/usr/bin/env node
import { spawn }                                                  from 'child_process'
import { checkNight, checkBurnout, pickGate, getHistory,
         hydrationGate, stretchGate, eyeRestGate, gratitudeGate,
         maybePosture, readGratitude }                            from './lib/gates.js'
import { breathe, intro, ripple }                                 from './lib/anim.js'
import { fetchQuote }                                             from './lib/quotes-api.js'
import { growGarden, showGarden, growthNotice }                   from './lib/garden.js'

const VERSION = '0.2.0'
const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'
const DIM   = '\x1b[2m'
const GREEN = '\x1b[32m'
const SEP   = `  ${DIM}${'─'.repeat(44)}${RESET}`

const arg = process.argv[2]

if (arg === '--garden') {
  showGarden()
  process.exit(0)
}

if (arg === '--gratitude') {
  const entries = readGratitude()
  if (entries.length === 0) {
    console.log(`\n  ${DIM}no gratitude noted yet. it will come.${RESET}\n`)
  } else {
    console.log(`\n  ${BOLD}things that worked${RESET}\n`)
    for (const line of entries) {
      const [date, ...rest] = line.split(' — ')
      console.log(`  ${DIM}${date.slice(0, 10)}${RESET}  ${rest.join(' — ')}`)
    }
    console.log()
  }
  process.exit(0)
}

if (!arg) {
  console.log(`\n  ${BOLD}Usage:${RESET}   zenbuild ${DIM}"<your build command>"${RESET}`)
  console.log(`  ${DIM}Example: zenbuild "npm run build"${RESET}`)
  console.log(`  ${DIM}Also:    zenbuild --garden · zenbuild --gratitude${RESET}\n`)
  process.exit(1)
}

await intro(VERSION)
console.log(SEP)
checkNight()
console.log(SEP)
await checkBurnout()
maybePosture()
console.log(SEP)

const quotePromise = fetchQuote() // resolves during the breathing ritual
await breathe()
console.log(SEP)

const gate = process.stdout.isTTY ? pickGate(getHistory()) : null
if (gate === 'eye-rest')       await eyeRestGate()
else if (gate === 'hydration') {
  await ripple()
  await hydrationGate()
}
else if (gate === 'stretch')   await stretchGate()
else if (gate === 'gratitude') await gratitudeGate()
if (gate) console.log(SEP)

const quote = await quotePromise
console.log(`\n  ${BOLD}✦ "${quote.text}"${RESET}`)
if (quote.author) console.log(`    ${DIM}— ${quote.author}${RESET}`)
console.log()
await new Promise(r => setTimeout(r, 1500))
console.log(SEP)
console.log(`\n  ${GREEN}▶  Okay okay, building now...${RESET}\n`)

const child = spawn(arg, { shell: true, stdio: 'inherit' })

child.on('close', code => {
  const exitCode = code ?? 0
  if (exitCode === 0) {
    const growth = growGarden()
    if (growth) {
      console.log(`\n  ${GREEN}${growthNotice(growth.type, growth.total)}${RESET}`)
      if (growth.completed) {
        console.log(`  ${DIM}your garden is complete. it was never about the garden.${RESET}\n`)
      } else {
        console.log(`  ${DIM}zenbuild --garden to visit${RESET}\n`)
      }
    }
  } else {
    console.log(`\n  ${DIM}breathe. read the error. it's telling you something.${RESET}\n`)
  }
  process.exit(exitCode)
})

child.on('error', err => {
  console.error(`\n  ${BOLD}zenbuild:${RESET} could not run command — ${err.message}\n`)
  process.exit(1)
})
