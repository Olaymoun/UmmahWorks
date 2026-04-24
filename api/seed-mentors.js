import { neon } from '@neondatabase/serverless'

const MENTORS = [
  { name: 'Dr. Ayesha Rahman',  email: 'ayesha.rahman@mentor.uw',    role: 'Principal Engineer',     company: 'Stripe',        bio: 'Twelve years in distributed systems. Comfortable talking through mid to senior engineering career leaps, IC vs. management, and how to ask for what you\'re worth without burning bridges.',                                                                                                                                                                                                              domains: ['Engineering'] },
  { name: 'Khalid Siddiqui',    email: 'khalid.siddiqui@mentor.uw',  role: 'Senior Product Manager', company: 'Notion',         bio: 'Eight years in product, having transitioned from engineering. Best suited for PMs thinking about promos to senior, or engineers considering the switch to product.',                                                                                                                                                                                                                        domains: ['Product'] },
  { name: 'Sumaya Al-Hassan',   email: 'sumaya.alhassan@mentor.uw',  role: 'Staff Data Scientist',   company: 'Airbnb',         bio: 'Ten years in data with a Ph.D. in statistics. Mentors across breaking into DS, ML Eng pivots, and staff-level technical leadership conversations.',                                                                                                                                                                                                                                      domains: ['Data & ML'] },
  { name: 'Yusuf Abdallah',     email: 'yusuf.abdallah@mentor.uw',   role: 'Engineering Manager',    company: 'Shopify',        bio: 'Went from senior engineer to manager in 2020. Specializes in first-time manager preparation, running hard 1:1s, and when to step back from the IC path.',                                                                                                                                                                                                                                domains: ['Engineering'] },
  { name: 'Mariam Farooq',      email: 'mariam.farooq@mentor.uw',    role: 'Senior Product Designer', company: 'Figma',         bio: 'Switched from architecture to product design. Exceptional at portfolio reviews, design interview prep, and finding your narrative without overselling.',                                                                                                                                                                                                                                  domains: ['Design'] },
  { name: 'Hasan Choudhury',    email: 'hasan.choudhury@mentor.uw',  role: 'Startup CTO',            company: 'early-stage',    bio: 'Founded two companies, exited one. Speaks honestly about the emotional tax of founding, when to leave a stable job, and the halal path to co-founder equity.',                                                                                                                                                                                                                           domains: ['Startup'] },
  { name: 'Fatima Khan',        email: 'fatima.khan@mentor.uw',      role: 'Senior UX Researcher',   company: 'Google',         bio: 'Seven years in research, including three at Google. Mentors across breaking into UXR from adjacent fields, research portfolios, and leveling up to senior.',                                                                                                                                                                                                                             domains: ['UX Research'] },
  { name: 'Omar Tariq',         email: 'omar.tariq@mentor.uw',       role: 'Engineering Director',   company: 'Microsoft',      bio: 'Fifteen years in the industry. Has hired hundreds of engineers. Best for mock interviews at senior and staff levels, and navigating difficult conversations about underpaid offers.',                                                                                                                                                                                                       domains: ['Engineering'] },
  { name: 'Noor Hakim, RD',     email: 'noor.hakim@mentor.uw',       role: 'Registered Dietitian',   company: 'Sutter Health',  bio: 'Clinical dietitian with a BS in Nutrition from UC Davis. Particularly strong for students navigating the RD credential: internship applications, personal statement reviews, and exam prep.',                                                                                                                                                                                            domains: ['Healthcare'] },
  { name: 'Yousuf Laymoun',     email: 'yousuf.laymoun@mentor.uw',   role: 'Senior Product Manager', company: 'PlayStation',    bio: 'CS background turned PM, with a decade across Google, Visa, Apple, and Meta Horizon before PlayStation. Best for PMs targeting big tech or gaming, building a technical PM narrative, or navigating data-heavy product roles.',                                                                                                                                                          domains: ['Product', 'Gaming'] },
]

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const sql = neon(process.env.DATABASE_URL)
    await sql`ALTER TABLE mentors ADD COLUMN IF NOT EXISTS bio TEXT`

    for (const m of MENTORS) {
      await sql`
        INSERT INTO mentors (name, email, role, company, bio, domains, status)
        VALUES (${m.name}, ${m.email}, ${m.role}, ${m.company}, ${m.bio}, ${m.domains}, 'active')
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name, role = EXCLUDED.role, company = EXCLUDED.company,
          bio = EXCLUDED.bio, domains = EXCLUDED.domains, status = 'active'
      `
    }
    return res.status(200).json({ ok: true, seeded: MENTORS.map(m => m.name) })
  } catch (err) {
    console.error('[seed-mentors]', err.message)
    return res.status(500).json({ error: err.message })
  }
}
