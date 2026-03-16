#!/usr/bin/env node
import { spawn }          from 'child_process'
import { checkNight,
         checkBurnout,
         checkHydration } from './lib/gates.js'
import { breathe }        from './lib/breath.js'
import { randomQuote }    from './lib/snippets.js'

const RESET = '\x1b[0m'
const BOLD  = '\x1b[1m'
const DIM   = '\x1b[2m'
const GREEN = '\x1b[32m'
const SEP   = `  ${DIM}${'─'.repeat(44)}${RESET}`

function header() {
  console.log()
  console.log(`        ${DIM}( zen )${RESET}`)
  console.log(`     ${DIM}∿∿∿  ◯  ∿∿∿${RESET}`)
  console.log(`   ${BOLD}zenbuild v0.1.0${RESET}`)
  console.log(`   ${DIM}"slow down to code faster"${RESET}`)
  console.log(SEP)
}

const cmd = process.argv[2]

if (!cmd) {
  console.log(`\n  ${BOLD}Usage:${RESET}   zenbuild ${DIM}"<your build command>"${RESET}`)
  console.log(`  ${DIM}Example: zenbuild "npm run build"${RESET}\n`)
  process.exit(1)
}

header()
checkNight()
console.log(SEP)
await checkBurnout()
console.log(SEP)
await breathe()
console.log(SEP)
await checkHydration()
console.log(SEP)
console.log(`\n  ${BOLD}✦ "${randomQuote()}"${RESET}\n`)
await new Promise(r => setTimeout(r, 1500))
console.log(SEP)
console.log(`\n  ${GREEN}▶  Okay okay, building now...${RESET}\n`)

const child = spawn(cmd, { shell: true, stdio: 'inherit' })

child.on('close', code => process.exit(code ?? 0))
child.on('error', err  => {
  console.error(`\n  ${BOLD}zenbuild:${RESET} could not run command — ${err.message}\n`)
  process.exit(1)
})
