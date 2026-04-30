'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('cookies_accepted') === null) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookies_accepted', 'true')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookies_accepted', 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div
        className="max-w-2xl mx-auto rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
        }}
      >
        <p className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>
          We use cookies to improve your experience and remember your preferences.{' '}
          <span style={{ color: 'var(--text-label)' }}>Your data is never sold.</span>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95"
            style={{
              backgroundColor: 'var(--bg-card-hover)',
              color: 'var(--text-muted)',
            }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors active:scale-95"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
