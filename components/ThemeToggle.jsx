'use client'

import { useTheme } from './ThemeProvider'

const OPTIONS = [
  { value: 'dark',    icon: '🌙', label: 'Dark'    },
  { value: 'light',   icon: '☀️',  label: 'Light'   },
  { value: 'reading', icon: '📖', label: 'Reading' },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex gap-1 rounded-2xl p-1"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      {OPTIONS.map(({ value, icon, label }) => {
        const active = theme === value
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={`Switch to ${label.toLowerCase()} mode`}
            aria-pressed={active}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            style={{
              backgroundColor: active ? 'var(--accent-primary)' : 'transparent',
              color: active ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <span className="text-base leading-none">{icon}</span>
            <span className="hidden sm:block">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
