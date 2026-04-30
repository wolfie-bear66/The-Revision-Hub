#!/usr/bin/env node
/**
 * Check current Supabase state — subjects, topic/card counts, and english-language block_name.
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

async function main() {
  // 1. List all subjects
  const { data: subjects, error: se } = await supabase
    .from('subjects')
    .select('id, name, slug')
    .order('name')

  if (se) { console.error('subjects error:', se.message); process.exit(1) }
  console.log('\n=== Subjects in DB ===')
  subjects.forEach(s => console.log(`  [${s.slug}] ${s.name} (id: ${s.id})`))

  // 2. Per-subject stats
  console.log('\n=== Stats ===')
  for (const s of subjects) {
    const { data: topics } = await supabase
      .from('topics')
      .select('id')
      .eq('subject_id', s.id)

    const topicIds = (topics || []).map(t => t.id)
    let cardCount = 0
    let blockCount = 0
    if (topicIds.length > 0) {
      const { data: cards } = await supabase
        .from('cards')
        .select('id, block_number, block_name')
        .in('topic_id', topicIds)

      cardCount = (cards || []).length
      const blockKeys = new Set((cards || []).map(c => `${c.topic_id}|${c.block_number}`))
      blockCount = blockKeys.size

      const nullNames = (cards || []).filter(c => c.block_name === null).length
      console.log(`  ${s.slug}: topics=${topicIds.length} blocks=${blockCount} cards=${cardCount} null_block_names=${nullNames}`)
    } else {
      console.log(`  ${s.slug}: NO TOPICS`)
    }
  }

  // 3. Check english-language block names specifically
  const englishSubject = subjects.find(s => s.slug === 'english-language')
  if (englishSubject) {
    const { data: engTopics } = await supabase
      .from('topics')
      .select('id')
      .eq('subject_id', englishSubject.id)

    const engTopicIds = (engTopics || []).map(t => t.id)
    if (engTopicIds.length > 0) {
      const { data: engCards } = await supabase
        .from('cards')
        .select('block_number, block_name')
        .in('topic_id', engTopicIds)

      const seen = new Map()
      for (const c of engCards || []) {
        const key = `${c.block_number}`
        if (!seen.has(key)) seen.set(key, c.block_name)
      }
      console.log('\n=== english-language block names ===')
      seen.forEach((name, key) => console.log(`  block ${key}: ${JSON.stringify(name)}`))
    }
  }
}

main().catch(err => { console.error(err.message); process.exit(1) })
