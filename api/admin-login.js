function readBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined) {
      resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
      return
    }
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', () => resolve(''))
  })
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const raw = await readBody(req)
  let body = {}
  try { body = JSON.parse(raw) } catch { /* invalid JSON body */ }

  const { username, password } = body

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true, token: process.env.ADMIN_PASSWORD })
  }

  return res.status(401).json({ error: 'Invalid credentials.' })
}
