'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'

const MODE_KEY = 'quiz-mode'

export default function FlashcardQuiz({ subject, topic, blockNumber, cards }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const [done, setDone] = useState(false)
  const [mode, setMode] = useState('keyword-first')

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY)
    if (saved === 'definition-first') setMode('definition-first')
  }, [])

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    localStorage.setItem(MODE_KEY, newMode)
    setFlipped(false)
  }, [])

  const handleClearMode = useCallback(() => {
    localStorage.removeItem(MODE_KEY)
  }, [])

  const colour = subject.colour || '#818cf8'
  const current = cards[index]
  const gotCount = results.filter((r) => r.gotIt).length
  const isDefinitionFirst = mode === 'definition-first'

  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-GB'
    window.speechSynthesis.speak(utterance)
  }, [])

  const handleFlip = useCallback(() => {
    setFlipped(true)
  }, [])

  const handleAnswer = useCallback(
    (gotIt) => {
      window.speechSynthesis?.cancel()
      const next = [...results, { card: current, gotIt }]
      setResults(next)
      if (index + 1 >= cards.length) {
        setDone(true)
      } else {
        setIndex((i) => i + 1)
        setFlipped(false)
      }
    },
    [results, current, index, cards.length]
  )

  const handleRetry = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIndex(0)
    setFlipped(false)
    setResults([])
    setDone(false)
  }, [])

  // ── Summary ─────────────────────────────────────────────────────────────────
  if (done) {
    const total = cards.length
    const pct = Math.round((gotCount / total) * 100)
    const missed = results.filter((r) => !r.gotIt)
    const message =
      pct === 100 ? 'Perfect score!' : pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort!' : 'Keep practising!'

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            {/* Score circle */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center mb-4"
                style={{ borderColor: 'var(--border-card-hover)' }}
              >
                <span className="text-2xl font-extrabold leading-none" style={{ color: 'var(--text-body)' }}>
                  {gotCount}
                </span>
                <span className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  / {total}
                </span>
              </div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-body)' }}>{message}</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {topic.name} · Block {blockNumber}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: 'var(--bg-card-hover)' }}
              >
                <p className="text-2xl font-extrabold text-emerald-500">{gotCount}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Correct</p>
              </div>
              <div
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: 'var(--bg-card-hover)' }}
              >
                <p className="text-2xl font-extrabold text-red-500">{missed.length}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Missed</p>
              </div>
              <div
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: 'var(--bg-card-hover)' }}
              >
                <p className="text-2xl font-extrabold" style={{ color: 'var(--accent-step)' }}>{pct}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Score</p>
              </div>
            </div>

            {/* Missed keywords */}
            {missed.length > 0 && (
              <div
                className="rounded-xl p-4 mb-6"
                style={{ backgroundColor: 'var(--bg-card-hover)' }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Missed keywords
                </p>
                <ul className="space-y-3">
                  {missed.map(({ card }) => (
                    <li key={card.id}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>
                        {card.keyword}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {card.definition}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleRetry}
              className="w-full py-4 rounded-xl text-white font-bold transition-colors active:scale-95 mb-3"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Try Again
            </button>
            <Link
              href={`/${subject.slug}`}
              onClick={handleClearMode}
              className="block w-full py-4 rounded-xl font-semibold text-center transition-colors active:scale-95 text-sm"
              style={{
                backgroundColor: 'var(--bg-card-hover)',
                color: 'var(--text-muted)',
              }}
            >
              ← Back to topics
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Quiz ────────────────────────────────────────────────────────────────────
  const progressPct = (index / cards.length) * 100

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-10 pb-12">
      <div className="w-full max-w-lg">
        {/* Topic + counter */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/${subject.slug}`}
            onClick={handleClearMode}
            className="text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Topics
          </Link>
          <span className="font-bold text-sm text-emerald-500">
            {index + 1} / {cards.length}
          </span>
        </div>

        {/* Topic name */}
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          {topic.name} · Block {blockNumber}
        </p>

        {/* Progress bar */}
        <div
          className="w-full rounded-full h-1 mb-6"
          style={{ backgroundColor: 'var(--bg-card-hover)' }}
        >
          <div
            className="progress-bar h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => handleModeChange('keyword-first')}
            className="flex-1 min-h-[44px] py-3 px-3 rounded-xl text-sm font-bold transition-colors active:scale-95"
            style={
              !isDefinitionFirst
                ? { backgroundColor: 'var(--accent-primary)', color: '#ffffff' }
                : { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)' }
            }
          >
            Word → Meaning
          </button>
          <button
            onClick={() => handleModeChange('definition-first')}
            className="flex-1 min-h-[44px] py-3 px-3 rounded-xl text-sm font-bold transition-colors active:scale-95"
            style={
              isDefinitionFirst
                ? { backgroundColor: 'var(--accent-primary)', color: '#ffffff' }
                : { backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)' }
            }
          >
            Meaning → Word
          </button>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <p
            className={`text-xs font-bold uppercase tracking-widest mb-3 ${
              isDefinitionFirst ? 'text-emerald-500' : 'text-indigo-400'
            }`}
          >
            {isDefinitionFirst ? 'Definition' : 'Keyword'}
          </p>
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="font-semibold text-lg leading-snug" style={{ color: 'var(--text-body)' }}>
              {isDefinitionFirst ? current.definition : current.keyword}
            </p>
            <button
              onClick={() => speak(isDefinitionFirst ? current.definition : current.keyword)}
              className="flex-shrink-0 transition-colors active:scale-95 mt-0.5"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Read aloud"
            >
              🔊
            </button>
          </div>

          {flipped && (
            <div
              className="mt-4 rounded-xl p-4"
              style={{
                backgroundColor: 'var(--bg-card-hover)',
                border: '1px solid var(--border-card)',
              }}
            >
              <p
                className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                  isDefinitionFirst ? 'text-indigo-400' : 'text-emerald-500'
                }`}
              >
                {isDefinitionFirst ? 'Keyword' : 'Definition'}
              </p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                  {isDefinitionFirst ? current.keyword : current.definition}
                </p>
                <button
                  onClick={() => speak(isDefinitionFirst ? current.keyword : current.definition)}
                  className="flex-shrink-0 transition-colors active:scale-95 mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Read aloud"
                >
                  🔊
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reveal button */}
        {!flipped && (
          <button
            onClick={handleFlip}
            className="w-full py-4 rounded-xl font-semibold transition-colors active:scale-95"
            style={{
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-card-hover)',
              color: 'var(--text-body)',
            }}
          >
            Reveal Answer
          </button>
        )}

        {/* Got it / Missed it */}
        {flipped && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold transition-colors active:scale-95"
            >
              ✗ Missed it
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-colors active:scale-95"
            >
              ✓ Got it
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
