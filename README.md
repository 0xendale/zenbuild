```
        ( zen )
     ∿∿∿  ◯  ∿∿∿
   zen-build
   "slow down to code faster"
```

[![npm version](https://img.shields.io/npm/v/zen-build?color=a8c5a0)](https://www.npmjs.com/package/zen-build)
[![license](https://img.shields.io/npm/l/zen-build?color=a8c5a0)](./LICENSE)
[![node](https://img.shields.io/node/v/zen-build?color=a8c5a0)](https://nodejs.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-a8c5a0)](./package.json)

> **slow down to code faster.**

---

## Philosophy

In 2026, AI generates code faster than ever. Pull requests are opened in seconds. Builds are triggered on every keystroke. And somewhere in the middle of all that velocity, the developer — you — started disappearing.

ZenBuild is a small act of resistance. It wraps your build command with a moment of intention: a night check that notices when you're working at 2 AM, a burnout shield that locks the keyboard when you've run five builds in ten minutes, a breathing animation that actually makes you breathe, and a hydration gate that asks the question your IDE never will.

It is not a productivity tool. It is a recovery tool that happens to ship software.

---

## Installation

```bash
npm install -g zen-build
```

Requires Node.js >= 18.

---

## Usage

```bash
zen-build "npm run build"
zen-build "make"
zen-build "cargo build --release"
zen-build "python manage.py collectstatic"
```

---

## How It Works

1. **Night Check** — If it's between 23:00 and 04:59, ZenBuild notices and says something. It still runs. But it says something.
2. **Burnout Shield** — If you've triggered five or more builds in the last ten minutes, ZenBuild locks the keyboard for 60 seconds. Stand up. Wiggle your toes. Look at something 20 feet away.
3. **Breathing Bar** — A 10-second animated breathing exercise. Inhale 4s. Hold 2s. Exhale 4s. The build can wait.
4. **Hydration Gate** — With a 10% probability each run, ZenBuild asks when you last drank water. If you say no, it exits. The water is more important.
5. **A Quote** — One of 333+ handwritten quotes about pace, debugging, code quality, AI, sleep, and what it means to do this work sustainably.
6. **Your Build** — Then, finally, your command runs. With full stdio inheritance. Exit code preserved.

---

## Why Slow?

The fastest build is the one you don't have to run twice. The best feature is the one you understood before you wrote it. The most productive developer is the one who shows up tomorrow.

ZenBuild is not about being slow. It is about being deliberate. Every gate it adds costs you seconds and saves you hours — in bugs not introduced, in regressions not shipped, in on-call incidents not triggered at 3 AM by a deploy that felt urgent at 11 PM.

Speed is not a virtue. Accuracy is. And accuracy requires a brain that has been watered, rested, and occasionally asked to breathe.

---

## Configuration

None. If you want to skip, run the command directly.

---

## License

MIT
