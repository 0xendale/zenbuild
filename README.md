<div align="center">

```
          ◯
       ∿∿∿ ∿∿∿
     zenbuild
```

# zenbuild

**slow down to code faster.**

[![npm](https://img.shields.io/npm/v/@zenbuild/zenbuild?color=a8c5a0&style=flat-square&label=npm)](https://www.npmjs.com/package/@zenbuild/zenbuild)
[![license](https://img.shields.io/npm/l/@zenbuild/zenbuild?color=a8c5a0&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@zenbuild/zenbuild?color=a8c5a0&style=flat-square)](https://nodejs.org)
[![zero dependencies](https://img.shields.io/badge/dependencies-zero-a8c5a0?style=flat-square)]()

</div>

---

## The Problem

In 2026, AI writes code before you finish the sentence.
Pipelines trigger on every keystroke.
Builds complete before you've taken a breath.

And somewhere in the middle of all that velocity — **you started disappearing.**

Not from the codebase. From yourself.

---

## The Tool

ZenBuild wraps any build command and inserts a moment of intention before it runs.

```bash
zenbuild "npm run build"
zenbuild "make"
zenbuild "cargo build --release"
zenbuild "python train.py"
```

That's it. Same commands. Same output. Same exit codes.

Except now, before the machine does its thing — **you do yours.**

---

## What Happens

Every time you run `zenbuild`, in this order:

**🌙 Night Check**
If it's past 11 PM or before 5 AM, ZenBuild notices. It says something quiet. Then continues. You've been warned.

**🔥 Burnout Shield**
Five builds in ten minutes? ZenBuild locks the keyboard for 60 seconds — no negotiation, no override. It tracks builds in `~/.zenbuild/history.json`. When the cooldown ends, the slate clears. You may proceed. Hopefully slower.

**🫁 The Breathing Bar**
Ten seconds. Every time. Inhale four. Hold two. Exhale four. A progress bar moves with your breath. It cannot be skipped. That is the point.

**💧 Hydration Gate**
One in ten builds, ZenBuild asks when you last had water. If you say no, the build doesn't run. Go drink. Come back. The code will still be broken.

**✦ A Quote**
One of 343 handwritten lines on pace, debugging, code quality, sleep, AI, and what it means to do this work sustainably. It sits on the screen for a moment before anything else happens.

**▶ Your Build**
Finally — your command runs. Real-time stdout and stderr. Exit code preserved exactly. Nothing changed. Except you took ten seconds first.

---

## Installation

```bash
npm install -g @zenbuild/zenbuild
```

Requires Node.js ≥ 18. No other dependencies. Ever.

---

## Why Slow?

> *"The fastest build is the one you don't have to run twice."*

You already have tools that go fast. You have AI that generates before you think. You have CI that deploys before you've had lunch. You have Slack that interrupts before you've reached flow.

What you don't have is a single piece of tooling that asks you to **stop** — not to block you, but to keep you functional past Thursday.

ZenBuild costs you ten seconds per build.

In return: fewer bugs born from rushed PRs. Fewer 3 AM incidents triggered by 11 PM urgency. Fewer resignation letters written by developers who forgot what it felt like to be present.

Ten seconds. That is the trade.

---

## Configuration

None.

If you want to skip the breathing, run the command directly. ZenBuild is a choice you make every time you type it. That is the design.

---

## License

MIT — use it, fork it, wrap your own rituals around it.
