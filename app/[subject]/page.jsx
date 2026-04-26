import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { subject: slug } = await params
  const supabase = createClient()
  const { data } = await supabase
    .from('subjects')
    .select('name')
    .eq('slug', slug)
    .single()
  return { title: data ? `${data.name} — The Revision Hub` : 'The Revision Hub' }
}

export default async function SubjectPage({ params }) {
  const { subject: slug } = await params
  const supabase = createClient()

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!subject) notFound()

  const { data: topics } = await supabase
    .from('topics')
    .select('id, name, paper, display_order, cards(block_number)')
    .eq('subject_id', subject.id)
    .order('display_order')

  // Group by paper, compute unique blocks per topic
  const papers = {}
  for (const topic of topics ?? []) {
    const paper = topic.paper || 'General'
    if (!papers[paper]) papers[paper] = []
    const blocks = [...new Set(topic.cards.map((c) => c.block_number))].sort((a, b) => a - b)
    papers[paper].push({ ...topic, blocks })
  }

  const colour = subject.colour || '#818cf8'

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-block text-xs text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          ← All subjects
        </Link>

        {/* Subject header */}
        <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: colour }} />
            <h1 className="text-xl font-extrabold text-white">{subject.name}</h1>
          </div>
          <p className="text-gray-500 text-xs mt-2 ml-7">Choose a topic and block to start</p>
        </div>

        {Object.keys(papers).length === 0 && (
          <div className="bg-dark-card border border-slate-700/30 rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-sm">No topics yet.</p>
          </div>
        )}

        {Object.entries(papers).map(([paper, paperTopics]) => (
          <section key={paper} className="mb-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
              {paper}
            </p>
            <div className="space-y-3">
              {paperTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-dark-card border border-slate-700/30 rounded-2xl p-4"
                >
                  <p className="text-white text-sm font-semibold mb-3">{topic.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {topic.blocks.map((block) => (
                      <Link
                        key={block}
                        href={`/${slug}/${topic.id}?block=${block}`}
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: colour }}
                      >
                        Block {block}
                      </Link>
                    ))}
                    {topic.blocks.length === 0 && (
                      <span className="text-xs text-gray-600">No cards yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
