import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { parseDomains } from './_lib/domains.js'
import { checkRateLimit } from './_lib/ratelimit.js'

const resend = new Resend(process.env.RESEND_API_KEY)
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
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Write a 2-3 sentence third-person mentor bio for a career mentorship platform called UmmahWorks, serving Muslim professionals. Be specific, warm, and professional. Focus on their background and what they are best positioned to help mentees with. Do not mention the platform by name. Write only the bio with no extra text.\n\n${context}`,
    })
    return text?.trim() || null
  } catch {
    return null
  }
}

async function fetchLinkedInText(url) {
  if (!url) return ''
  const liAt = process.env.LINKEDIN_LI_AT
  const jsessionId = process.env.LINKEDIN_JSESSIONID
  if (!liAt || !jsessionId) return ''

  try {
    const vanity = url.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1]
    if (!vanity) return ''

    const csrfToken = jsessionId.replace(/^"|"$/g, '')

    const r = await fetch(`https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${vanity}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-91`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/vnd.linkedin.normalized+json+2.1',
        'Accept-Language': 'en-US,en;q=0.9',
        'x-li-lang': 'en_US',
        'x-restli-protocol-version': '2.0.0',
        'csrf-token': csrfToken,
        'cookie': `li_at=${liAt}; JSESSIONID="${csrfToken}"`,
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!r.ok) return ''
    const data = await r.json()

    const profile = data?.included?.find(e => e?.$type?.includes('dash.identity.profile.Profile') && e.firstName)
    if (!profile) return ''

    const headline = profile.headline ?? ''
    const summary = profile.summary ?? ''
    const firstName = profile.firstName ?? ''
    const lastName = profile.lastName ?? ''
    const positions = data.included
      ?.filter(e => e?.$type?.includes('Position') && e.title)
      ?.slice(0, 3)
      ?.map(p => `${p.title} at ${p.companyName || ''}`)
      ?.join(', ') ?? ''

    return [firstName, lastName, headline, summary, positions].filter(Boolean).join(' ')
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
