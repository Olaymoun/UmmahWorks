import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location])

  const navLinks = [
    { to: '/coaching', label: 'Coaching' },
    { to: '/hub', label: 'Resources' },
    { to: '/mentorship', label: 'Mentors' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header className="bg-paper border-b border-rule sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-[10px] no-underline text-ink">
            <img src="/logo.png" alt="UmmahWorks" className="w-9 h-9 object-contain" />
            <span className="font-serif font-medium text-[21px] tracking-[-0.015em]">
              UmmahWorks
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `font-sans text-[14px] no-underline ${isActive ? 'text-accent font-medium' : 'text-ink-2 font-normal'}`
              }>
                {label}
              </NavLink>
            ))}
            <Link to="/coaching" className="py-[9px] px-[18px] bg-ink text-paper-cream rounded-sm text-[13px] font-medium no-underline font-sans">
              Request coaching
            </Link>
          </nav>

          <button
            className="md:hidden bg-transparent border-none cursor-pointer text-ink p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-rule bg-paper py-3 px-6 pb-4">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `block py-[10px] px-3 text-[14px] no-underline ${isActive ? 'text-accent font-medium' : 'text-ink-2 font-normal'}`
            }>
              {label}
            </NavLink>
          ))}
          <Link to="/coaching" className="block mt-2 py-3 px-3 text-center bg-ink text-paper-cream rounded-sm text-[14px] font-medium no-underline">
            Request coaching
          </Link>
        </div>
      )}
    </header>
  )
}
