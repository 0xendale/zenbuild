// test/snippets.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomQuote, QUOTES } from '../lib/snippets.js'

test('randomQuote returns a non-empty string', () => {
  const q = randomQuote()
  assert.equal(typeof q, 'string')
  assert.ok(q.length > 0)
})

test('randomQuote always returns a value from QUOTES', () => {
  for (let i = 0; i < 50; i++) {
    assert.ok(QUOTES.includes(randomQuote()))
  }
})

test('QUOTES has at least 333 entries', () => {
  assert.ok(QUOTES.length >= 333)
})

test('all quotes are non-empty strings', () => {
  for (const q of QUOTES) {
    assert.equal(typeof q, 'string')
    assert.ok(q.length > 0, `Empty quote found: "${q}"`)
  }
})
