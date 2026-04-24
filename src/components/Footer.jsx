import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-paper-cream border-t border-paper-cream/10">
      <div className="max-w-[1200px] mx-auto pt-14 px-5 pb-8 md:pt-14 md:px-12 md:pb-10">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-10">

          <div>
            <Link to="/" className="flex items-center gap-[10px] no-underline mb-4">
              <img src="/logo.png" alt="UmmahWorks" className="w-[34px] h-[34px] object-contain brightness-0 invert opacity-85" />
              <span className="font-serif font-medium text-[19px] text-paper-cream tracking-[-0.015em]">
                UmmahWorks
              </span>
            </Link>
            <p className="text-[13px] leading-[1.65] text-paper-cream/60 max-w-[280px]">
              A free community for Muslim professionals in tech. Resources, mentorship, and coaching offered as sadaqah.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[.22em] uppercase text-accent-2 mb-[18px]">
              Platform
            </h3>
            <ul className="list-none p-0 flex flex-col gap-[10px]">
              {[['Career Hub', '/hub'], ['Mentors', '/mentorship'], ['Coaching', '/coaching']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-[14px] text-paper-cream/[.65] no-underline hover:text-paper-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[.22em] uppercase text-accent-2 mb-[18px]">
              Connect
            </h3>
            <ul className="list-none p-0 flex flex-col gap-[10px]">
              <li>
                <a href="mailto:salaam@ummahworks.org" className="text-[14px] text-paper-cream/[.65] no-underline hover:text-paper-cream transition-colors">
                  salaam@ummahworks.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-paper-cream/10 mt-10 pt-6 flex justify-between items-center flex-wrap gap-3">
          <p className="font-mono text-[10px] tracking-[.18em] uppercase text-muted">
            © {year} UmmahWorks
          </p>
          <p className="font-instrument italic text-[13px] text-accent-2">
            Built for the community.
          </p>
        </div>
      </div>
    </footer>
  )
}
