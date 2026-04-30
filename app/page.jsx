import { createClient } from '@/lib/supabase'
import SubjectSelector from '@/components/SubjectSelector'

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
    <main
      className="min-h-screen px-4 py-10 flex flex-col items-center"
      style={{ backgroundColor: '#0f0e1a' }}
    >
      <div className="w-full max-w-[390px] flex flex-col gap-6">

        {/* Hero */}
        <section className="text-center flex flex-col items-center gap-3 pt-4">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(127,119,221,0.15)', color: '#c4b5fd' }}
          >
            GCSE Flashcards
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#c4b5fd' }}>
            The Revision Hub
          </h1>
          <p className="text-sm" style={{ color: '#7c7a9a' }}>Small Steps, Giant Leaps</p>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c7a9a' }}>
            How it works
          </p>
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-center gap-4 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: '#1c1b2e',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: 'rgba(127,119,221,0.15)' }}
              >
                {step.icon}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#a78bfa' }}>
                  Step {step.number}
                </p>
                <p className="text-sm font-medium" style={{ color: '#f1f0ff' }}>
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
            backgroundColor: '#1c1b2e',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: '#f1f0ff' }}>
            What are you revising today?
          </p>
          <SubjectSelector subjects={subjects || []} />
        </section>

        {/* Tips for success */}
        <section className="flex flex-col gap-3">
          <span
            className="self-start text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(127,119,221,0.15)', color: '#c4b5fd' }}
          >
            ★ Tips for success
          </span>
          {tips.map((tip) => (
            <div
              key={tip.label}
              className="flex items-start gap-4 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: '#1c1b2e',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: 'rgba(127,119,221,0.15)' }}
              >
                {tip.icon}
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                  style={{ color: '#a78bfa' }}
                >
                  {tip.label}
                </p>
                <p className="text-sm" style={{ color: '#7c7a9a' }}>
                  {tip.text}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <p className="text-center pb-6">
          <a href="/dashboard" className="text-xs transition-colors" style={{ color: '#7c7a9a' }}>
            Progress dashboard →
          </a>
        </p>

      </div>
    </main>
  )
}
