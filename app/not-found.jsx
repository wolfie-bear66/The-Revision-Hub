import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div
        className="rounded-2xl p-10 max-w-sm w-full"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-body)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          That subject, topic, or block doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white rounded-xl font-semibold text-sm transition-colors"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Back to subjects
        </Link>
      </div>
    </main>
  )
}
