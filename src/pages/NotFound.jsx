import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page not found | UmmahWorks</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div style={{ background: 'var(--paper)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>404</p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 500, color: 'var(--ink)', marginBottom: 12 }}>Page not found.</h1>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: 'var(--ink-2)', marginBottom: 32 }}>That URL does not exist. Try the hub.</p>
          <Link to="/hub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: 'var(--ink)', background: 'var(--accent-2)', padding: '12px 24px', borderRadius: 2, textDecoration: 'none' }}>Browse resources</Link>
        </div>
      </div>
    </>
  )
}
