const store = new Map() // ip -> [timestamp, ...]
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 5

export function checkRateLimit(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'anonymous'
  const now = Date.now()
  const timestamps = (store.get(ip) || []).filter(t => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' })
    return false
  }

  timestamps.push(now)
  store.set(ip, timestamps)
  return true
}
