import { createClient } from '@/lib/supabase'
import SubjectSelector from '@/components/SubjectSelector'
import ThemeToggle from '@/components/ThemeToggle'

export const dynamic = 'force-dynamic'

const steps = [
  { icon: '📚', number: 1, title: 'Pick a subject and topic' },
  { icon: '🔄', number: 2, title: 'Choose word → meaning or meaning → word' },
  { icon: '✅', number: 3, title: 'Repeat to remember more' },
]

const tips = [
  {
    icon: '🕐',
    label: 'Make it a habit',
    text: 'Open the app at the same time every day — even 5 minutes helps',
  },
  {
    icon: '🤫',
    label: 'Find your spot',
    text: 'Find a quiet place where you can concentrate',
  },
  {
    icon: '🔊',
    label: 'Use your ears',
    text: "Tap a word to hear it read aloud if you're not sure how to say it",
  },
]

export default async function HomePage() {
  const supabase = createClient()
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-[390px] flex flex-col gap-6">

        {/* Theme toggle */}
        <div className="flex justify-end pt-2">
          <ThemeToggle />
        </div>

        {/* Hero */}
        <section className="text-center flex flex-col items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--accent-pill-bg)',
              border: '1px solid var(--accent-pill-border)',
              color: 'var(--accent-pill-text)',
            }}
          >
            GCSE Flashcards
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>
            The Revision Hub
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Small Steps, Giant Leaps</p>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            How it works
          </p>
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-center gap-4 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: 'var(--bg-icon)' }}
              >
                {step.icon}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--accent-step)' }}>
                  Step {step.number}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Subject selector */}
        <section
          className="rounded-2xl px-4 py-5 flex flex-col gap-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>
            What are you revising today?
          </p>
          <SubjectSelector subjects={subjects || []} />
        </section>

        {/* Tips for success */}
        <section className="flex flex-col gap-3">
          <span
            className="self-start text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--tips-badge-bg)',
              border: '1px solid var(--tips-badge-border)',
              color: 'var(--tips-badge-text)',
            }}
          >
            ★ Tips for success
          </span>
          {tips.map((tip) => (
            <div
              key={tip.label}
              className="flex items-start gap-4 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: 'var(--tips-bg)',
                border: '1px solid var(--tips-border)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: 'var(--bg-icon)' }}
              >
                {tip.icon}
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                  style={{ color: 'var(--accent-step)' }}
                >
                  {tip.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {tip.text}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <p className="text-center pb-6">
          <a href="/dashboard" className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>
            Progress dashboard →
          </a>
        </p>

      </div>
    </main>
  )
}
