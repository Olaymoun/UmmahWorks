import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const sql = neon(process.env.DATABASE_URL)

    const rows = await sql`
      SELECT id, name, role, company, topics, bio, domains
      FROM mentors
      WHERE status = 'active' AND array_length(domains, 1) > 0
      ORDER BY created_at ASC
    `

    const domains = [...new Set(rows.flatMap(r => r.domains || []))]
    const count = rows.length

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ domains, count, mentors: rows })
  } catch (err) {
    console.error('[mentors]', err.message)
    return res.status(500).json({ error: 'Failed to fetch mentors.' })
  }
}
