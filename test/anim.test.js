// test/anim.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { circleFrame, intro, ripple } from '../lib/anim.js'

test('circleFrame returns a 5-line block at every radius', () => {
  for (let r = 1; r <= 5; r++) {
    const lines = circleFrame(r).split('\n')
    assert.equal(lines.length, 5, `radius ${r} must render 5 lines`)
  }
})

test('circleFrame always contains the center circle ◯', () => {
  for (let r = 1; r <= 5; r++) {
    assert.ok(circleFrame(r).includes('◯'), `radius ${r} must contain ◯`)
  }
})

test('circleFrame lines have constant width per frame', () => {
  for (let r = 1; r <= 5; r++) {
    const widths = new Set(circleFrame(r).split('\n').map(l => l.length))
    assert.equal(widths.size, 1, `radius ${r} lines must be equal width`)
  }
})

test('circleFrame clamps out-of-range radius', () => {
  assert.equal(circleFrame(0), circleFrame(1))
  assert.equal(circleFrame(99), circleFrame(5))
})

test('larger radius renders a wider halo', () => {
  const dots = s => (s.match(/[·∙]/g) || []).length
  assert.ok(dots(circleFrame(5)) > dots(circleFrame(2)))
  assert.equal(dots(circleFrame(1)), 0)
})

test('intro and ripple are exported functions', () => {
  assert.equal(typeof intro, 'function')
  assert.equal(typeof ripple, 'function')
})

test('intro resolves quickly in non-TTY (tests run piped)', async () => {
  const t0 = Date.now()
  await intro('0.2.0')
  assert.ok(Date.now() - t0 < 200, 'non-TTY intro must not animate')
})

test('ripple resolves instantly in non-TTY', async () => {
  const t0 = Date.now()
  await ripple()
  assert.ok(Date.now() - t0 < 100)
})
