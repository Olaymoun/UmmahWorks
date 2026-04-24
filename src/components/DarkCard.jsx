export default function DarkCard({ children }) {
  return (
    <div className="bg-ink text-paper-cream rounded-sm relative overflow-hidden" style={{ padding: '44px 44px 40px' }}>
      <div
        className="absolute pointer-events-none"
        style={{ top: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(197,139,61,.18), transparent 70%)' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
