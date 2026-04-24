import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <Helmet>
        <title>About | UmmahWorks</title>
        <meta name="description" content="UmmahWorks is a volunteer-run platform offering free career resources, mentorship, and coaching for Muslim professionals in tech." />
        <link rel="canonical" href="https://ummahworks.org/about" />
        <meta property="og:title" content="About | UmmahWorks" />
        <meta property="og:description" content="UmmahWorks is a volunteer-run platform offering free career resources, mentorship, and coaching for Muslim professionals in tech." />
        <meta property="og:url" content="https://ummahworks.org/about" />
      </Helmet>

      {/* HERO */}
      <header className="about-header-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px 56px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 30, height: 1, background: 'var(--accent-2)', display: 'block' }} />
          Founder · UmmahWorks
        </div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 'clamp(40px,6vw,68px)', lineHeight: 1.02, letterSpacing: '-.028em', color: 'var(--ink)', maxWidth: '20ch', textWrap: 'balance' }}>
          The Story Behind <em className="text-accent">UmmahWorks.</em>
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <section className="about-main-grid max-md:block" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>

        {/* LEFT: identity card */}
        <div className="about-sticky-col" style={{ position: 'sticky', top: 96 }}>
          <div style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '32px 28px' }}>
            {/* Avatar monogram */}
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(145deg, var(--accent), #1a7650)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 34, color: 'var(--cream)', letterSpacing: '-.02em', marginBottom: 20, border: '3px solid var(--cream)', boxShadow: '0 0 0 1px var(--rule)' }}>
              OL
            </div>

            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, letterSpacing: '-.01em', color: 'var(--ink)', marginBottom: 4 }}>Omar Laymoun</div>
            <div className="font-instrument italic text-[15px] text-accent mb-6">Founder, UmmahWorks</div>

            {[
              ['Title', 'Principal Program Manager'],
              ['Company', 'NVIDIA'],
              ['Industry', '10+ years in tech'],
              ['Focus', 'Program & Product Management'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, alignItems: 'baseline', padding: '10px 0', borderBottom: '1px dotted var(--rule)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{k}</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
              </div>
            ))}

            <Link to="/coaching" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, padding: '12px 20px', background: 'var(--ink)', color: 'var(--cream)', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, textDecoration: 'none', width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
              Book a free session
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>

        {/* RIGHT: letter */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--accent-2)', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: 'var(--accent-2)', display: 'block' }} />
            In his own words
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 22, lineHeight: 1.6, color: 'var(--ink)', fontWeight: 400, textWrap: 'pretty' }}>
              For years, I watched incredibly capable Muslims struggle to break into tech or advance to the next level. The barrier was never a lack of talent. It was a severe deficit in access. People lacked the insider guidance, the strategic networks, and the precise phrasing needed to make a resume stand out.
            </p>

            <blockquote className="font-instrument italic" style={{ fontSize: 26, lineHeight: 1.45, color: 'var(--ink)', paddingLeft: 24, borderLeft: '2px solid var(--accent-2)', textWrap: 'pretty', margin: '8px 0' }}>
              Watching that disparity unfold was deeply frustrating, but it also became a catalyst.
            </blockquote>

            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, lineHeight: 1.65, color: 'var(--ink-2)', textWrap: 'pretty' }}>
              UmmahWorks is my response. After spending over a decade deeply embedded in product and program management, including my current role as a Principal Program Manager at NVIDIA, I want to dismantle those barriers. I have been fortunate enough to acquire the exact insights so many in our community need, and I refuse to keep them to myself.
            </p>

            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, lineHeight: 1.65, color: 'var(--ink-2)', textWrap: 'pretty' }}>
              Every coaching session, template, and guide on this platform is completely free. I fundamentally believe our community's strength relies entirely on the people willing to reach back and help others climb. Every mentor and coach gives their time as sadaqah. Nobody is paid. The work is the reward.
            </p>

            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, lineHeight: 1.65, color: 'var(--ink)', fontWeight: 500, textWrap: 'pretty' }}>
              You do not have to figure this out by yourself. We rise together, inshaAllah.
            </p>
          </div>

          {/* Signature */}
          <div style={{ marginTop: 52, paddingTop: 36, borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="font-instrument italic text-[28px] text-accent tracking-[.01em] mb-1">Omar Laymoun</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Founder · UmmahWorks · 2023</div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION STRIP */}
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '52px 48px' }}>
        <div className="about-mission-grid max-md:block" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            ['/ 01', 'Free, always.', 'Every resource, session, and template on this site is completely free. We want to support the community without any barriers.'],
            ['/ 02', 'Volunteer-run.', 'Every mentor and coach gives their time as sadaqah. Our mentors and coaches volunteer their time. We do this purely to uplift the community.'],
            ['/ 03', 'Community first.', 'UmmahWorks exists to serve the community, not to scale. We prioritize quality over reach, always.'],
          ].map(([n, h, p]) => (
            <div key={n} className="about-mission-item" style={{ padding: '0 40px 0 0', borderRight: '1px solid rgba(251,248,241,.1)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-2)', marginBottom: 14 }}>{n}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, letterSpacing: '-.01em', marginBottom: 10, color: 'var(--cream)' }}>{h}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(251,248,241,.65)' }}>{p}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
