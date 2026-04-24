import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'
import { checkRateLimit } from './_lib/ratelimit.js'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN = 'salaam@ummahworks.org'
const FROM = 'UmmahWorks <forms@ummahworks.org>'
const BASE_URL = 'https://ummahworks.org'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function fmt(timeStr) {
  const [h, m] = timeStr.substring(0, 5).split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return m === 0 ? `${hour}${ampm}` : `${hour}:${m.toString().padStart(2, '0')}${ampm}`
}

function windowOverlap(mentorW, menteeW) {
  if (mentorW.day_of_week !== menteeW.day) return null
  const s1 = mentorW.start_time.substring(0, 5)
  const e1 = mentorW.end_time.substring(0, 5)
  const s2 = menteeW.start.substring(0, 5)
  const e2 = menteeW.end.substring(0, 5)
  const start = s1 > s2 ? s1 : s2
  const end = e1 < e2 ? e1 : e2
  if (start >= end) return null
  return { day: mentorW.day_of_week, start, end }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!checkRateLimit(req, res)) return

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body ?? {}

  const { name, email, career_stage, domains, need, availability } = body

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })
  if (!domains || domains.length === 0) return res.status(400).json({ error: 'Select at least one domain.' })
  if (!availability || availability.length === 0) return res.status(400).json({ error: 'Add at least one availability window.' })

  try {
    const sql = neon(process.env.DATABASE_URL)

    const [mentee] = await sql`
      INSERT INTO mentees (name, email, career_stage, domains, need)
      VALUES (${name}, ${email}, ${career_stage || null}, ${domains}, ${need || null})
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        career_stage = COALESCE(EXCLUDED.career_stage, mentees.career_stage),
        domains = EXCLUDED.domains,
        need = EXCLUDED.need
      RETURNING id
    `

    await sql`DELETE FROM mentee_availability WHERE mentee_id = ${mentee.id}`

    for (const w of availability) {
      await sql`
        INSERT INTO mentee_availability (mentee_id, day_of_week, start_time, end_time, timezone)
        VALUES (${mentee.id}, ${w.day}, ${w.start}, ${w.end}, ${w.timezone || 'America/New_York'})
      `
    }

    const candidates = await sql`
      SELECT m.*,
        COALESCE(
          array_agg(
            json_build_object(
              'day_of_week', ma.day_of_week,
              'start_time', ma.start_time::text,
              'end_time', ma.end_time::text,
              'timezone', ma.timezone
            )
          ) FILTER (WHERE ma.id IS NOT NULL),
          ARRAY[]::json[]
        ) AS windows
      FROM mentors m
      LEFT JOIN mentor_availability ma ON ma.mentor_id = m.id
      WHERE m.domains && ${domains} AND m.status = 'active'
      GROUP BY m.id
    `

    const menteeAvailStr = availability
      .map(w => `${DAY_NAMES[w.day]} ${fmt(w.start)} to ${fmt(w.end)} (${w.timezone})`)
      .join(', ')

    if (candidates.length === 0) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN,
        replyTo: email,
        subject: `Mentee request (no matches yet): ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Stage: ${career_stage || 'not specified'}`,
          `Domains: ${domains.join(', ')}`,
          `Availability: ${menteeAvailStr}`,
          ``,
          `What they need:`,
          need || '(not specified)',
          ``,
          `No mentor matches found yet. Consider adding mentors with availability in these domains.`,
        ].join('\n'),
      })
      return res.status(200).json({ ok: true })
    }

    const scored = candidates.map(mentor => {
      const mentorWindows = mentor.windows || []
      const domainScore = domains.filter(d => (mentor.domains || []).includes(d)).length
      let availabilityScore = 0
      const overlapDetails = []

      for (const mw of mentorWindows) {
        for (const tw of availability) {
          const overlap = windowOverlap(mw, tw)
          if (overlap) {
            availabilityScore++
            overlapDetails.push(`${DAY_NAMES[overlap.day]} ${fmt(overlap.start)} to ${fmt(overlap.end)}`)
          }
        }
      }

      return { ...mentor, domainScore, availabilityScore, totalScore: domainScore * 3 + availabilityScore, overlapDetails }
    })

    const top = scored
      .filter(m => m.domainScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5)

    const matchRows = []
    for (const mentor of top) {
      const token = randomUUID()
      await sql`
        INSERT INTO matches (mentor_id, mentee_id, domain_score, availability_score, total_score, status, approval_token)
        VALUES (${mentor.id}, ${mentee.id}, ${mentor.domainScore}, ${mentor.availabilityScore}, ${mentor.totalScore}, 'pending', ${token})
      `
      matchRows.push({ mentor, token })
    }

    const matchLines = matchRows.map(({ mentor, token }, i) => [
      `#${i + 1} ${mentor.name} (${[mentor.role, mentor.company].filter(Boolean).join(', ')}) | Score: ${mentor.totalScore}`,
      `Domains: ${(mentor.domains || []).join(', ')}`,
      mentor.overlapDetails.length > 0
        ? `Overlap: ${mentor.overlapDetails.join(', ')}`
        : `No direct time overlap (domain match only)`,
      `Approve: ${BASE_URL}/api/approve-match?token=${token}`,
      ``,
    ].join('\n')).join('\n')

    await resend.emails.send({
      from: FROM,
      to: ADMIN,
      replyTo: email,
      subject: `Match suggestions: ${name} (${domains.join(', ')})`,
      text: [
        `MENTEE`,
        `------`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Stage: ${career_stage || 'not specified'}`,
        `Domains: ${domains.join(', ')}`,
        `Availability: ${menteeAvailStr}`,
        ``,
        `What they need:`,
        need || '(not specified)',
        ``,
        `SUGGESTED MATCHES`,
        `-----------------`,
        ``,
        matchLines,
      ].join('\n'),
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[mentee-request]', err.message)
    return res.status(500).json({ error: 'Failed to process request.' })
  }
}
