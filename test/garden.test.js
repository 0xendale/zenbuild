// test/garden.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextElementType, parseGarden, placeElement,
         renderGarden, growthNotice,
         GRID_W, GRID_H, MAX_ELEMENTS } from '../lib/garden.js'

test('elements cycle through the pool in order', () => {
  assert.equal(nextElementType(0), 'stone')
  assert.equal(nextElementType(1), 'sprout')
  assert.equal(nextElementType(2), 'grass')
  assert.equal(nextElementType(3), 'bamboo')
  assert.equal(nextElementType(4), 'tree')
  assert.equal(nextElementType(5), 'lotus')
  assert.equal(nextElementType(6), 'stone') // wraps
})

test('every 10th element is a koi', () => {
  assert.equal(nextElementType(9), 'koi')
  assert.equal(nextElementType(19), 'koi')
  assert.notEqual(nextElementType(10), 'koi')
})

test('parseGarden recovers from corrupt or empty json', () => {
  for (const raw of ['', 'not json', '{"elements": "nope"}', '[]']) {
    const state = parseGarden(raw)
    assert.deepEqual(state.elements, [])
    assert.equal(state.totalBuilds, 0)
    assert.ok(state.plantedAt)
  }
})

test('parseGarden preserves valid state', () => {
  const raw = JSON.stringify({
    elements: [{ type: 'stone', x: 1, y: 1, addedAt: '2026-07-07T00:00:00Z' }],
    totalBuilds: 7,
    plantedAt: '2026-01-01T00:00:00Z',
  })
  const state = parseGarden(raw)
  assert.equal(state.elements.length, 1)
  assert.equal(state.totalBuilds, 7)
  assert.equal(state.plantedAt, '2026-01-01T00:00:00Z')
})

test('placeElement stays in bounds and avoids overlap', () => {
  const taken = [{ x: 0, y: 0 }]
  let calls = 0
  // rng that first collides with (0,0), then yields (1,1)
  const rng = () => {
    calls++
    if (calls <= 2) return 0
    return 1 / GRID_W + 0.001
  }
  const pos = placeElement(taken, rng)
  assert.ok(pos.x >= 0 && pos.x < GRID_W)
  assert.ok(pos.y >= 0 && pos.y < GRID_H)
  assert.ok(!(pos.x === 0 && pos.y === 0), 'must not overlap taken cell')
})

test('renderGarden draws the element glyph on a sand grid', () => {
  const state = parseGarden('')
  state.elements.push({ type: 'lotus', x: 3, y: 2, addedAt: 'x' })
  const out = renderGarden(state)
  assert.equal(out.split('\n').length, GRID_H)
  assert.ok(out.includes('✿'))
  assert.ok(out.includes('˜'))
})

test('growthNotice names the element and count', () => {
  const line = growthNotice('sprout', 12)
  assert.ok(line.includes('sprout'))
  assert.ok(line.includes('12'))
})

test('MAX_ELEMENTS is 40', () => {
  assert.equal(MAX_ELEMENTS, 40)
})
