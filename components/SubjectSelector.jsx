'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubjectSelector({ subjects }) {
  const [selected, setSelected] = useState('')
  const router = useRouter()

  return (
    <>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm appearance-none"
        style={{
          backgroundColor: 'var(--bg-page)',
          border: '1px solid var(--border-card)',
          color: selected ? 'var(--text-body)' : 'var(--text-muted)',
          outline: 'none',
        }}
      >
        <option value="" disabled>Choose a subject...</option>
        {subjects.map((subject) => (
          <option
            key={subject.id}
            value={subject.slug}
            style={{ color: 'var(--text-body)', backgroundColor: 'var(--bg-card)' }}
          >
            {subject.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => { if (selected) router.push(`/${selected}`) }}
        disabled={!selected}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: '#ffffff',
          opacity: selected ? 1 : 0.45,
          cursor: selected ? 'pointer' : 'not-allowed',
        }}
      >
        Let's go →
      </button>
    </>
  )
}
