export default function SubmitButton({ loading, loadingText = 'Sending…', children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%', padding: '14px 24px', background: 'var(--accent-2)',
        color: 'var(--ink)', border: 'none', borderRadius: 2,
        fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
        cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? loadingText : children}
    </button>
  )
}
