export function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const FORM_ERROR = 'Something went wrong. Please email us at salaam@ummahworks.org.'
