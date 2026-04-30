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
      <div className="max-w-2xl mx-auto bg-dark-card border border-slate-700/30 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-gray-300 flex-1">
          We use cookies to improve your experience and remember your preferences.{' '}
          <span className="text-gray-500">Your data is never sold.</span>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-dark-inner hover:bg-dark-muted text-gray-400 hover:text-gray-200 transition-colors active:scale-95"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors active:scale-95"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
