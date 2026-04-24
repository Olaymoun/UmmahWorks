import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { fmt } from '../lib/utils'

const TOKEN_KEY = 'uw_admin_token'

function storageGet(key) {
  try { return sessionStorage.getItem(key) } catch { return null }
}
function storageSet(key, val) {
  try { sessionStorage.setItem(key, val) } catch { /* storage blocked */ }
}
function storageRemove(key) {
  try { sessionStorage.removeItem(key) } catch { /* storage blocked */ }
}

const stageLabels = {
  early: 'Early career',
  mid: 'Mid-level',
  senior: 'Senior / staff',
  founding: 'Founding / leadership',
  switching: 'Switching into tech',
}

function mono(text, color = 'var(--muted)') {
  return { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color }
}

function Tag({ label }) {
  return (
    <span style={{ ...mono('var(--muted)'), padding: '2px 7px', border: '1px solid var(--rule)', borderRadius: 99, background: 'var(--paper)', whiteSpace: 'nowrap', display: 'inline-block' }}>
      {label}
    </span>
  )
}

function Btn({ onClick, disabled, variant = 'default', children }) {
  const bg = variant === 'approve' ? '#0b5d3b' : variant === 'reject' ? '#7f1d1d' : 'var(--ink)'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ padding: '6px 14px', background: bg, color: '#fbf8f1', border: 'none', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, cursor: disabled ? 'wait' : 'pointer', opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </button>
  )
}

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        cache: 'no-store',
      })
      const text = await res.text()
      let data = {}
      try { data = JSON.parse(text) } catch { /* non-JSON response */ }
      if (res.ok && data.ok) {
        storageSet(TOKEN_KEY, data.token)
        onLogin(data.token)
      } else {
        setError(data.error || `Server error (${res.status})`)
      }
    } catch (err) {
      setError('Request failed: ' + (err?.message || 'unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ ...mono('var(--accent)'), marginBottom: 12 }}>/ Admin</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 38, letterSpacing: '-.022em', color: 'var(--ink)', marginBottom: 32 }}>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', ...mono('var(--muted)'), marginBottom: 6 }}>Username</label>
            <input
              required
              autoComplete="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={{ width: '100%', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', ...mono('var(--muted)'), marginBottom: 6 }}>Password</label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--ink)', outline: 'none' }}
            />
          </div>
          {error && <p style={{ marginBottom: 14, fontSize: 13, color: '#b91c1c' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px 24px', background: 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: 2, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function PendingMentors({ data, onAction, acting }) {
  if (!data.length) return <p style={{ fontSize: 14, color: 'var(--ink-2)', padding: '24px 0' }}>No pending applications.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map(m => (
        <div key={m.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 18, color: 'var(--ink)', marginBottom: 2 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 8 }}>
                {[m.role, m.company].filter(Boolean).join(' at ')}
                {' '}
                <a href={`mailto:${m.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{m.email}</a>
              </div>
              {m.linkedin && (
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                  <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{m.linkedin}</a>
                </div>
              )}
              {m.topics && <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)', marginBottom: 10, maxWidth: '68ch' }}>{m.topics}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                {(m.domains || []).map(d => <Tag key={d} label={d} />)}
                {(!m.domains || m.domains.length === 0) && <span style={{ fontSize: 12, color: 'var(--muted)' }}>No domains parsed</span>}
              </div>
              <div style={{ ...mono('var(--muted)') }}>Applied {fmt(m.created_at)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              <Btn variant="approve" onClick={() => onAction('approve_mentor', m.id)} disabled={acting === m.id}>Approve</Btn>
              <Btn variant="reject" onClick={() => onAction('reject_mentor', m.id)} disabled={acting === m.id}>Reject</Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PendingMatches({ data }) {
  if (!data.length) return <p style={{ fontSize: 14, color: 'var(--ink-2)', padding: '24px 0' }}>No pending matches.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map(m => (
        <div key={m.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '22px 24px' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ ...mono('var(--accent)'), marginBottom: 6 }}>Mentor</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{m.mentor_name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{[m.mentor_role, m.mentor_company].filter(Boolean).join(' at ')}</div>
              <a href={`mailto:${m.mentor_email}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{m.mentor_email}</a>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ ...mono('var(--accent-2)'), marginBottom: 6 }}>Mentee</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{m.mentee_name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 2 }}>{stageLabels[m.career_stage] || m.career_stage}</div>
              <a href={`mailto:${m.mentee_email}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{m.mentee_email}</a>
              {m.need && <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>{m.need}</p>}
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={{ ...mono('var(--muted)'), marginBottom: 6 }}>Score</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, color: 'var(--ink)' }}>{m.total_score}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>domain {m.domain_score} / avail {m.availability_score}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ ...mono(), padding: '3px 8px', border: '1px solid var(--rule)', borderRadius: 99, background: m.status === 'admin_approved' ? '#e6f0ec' : 'var(--paper)', color: m.status === 'admin_approved' ? '#0b5d3b' : 'var(--muted)' }}>
                  {m.status}
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dotted var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...mono('var(--muted)') }}>{fmt(m.created_at)}</span>
            {m.status === 'pending' && m.approval_token && (
              <a
                href={`/api/approve-match?token=${m.approval_token}`}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}
              >
                Approve match
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ActiveMentors({ data, onAction, acting }) {
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const startEdit = (m) => {
    setEditing(m.id)
    setEditForm({ name: m.name, email: m.email || '', role: m.role || '', company: m.company || '', bio: m.bio || '', domains: (m.domains || []).join(', ') })
  }

  const saveEdit = async () => {
    await onAction('update_mentor', editing, {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      company: editForm.company,
      bio: editForm.bio,
      domains: editForm.domains.split(',').map(d => d.trim()).filter(Boolean),
    })
    setEditing(null)
  }

  if (!data.length) return <p style={{ fontSize: 14, color: 'var(--ink-2)', padding: '24px 0' }}>No active mentors yet.</p>

  const inputStyle = { width: '100%', background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 2, padding: '7px 10px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--ink)', outline: 'none', marginBottom: 8 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map(m => (
        <div key={m.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '16px 20px' }}>
          {editing === m.id ? (
            <div>
              <input style={inputStyle} value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" />
              <input style={inputStyle} value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
              <input style={inputStyle} value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} placeholder="Role" />
              <input style={inputStyle} value={editForm.company} onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" />
              <textarea style={{ ...inputStyle, resize: 'vertical', marginBottom: 8 }} rows={3} value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" />
              <input style={inputStyle} value={editForm.domains} onChange={e => setEditForm(f => ({ ...f, domains: e.target.value }))} placeholder="Domains (comma-separated)" />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Btn variant="approve" onClick={saveEdit} disabled={acting === m.id}>Save</Btn>
                <Btn onClick={() => setEditing(null)}>Cancel</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{[m.role, m.company].filter(Boolean).join(' at ')} &middot; <a href={`mailto:${m.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{m.email}</a></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                  {(m.domains || []).map(d => <Tag key={d} label={d} />)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Btn onClick={() => startEdit(m)} disabled={acting === m.id}>Edit</Btn>
                <Btn variant="reject" onClick={() => onAction('delete_mentor', m.id)} disabled={acting === m.id}>Delete</Btn>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function RecentMentees({ data }) {
  if (!data.length) return <p style={{ fontSize: 14, color: 'var(--ink-2)', padding: '24px 0' }}>No mentees yet.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map(m => (
        <div key={m.id} style={{ background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 2, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6 }}>
                {stageLabels[m.career_stage] || m.career_stage || 'Stage not set'} &middot; <a href={`mailto:${m.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{m.email}</a>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(m.domains || []).map(d => <Tag key={d} label={d} />)}
              </div>
              {m.need && <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5, maxWidth: '60ch' }}>{m.need}</p>}
            </div>
            <div style={{ ...mono('var(--muted)'), flexShrink: 0 }}>{fmt(m.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('pending')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin-data', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  useEffect(() => { load() }, [load])

  const handleAction = async (action, id, extra = {}) => {
    setActing(id)
    try {
      await fetch('/api/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, id, ...extra }),
      })
      load()
    } finally {
      setActing(null)
    }
  }

  const tabs = [
    { key: 'pending', label: 'Pending', count: data?.pendingMentors?.length },
    { key: 'matches', label: 'Matches', count: data?.pendingMatches?.length },
    { key: 'active', label: 'Active Mentors', count: data?.activeMentors?.length },
    { key: 'mentees', label: 'Mentees', count: data?.recentMentees?.length },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px 80px' }} className="mobile-px">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ ...mono('var(--accent)'), marginBottom: 10 }}>/ Admin dashboard</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 38, letterSpacing: '-.022em', color: 'var(--ink)' }}>UmmahWorks</h1>
        </div>
        <button onClick={onLogout} style={{ marginTop: 8, ...mono('var(--muted)'), background: 'none', border: '1px solid var(--rule)', borderRadius: 2, padding: '6px 14px', cursor: 'pointer' }}>
          Sign out
        </button>
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 28, borderBottom: '1px solid var(--rule)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
              padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.key ? 'var(--ink)' : 'var(--muted)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
            {t.count != null && (
              <span style={{ marginLeft: 6, ...mono(tab === t.key ? 'var(--accent)' : 'var(--muted)'), fontSize: 10 }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: 'var(--muted)', padding: '24px 0' }}>Loading...</p>
      ) : data ? (
        <>
          {tab === 'pending' && <PendingMentors data={data.pendingMentors || []} onAction={handleAction} acting={acting} />}
          {tab === 'matches' && <PendingMatches data={data.pendingMatches || []} />}
          {tab === 'active' && <ActiveMentors data={data.activeMentors || []} onAction={handleAction} acting={acting} />}
          {tab === 'mentees' && <RecentMentees data={data.recentMentees || []} />}
        </>
      ) : (
        <p style={{ fontSize: 13, color: '#b91c1c', padding: '24px 0' }}>Failed to load data.</p>
      )}
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => storageGet(TOKEN_KEY) || null)

  const handleLogout = () => {
    storageRemove(TOKEN_KEY)
    setToken(null)
  }

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '60vh' }}>
      <Helmet>
        <title>Admin | UmmahWorks</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={setToken} />
      )}
    </div>
  )
}
