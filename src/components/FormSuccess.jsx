export default function FormSuccess({ title, subtitle }) {
  return (
    <div className="text-center py-8">
      <p className="font-serif text-[20px] text-paper-cream mb-2">{title}</p>
      <p className="text-[13px]" style={{ color: 'rgba(251,248,241,.6)' }}>{subtitle}</p>
    </div>
  )
}
