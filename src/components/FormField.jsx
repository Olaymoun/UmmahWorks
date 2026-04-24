import { inputClass, labelClass } from './formStyles'

export default function FormField({ id, label, mb = 14, labelStyle, children }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label htmlFor={id} className={labelClass} style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export function TextField({ id, label, mb, ...inputProps }) {
  return (
    <FormField id={id} label={label} mb={mb}>
      <input id={id} className={inputClass} {...inputProps} />
    </FormField>
  )
}

export function TextareaField({ id, label, mb, rows = 4, ...textareaProps }) {
  return (
    <FormField id={id} label={label} mb={mb}>
      <textarea
        id={id}
        rows={rows}
        className={`${inputClass} resize-y font-serif text-[14px] leading-[1.5]`}
        {...textareaProps}
      />
    </FormField>
  )
}

export function SelectField({ id, label, mb, children, ...selectProps }) {
  return (
    <FormField id={id} label={label} mb={mb}>
      <select id={id} className={inputClass} style={{ appearance: 'auto' }} {...selectProps}>
        {children}
      </select>
    </FormField>
  )
}
