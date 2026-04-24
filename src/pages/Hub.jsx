import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const streams = [
  { n: '/ 01', h: <>Breaking <em className="text-accent">in</em></>, p: 'For your first job, first switch, or first internship. Read honest guides on cold outreach, portfolios, and what recruiters look for.', tag: 'Entry · Switch', searchTag: 'Breaking in' },
  { n: '/ 02', h: <>Moving <em className="text-accent">up</em></>, p: 'Promotion documents, staff narratives, and the quiet politics of leveling. Honest, real-world examples of what good senior work looks like and how to showcase yours.', tag: 'Mid · Senior', searchTag: 'Moving up' },
  { n: '/ 03', h: <>Offers &amp; <em className="text-accent">negotiation</em></>, p: 'Numbers, halal considerations, exactly what to say. Contributed by mentors who hire. Read these before you sign anything.', tag: 'All levels', searchTag: 'Offers' },
  { n: '/ 04', h: <>On the <em className="text-accent">job</em></>, p: 'Prayer accommodations, layoffs, PIPs, resignations, and the daily friction of the workplace itself. Practical guides for the situations no one prepares you for.', tag: 'Day to day', searchTag: 'Workplace' },
  { n: '/ 05', h: <>The <em className="text-accent">longer work</em></>, p: 'Career arcs, leaving, leading, founding. Essays that will not help you tomorrow but might shape your next ten years.', tag: 'Reflective', searchTag: 'Longer work' },
]

