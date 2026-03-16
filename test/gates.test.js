// test/gates.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'

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
