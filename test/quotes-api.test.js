// test/quotes-api.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fetchQuote } from '../lib/quotes-api.js'
import { QUOTES } from '../lib/snippets.js'

test('returns API quote and author on success', async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => [{ q: 'Be water, my friend.', a: 'Bruce Lee' }],
  })
  const quote = await fetchQuote(fakeFetch)
  assert.deepEqual(quote, { text: 'Be water, my friend.', author: 'Bruce Lee' })
})

test('missing author yields author: null', async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => [{ q: 'Silence is a build passing.', a: '' }],
  })
  const quote = await fetchQuote(fakeFetch)
  assert.equal(quote.author, null)
})

test('falls back to local pool on non-ok status', async () => {
  const fakeFetch = async () => ({ ok: false, json: async () => [] })
  const quote = await fetchQuote(fakeFetch)
  assert.ok(QUOTES.includes(quote.text))
  assert.equal(quote.author, null)
})

test('falls back on malformed payload', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ nope: true }) })
  const quote = await fetchQuote(fakeFetch)
  assert.ok(QUOTES.includes(quote.text))
})

test('falls back on network error', async () => {
  const fakeFetch = async () => { throw new Error('offline') }
  const t0 = Date.now()
  const quote = await fetchQuote(fakeFetch)
  assert.ok(QUOTES.includes(quote.text))
  assert.ok(Date.now() - t0 < 500, 'must not leave the default 2s timer pending')
})

test('falls back on timeout via AbortController', async () => {
  const hangingFetch = (url, { signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')))
  })
  const t0 = Date.now()
  const quote = await fetchQuote(hangingFetch, 50)
  assert.ok(Date.now() - t0 < 1000, 'must abort, not hang')
  assert.ok(QUOTES.includes(quote.text))
})
