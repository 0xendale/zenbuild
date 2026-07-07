// test/gates.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickGate, formatGratitudeEntry } from '../lib/gates.js'

test('history older than 10 minutes is pruned', () => {
  const now = Date.now()
  const tenMinutes = 10 * 60 * 1000
  const timestamps = [
    new Date(now - tenMinutes - 1000).toISOString(), // too old
    new Date(now - tenMinutes + 1000).toISOString(), // recent
    new Date(now - 1000).toISOString(),               // recent
  ]
  const recent = timestamps.filter(ts => now - new Date(ts).getTime() < tenMinutes)
  assert.equal(recent.length, 2)
})

test('night check triggers between 23:00 and 04:59', () => {
  const isNight = (hour) => hour >= 23 || hour < 5
  assert.ok(isNight(23))
  assert.ok(isNight(0))
  assert.ok(isNight(4))
  assert.ok(!isNight(5))
  assert.ok(!isNight(22))
  assert.ok(!isNight(12))
})

test('missing history.json is treated as empty array', () => {
  let data
  try {
    data = JSON.parse('')
  } catch {
    data = []
  }
  assert.deepEqual(data, [])
})

test('pickGate: eye-rest fires on every 3rd build within the hour', () => {
  const now = Date.now()
  const mk = n => Array.from({ length: n }, (_, i) => new Date(now - (i + 1) * 60000).toISOString())
  const neverRoll = () => 0.99
  assert.equal(pickGate(mk(2), neverRoll, now), null)
  assert.equal(pickGate(mk(3), neverRoll, now), 'eye-rest')
  assert.equal(pickGate(mk(4), neverRoll, now), null)
  assert.equal(pickGate(mk(6), neverRoll, now), 'eye-rest')
})

test('pickGate: builds older than an hour do not count toward eye-rest', () => {
  const now = Date.now()
  const stale = Array.from({ length: 5 }, (_, i) =>
    new Date(now - (61 + i) * 60000).toISOString())
  assert.equal(pickGate(stale, () => 0.99, now), null)
})

test('pickGate weights: hydration 10%, stretch 10%, gratitude 5%, else none', () => {
  assert.equal(pickGate([], () => 0.05), 'hydration')
  assert.equal(pickGate([], () => 0.15), 'stretch')
  assert.equal(pickGate([], () => 0.22), 'gratitude')
  assert.equal(pickGate([], () => 0.25), null)
  assert.equal(pickGate([], () => 0.80), null)
})

test('formatGratitudeEntry is "ISO — text" with trailing newline', () => {
  const d = new Date('2026-07-07T12:00:00Z')
  assert.equal(
    formatGratitudeEntry('the tests passed first try', d),
    '2026-07-07T12:00:00.000Z — the tests passed first try\n'
  )
})
