import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-10 max-w-sm w-full">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-xl font-extrabold text-white mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">That subject, topic, or block doesn't exist.</p>
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
