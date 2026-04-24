import { useState } from 'react'
import { labelClass } from './formStyles'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'America/Chicago', label: 'Central (CT)' },
  { value: 'America/Denver', label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central Europe (CET)' },
  { value: 'Europe/Istanbul', label: 'Turkey (TRT)' },
  { value: 'Asia/Dubai', label: 'Gulf (GST)' },
  { value: 'Asia/Karachi', label: 'Pakistan (PKT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dhaka', label: 'Bangladesh (BST)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Malaysia (MYT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
]

const timeInput = {
  background: 'rgba(251,248,241,.08)',
  border: '1px solid rgba(251,248,241,.15)',
  color: 'var(--cream)',
  borderRadius: 2,
  padding: '5px 8px',
  fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
  outline: 'none',
  colorScheme: 'dark',
}

function detectTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TIMEZONES.find(t => t.value === tz)?.value || 'America/New_York'
  } catch {
    return 'America/New_York'
  }
}

export default function AvailabilityPicker({ windows, onChange }) {
  const [timezone, setTimezone] = useState(
    windows[0]?.timezone || detectTimezone()
  )

  const byDay = Object.fromEntries(windows.map(w => [w.day, w]))

  const toggle = (day) => {
    const next = { ...byDay }
    if (next[day]) {
      delete next[day]
    } else {
      next[day] = { day, start: '09:00', end: '17:00', timezone }
    }
    onChange(Object.values(next))
  }

  const update = (day, field, val) => {
    const next = { ...byDay, [day]: { ...byDay[day], [field]: val } }
    onChange(Object.values(next))
  }

  const changeTimezone = (tz) => {
    setTimezone(tz)
    const updated = Object.values(byDay).map(w => ({ ...w, timezone: tz }))
    onChange(updated)
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label className={labelClass}>Your timezone</label>
        <select
          className="w-full py-[10px] px-3 bg-paper-cream/5 border border-paper-cream/20 text-paper-cream font-sans text-[13.5px] rounded-sm outline-none box-border mt-[6px]"
          style={{ appearance: 'auto' }}
          value={timezone}
          onChange={e => changeTimezone(e.target.value)}
        >
          {TIMEZONES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        {DAYS.map((dayName, dayIdx) => {
          const active = !!byDay[dayIdx]
          return (
            <div
              key={dayIdx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: dayIdx < 6 ? '1px solid rgba(251,248,241,.07)' : 'none',
                flexWrap: 'wrap',
              }}
            >
              <input
                type="checkbox"
                id={`avail-day-${dayIdx}`}
                checked={active}
                onChange={() => toggle(dayIdx)}
                style={{ width: 14, height: 14, cursor: 'pointer', accentColor: '#c58b3d', flexShrink: 0 }}
              />
              <label
                htmlFor={`avail-day-${dayIdx}`}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: active ? 'rgba(251,248,241,.88)' : 'rgba(251,248,241,.35)',
                  width: 80,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'color .12s',
                }}
              >
                {dayName}
              </label>
              {active && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="time"
                    value={byDay[dayIdx].start}
                    onChange={e => update(dayIdx, 'start', e.target.value)}
                    style={timeInput}
                  />
                  <span style={{ color: 'rgba(251,248,241,.35)', fontSize: 11 }}>to</span>
                  <input
                    type="time"
                    value={byDay[dayIdx].end}
                    onChange={e => update(dayIdx, 'end', e.target.value)}
                    style={timeInput}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