const notes = [
  { type: '/ Guide · 8 min', tag: 'Workplace', title: 'Your calendar, your prayer time.', h: <>Your calendar, <em className="text-accent">your prayer time.</em></>, p: 'Exact calendar block settings, HR scripts, and a facilities request template. Protect your time before anyone claims it.', slug: 'workplace-accommodations' },
  { type: '/ Guide · 7 min', tag: 'Moving up', title: 'The promo doc, by the numbers.', h: <>The promo doc, <em className="text-accent">by the numbers.</em></>, p: 'Four sections, one annotated fill-in template, and a before/after table showing the difference between listing tasks and proving impact.', slug: 'promo-doc-framework' },
  { type: '/ Note · 5 min', tag: 'Offers', title: 'What to say after the number.', h: <>What to say <em className="text-accent">after the number.</em></>, p: 'Three exact counter-offer email templates for base salary, sign-on, and competing offers. Plus the math for reading total comp.', slug: 'salary-negotiation' },
  { type: '/ Guide · 6 min', tag: 'Breaking in', title: 'Three lines. A real reply.', h: <>Three lines. <em className="text-accent">A real reply.</em></>, p: 'Why long emails go unread and exactly how to write the short ones. Three outreach templates, a follow-up, and a profile checklist.', slug: 'cold-outreach' },
  { type: '/ Guide · 9 min', tag: 'Longer work', title: 'The pivot, planned out.', h: <>The pivot, <em className="text-accent">planned out.</em></>, p: 'A six-month sequence for switching industries: skills audit, resume reframe, networking, and what to look for in the interview room.', slug: 'career-transition' },
  { type: '/ Guide · 10 min', tag: 'Breaking in', title: 'Behavioral interviews, by the numbers.', h: <>Behavioral interviews, <em className="text-accent">by the numbers.</em></>, p: 'A strict STAR time-allocation breakdown, a four-story bank mapped to the top ten questions, and five hard questions to ask at the end of the interview.', slug: 'behavioral-interviews' },
  { type: '/ Guide · 8 min', tag: 'Moving up', title: 'Own the 1-on-1.', h: <>Own the <em className="text-accent">1-on-1.</em></>, p: 'A three-part agenda template, how to escape the status update trap, and exact scripts for receiving critical feedback without reacting defensively.', slug: 'manager-one-on-ones' },
  { type: '/ Guide · 9 min', tag: 'Longer work', title: 'When the project crosses a line.', h: <>When the project <em className="text-accent">crosses a line.</em></>, p: 'A framework for telling apart an ethical conflict from a personal preference, a reassignment script that protects your capital, and a quiet exit timeline.', slug: 'project-ethics' },
  { type: '/ Guide · 11 min', tag: 'Workplace', title: 'The first 48 hours after a layoff.', h: <>The first 48 hours <em className="text-accent">after a layoff.</em></>, p: 'A strict checklist, severance math, COBRA costs, a fill-in LinkedIn announcement template, and exact interview scripts for explaining the gap.', slug: 'layoffs-severance' },
  { type: '/ Guide · 8 min', tag: 'Workplace', title: 'How to leave well.', h: <>How to leave <em className="text-accent">well.</em></>, p: 'The verbal script for your resignation meeting, a legally sound notice email template, a handoff document table of contents, and two farewell message templates.', slug: 'resignation-protocol' },
  { type: '/ Guide · 10 min', tag: 'Moving up', title: 'The self-review that writes your promotion case.', h: <>The self-review that <em className="text-accent">writes your promotion case.</em></>, p: 'A weekly brag document method, a task-to-impact conversion table, a lessons-learned framework for failed projects, and a copy-paste-ready format for your manager.', slug: 'performance-reviews' },
  { type: '/ Guide · 9 min', tag: 'Workplace', title: 'When the PIP lands.', h: <>When the PIP <em className="text-accent">lands.</em></>, p: 'How to read whether a PIP is a genuine development plan or an exit document, how to build a paper trail from day one, and how to negotiate a mutual separation instead.', slug: 'surviving-pip' },
  { type: '/ Guide · 8 min', tag: 'Moving up', title: 'Manage your manager. Without the sycophancy.', h: <>Manage your manager. <em className="text-accent">Without the sycophancy.</em></>, p: 'How to map what your manager\'s manager cares about, the no-surprises communication rule, and exact scripts for pushing back on unrealistic timelines.', slug: 'managing-up' },
  { type: '/ Guide · 9 min', tag: 'Breaking in', title: 'The first 90 days. Done right.', h: <>The first 90 days. <em className="text-accent">Done right.</em></>, p: 'A structured listening tour with four standard questions, a framework for securing an early win, and how to set your working norms before anyone sets them for you.', slug: 'first-90-days' },
  { type: '/ Guide · 11 min', tag: 'Longer work', title: 'The engineer who became a manager.', h: <>The engineer who became <em className="text-accent">a manager.</em></>, p: 'Why the skills that made you a great IC will make you a poor manager, a delegation matrix, and a step-by-step guide to handling your first technical conflict.', slug: 'ic-to-manager' },
  { type: '/ Guide · 8 min', tag: 'Workplace', title: 'Your calendar. Your work.', h: <>Your calendar. <em className="text-accent">Your work.</em></>, p: 'A three-week audit method to prove meeting overload with data, three meeting-decline email templates, and a 15-minute Friday ritual that closes the week cleanly.', slug: 'deep-work-blocks' },
  { type: '/ Guide · 7 min', tag: 'Moving up', title: 'Present to executives. Get decisions.', h: <>Present to executives. <em className="text-accent">Get decisions.</em></>, p: 'The BLUF framework for leading with your ask, how to design a deck for interruption, and exact language for handling questions you cannot answer in the room.', slug: 'executive-presentations' },
  { type: '/ Guide · 8 min', tag: 'Workplace', title: 'Feedback that lands.', h: <>Feedback that <em className="text-accent">lands.</em></>, p: 'The SBI framework for fact-based criticism, rules for code reviews and retrospectives, and scripts for addressing microaggressions and defusing defensive reactions.', slug: 'peer-feedback' },
  { type: '/ Guide · 9 min', tag: 'Workplace', title: 'Build the team. Include everyone.', h: <>Build the team. <em className="text-accent">Include everyone.</em></>, p: 'Alternatives to bar-centric team events, a Ramadan communication template for offsites, and how to structure retrospectives so junior engineers actually speak up.', slug: 'team-rituals' },
  { type: '/ Guide · 10 min', tag: 'Longer work', title: 'Your board of directors.', h: <>Your board of <em className="text-accent">directors.</em></>, p: 'Why formal mentorship requests fail, the four professional roles every career needs, a structured agenda template, and the exact follow-up email that keeps advisors engaged.', slug: 'finding-mentors' },
]

const templates = [
  { n: '/ 01', nm: 'The Monogram', tg: 'Senior IC, Staff', href: '/templates/tech-ic.html' },
  { n: '/ 02', nm: 'The Blueprint', tg: 'PM, TPM, Director', href: '/templates/pm-tpm.html' },
  { n: '/ 03', nm: 'The Botanic', tg: 'Early career · career switchers', href: '/templates/early-career.html' },
  { n: '/ 04', nm: 'The Ledger', tg: 'Finance, strategy, operations', href: '/templates/ledger.html' },
  { n: '/ 05', nm: 'The Signal', tg: 'Data science, ML engineering', href: '/templates/signal.html' },
  { n: '/ 06', nm: 'The Broadsheet', tg: 'Directors, VPs, executives', href: '/templates/broadsheet.html' },
  { n: '/ 07', nm: 'The Studio', tg: 'Product design, UX, creative', href: '/templates/studio.html' },
  { n: '/ 08', nm: 'The Quarterly', tg: 'Product management, growth', href: '/templates/quarterly.html' },
  { n: '/ 09', nm: 'The Grid', tg: 'Engineers, all levels', href: '/templates/grid.html' },
  { n: '/ 10', nm: 'The Correspondent', tg: 'Marketing, comms, content', href: '/templates/correspondent.html' },
]

