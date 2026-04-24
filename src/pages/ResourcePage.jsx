import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const docs = import.meta.glob('../content/resources/*.md', { query: '?raw', import: 'default', eager: true })

const slugMap = Object.fromEntries(
  Object.entries(docs).map(([path, content]) => {
    const slug = path.replace('../content/resources/', '').replace('.md', '')
    return [slug, content]
  })
)

const docMeta = {
  'workplace-accommodations': { tag: 'Workplace',   type: 'Guide', readTime: '8 min',  title: 'Your calendar, your prayer time.',                       desc: 'Exact calendar block settings, HR scripts, and a facilities request template. Protect your time before anyone claims it.' },
  'promo-doc-framework':      { tag: 'Moving up',   type: 'Guide', readTime: '7 min',  title: 'The promo doc, by the numbers.',                          desc: 'Four sections, one annotated fill-in template, and a before/after table showing the difference between listing tasks and proving impact.' },
  'salary-negotiation':       { tag: 'Offers',      type: 'Note',  readTime: '5 min',  title: 'What to say after the number.',                           desc: 'Three exact counter-offer email templates for base salary, sign-on, and competing offers. Plus the math for reading total comp.' },
  'cold-outreach':            { tag: 'Breaking in', type: 'Guide', readTime: '6 min',  title: 'Three lines. A real reply.',                              desc: 'Why long emails go unread and exactly how to write the short ones. Three outreach templates, a follow-up, and a profile checklist.' },
  'career-transition':        { tag: 'Longer work', type: 'Guide', readTime: '9 min',  title: 'The pivot, planned out.',                                 desc: 'A six-month sequence for switching industries: skills audit, resume reframe, networking, and what to look for in the interview room.' },
  'behavioral-interviews':    { tag: 'Breaking in', type: 'Guide', readTime: '10 min', title: 'Behavioral interviews, by the numbers.',                  desc: 'A strict STAR time-allocation breakdown, a four-story bank mapped to the top ten questions, and five hard questions to ask at the end.' },
  'manager-one-on-ones':      { tag: 'Moving up',   type: 'Guide', readTime: '8 min',  title: 'Own the 1-on-1.',                                         desc: 'A three-part agenda template, how to escape the status update trap, and exact scripts for receiving critical feedback without reacting defensively.' },
  'project-ethics':           { tag: 'Longer work', type: 'Guide', readTime: '9 min',  title: 'When the project crosses a line.',                        desc: 'A framework for separating an ethical conflict from a personal preference, a reassignment script, and a quiet exit timeline.' },
  'layoffs-severance':        { tag: 'Workplace',   type: 'Guide', readTime: '11 min', title: 'The first 48 hours after a layoff.',                      desc: 'A strict checklist, severance math, COBRA costs, a fill-in LinkedIn announcement template, and exact interview scripts for explaining the gap.' },
  'resignation-protocol':     { tag: 'Workplace',   type: 'Guide', readTime: '8 min',  title: 'How to leave well.',                                      desc: 'The verbal script for your resignation meeting, a legally sound notice email template, a handoff document outline, and farewell message templates.' },
  'performance-reviews':      { tag: 'Moving up',   type: 'Guide', readTime: '10 min', title: 'The self-review that writes your promotion case.',         desc: 'A weekly brag document method, a task-to-impact conversion table, a lessons-learned framework, and a copy-paste format for your manager.' },
  'surviving-pip':            { tag: 'Workplace',   type: 'Guide', readTime: '9 min',  title: 'When the PIP lands.',                                     desc: 'How to read whether a PIP is a genuine development plan or an exit document, how to build a paper trail, and how to negotiate a mutual separation.' },
  'managing-up':              { tag: 'Moving up',   type: 'Guide', readTime: '8 min',  title: 'Manage your manager. Without the sycophancy.',             desc: "How to map what your manager's manager cares about, the no-surprises communication rule, and scripts for pushing back on unrealistic timelines." },
  'first-90-days':            { tag: 'Breaking in', type: 'Guide', readTime: '9 min',  title: 'The first 90 days. Done right.',                          desc: 'A structured listening tour with four standard questions, a framework for securing an early win, and how to set working norms before anyone else does.' },
  'ic-to-manager':            { tag: 'Longer work', type: 'Guide', readTime: '11 min', title: 'The engineer who became a manager.',                       desc: 'Why the skills that made you a great IC will make you a poor manager, a delegation matrix, and a guide to handling your first technical conflict.' },
  'deep-work-blocks':         { tag: 'Workplace',   type: 'Guide', readTime: '8 min',  title: 'Your calendar. Your work.',                               desc: 'A three-week audit method to prove meeting overload with data, three meeting-decline email templates, and a 15-minute Friday ritual.' },
  'executive-presentations':  { tag: 'Moving up',   type: 'Guide', readTime: '7 min',  title: 'Present to executives. Get decisions.',                   desc: 'The BLUF framework for leading with your ask, how to design a deck for interruption, and exact language for questions you cannot answer in the room.' },
  'peer-feedback':            { tag: 'Workplace',   type: 'Guide', readTime: '8 min',  title: 'Feedback that lands.',                                    desc: 'The SBI framework for fact-based criticism, rules for code reviews and retrospectives, and scripts for addressing microaggressions.' },
  'team-rituals':             { tag: 'Workplace',   type: 'Guide', readTime: '9 min',  title: 'Build the team. Include everyone.',                       desc: 'Alternatives to bar-centric team events, a Ramadan communication template for offsites, and how to structure retrospectives so junior engineers speak up.' },
  'finding-mentors':          { tag: 'Longer work', type: 'Guide', readTime: '10 min', title: 'Your board of directors.',                                desc: 'Why formal mentorship requests fail, the four professional roles every career needs, and the exact follow-up email that keeps advisors engaged.' },
  'only-muslim-in-the-room':  { tag: 'Longer work', type: 'Essay', readTime: '12 min', title: 'The only Muslim in the room.',                            desc: 'On navigating professional spaces where your faith and background mark you as different. A guide for Muslim professionals in majority non-Muslim workplaces.' },
}

