#!/usr/bin/env node
/**
 * Fix null block_name values for the english-language subject.
 * Reports what's in the DB, then patches block_name from topic name + block_number.
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
  // Find english-language subject
  const { data: subject, error: se } = await supabase
    .from('subjects')
    .select('id, name')
    .eq('slug', 'english-language')
    .single()

  if (se || !subject) { console.error('Subject not found:', se?.message); process.exit(1) }
  console.log(`\nSubject: ${subject.name} (id: ${subject.id})`)

  // Get all topics
  const { data: topics } = await supabase
    .from('topics')
    .select('id, name, display_order')
    .eq('subject_id', subject.id)
    .order('display_order')

  console.log(`\nTopics (${topics.length}):`)
  for (const t of topics) {
    console.log(`  [${t.id}] "${t.name}" (display_order: ${t.display_order})`)
  }

  // Get distinct blocks per topic
  console.log('\nBlocks (from cards table):')
  for (const t of topics) {
    const { data: cards } = await supabase
      .from('cards')
      .select('block_number, block_name, keyword')
      .eq('topic_id', t.id)
      .order('block_number')
      .order('display_order')

    const blocks = new Map()
    for (const c of cards || []) {
      if (!blocks.has(c.block_number)) {
        blocks.set(c.block_number, { current_name: c.block_name, sample: c.keyword })
      }
    }
    blocks.forEach((info, bn) => {
      console.log(`  Topic "${t.name}" — block ${bn}: name=${JSON.stringify(info.current_name)} sample="${info.sample}"`)
    })
  }

  // Patch: for each topic+block with null block_name, set to "<topic_name> (<block_number>)"
  console.log('\nPatching null block_names...')
  let patched = 0
  for (const t of topics) {
    const { data: cards } = await supabase
      .from('cards')
      .select('block_number, block_name')
      .eq('topic_id', t.id)
      .is('block_name', null)

    const blockNums = [...new Set((cards || []).map(c => c.block_number))]
    for (const bn of blockNums) {
      const newName = `${t.name} (${bn})`
      const { error } = await supabase
        .from('cards')
        .update({ block_name: newName })
        .eq('topic_id', t.id)
        .eq('block_number', bn)
        .is('block_name', null)

      if (error) {
        console.error(`  ✗ Error patching topic "${t.name}" block ${bn}:`, error.message)
      } else {
        console.log(`  ✓ Set block_name = "${newName}"`)
        patched++
      }
    }
  }

  if (patched === 0) {
    console.log('  No null block_names found — nothing to patch.')
  }

  // Verify
  console.log('\nVerification:')
  for (const t of topics) {
    const { data: cards } = await supabase
      .from('cards')
      .select('block_number, block_name')
      .eq('topic_id', t.id)
      .order('block_number')

    const blocks = new Map()
    for (const c of cards || []) {
      if (!blocks.has(c.block_number)) blocks.set(c.block_number, c.block_name)
    }
    blocks.forEach((name, bn) => {
      console.log(`  "${t.name}" block ${bn}: ${JSON.stringify(name)}`)
    })
  }

  console.log('\n✅ Done.\n')
}

main().catch(err => { console.error(err.message); process.exit(1) })
