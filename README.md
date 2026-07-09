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

**∿ The Arrival**
A small animated wave. Your name in lights (well, the tool's name). A tagline typed out one character at a time, because nothing here is in a hurry.

**🌙 Night Check**
If it's past 11 PM or before 5 AM, ZenBuild notices. It says something quiet. Then continues. You've been warned.

**🔥 Burnout Shield**
Five builds in ten minutes? ZenBuild locks the keyboard for 60 seconds — no negotiation, no override. It tracks the last hour of builds in `~/.zenbuild/history.json`. When the cooldown ends, the slate clears. You may proceed. Hopefully slower.

**🧘 A Posture Whisper** *(sometimes)*
Roughly one build in seven, a single dim line: *unclench your jaw. drop your shoulders. sit tall.* No pause. No gate. Just a reminder that you have a body.

**🫁 The Breathing Circle**
Ten seconds. Every time. A circle expands as you inhale for four, pulses as you hold for two, contracts as you exhale for four. It cannot be skipped. That is the point.

**⛩ A Gate** *(at most one per build)*
After the breath, ZenBuild may open one gate:

- **💧 Hydration** — one build in ten. A ripple, then a question: when did you last drink water? Say no and the build doesn't run. Go drink. The code will still be broken.
- **🧘 Stretch** — one build in ten. Fifteen seconds of neck rolls or wrist circles, with a countdown bar that waits for you.
- **🙏 Gratitude** — one build in twenty. Name one thing that worked today. It gets written down. You'll want it later.
- **👀 Eye Rest** — not random. Every third build within the hour, twenty seconds of looking at something twenty feet away. Your optometrist would approve.

**✦ A Quote**
Fetched live from [zenquotes.io](https://zenquotes.io) while you were breathing — no extra wait. If the network is slow or absent, one of 333 handwritten local lines on pace, debugging, sleep, AI, and doing this work sustainably steps in silently. Either way, it sits on the screen for a moment before anything else happens.

**▶ Your Build**
Finally — your command runs. Real-time stdout and stderr. Exit code preserved exactly. Nothing changed. Except you took ten seconds first.

**🌱 The Garden**
If the build succeeds, something grows.

---

## The Zen Garden

Every successful build plants one element in your garden — a stone, a sprout, grass, bamboo, a tree, a lotus. Every tenth element, a koi arrives. Rare and unbothered.

```bash
zenbuild --garden
```

```
  your zen garden

  ˜˜˜˜◦˜˜˜˜˜˜˜˜˜˜🌱˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜┃˜˜˜˜˜˜˜˜˜˜˜
  ˜˜˜˜˜˜˜˜˜˜ⁿ˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜
  ˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜🌲˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜✿˜˜˜˜˜˜
  ˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜˜🐟˜˜˜˜˜˜˜˜˜˜˜˜˜

  7 elements · 7 mindful builds · planted 2026-07-07
```

At 40 elements the garden is complete. It gets archived, and a fresh one begins. It was never about the garden.

And the things you were grateful for:

```bash
zenbuild --gratitude
```

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

In CI or a pipe (no TTY), the animations go static and the interactive gates step aside. ZenBuild is for humans; machines may pass.

---

## What's New in 0.2.0

- Animated intro, breathing circle, and water ripple (TTY only — CI stays clean)
- Gate picker: hydration, stretch, gratitude, and eye-rest gates — at most one per build
- Posture whispers, non-blocking
- Zen garden that grows with every successful build (`--garden`)
- Gratitude journal (`--gratitude`)
- Live quotes from zenquotes.io with silent local fallback
- Burnout shield now keeps a rolling one-hour history

---

## License

MIT — use it, fork it, wrap your own rituals around it.