const backArrow = (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
)

const monoNav = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}

export default function ResourcePage() {
  const { slug } = useParams()
  const content = slugMap[slug]
  const meta = docMeta[slug] || {}

  if (!content) {
    return (
      <div style={{ maxWidth: 720, margin: '80px auto', padding: '0 32px', fontFamily: "'Fraunces', serif" }}>
        <p style={{ color: 'var(--muted)' }}>Resource not found.</p>
        <Link to="/hub" style={{ color: 'var(--accent)', fontSize: 14 }}>Back to Hub</Link>
      </div>
    )
  }

  const pageTitle = meta.title ? `${meta.title} | UmmahWorks` : 'UmmahWorks'
  const pageDesc = meta.desc || 'A free career resource for Muslim professionals in tech.'
  const canonical = `https://ummahworks.org/resources/${slug}`
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title || slug,
    description: pageDesc,
    author: { '@type': 'Organization', name: 'UmmahWorks', url: 'https://ummahworks.org' },
    publisher: { '@type': 'Organization', name: 'UmmahWorks', url: 'https://ummahworks.org' },
    url: canonical,
    dateModified: '2026-04-20',
  })

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{articleSchema}</script>
      </Helmet>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '44px 32px 88px' }} className="mobile-px">

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, flexWrap: 'wrap', gap: 12 }}>
          <Link to="/hub" style={monoNav}>{backArrow} Hub</Link>
          {meta.tag && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-2)',
                background: 'rgba(197,139,61,.08)',
                border: '1px solid rgba(197,139,61,.28)',
                borderRadius: 2,
                padding: '3px 9px',
              }}>{meta.tag}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9.5,
                letterSpacing: '.15em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>/ {meta.type} · {meta.readTime}</span>
            </div>
          )}
        </div>

        {/* Article */}
        <article className="prose-resource">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>

        {/* Footer */}
        <div style={{ marginTop: 72, paddingTop: 24, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link to="/hub" style={monoNav}>{backArrow} Back to Hub</Link>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 13, fontStyle: 'italic', color: 'var(--muted)' }}>
            UmmahWorks · Free resource
          </span>
        </div>

      </div>
    </div>
  )
}
