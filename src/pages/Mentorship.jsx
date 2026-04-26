import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Kicker from '../components/Kicker'
import DarkCard from '../components/DarkCard'
import FormSuccess from '../components/FormSuccess'
import SubmitButton from '../components/SubmitButton'
import { TextField, TextareaField } from '../components/FormField'
import { FORM_ERROR } from '../lib/utils'

const CARD_GRADS = [
  'linear-gradient(145deg,#0b5d3b,#1a7650)',
  'linear-gradient(145deg,#c58b3d,#8f5d26)',
  'linear-gradient(145deg,#6d5a3e,#8f7850)',
  'linear-gradient(145deg,#2e5c3e,#1a4028)',
  'linear-gradient(145deg,#5a3e6d,#3d2a4f)',
  'linear-gradient(145deg,#3a4f2e,#1d2b17)',
  'linear-gradient(145deg,#7a3c1f,#5a2712)',
  'linear-gradient(145deg,#1e3a5f,#0f2140)',
  'linear-gradient(145deg,#9c6a2e,#6d4a1e)',
  'linear-gradient(145deg,#2e6d5f,#1a4a3e)',
]

const principles = [
  { n: '/ 01', h: 'Twenty minutes, on your time', p: 'Our mentors volunteer what time they can spare. We believe a single, focused conversation can change a career trajectory, so we never ask for long commitments.' },
  { n: '/ 02', h: 'Match, do not match-make', p: 'We personally handle the logistics of finding the right person. There are no complicated dashboards or rating systems to manage, allowing you to focus purely on the conversation.' },
  { n: '/ 03', h: 'Off the record', p: 'We know that career conversations require vulnerability and trust. Everything discussed remains strictly confidential between you and the person you are speaking with.' },
  { n: '/ 04', h: 'No hierarchy of care', p: 'Every community member receives the same level of thoughtfulness, whether they are an intern looking for their first role or a staff engineer navigating a complex offer.' },
]

const asks = [
  ['Twenty minutes, once a month.', 'We will send you a matched request. All you need to do is show up and share your honest advice. There is no need to prepare materials or follow a structured curriculum.'],
  ['You pick your lane.', 'Let us know the areas you are most comfortable discussing. We carefully filter requests so you only speak to topics that fit your unique background and expertise.'],
  ['No ongoing obligation.', 'Each session is designed to be a single, complete conversation. You are always welcome to continue the relationship if you feel a connection, but there is absolutely no pressure to commit to ongoing mentorship.'],
  ['Everything stays off the record.', 'We deeply value your privacy. The guidance you share in your session remains entirely confidential, and we never share your name without your explicit permission.'],
]

function MentorCard({ init, grad, name, role, co, bio, tags }) {
  return (
    <article className="bg-paper-cream border border-rule rounded-sm flex flex-col" style={{ padding: '28px 26px 24px' }}>
      <div className="flex gap-4 items-start mb-[18px] pb-[18px] border-b border-rule">
        <div
          className="shrink-0 rounded-full flex items-center justify-center font-serif font-medium text-paper-cream"
          style={{ width: 64, height: 64, background: grad, border: '2px solid var(--cream)', boxShadow: '0 0 0 1px var(--rule)', fontSize: 26, letterSpacing: '-.02em' }}
        >
          {init}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-medium text-[18px] tracking-[-0.01em] leading-[1.2] text-ink mb-1">{name}</div>
          <div className="font-instrument italic text-[13.5px] text-accent leading-[1.35]">
            {role} <span className="not-italic font-sans text-[12px] font-medium text-ink-2">· {co}</span>
          </div>
        </div>
      </div>
      <p className="text-[13.5px] leading-[1.6] text-ink-2 flex-1 mb-4">{bio}</p>
      <div className="flex flex-wrap gap-[6px] pt-[14px] border-t border-dashed border-rule">
        {tags.map(t => (
          <span key={t} className="font-mono text-[9.5px] tracking-[.1em] uppercase text-muted px-2 py-[3px] border border-rule rounded-full bg-paper whitespace-nowrap">{t}</span>
        ))}
      </div>
    </article>
  )
}

function MentorApplicationForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: '', company: '', linkedin: '', topics: '' })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/mentor-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.ok) setSent(true)
      else setError(FORM_ERROR)
    } catch {
      setError(FORM_ERROR)
    } finally {
      setLoading(false)
    }
  }

  if (sent) return <FormSuccess title="Application received. JazakAllah Khayran." subtitle="We will be in touch within three working days, inshaAllah." />

  return (
    <form onSubmit={handleSubmit}>
      <TextField id="mentor-name" label="Your name" required value={form.name} onChange={set('name')} placeholder="Yousuf L." />
      <TextField id="mentor-email" label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <TextField id="mentor-role" label="Current role" required value={form.role} onChange={set('role')} placeholder="Senior PM, Staff Engineer..." />
      <TextField id="mentor-company" label="Company" required value={form.company} onChange={set('company')} placeholder="PlayStation, Google..." />
      <TextField id="mentor-linkedin" label="LinkedIn URL" type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/yourname" />
      <TextareaField id="mentor-topics" label="What can you help with?" required mb={18} value={form.topics} onChange={set('topics')} placeholder="Promos, offer negotiation, PM interviews... Speak plainly." />
      {error && <p className="mb-3 text-[13px] text-red-400 text-center">{error}</p>}
      <SubmitButton loading={loading}>Apply to mentor</SubmitButton>
      <p className="mt-[14px] text-center font-instrument italic text-[13.5px] text-paper-cream/[.55]">We reply to every application, inshaAllah.</p>
    </form>
  )
}

