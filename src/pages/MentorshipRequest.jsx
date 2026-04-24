import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Kicker from '../components/Kicker'
import DarkCard from '../components/DarkCard'
import FormSuccess from '../components/FormSuccess'
import SubmitButton from '../components/SubmitButton'
import { TextField, SelectField, TextareaField } from '../components/FormField'
import FormField from '../components/FormField'
import AvailabilityPicker from '../components/AvailabilityPicker'
import { FORM_ERROR } from '../lib/utils'

const DOMAINS = ['Engineering', 'Product', 'Data & ML', 'Design', 'Startup', 'UX Research', 'Healthcare', 'Gaming']

const domainBtn = (active) => ({
  padding: '5px 12px',
  borderRadius: 99,
  border: active ? '1px solid var(--accent-2)' : '1px solid rgba(251,248,241,.18)',
  background: active ? 'rgba(197,139,61,.2)' : 'transparent',
  color: active ? 'var(--accent-2)' : 'rgba(251,248,241,.5)',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all .12s',
})

function RequestForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', career_stage: '', domains: [], need: '', availability: [] })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const toggleDomain = (d) => setForm(f => ({
    ...f,
    domains: f.domains.includes(d) ? f.domains.filter(x => x !== d) : [...f.domains, d],
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.domains.length === 0) { setError('Select at least one domain.'); return }
    if (form.availability.length === 0) { setError('Add at least one availability window.'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/mentee-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.ok) setSent(true)
      else setError(data.error || FORM_ERROR)
    } catch {
      setError(FORM_ERROR)
    } finally {
      setLoading(false)
    }
  }

  if (sent) return <FormSuccess title="Request received. JazakAllah Khayran." subtitle="We will be in touch within three working days, inshaAllah." />

  return (
    <form onSubmit={handleSubmit}>
      <TextField id="req-name" label="Your name" required value={form.name} onChange={set('name')} placeholder="Amina S." />
      <TextField id="req-email" label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <SelectField id="req-stage" label="Career stage" required value={form.career_stage} onChange={set('career_stage')}>
        <option value="">Select...</option>
        <option value="early">Early career, under 3 years</option>
        <option value="mid">Mid-level, 3 to 7 years</option>
        <option value="senior">Senior / staff, 7+ years</option>
        <option value="founding">Founding / leadership</option>
        <option value="switching">Switching into tech</option>
      </SelectField>
      <FormField label="Domain you need help with" labelStyle={{ display: 'block', marginBottom: 10 }}>
        <div className="flex flex-wrap gap-[6px]">
          {DOMAINS.map(d => (
            <button type="button" key={d} onClick={() => toggleDomain(d)} style={domainBtn(form.domains.includes(d))}>
              {d}
            </button>
          ))}
        </div>
      </FormField>
      <TextareaField id="req-need" label="What are you trying to figure out?" required value={form.need} onChange={set('need')} placeholder="Be specific: what is the actual roadblock you are facing?" />
      <FormField label="Your weekly availability" labelStyle={{ display: 'block', marginBottom: 6 }} mb={18}>
        <p className="text-[12px] leading-[1.55] mb-3" style={{ color: 'rgba(251,248,241,.4)' }}>
          We use this to find mentors who share your open hours. Check each day you are typically free and add a time window.
        </p>
        <AvailabilityPicker windows={form.availability} onChange={windows => setForm(f => ({ ...f, availability: windows }))} />
      </FormField>
      {error && <p className="mb-3 text-[13px] text-red-400 text-center">{error}</p>}
      <SubmitButton loading={loading}>Send request</SubmitButton>
      <p className="mt-[14px] text-center font-instrument italic text-[13.5px] text-paper-cream/[.55]">We reply to every request, inshaAllah.</p>
    </form>
  )
}

export default function MentorshipRequest() {
  return (
    <div className="bg-paper text-ink">
      <Helmet>
        <title>Request a Mentor | UmmahWorks</title>
        <meta name="description" content="Request a free 20-minute mentorship session with a Muslim professional in your field." />
        <link rel="canonical" href="https://ummahworks.org/request" />
        <meta property="og:title" content="Request a Mentor | UmmahWorks" />
        <meta property="og:description" content="Request a free 20-minute mentorship session with a Muslim professional in your field." />
        <meta property="og:url" content="https://ummahworks.org/request" />
      </Helmet>

      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 48px 50px', borderBottom: '1px solid var(--rule)' }}>
        <Kicker withLine color="var(--muted)">Mentorship · Always free</Kicker>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(44px,7vw,72px)', lineHeight: 1.02, letterSpacing: '-.028em', color: 'var(--ink)', marginBottom: 24, maxWidth: '18ch', textWrap: 'balance' }}>
          Twenty minutes with someone <em className="text-accent">who has been there.</em>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: '62ch' }}>
          Tell us what you are navigating and when you are free. We will find the right mentor from our council and make the introduction only after they approve.
        </p>
      </section>

      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'start' }}
      >
        <div>
          <Kicker>/ What to expect</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 28, lineHeight: 1.1, letterSpacing: '-.018em', color: 'var(--ink)', marginBottom: 20 }}>
            How matching works.
          </h2>
          <div className="flex flex-col gap-5">
            {[
              ['Submit this form.', 'Tell us your domain, career stage, and what you are working through. Add your weekly availability so we can find a real time match.'],
              ['We find the fit.', 'We score your domain and schedule against our mentor council and surface the strongest candidates within a few days.'],
              ['The mentor approves.', 'Before anything is shared, the matched mentor reviews your request and confirms the intro. You only hear from someone who genuinely wants to help.'],
              ['You connect directly.', 'Once confirmed, you get a direct email intro. Twenty minutes, on video, completely off the record.'],
            ].map(([h, p], i) => (
              <div key={i} className="flex gap-[14px]">
                <span className="font-mono text-[10px] tracking-[.1em] text-accent-2 shrink-0 pt-[3px]">0{i + 1}</span>
                <div>
                  <div className="font-serif font-medium text-[15px] text-ink mb-1">{h}</div>
                  <p className="text-[13px] leading-[1.6] text-ink-2">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DarkCard>
          <Kicker withLine color="var(--accent-2)">Request a session</Kicker>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, lineHeight: 1.1, letterSpacing: '-.018em', marginBottom: 22 }}>
            Tell us what you are <em className="text-accent-2">working through.</em>
          </h3>
          <RequestForm />
        </DarkCard>
      </section>
    </div>
  )
}
