import { useState } from 'react'
import { Link } from 'react-router-dom'
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

const offerings = [
  { n: '/ 01 · Career navigation', h: <><em className="text-accent">Where do I go next?</em></>, p: 'Whether you want to stay, switch roles, or wait it out, we offer our own experiences to help you decide. You can always expect honest and supportive guidance from us.' },
  { n: '/ 02 · Interview prep', h: <>Mock interviews, <em className="text-accent">real feedback</em></>, p: "Whether technical or behavioral, we run through mock interviews and provide constructive feedback. We will help you refine your stories and let you know when you are truly ready." },
  { n: '/ 03 · Resume & narrative', h: <>A clearer <em className="text-accent">way to tell your story</em></>, p: 'We will review your resume line by line to help you highlight what truly matters for your experience level. You can also use our provided templates as a starting point.' },
  { n: '/ 04 · Offers & negotiation', h: <>What you should <em className="text-accent">actually ask for</em></>, p: 'Bring the offer and the context. We will tell you what we think it is worth and exactly what to say next, all with halal considerations in mind.' },
]

const steps = [
  { n: 'Step 01', h: 'Tell us what you need', p: 'Fill out the short form below. A brief description is perfect, but being specific helps us find the best mentor for you.' },
  { n: 'Step 02', h: 'We find the fit', p: 'Give us a few days to review your request. We will thoughtfully introduce you to a volunteer whose background perfectly aligns with what you are navigating.' },
  { n: 'Step 03', h: 'Twenty minutes, on video', p: 'You schedule directly. Your session is completely private, unrecorded, and confidential.' },
  { n: 'Step 04', h: 'Follow-up', p: 'Most people find the clarity they need in just one session. You are always welcome to reach out again if you hit another roadblock later on, but there are never any ongoing obligations.' },
]

const quotes = [
  { q: <>I was struggling to translate my day-to-day work into a clear promo doc. My mentor tore my first draft apart<em className="text-accent">—in the best way possible—</em>and helped me map my impact directly to the actual business metrics leadership cared about.</>, cite: 'Tariq Hassan, Senior PM', when: 'CAREER NAVIGATION · 2024' },
  { q: <>The recruiter gave me the standard 'this is top of band' line. My mentor reviewed the equity breakdown, showed me the real comp data for my level, and gave me a literal script to push back. We negotiated <em className="text-accent">an extra $25k in base.</em></>, cite: 'Amina Yusuf, Staff Engineer', when: 'OFFER REVIEW · 2024' },
  { q: <>I was burning out but felt guilty leaving. Talking to an industry veteran who understood the <em className="text-accent">specific cultural and professional pressures</em> I was facing gave me the clarity to update my resume and finally pivot to a healthier organization.</>, cite: 'Bilal Khalid, Engineering Lead', when: 'CAREER NAVIGATION · 2023' },
]

function CoachingForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', level: '', domains: [], need: '', availability: [] })

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
        body: JSON.stringify({ ...form, career_stage: form.level }),
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

  if (sent) return <FormSuccess title="Request received. JazakAllah Khayran." subtitle="We will reply within three working days, inshaAllah." />

  return (
    <form onSubmit={handleSubmit}>
      <TextField id="coaching-name" label="Your name" required value={form.name} onChange={set('name')} placeholder="Amina S." />
      <TextField id="coaching-email" label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <SelectField id="coaching-level" label="What you do now" required value={form.level} onChange={set('level')}>
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
      <TextareaField id="coaching-need" label="What are you trying to figure out?" required value={form.need} onChange={set('need')} placeholder="Tell us your situation. Be specific: what is the actual roadblock?" />
      <FormField label="Your weekly availability" labelStyle={{ display: 'block', marginBottom: 6 }} mb={18}>
        <p className="text-[12px] leading-[1.55] mb-3" style={{ color: 'rgba(251,248,241,.4)' }}>
          We use this to find mentors who share your open hours.
        </p>
        <AvailabilityPicker windows={form.availability} onChange={windows => setForm(f => ({ ...f, availability: windows }))} />
      </FormField>
      {error && <p className="mb-3 text-[13px] text-red-400 text-center">{error}</p>}
      <SubmitButton loading={loading}>Send request</SubmitButton>
      <p className="mt-[14px] text-center font-instrument italic text-[13.5px] text-paper-cream/[.55]">We reply to every request, inshaAllah.</p>
    </form>
  )
}

