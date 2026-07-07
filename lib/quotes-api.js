// lib/quotes-api.js
import { randomQuote } from './snippets.js'

const API_URL = 'https://zenquotes.io/api/random'

// Never rejects, never blocks longer than timeoutMs: any failure falls back
// silently to the local pool. fetchImpl is injectable for tests.
export async function fetchQuote(fetchImpl = globalThis.fetch, timeoutMs = 2000) {
  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetchImpl(API_URL, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = await res.json()
    const q = data?.[0]?.q
    const a = data?.[0]?.a
    if (typeof q !== 'string' || !q.trim()) throw new Error('bad payload')
    return {
      text:   q.trim(),
      author: typeof a === 'string' && a.trim() ? a.trim() : null,
    }
  } catch {
    return { text: randomQuote(), author: null }
  } finally {
    clearTimeout(timer)
  }
}
