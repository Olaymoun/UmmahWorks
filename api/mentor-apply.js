import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { parseDomains } from './_lib/domains.js'
import { checkRateLimit } from './_lib/ratelimit.js'

const resend = new Resend(process.env.RESEND_API_KEY)
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const ADMIN = 'salaam@ummahworks.org'
const FROM = 'UmmahWorks <forms@ummahworks.org>'

async function generateBio(name, role, company, topics, linkedinText) {
  const context = [
    `Name: ${name}`,
    `Role: ${role || 'not specified'}`,
    `Company: ${company || 'not specified'}`,
    `What they can help with: ${topics || 'not specified'}`,
    linkedinText ? `LinkedIn context: ${linkedinText.slice(0, 400)}` : null,
  ].filter(Boolean).join('\n')

  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(`Write a 2-3 sentence third-person mentor bio for a career mentorship platform called UmmahWorks, serving Muslim professionals. Be specific, warm, and professional. Focus on their background and what they are best positioned to help mentees with. Do not mention the platform by name. Write only the bio with no extra text.\n\n${context}`)
    return result.response.text()?.trim() || null
  } catch {
    return null
  }
}

async function fetchLinkedInText(url) {
  if (!url) return ''
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    })
    const html = await r.text()
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || ''
    const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1] || ''
    return `${title} ${desc}`
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!checkRateLimit(req, res)) return

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body ?? {}

  const { name, email, role, company, linkedin, topics } = body

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })

  try {
    const linkedinText = await fetchLinkedInText(linkedin)
    const combinedText = `${role || ''} ${company || ''} ${topics || ''} ${linkedinText}`
    const domains = parseDomains(combinedText)
    const bio = await generateBio(name, role, company, topics, linkedinText)

    const sql = neon(process.env.DATABASE_URL)

    await sql`
      INSERT INTO mentors (name, email, role, company, linkedin, topics, bio, domains, status)
      VALUES (${name}, ${email}, ${role || null}, ${company || null}, ${linkedin || null}, ${topics || null}, ${bio || null}, ${domains}, 'pending')
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        company = EXCLUDED.company,
        linkedin = COALESCE(EXCLUDED.linkedin, mentors.linkedin),
        topics = EXCLUDED.topics,
        bio = COALESCE(EXCLUDED.bio, mentors.bio),
        domains = EXCLUDED.domains,
        status = CASE WHEN mentors.status = 'active' THEN 'active' ELSE 'pending' END
    `

    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      replyTo: email,
      subject: `Mentor application: ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Role:    ${role || '(not specified)'}`,
        `Company: ${company || '(not specified)'}`,
        `LinkedIn: ${linkedin || '(not provided)'}`,
        `Domains parsed: ${domains.length > 0 ? domains.join(', ') : '(none detected)'}`,
        ``,
        `What they can help with:`,
        topics || '(not specified)',
      ].join('\n'),
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[mentor-apply]', err.message)
    return res.status(500).json({ error: 'Failed to submit application.' })
  }
}
