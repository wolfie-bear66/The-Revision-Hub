import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import FlashcardQuiz from './FlashcardQuiz'

export default async function QuizPage({ params, searchParams }) {
  const { subject: subjectSlug, topic: topicId } = await params
  const { block } = await searchParams
  const blockNumber = parseInt(block ?? '1', 10)

  const supabase = createClient()

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', subjectSlug)
    .single()

  if (!subject) notFound()

  const { data: topic } = await supabase
    .from('topics')
    .select('*')
    .eq('id', topicId)
    .single()

  if (!topic) notFound()

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('topic_id', topicId)
    .eq('block_number', blockNumber)
    .order('display_order')

  if (!cards || cards.length === 0) notFound()

  return (
    <FlashcardQuiz
      subject={subject}
      topic={topic}
      blockNumber={blockNumber}
      cards={cards}
    />
  )
}
