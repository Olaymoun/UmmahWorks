import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'UmmahWorks <salaam@ummahworks.org>'
const BASE_URL = 'https://ummahworks.org'

function auth(req) {
  const h = req.headers.authorization
  return h && h.startsWith('Bearer ') && h.slice(7) === process.env.ADMIN_PASSWORD
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body ?? {}

  const { action, id, ...fields } = body
  if (!action || !id) return res.status(400).json({ error: 'action and id are required.' })

  try {
    const sql = neon(process.env.DATABASE_URL)

    if (action === 'approve_mentor') {
      const [mentor] = await sql`
        UPDATE mentors SET status = 'active' WHERE id = ${id}
        RETURNING name, email
      `
      if (!mentor) return res.status(404).json({ error: 'Mentor not found.' })

      const firstName = mentor.name.split(' ')[0]
      await resend.emails.send({
        from: FROM,
        to: mentor.email,
        subject: 'You have been approved as an UmmahWorks mentor',
        text: [
          `Assalamu alaikum ${firstName},`,
          ``,
          `Your application to join the UmmahWorks mentor council has been approved.`,
          ``,
          `Please visit your mentor portal to set your weekly availability. Once you do, we will start matching you with mentees whose schedules and goals align with yours.`,
          ``,
          `Mentor portal: ${BASE_URL}/mentor-portal`,
          ``,
          `JazakAllah Khayran for giving back to the community.`,
          `UmmahWorks`,
        ].join('\n'),
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f2eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2eb;padding:48px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fdf9f3;border:1px solid #e2ddd4;border-radius:2px;overflow:hidden">

        <!-- Header -->
        <tr>
          <td style="background:#11130f;padding:28px 40px">
            <p style="margin:0;font-family:'JetBrains Mono',monospace,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c58b3d">UmmahWorks</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3a3a2e">Assalamu alaikum ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a3a2e">Your application to join the UmmahWorks mentor council has been approved. JazakAllah Khayran for committing your time and experience to the next generation of Muslim professionals.</p>
            <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#3a3a2e">To get started, visit your mentor portal and set your weekly availability. Once you do, we will begin matching you with mentees whose goals and schedules align with yours.</p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#11130f;border-radius:2px">
                  <a href="${BASE_URL}/mentor-portal" style="display:inline-block;padding:13px 24px;font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#fdf9f3;text-decoration:none;letter-spacing:.02em">Set my availability &rarr;</a>
                </td>
              </tr>
            </table>

            <p style="margin:32px 0 0;font-size:13px;color:#8a8579">Or copy this link: <a href="${BASE_URL}/mentor-portal" style="color:#c58b3d">${BASE_URL}/mentor-portal</a></p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px"><div style="height:1px;background:#e2ddd4"></div></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#b0aa9e">UmmahWorks &middot; Volunteer-run &middot; Since 2023</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      })

      return res.status(200).json({ ok: true })
    }

    if (action === 'reject_mentor') {
      await sql`UPDATE mentors SET status = 'rejected' WHERE id = ${id}`
      return res.status(200).json({ ok: true })
    }

    if (action === 'delete_mentor') {
      await sql`DELETE FROM mentors WHERE id = ${id}`
      return res.status(200).json({ ok: true })
    }

    if (action === 'update_mentor') {
      const { name, email, role, company, bio, domains } = fields
      await sql`
        UPDATE mentors SET
          name = ${name}, email = ${email}, role = ${role}, company = ${company},
          bio = ${bio}, domains = ${domains}
        WHERE id = ${id}
      `
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Unknown action.' })
  } catch (err) {
    console.error('[admin-action]', err.message)
    return res.status(500).json({ error: 'Action failed.' })
  }
}
