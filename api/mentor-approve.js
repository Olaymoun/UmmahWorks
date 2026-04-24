import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'UmmahWorks <salaam@ummahworks.org>'

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
        mentee.need AS mentee_need
      FROM matches m
      JOIN mentors mentor ON mentor.id = m.mentor_id
      JOIN mentees mentee ON mentee.id = m.mentee_id
      WHERE m.mentor_approval_token = ${token}
    `

    if (!match) {
      return res.status(404).send(page('Link not found.', 'This link is invalid or has already been used.', false))
    }

    if (match.status === 'approved') {
      return res.status(200).send(
        page('Already confirmed.', `You already accepted this match with ${match.mentee_name}. Check your email for their contact details.`, true)
      )
    }

    if (match.status !== 'admin_approved') {
      return res.status(400).send(page('Not ready.', 'This match has not been approved by our team yet.', false))
    }

    await sql`UPDATE matches SET status = 'approved' WHERE mentor_approval_token = ${token}`

    const mentorFirst = match.mentor_name.split(' ')[0]
    const menteeFirst = match.mentee_name.split(' ')[0]
    const mentorTitle = [match.mentor_role, match.mentor_company].filter(Boolean).join(' at ')

    await resend.emails.send({
      from: FROM,
      to: match.mentor_email,
      subject: `Match confirmed: ${match.mentee_name}`,
      text: [
        `Assalamu alaikum ${mentorFirst},`,
        ``,
        `You confirmed the match. Here are their details:`,
        ``,
        `Name: ${match.mentee_name}`,
        `Email: ${match.mentee_email}`,
        ``,
        `What they need:`,
        match.mentee_need || '(they will share more when you connect)',
        ``,
        `Please reach out directly to schedule your 20-minute session.`,
        ``,
        `JazakAllah Khayran for giving back.`,
        `UmmahWorks`,
      ].join('\n'),
    })

    await resend.emails.send({
      from: FROM,
      to: match.mentee_email,
      subject: `Your mentor is ready`,
      text: [
        `Assalamu alaikum ${menteeFirst},`,
        ``,
        `We found a match for you.`,
        ``,
        `${match.mentor_name}${mentorTitle ? `, ${mentorTitle},` : ''} has agreed to connect with you.`,
        ``,
        `They will reach out to you at ${match.mentee_email} to schedule your 20-minute session.`,
        ``,
        `JazakAllah Khayran,`,
        `UmmahWorks`,
      ].join('\n'),
    })

    return res.status(200).send(
      page(
        'Session confirmed.',
        `Contact details have been sent to both you and ${match.mentee_name}. JazakAllah Khayran for giving back.`,
        true
      )
    )
  } catch (err) {
    console.error('[mentor-approve]', err.message)
    return res.status(500).send(page('Something went wrong.', err.message, false))
  }
}
