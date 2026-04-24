import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Kicker from '../components/Kicker'
import DarkCard from '../components/DarkCard'
import FormSuccess from '../components/FormSuccess'
import SubmitButton from '../components/SubmitButton'
import { TextField } from '../components/FormField'
import FormField from '../components/FormField'
import AvailabilityPicker from '../components/AvailabilityPicker'
import { FORM_ERROR } from '../lib/utils'

function MentorPortalForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', availability: [] })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.availability.length === 0) { setError('Add at least one availability window.'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/mentor-availability', {
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

  if (sent) return <FormSuccess title="Availability saved. JazakAllah Khayran." subtitle="Return here anytime to update your windows." />

  return (
    <form onSubmit={handleSubmit}>
      <TextField id="mp-name" label="Your name" required value={form.name} onChange={set('name')} placeholder="Dr. Ayesha Rahman" />
      <TextField id="mp-email" label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <FormField label="Weekly availability" labelStyle={{ display: 'block', marginBottom: 6 }} mb={18}>
        <p className="text-[12px] leading-[1.55] mb-3" style={{ color: 'rgba(251,248,241,.4)' }}>
          Check each day you are typically free and set a time window. We match you only with mentees who share these hours.
        </p>
        <AvailabilityPicker windows={form.availability} onChange={windows => setForm(f => ({ ...f, availability: windows }))} />
      </FormField>
      {error && <p className="mb-3 text-[13px] text-red-400 text-center">{error}</p>}
      <SubmitButton loading={loading} loadingText="Saving...">Save availability</SubmitButton>
      <p className="mt-[14px] text-center font-instrument italic text-[13.5px] text-paper-cream/[.55]">Return here anytime to update your windows.</p>
    </form>
  )
}

export default function MentorPortal() {
  return (
    <div className="bg-paper text-ink">
      <Helmet>
        <title>Mentor Portal | UmmahWorks</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 48px 50px', borderBottom: '1px solid var(--rule)' }}>
        <Kicker withLine color="var(--muted)">Mentor Portal · Internal</Kicker>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(36px,5.5vw,60px)', lineHeight: 1.05, letterSpacing: '-.025em', color: 'var(--ink)', marginBottom: 18, maxWidth: '18ch', textWrap: 'balance' }}>
          Set your <em className="text-accent">availability.</em>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: '56ch' }}>
          Let us know when you are typically free each week. We use this to match you only with mentees who share your open hours, so nothing ever lands on your plate unexpectedly.
        </p>
      </section>

      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'start' }}
      >
        <div>
          <Kicker>/ How this works</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 28, lineHeight: 1.1, letterSpacing: '-.018em', color: 'var(--ink)', marginBottom: 20 }}>
            Simple by design.
          </h2>
          <div className="flex flex-col gap-5">
            {[
              ['Set your windows once.', 'Fill this out once and we save your weekly schedule. Come back to update it anytime things change.'],
              ['We do the matching.', 'When a mentee submits a request, we score their availability and domain against yours. You only hear from us when the fit is genuine.'],
              ['You approve before anything happens.', 'We email you the mentee summary and a one-click approve link. No surprise calendar invites, ever.'],
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
          <Kicker withLine color="var(--accent-2)">Your availability</Kicker>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 26, lineHeight: 1.1, letterSpacing: '-.018em', marginBottom: 22 }}>
            When are you <em className="text-accent-2">free?</em>
          </h3>
          <MentorPortalForm />
        </DarkCard>
      </section>
    </div>
  )
}