export default function Coaching() {
  return (
    <div className="bg-paper text-ink">
      <Helmet>
        <title>1-on-1 Coaching | UmmahWorks</title>
        <meta name="description" content="Free one-on-one coaching sessions with senior Muslim professionals. Resume reviews, interview prep, offer negotiation, and career strategy." />
        <link rel="canonical" href="https://ummahworks.org/coaching" />
        <meta property="og:title" content="1-on-1 Coaching | UmmahWorks" />
        <meta property="og:description" content="Free one-on-one coaching sessions with senior Muslim professionals. Resume reviews, interview prep, offer negotiation, and career strategy." />
        <meta property="og:url" content="https://ummahworks.org/coaching" />
      </Helmet>

      {/* HERO */}
      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '70px 48px 50px', borderBottom: '1px solid var(--rule)' }}>
        <Kicker withLine color="var(--muted)">Coaching · 1-on-1 · Always free</Kicker>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(44px,7vw,72px)', lineHeight: 1.02, letterSpacing: '-.028em', color: 'var(--ink)', marginBottom: 24, maxWidth: '18ch', textWrap: 'balance' }}>
          Twenty minutes, with someone <em className="text-accent">who has the playbook.</em>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: '62ch' }}>
          Honest, one-on-one career coaching for Muslim professionals. Tell us the roadblock you are facing, and we will connect you directly with a leader who has the playbook to beat it.
        </p>
      </section>

      {/* WHAT YOU GET */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 48px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 56, alignItems: 'start' }}
      >
        <div>
          <Kicker>/ What you get</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 16, textWrap: 'balance' }}>
            Practical advice <em className="text-accent">to help you grow.</em>
          </h2>
          <p className="text-[14.5px] leading-[1.65] text-ink-2">
            Our only goal is for you to leave the session with more clarity than you had coming in. We listen to your specific situation, ask the right questions, and share exactly what we would do in your shoes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[2px] border border-rule rounded-sm" style={{ background: 'var(--rule)' }}>
          {offerings.map(({ n, h, p }) => (
            <div key={n} style={{ background: 'var(--cream)', padding: '28px 28px 26px' }}>
              <Kicker color="var(--accent-2)">{n}</Kicker>
              <h3 className="font-serif font-medium text-[19px] tracking-[-0.01em] text-ink mb-2">{h}</h3>
              <p className="text-[13.5px] leading-[1.6] text-ink-2">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 48px 60px' }}>
        <div style={{ maxWidth: '62ch', marginBottom: 32 }}>
          <Kicker>/ How it works</Kicker>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--ink)' }}>
            Connecting with <em className="text-accent">a coach.</em>
          </h2>
        </div>
        <div className="border-t border-rule" />
        <div className="grid grid-cols-4 max-md:grid-cols-2">
          {steps.map(({ n, h, p }) => (
            <div key={n} style={{ padding: '26px 24px 28px', borderRight: '1px dashed var(--rule)', position: 'relative' }}>
              <span className="absolute block w-3 h-3 rounded-full bg-paper border-2 border-accent" style={{ top: -6, left: 24 }} />
              <div className="font-mono text-[10px] tracking-[.22em] uppercase text-muted mb-[10px]">{n}</div>
              <h4 className="font-serif font-medium text-[17px] text-ink tracking-[-0.01em] mb-2">{h}</h4>
              <p className="text-[13px] leading-[1.6] text-ink-2">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MENTOR CALLOUT */}
      <section className="mobile-px" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 40px' }}>
        <div className="bg-paper-cream border border-rule rounded-sm flex justify-between items-center gap-6 flex-wrap" style={{ padding: '24px 32px' }}>
          <div>
            <Kicker>/ The network</Kicker>
            <p className="font-serif text-[17px] text-ink leading-[1.35]">Curious who you might be matched with? Browse the mentor council.</p>
          </div>
          <Link to="/mentorship" className="inline-flex items-center gap-2 bg-ink text-paper-cream rounded-sm font-sans text-[13px] font-medium no-underline whitespace-nowrap shrink-0" style={{ padding: '11px 20px' }}>
            See the mentors <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>
      </section>

      {/* SELF-SELECTION + FORM */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}
      >
        <div className="bg-paper-cream border border-rule rounded-sm" style={{ padding: '36px 36px 34px' }}>
          <Kicker>/ A note on honesty</Kicker>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 24, letterSpacing: '-.015em', marginBottom: 12, color: 'var(--ink)' }}>
            How to make the most of <em className="text-accent">this.</em>
          </h3>
          <div className="mt-[14px] pt-[14px] border-t border-dashed border-rule flex flex-col gap-5">
            {[
              ['Bring drafts, not blank pages.', 'We are here to help you review and refine your resume, portfolio, or career strategy. To make the most of your time, please bring some initial work for us to look at together.'],
              ['Focus on the guidance.', 'While organic connections and referrals often happen within our network, the true value of these sessions is the advice itself. Come ready to learn, and let any networking happen naturally.'],
              ['Bring a specific roadblock.', 'Because 1:1 time is limited, it is best used for real challenges like navigating a grueling interview loop, negotiating an offer, or breaking through a stalled promotion.'],
              ['Help us prioritize those in need.', 'We built this platform to bridge the gap for Muslim professionals who might lack insider knowledge or corporate sponsorship. If you already have access to senior tech mentors, we kindly ask that you leave these limited slots open for those who need them most.'],
            ].map(([title, body], i) => (
              <div key={i} className="flex gap-[14px]">
                <span className="font-mono text-[10px] tracking-[.1em] text-accent shrink-0 pt-[3px]">0{i + 1}</span>
                <div>
                  <div className="font-serif font-medium text-[14.5px] text-ink mb-1">{title}</div>
                  <p className="text-[13px] leading-[1.6] text-ink-2">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DarkCard>
          <Kicker withLine color="var(--accent-2)">Request a session</Kicker>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 28, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 10 }}>
            Tell us what's <em className="text-accent-2">actually going on.</em>
          </h3>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 15, lineHeight: 1.55, color: 'rgba(251,248,241,.72)', maxWidth: '40ch', marginBottom: 22 }}>
            Responses read by a volunteer within 3 working days. Everything shared is held in confidence.
          </p>
          <CoachingForm />
        </DarkCard>
      </section>

      {/* QUOTES */}
      <section
        className="max-md:block mobile-px"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}
      >
        {quotes.map(({ q, cite, when }, i) => (
          <article key={i} className="bg-paper-cream border border-rule rounded-sm relative" style={{ padding: '28px 26px 24px' }}>
            <span className="font-instrument text-[52px] leading-[.8] text-accent-2 absolute top-[14px] right-[22px] opacity-60">"</span>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, lineHeight: 1.55, color: 'var(--ink)', marginBottom: 14, fontWeight: 400, textWrap: 'pretty' }}>{q}</p>
            <div className="pt-[14px] border-t border-dashed border-rule font-mono text-[10px] tracking-[.14em] uppercase text-muted leading-[1.7]">
              <b className="text-ink font-sans font-medium tracking-[.02em] normal-case text-[13px] block">{cite}</b>
              {when}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
