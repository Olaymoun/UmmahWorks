export default function Kicker({ children, color = 'var(--accent)', withLine = false, className = '' }) {
  if (withLine) {
    return (
      <div
        className={`flex items-center gap-3 font-mono uppercase tracking-[.28em] text-[11px] mb-5 ${className}`}
        style={{ color }}
      >
        <span className="block w-[30px] h-px shrink-0" style={{ background: color }} />
        {children}
      </div>
    )
  }
  return (
    <div
      className={`font-mono uppercase tracking-[.24em] text-[10px] mb-[14px] ${className}`}
      style={{ color }}
    >
      {children}
    </div>
  )
}
