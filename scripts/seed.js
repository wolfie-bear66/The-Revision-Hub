#!/usr/bin/env node
/**
 * Seed script — reads every *.json file in data/ (except example-subject.json)
 * and upserts subjects, topics, and cards into Supabase.
 *
 * Usage:
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * The service role key bypasses RLS so inserts always succeed.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '\n❌  Missing environment variables.\n' +
      '    Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function assert(condition, msg) {
  if (!condition) {
    console.error(`\n❌  ${msg}\n`)
    process.exit(1)
  }
}

// ── Seed one file ─────────────────────────────────────────────────────────────

async function seedFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    console.error(`  ⚠️  Could not parse ${path.basename(filePath)} — skipping`)
    return
  }

  const { subject: subjectData, topics: topicsData } = data

  assert(subjectData?.slug, `${path.basename(filePath)}: missing subject.slug`)
  assert(subjectData?.name, `${path.basename(filePath)}: missing subject.name`)
  assert(Array.isArray(topicsData), `${path.basename(filePath)}: "topics" must be an array`)

  console.log(`\n📚  ${subjectData.name}`)

  // 1. Upsert subject (keyed on slug)
  const { data: subject, error: subjectErr } = await supabase
    .from('subjects')
    .upsert(subjectData, { onConflict: 'slug' })
    .select()
    .single()

  if (subjectErr) {
    console.error('    Subject error:', subjectErr.message)
    throw subjectErr
  }

  for (const topicData of topicsData) {
    const { blocks, ...topicFields } = topicData
    assert(topicFields.name, `${path.basename(filePath)}: every topic needs a "name"`)
    assert(Array.isArray(blocks), `${path.basename(filePath)}: topic "${topicFields.name}" needs a "blocks" array`)

    // 2. Find-or-create topic by subject_id + name
    let { data: existing } = await supabase
      .from('topics')
      .select('id')
      .eq('subject_id', subject.id)
      .eq('name', topicFields.name)
      .maybeSingle()

    let topicId
    if (existing) {
      await supabase
        .from('topics')
        .update({ paper: topicFields.paper ?? null, display_order: topicFields.display_order ?? 0, exam_board: topicFields.exam_board ?? null })
        .eq('id', existing.id)
      topicId = existing.id
    } else {
      const { data: inserted, error: topicErr } = await supabase
        .from('topics')
        .insert({
          subject_id: subject.id,
          name: topicFields.name,
          paper: topicFields.paper ?? null,
          display_order: topicFields.display_order ?? 0,
          exam_board: topicFields.exam_board ?? null,
        })
        .select('id')
        .single()

      if (topicErr) {
        console.error('    Topic error:', topicErr.message)
        throw topicErr
      }
      topicId = inserted.id
    }

    console.log(`  📝  ${topicFields.name} (id: ${topicId})`)

    for (const block of blocks) {
      const { block_number, block_name = null, cards } = block
      assert(block_number != null, `topic "${topicFields.name}": every block needs a "block_number"`)
      assert(Array.isArray(cards), `topic "${topicFields.name}" block ${block_number}: needs a "cards" array`)

      // 3. Delete existing cards for this topic+block, then re-insert
      await supabase.from('cards').delete().eq('topic_id', topicId).eq('block_number', block_number)

      const rows = cards.map((card, i) => ({
        topic_id: topicId,
        block_number,
        block_name,
        keyword: card.keyword,
        definition: card.definition,
        display_order: i,
      }))

      const { error: cardErr } = await supabase.from('cards').insert(rows)
      if (cardErr) {
        console.error(`    Card error (block ${block_number}):`, cardErr.message)
        throw cardErr
      }

      console.log(`       Block ${block_number}: ${cards.length} cards`)
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const dataDir = path.join(__dirname, '..', 'data')

  if (!fs.existsSync(dataDir)) {
    console.error('\n❌  data/ directory not found — create it and add JSON files.\n')
    process.exit(1)
  }

  const fileFilter = process.argv[2] // optional: node scripts/seed.js history.json
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => {
      if (f === 'example-subject.json') return false
      if (!f.endsWith('.json')) return false
      if (fileFilter) return f === fileFilter
      return true
    })
    .sort()

  if (files.length === 0) {
    console.log('\n⚠️  No content JSON files found in data/  (example-subject.json is ignored)\n')
    process.exit(0)
  }

  for (const file of files) {
    await seedFile(path.join(dataDir, file))
  }

  console.log('\n✅  Seed complete!\n')
}

main().catch((err) => {
  console.error('\n❌  Seed failed:', err.message ?? err)
  process.exit(1)
})
