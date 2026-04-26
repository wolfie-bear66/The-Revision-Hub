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
          <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-8">
            {/* Score circle */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-slate-600 flex flex-col items-center justify-center mb-4">
                <span className="text-2xl font-extrabold text-white leading-none">{gotCount}</span>
                <span className="text-xs text-gray-500 leading-none mt-0.5">/ {total}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{message}</h2>
              <p className="text-gray-500 text-sm mt-1">{topic.name} · Block {blockNumber}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-dark-inner rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-400">{gotCount}</p>
                <p className="text-xs text-gray-500 mt-1">Correct</p>
              </div>
              <div className="bg-dark-inner rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-red-400">{missed.length}</p>
                <p className="text-xs text-gray-500 mt-1">Missed</p>
              </div>
              <div className="bg-dark-inner rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-indigo-400">{pct}%</p>
                <p className="text-xs text-gray-500 mt-1">Score</p>
              </div>
            </div>

            {/* Missed keywords */}
            {missed.length > 0 && (
              <div className="bg-dark-inner rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Missed keywords
                </p>
                <ul className="space-y-3">
                  {missed.map(({ card }) => (
                    <li key={card.id}>
                      <p className="text-white text-sm font-semibold">{card.keyword}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{card.definition}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleRetry}
              className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors active:scale-95 mb-3"
            >
              Try Again
            </button>
            <Link
              href={`/${subject.slug}`}
              onClick={handleClearMode}
              className="block w-full py-4 rounded-xl bg-dark-inner hover:bg-dark-muted text-gray-300 font-semibold text-center transition-colors active:scale-95 text-sm"
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
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Topics
          </Link>
          <span className="text-emerald-400 font-bold text-sm">
            {index + 1} / {cards.length}
          </span>
        </div>

        {/* Topic name */}
        <p className="text-gray-500 text-xs mb-3">{topic.name} · Block {blockNumber}</p>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1 mb-6">
          <div
            className="progress-bar h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => handleModeChange('keyword-first')}
            className={`flex-1 min-h-[44px] py-3 px-3 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
              !isDefinitionFirst
                ? 'bg-violet-600 text-white'
                : 'bg-dark-inner text-gray-400 hover:text-gray-200'
            }`}
          >
            Word → Meaning
          </button>
          <button
            onClick={() => handleModeChange('definition-first')}
            className={`flex-1 min-h-[44px] py-3 px-3 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
              isDefinitionFirst
                ? 'bg-violet-600 text-white'
                : 'bg-dark-inner text-gray-400 hover:text-gray-200'
            }`}
          >
            Meaning → Word
          </button>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-6 mb-4">
          {/* Prompt */}
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDefinitionFirst ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {isDefinitionFirst ? 'Definition' : 'Keyword'}
          </p>
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-white font-semibold text-lg leading-snug">
              {isDefinitionFirst ? current.definition : current.keyword}
            </p>
            <button
              onClick={() => speak(isDefinitionFirst ? current.definition : current.keyword)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-300 active:scale-95 transition-colors mt-0.5"
              aria-label="Read aloud"
            >
              🔊
            </button>
          </div>

          {/* Reveal — shown after flip */}
          {flipped && (
            <div className="mt-4 bg-dark-inner border border-slate-600/30 rounded-xl p-4">
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDefinitionFirst ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {isDefinitionFirst ? 'Keyword' : 'Definition'}
              </p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {isDefinitionFirst ? current.keyword : current.definition}
                </p>
                <button
                  onClick={() => speak(isDefinitionFirst ? current.keyword : current.definition)}
                  className="flex-shrink-0 text-gray-500 hover:text-gray-300 active:scale-95 transition-colors mt-0.5"
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
            className="w-full py-4 rounded-xl bg-dark-bg border border-slate-700/50 text-white font-semibold hover:border-slate-500 transition-colors active:scale-95"
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