export default function Hub() {
  const [query, setQuery] = useState('')
  const [featuredHover, setFeaturedHover] = useState(false)

  const q = query.trim().toLowerCase()
  const filteredNotes = q
    ? notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q) ||
        n.p.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q)
      )
    : []

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Helmet>
        <title>Resource Hub | UmmahWorks</title>
        <meta name="description" content="20+ free career guides for Muslim professionals in tech. Covering breaking in, promotions, negotiations, workplace topics, and more." />
        <link rel="canonical" href="https://ummahworks.org/hub" />
        <meta property="og:title" content="Resource Hub | UmmahWorks" />
        <meta property="og:description" content="20+ free career guides for Muslim professionals in tech. Covering breaking in, promotions, negotiations, workplace topics, and more." />
        <meta property="og:url" content="https://ummahworks.org/hub" />
      </Helmet>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 48px 44px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 56, alignItems: 'end' }} className="max-md:block mobile-px">
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 30, height: 1, background: 'var(--accent-2)', display: 'block' }} />
            Resources · Free library · Updated weekly
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(44px,6vw,66px)', lineHeight: 1.02, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 22, maxWidth: '17ch', textWrap: 'balance' }}>
            The playbook for <em className="text-accent">advancement.</em>
          </h1>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '60ch' }}>
            A deliberate collection of guides and insights from industry veterans. Focus purely on the practical leverage you need to break in and level up. Built by our mentors to scale the candid conversations we have behind closed doors.
          </p>
        </div>
        <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Find what you need</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', border: '1px solid var(--rule)', borderRadius: 2, background: 'var(--paper)' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" style={{ color: 'var(--muted)', flexShrink: 0 }} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"/></svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., first senior interview, imposter syndrome..."
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: "'Fraunces', serif", fontSize: 16, color: 'var(--ink)', fontStyle: 'italic' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                aria-label="Clear search"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <div className="font-instrument italic text-[13px] text-muted">{notes.length} guides · reading time indicated · freely available to all.</div>
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {q && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 52px' }} className="mobile-px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, letterSpacing: '-.018em' }}>
              {filteredNotes.length > 0
                ? <>Results for <em className="text-accent">"{query}"</em></>
                : <>No results for <em className="text-accent">"{query}"</em></>}
            </h2>
            {filteredNotes.length > 0 && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {filteredNotes.length} {filteredNotes.length === 1 ? 'guide' : 'guides'}
              </span>
            )}
          </div>
          {filteredNotes.length === 0 ? (
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', color: 'var(--ink-2)', fontSize: 16 }}>
              Try a different keyword. Browse by career stage below.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {filteredNotes.map(({ type, tag, h, p, slug }) => (
                <Link to={`/resources/${slug}`} key={slug} className="card-slide" style={{ padding: '18px 18px 16px', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, color: 'inherit', display: 'block', textDecoration: 'none' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span>{type}</span><span>{tag}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, letterSpacing: '-.01em', lineHeight: 1.25, marginBottom: 4, color: 'var(--ink)' }}>{h}</h4>
                  <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>{p}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* STREAMS */}
      {!q && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 12px' }} className="mobile-px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, letterSpacing: '-.018em' }}>
              Browse by <em className="text-accent">your career stage.</em>
            </h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>5 categories · {notes.length} guides</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 52 }} className="max-md:grid-cols-2">
            {streams.map(({ n, h, p, tag, searchTag }) => {
              const streamCount = notes.filter(note => note.tag === searchTag).length
              return (
              <button type="button" key={n} className="card-lift" onClick={() => { setQuery(searchTag); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '22px 22px 20px', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-2)' }}>{n}</span>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 20, letterSpacing: '-.01em' }}>{h}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)', flex: 1 }}>{p}</p>
                <div style={{ paddingTop: 12, borderTop: '1px dotted var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  <b style={{ color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '.04em', textTransform: 'none', fontSize: 12.5 }}>{streamCount} {streamCount === 1 ? 'guide' : 'guides'}</b>
                  <span>{tag}</span>
                </div>
              </button>
            )})}
          </div>
        </section>
      )}

      {/* TEMPLATES CTA */}
      {!q && (
        <section style={{ maxWidth: 1200, margin: '0 auto 56px', padding: '36px 48px', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2 }} className="mobile-px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 8, textWrap: 'balance', color: 'var(--ink)' }}>
                Ten <em className="text-accent">resume templates,</em> free to use.
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                Designed for Muslim professionals. Edit in the browser, print as PDF, and use instantly.
              </p>
            </div>
            <a href="/templates-index.html" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--accent)', whiteSpace: 'nowrap', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
              Browse gallery <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {templates.map(({ n, nm, tg, href }) => (
              <a key={nm} href={href} target="_blank" rel="noopener noreferrer" className="card-lift" style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '14px 14px 12px', borderRadius: 2, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-2)', marginBottom: 6 }}>{n}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 500, letterSpacing: '-.005em', lineHeight: 1.2, marginBottom: 4, color: 'var(--ink)' }}>{nm}</div>
                <div className="font-instrument italic text-[12px] text-muted">{tg}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED READING */}
      {!q && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 48px 60px' }} className="mobile-px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, letterSpacing: '-.018em' }}>
              This week's <em className="text-accent">reading.</em>
            </h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>Curated · 18 Apr 2026</span>
          </div>

          {/* Featured essay */}
          <a href="/resources/only-muslim-in-the-room" onMouseEnter={() => setFeaturedHover(true)} onMouseLeave={() => setFeaturedHover(false)} style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: 2, padding: '40px 40px 34px', position: 'relative', overflow: 'hidden', marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'end', textDecoration: 'none', border: featuredHover ? '1px solid var(--accent)' : '1px solid transparent', transform: featuredHover ? 'translateY(-2px)' : 'none', transition: 'border-color .12s, transform .12s' }} className="max-md:block">
            <div style={{ position: 'absolute', top: -40, right: -40, width: 280, height: 280, background: 'radial-gradient(circle, rgba(197,139,61,.18), transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-2)', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 20, height: 1, background: 'var(--accent-2)', display: 'block' }} />
                Featured essay · 12 min read
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 14, maxWidth: '28ch', textWrap: 'balance' }}>
                On <em className="text-accent-2">being the only Muslim</em> in the room, and staying anyway.
              </h3>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 15.5, lineHeight: 1.6, color: 'rgba(251,248,241,.72)', maxWidth: '64ch' }}>
                A long essay by one of our staff engineers about the first five years at a big company, prayer spaces that did not exist, meetings that ran through Jummah, and the firm boundaries that made the work sustainable. Written for the engineer who is wondering whether they should leave.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14, flexShrink: 0 }} className="max-md:mt-5 max-md:items-start">
              <span className="font-instrument italic text-[14.5px] text-paper-cream/[.85]">
                by <b style={{ fontStyle: 'normal', fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'var(--cream)' }}>Dr. Ayesha Rahman,</b> Principal Engineer
              </span>
              <span style={{ color: 'var(--accent-2)', fontSize: 13, fontWeight: 500, display: 'inline-flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                Read the essay <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </span>
            </div>
          </a>

          {/* Article grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="max-md:grid-cols-2 max-sm:grid-cols-1">
            {notes.map(({ type, tag, h, p, slug }) => (
              <Link to={`/resources/${slug}`} key={slug} className="card-slide" style={{ padding: '20px 20px 18px', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, color: 'inherit', display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span>{type}</span><span>{tag}</span>
                </div>
                <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 17, letterSpacing: '-.01em', lineHeight: 1.25, color: 'var(--ink)' }}>{h}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.58, color: 'var(--ink-2)', flex: 1 }}>{p}</p>
                <div style={{ paddingTop: 10, borderTop: '1px dotted var(--rule)', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)', fontSize: 12, fontWeight: 500 }}>
                  Read <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CLOSING */}
      {!q && (
        <section style={{ maxWidth: 1200, margin: '0 auto 60px', padding: '0 48px' }} className="mobile-px">
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, lineHeight: 1.45, maxWidth: '58ch', color: 'var(--ink)', paddingLeft: 22, borderLeft: '2px solid var(--accent-2)', textWrap: 'pretty' }}>
            <em className="text-accent">The written network.</em>{' '}
            A small collection of guides and notes from industry veterans, focusing entirely on the practical, proven steps you need to build your career.
          </div>
          <div style={{ marginTop: 14, marginLeft: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>UmmahWorks editorial · 2026</div>
        </section>
      )}
    </div>
  )
}
