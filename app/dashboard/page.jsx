import Link from 'next/link'

export const metadata = { title: 'Progress Dashboard — The Revision Hub' }

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-10 max-w-sm w-full text-center">
        <p className="text-4xl mb-5">📊</p>
        <h1 className="text-xl font-extrabold text-white mb-2">Progress Dashboard</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Track your scores over time with charts per topic and block.
        </p>
        <span className="inline-block bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-8">
          Coming soon — Phase 2
        </span>
        <br />
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          Back to subjects
        </Link>
      </div>
    </main>
  )
}
