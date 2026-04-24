import { neon } from '@neondatabase/serverless'

function auth(req) {
  const h = req.headers.authorization
  return h && h.startsWith('Bearer ') && h.slice(7) === process.env.ADMIN_PASSWORD
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const sql = neon(process.env.DATABASE_URL)

    const [pendingMentors, activeMentors, pendingMatches, recentMentees] = await Promise.all([
      sql`
        SELECT id, name, email, role, company, linkedin, topics, domains, created_at
        FROM mentors WHERE status = 'pending' ORDER BY created_at DESC
      `,
      sql`
        SELECT id, name, email, role, company, bio, domains, created_at
        FROM mentors WHERE status = 'active' ORDER BY name
      `,
      sql`
        SELECT
          m.id, m.status, m.total_score, m.domain_score, m.availability_score,
          m.created_at, m.approval_token,
          mr.name AS mentor_name, mr.email AS mentor_email,
          mr.role AS mentor_role, mr.company AS mentor_company,
          me.name AS mentee_name, me.email AS mentee_email,
          me.career_stage, me.domains AS mentee_domains, me.need
        FROM matches m
        JOIN mentors mr ON mr.id = m.mentor_id
        JOIN mentees me ON me.id = m.mentee_id
        WHERE m.status IN ('pending', 'admin_approved')
        ORDER BY m.created_at DESC
      `,
      sql`
        SELECT id, name, email, career_stage, domains, need, created_at
        FROM mentees ORDER BY created_at DESC LIMIT 30
      `,
    ])

    return res.status(200).json({ pendingMentors, activeMentors, pendingMatches, recentMentees })
  } catch (err) {
    console.error('[admin-data]', err.message)
    return res.status(500).json({ error: 'Failed to load data.' })
  }
}
