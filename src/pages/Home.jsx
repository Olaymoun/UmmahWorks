import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const S = {
  page: { background: 'var(--paper)', color: 'var(--ink)' },
  hero: {
    maxWidth: 1280, margin: '0 auto', padding: '72px 48px 80px',
    display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'start',
    position: 'relative',
  },
  kicker: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.28em',
    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 28,
  },
  moon: {
    width: 14, height: 14, borderRadius: '50%',
    flexShrink: 0,
    background: 'radial-gradient(circle at 70% 35%, #f6f3ec 0 29%, #c58b3d 36%)',
  },
  h1: {
    fontFamily: "'Fraunces', serif", fontWeight: 500,
    fontSize: 'clamp(52px,7vw,76px)', lineHeight: 1.02, letterSpacing: '-.03em',
    color: 'var(--ink)', marginBottom: 24, maxWidth: '14ch', textWrap: 'balance',
  },
  hadith: {
    fontSize: 19, lineHeight: 1.5, color: 'var(--ink-2)',
    maxWidth: '52ch', marginBottom: 18,
    paddingLeft: 20, borderLeft: '2px solid var(--accent-2)',
  },
  lede: {
    fontFamily: "'Fraunces', serif", fontSize: 20, lineHeight: 1.55,
    color: 'var(--ink-2)', fontWeight: 400, maxWidth: '52ch', marginBottom: 32,
  },
  ctaRow: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 42 },
  btnDark: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 22px', borderRadius: 2,
    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', background: 'var(--ink)', color: 'var(--cream)',
    transition: 'background .15s',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 22px', borderRadius: 2,
    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', background: 'transparent', color: 'var(--ink)',
    border: '1px solid var(--ink)', transition: 'background .15s, color .15s',
  },
  trust: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
  },
  trustCell: {
    padding: '22px 28px', borderRight: '1px solid var(--rule)',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  trustNum: {
    fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22,
    color: 'var(--ink)', letterSpacing: '-.01em',
  },
  trustLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.14em',
    textTransform: 'uppercase', color: 'var(--muted)',
  },
  visualFrame: {
    padding: '32px 32px 28px', background: 'var(--cream)',
    border: '1px solid var(--rule)', borderRadius: 2,
    boxShadow: '0 30px 60px -30px rgba(17,19,15,.2)', position: 'relative',
  },
  visualLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.28em',
    textTransform: 'uppercase', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  sessionTitle: {
    fontFamily: "'Fraunces', serif", fontWeight: 500,
    fontSize: 24, lineHeight: 1.15, letterSpacing: '-.015em',
    color: 'var(--ink)', marginBottom: 10,
  },
  sessionDate: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
  },
  sessionDesc: { fontSize: 13, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 16 },
  avatarStack: {
    display: 'flex', alignItems: 'center', marginBottom: 14,
    paddingTop: 16, borderTop: '1px solid var(--rule)',
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%', marginLeft: -8,
    background: 'linear-gradient(145deg, #c58b3d, #8f5d26)',
    border: '2px solid var(--cream)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'var(--cream)',
    fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 13,
  },
  mentorText: {
    marginLeft: 14, fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.45,
  },
}

export default function Home() {
  const [mentorCount, setMentorCount] = useState(null)

  useEffect(() => {
    fetch('/api/mentors')
      .then(r => r.json())
      .then(data => { if (data.count >= 0) setMentorCount(data.count) })
      .catch(() => {})
  }, [])

  return (
    <div style={S.page}>
      <Helmet>
        <title>UmmahWorks | Career guidance for Muslim professionals</title>
        <meta name="description" content="Free career resources, mentorship, and one-on-one coaching for Muslim professionals in tech. Built by industry veterans." />
        <link rel="canonical" href="https://ummahworks.org" />
        <meta property="og:title" content="UmmahWorks | Career guidance for Muslim professionals" />
        <meta property="og:description" content="Free career resources, mentorship, and one-on-one coaching for Muslim professionals in tech. Built by industry veterans." />
        <meta property="og:url" content="https://ummahworks.org" />
      </Helmet>
      <section style={S.hero} className="home-hero-grid">
        {/* left rule line */}
        <div style={{ position: 'absolute', top: 40, left: 48, right: 48, height: 1, background: 'linear-gradient(to right, var(--rule), transparent 60%)' }} />

        <div>
          <div style={S.kicker} className="home-kicker">
            <span style={S.moon} />
            <span>The generation that made it, investing in the one that follows.</span>
          </div>

          <h1 style={S.h1}>
            Elevating the Ummah,{' '}
            <em className="text-accent">
              one career at a time.
            </em>
          </h1>

          <blockquote style={S.hadith} className="font-instrument italic">
            Whoever guides to good is like the one who does it.
            <span style={{ display: 'block', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', fontStyle: 'normal' }}>
              Prophetic tradition · Sahih Muslim
            </span>
          </blockquote>

          <p style={S.lede}>
            Career guidance, mentorship, and one-on-one coaching for Muslim professionals. Built by industry veterans committed to pulling the next generation forward.
          </p>

          <div style={S.ctaRow}>
            <Link to="/mentorship" style={S.btnDark}>
              Find a mentor
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <Link to="/coaching" style={S.btnOutline}>Book a coaching session</Link>
          </div>

          <div style={S.trust} className="home-trust-grid">
            <div style={S.trustCell}>
              <b style={S.trustNum}>{mentorCount ?? '—'}</b>
              <span style={S.trustLabel}>active mentors in our network</span>
            </div>
            <div style={S.trustCell}>
              <b style={S.trustNum}>1 : 1</b>
              <span style={S.trustLabel}>private & confidential</span>
            </div>
            <div style={{ ...S.trustCell, borderRight: 'none' }}>
              <b style={S.trustNum}>Since <em className="text-accent">2023</em></b>
              <span style={S.trustLabel}>volunteer-run, non-profit</span>
            </div>
          </div>
        </div>

        <aside style={{ paddingTop: 20 }}>
          <div style={S.visualFrame}>
            <div style={S.visualLabel}>
              <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'block' }} />
              This week at UmmahWorks
            </div>
            <div style={S.sessionTitle}>
              Office hours with{' '}
              <em className="text-accent">
                Dr. Ayesha Rahman,
              </em>{' '}
              Principal Engineer at Stripe.
            </div>
            <div style={S.sessionDate}>Saturday · 18 Apr · 11:00 PT</div>
            <p style={S.sessionDesc}>Open-format career Q&A for mid-level engineers. Bring your resume, concerns, and questions. No booking is required.</p>
            <div style={S.avatarStack}>
              {[['A', 'linear-gradient(145deg,#c58b3d,#8f5d26)'], ['K', 'linear-gradient(145deg,#0b5d3b,#1a7650)'], ['S', 'linear-gradient(145deg,#6d5a3e,#8f7850)']].map(([letter, bg], i) => (
                <span key={letter} style={{ ...S.avatar, marginLeft: i === 0 ? 0 : -8, background: bg }}>{letter}</span>
              ))}
              <span style={{ ...S.avatar, marginLeft: -8, background: 'var(--cream)', color: 'var(--accent)', border: '2px solid var(--rule)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.08em' }}>+25</span>
              <span style={S.mentorText} className="font-instrument italic">
                Join <b style={{ fontStyle: 'normal', fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'var(--ink)' }}>Ayesha, Khalid, Sumaya</b><br />along with 25 other professionals.
              </span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
