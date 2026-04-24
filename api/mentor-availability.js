import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body ?? {}

  const { name, email, availability } = body

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })
  if (!availability || availability.length === 0) return res.status(400).json({ error: 'Add at least one availability window.' })

  try {
    const sql = neon(process.env.DATABASE_URL)

    const [existing] = await sql`SELECT id, status FROM mentors WHERE email = ${email}`

    if (!existing || existing.status !== 'active') {
      return res.status(403).json({
        error: 'No active mentor account found for this email. If you applied recently, please wait for approval.',
      })
    }

    await sql`UPDATE mentors SET name = ${name} WHERE id = ${existing.id}`
    await sql`DELETE FROM mentor_availability WHERE mentor_id = ${existing.id}`

    for (const w of availability) {
      await sql`
        INSERT INTO mentor_availability (mentor_id, day_of_week, start_time, end_time, timezone)
        VALUES (${existing.id}, ${w.day}, ${w.start}, ${w.end}, ${w.timezone || 'America/New_York'})
      `
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[mentor-availability]', err.message)
    return res.status(500).json({ error: 'Failed to save availability.' })
  }
}
