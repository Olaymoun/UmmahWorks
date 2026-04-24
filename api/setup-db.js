import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL)

    await sql`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT,
        company TEXT,
        linkedin TEXT,
        topics TEXT,
        domains TEXT[] DEFAULT '{}',
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS mentor_availability (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
        day_of_week SMALLINT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        timezone TEXT NOT NULL DEFAULT 'America/New_York'
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS mentees (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        career_stage TEXT,
        domains TEXT[] DEFAULT '{}',
        need TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS mentee_availability (
        id SERIAL PRIMARY KEY,
        mentee_id INTEGER REFERENCES mentees(id) ON DELETE CASCADE,
        day_of_week SMALLINT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        timezone TEXT NOT NULL DEFAULT 'America/New_York'
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER REFERENCES mentors(id),
        mentee_id INTEGER REFERENCES mentees(id),
        domain_score INTEGER DEFAULT 0,
        availability_score INTEGER DEFAULT 0,
        total_score INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        approval_token TEXT UNIQUE,
        mentor_approval_token TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS mentor_approval_token TEXT UNIQUE`

    return res.status(200).json({ ok: true, message: 'Schema ready.' })
  } catch (err) {
    console.error('[setup-db]', err.message)
    return res.status(500).json({ error: err.message })
  }
}
