import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="gradient-title text-4xl font-extrabold tracking-tight mb-2">
            The Revision Hub
          </h1>
          <p className="text-gray-500 text-sm">GCSE Revision Flashcards</p>
        </div>

        {/* Subject grid */}
        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/${subject.slug}`}
                className="bg-dark-card border border-slate-700/30 rounded-2xl p-5 hover:bg-dark-muted transition-colors group"
              >
                <div
                  className="w-3 h-3 rounded-full mb-3"
                  style={{ backgroundColor: subject.colour || '#818cf8' }}
                />
                <p className="text-white font-semibold text-sm group-hover:text-slate-200">
                  {subject.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-sm">No subjects yet.</p>
            <p className="text-gray-600 text-xs mt-1">
              Run <code className="text-indigo-400">npm run seed</code> to load content.
            </p>
          </div>
        )}

        {/* Footer link */}
        <p className="text-center mt-10">
          <Link href="/dashboard" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Progress dashboard →
          </Link>
        </p>
      </div>
    </main>
  )
}
