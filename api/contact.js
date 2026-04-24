import { Resend } from 'resend'
import { checkRateLimit } from './_lib/ratelimit.js'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = 'salaam@ummahworks.org'
const FROM = 'UmmahWorks <forms@ummahworks.org>'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!checkRateLimit(req, res)) return

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body ?? {}

  const { name, email, level, need } = body
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Coaching request: ${name}`,
      text: [
        `Name:  ${name}`,
        `Email: ${email}`,
        `Level: ${level || '(not specified)'}`,
        ``,
        `What they need:`,
        need || '(not specified)',
      ].join('\n'),
    })

    if (error) {
      console.error('[contact] resend error:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] exception:', err.message)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