export default function Mentorship() {
  const [mentors, setMentors] = useState([])
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mentors')
      .then(r => r.json())
      .then(data => {
        if (data.mentors?.length) setMentors(data.mentors)
        if (data.domains?.length) setDomains(data.domains)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayMentors = mentors.map((m, i) => ({
    init: m.name?.charAt(0) || '?',
    grad: CARD_GRADS[i % CARD_GRADS.length],
    name: m.name,
    role: m.role,
    co: m.company,
    bio: m.bio || m.topics,
    tags: m.domains || [],
  }))

  return (
    <div className="bg-paper text-ink">
      <Helmet>
        <title>Find a Mentor | UmmahWorks</title>
        <meta name="description" content="Get matched with a Muslim professional in your field for a free, confidential 20-minute career conversation. No dashboards. No pressure." />
        <link rel="canonical" href="https://ummahworks.org/mentorship" />
        <meta property="og:title" content="Find a Mentor | UmmahWorks" />
        <meta property="og:description" content="Get matched with a Muslim professional in your field for a free, confidential 20-minute career conversation. No dashboards. No pressure." />
        <meta property="og:url" content="https://ummahworks.org/mentorship" />
      </Helmet>

      {/* HERO */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px 40px', borderBottom: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 60, alignItems: 'end' }}
      >
        <div>
          <Kicker withLine color="var(--muted)">For Senior Professionals · Volunteer Council</Kicker>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(40px,6vw,64px)', lineHeight: 1.02, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 20, maxWidth: '14ch', textWrap: 'balance' }}>
            You built your career. <em className="text-accent">Now help build the community.</em>
          </h1>
          <blockquote className="font-instrument italic" style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: '52ch', marginBottom: 18, paddingLeft: 20, borderLeft: '2px solid var(--accent-2)' }}>
            Whoever guides someone to goodness will have a reward like one who did it.
            <span className="block mt-[6px] font-mono text-[10px] tracking-[.16em] uppercase text-muted not-italic">
              Prophetic tradition · Sahih Muslim
            </span>
          </blockquote>
        </div>
        <div className="bg-paper-cream border border-rule rounded-sm text-[13px] text-ink-2 leading-[1.6]" style={{ padding: '22px 24px' }}>
          <div className="flex justify-between items-start gap-[14px] py-2 border-b border-dashed border-rule">
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-muted whitespace-nowrap pt-[3px]">Domains covered</span>
            <div className="flex flex-wrap gap-[5px] justify-end">
              {domains.map(d => (
                <span key={d} className="font-mono text-[9px] tracking-[.1em] uppercase text-muted px-[7px] py-[3px] border border-rule rounded-full bg-paper whitespace-nowrap">{d}</span>
              ))}
            </div>
          </div>
          {[['Active mentors', mentors.length], ['Status', 'Accepting mentors']].map(([k, v]) => (
            <div key={k} className="flex justify-between items-baseline gap-[14px] py-2 border-b border-dashed border-rule">
              <span className="font-mono text-[10px] tracking-[.14em] uppercase text-muted whitespace-nowrap">{k}</span>
              <span className="font-serif text-[14px] text-ink font-medium">{v}</span>
            </div>
          ))}
          <p className="mt-3 font-instrument italic text-[13px] text-ink-2 leading-[1.5]">
            Your domain isn't listed?{' '}
            <span className="not-italic font-sans text-[12px] font-semibold text-ink">This is your sign to volunteer.</span>
          </p>
        </div>
      </section>

      {/* WHAT WE ASK */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 56, alignItems: 'start' }}
      >
        <div>
          <Kicker>/ What we ask</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 16, textWrap: 'balance' }}>
            Small ask. <em className="text-accent">Real impact.</em>
          </h2>
          <p className="text-[14.5px] leading-[1.65] text-ink-2">
            We match you with one person at a time, based on what they need and what you know. You show up, speak plainly, and go back to your day.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[2px] border border-rule rounded-sm" style={{ background: 'var(--rule)' }}>
          {asks.map(([title, body], i) => (
            <div key={i} className="bg-paper-cream" style={{ padding: '28px 28px 26px' }}>
              <Kicker color="var(--accent-2)">/ 0{i + 1}</Kicker>
              <h3 className="font-serif font-medium text-[17px] tracking-[-0.01em] text-ink mb-2">{title}</h3>
              <p className="text-[13.5px] leading-[1.6] text-ink-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE COUNCIL */}
      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px', borderTop: '1px solid var(--rule)' }}>
        <div className="mb-8">
          <Kicker>/ The current council</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Your peers are <em className="text-accent">already here.</em>
          </h2>
        </div>
        {loading ? (
          <p className="text-[14px] text-muted py-6">Loading mentors...</p>
        ) : displayMentors.length === 0 ? (
          <p className="text-[14px] text-muted py-6">No mentors yet. Be the first to join the council.</p>
        ) : (
          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
            {displayMentors.map((m) => (
              <MentorCard key={m.name} {...m} />
            ))}
          </div>
        )}
      </section>

      {/* PRINCIPLES */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 20px', borderTop: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: '1fr 2.4fr', gap: 48, alignItems: 'start' }}
      >
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 32, letterSpacing: '-.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
          How we <em className="text-accent">run this,</em> and why.
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {principles.map(({ n, h, p }) => (
            <div key={n}>
              <Kicker color="var(--accent-2)">{n}</Kicker>
              <h4 className="font-serif font-medium text-[17px] text-ink mb-[6px] tracking-[-0.01em]">{h}</h4>
              <p className="text-[13.5px] leading-[1.6] text-ink-2">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '60px auto 80px', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}
      >
        <div>
          <Kicker>/ Join the council</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 16 }}>
            Ready to <em className="text-accent">give back?</em>
          </h2>
          <p className="text-[14.5px] leading-[1.65] text-ink-2">
            Share a bit about your background and what topics you are most comfortable discussing. We personally review every application so we can respect your time and only send relevant requests your way. We will be in touch within a few days to get you set up.
          </p>
          <blockquote className="font-instrument italic" style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: '52ch', marginTop: 24, marginBottom: 18, paddingLeft: 20, borderLeft: '2px solid var(--accent-2)' }}>
            Allah's Messenger (ﷺ) said, "A Muslim is a brother of another Muslim, so he should not oppress him, nor should he hand him over to an oppressor. Whoever fulfilled the needs of his brother, Allah will fulfill his needs; whoever brought his (Muslim) brother out of a discomfort, Allah will bring him out of the discomforts of the Day of Resurrection, and whoever conceals the faults of a Muslim, Allah will conceal his faults on the Day of Resurrection."
            <span className="block mt-[6px] font-mono text-[10px] tracking-[.16em] uppercase text-muted not-italic">
              Prophetic tradition · Sahih al-Bukhari
            </span>
          </blockquote>
          <div className="mt-7 pt-6 border-t border-dashed border-rule">
            <p className="text-[13px] leading-[1.65] text-ink-2 mb-[6px]">Looking for coaching instead?</p>
            <Link to="/coaching" className="font-sans text-[13px] font-medium text-accent no-underline inline-flex items-center gap-[6px]">
              Request a session <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>
        <DarkCard>
          <MentorApplicationForm />
        </DarkCard>
      </section>
    </div>
  )
}
