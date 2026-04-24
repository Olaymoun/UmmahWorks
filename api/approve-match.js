import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'UmmahWorks <salaam@ummahworks.org>'
const BASE_URL = 'https://ummahworks.org'

function page(title, message, success) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | UmmahWorks</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; background: #f6f3ec; color: #11130f; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { max-width: 520px; width: 100%; text-align: center; }
    .mark { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 20px; background: ${success ? '#e6f0ec' : '#fce8e8'}; color: ${success ? '#0b5d3b' : '#b91c1c'}; border: 1px solid ${success ? '#b3d4c8' : '#fca5a5'}; }
    h1 { font-size: 30px; font-weight: 500; margin-bottom: 12px; line-height: 1.15; letter-spacing: -.022em; }
    p { font-size: 15px; line-height: 1.65; color: #3a3f34; margin-bottom: 28px; }
    a { display: inline-block; padding: 12px 24px; background: #11130f; color: #fbf8f1; text-decoration: none; border-radius: 2px; font-family: Inter, sans-serif; font-size: 13px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="mark">${success ? '&#10003;' : '&#215;'}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://ummahworks.org">Return to UmmahWorks</a>
  </div>
</body>
</html>`
}

export default async function handler(req, res) {
  const { token } = req.query

  if (!token) {
    return res.status(400).send(page('Missing token.', 'No approval token was provided in the link.', false))
  }

  try {
    const sql = neon(process.env.DATABASE_URL)

    const [match] = await sql`
      SELECT
        m.id, m.status,
        mentor.name AS mentor_name,
        mentor.email AS mentor_email,
        mentor.role AS mentor_role,
        mentor.company AS mentor_company,
        mentee.name AS mentee_name,
        mentee.email AS mentee_email,
        mentee.need AS mentee_need,
        mentee.career_stage AS mentee_stage,
        mentee.domains AS mentee_domains
      FROM matches m
      JOIN mentors mentor ON mentor.id = m.mentor_id
      JOIN mentees mentee ON mentee.id = m.mentee_id
      WHERE m.approval_token = ${token}
    `

    if (!match) {
      return res.status(404).send(page('Link not found.', 'This approval link is invalid or has already been used.', false))
    }

    if (match.status !== 'pending') {
      return res.status(200).send(
        page('Already actioned.', `This match was already processed. ${match.mentor_name} has been notified.`, true)
      )
    }

    const mentorToken = randomUUID()

    await sql`
      UPDATE matches
      SET status = 'admin_approved', mentor_approval_token = ${mentorToken}
      WHERE approval_token = ${token}
    `

    const mentorFirst = match.mentor_name.split(' ')[0]
    const mentorTitle = [match.mentor_role, match.mentor_company].filter(Boolean).join(' at ')
    const stageMap = { early: 'Early career', mid: 'Mid-level', senior: 'Senior / staff', founding: 'Founding / leadership', switching: 'Switching into tech' }
    const stage = stageMap[match.mentee_stage] || match.mentee_stage || 'professional'

    await resend.emails.send({
      from: FROM,
      to: match.mentor_email,
      subject: `Mentee request: ${match.mentee_name} wants to connect`,
      text: [
        `Assalamu alaikum ${mentorFirst},`,
        ``,
        `A mentee has been matched with you. Please review and confirm if you are available to connect.`,
        ``,
        `---`,
        ``,
        `${match.mentee_name}`,
        `Stage: ${stage}`,
        `Domains: ${(match.mentee_domains || []).join(', ')}`,
        ``,
        `What they need:`,
        match.mentee_need || '(they will share more when you connect)',
        ``,
        `---`,
        ``,
        `To confirm this match and receive their contact details:`,
        `Accept: ${BASE_URL}/api/mentor-approve?token=${mentorToken}`,
        ``,
        `If you are not available right now, simply ignore this email. No action required.`,
        ``,
        `JazakAllah Khayran,`,
        `UmmahWorks`,
      ].join('\n'),
    })

    return res.status(200).send(
      page(
        'Match forwarded.',
        `An approval request has been sent to ${match.mentor_name}${mentorTitle ? ` (${mentorTitle})` : ''}. Intro emails will go out once they confirm.`,
        true
      )
    )
  } catch (err) {
    console.error('[approve-match]', err.message)
    return res.status(500).send(page('Something went wrong.', err.message, false))
  }
}
