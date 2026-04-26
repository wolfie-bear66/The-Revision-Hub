# The Revision Hub

GCSE flashcard revision app built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

---

## Project structure

```
the-revision-hub/
├── app/
│   ├── layout.jsx                  ← root layout + metadata
│   ├── globals.css                 ← Tailwind base styles
│   ├── page.jsx                    ← landing page — all subjects
│   ├── not-found.jsx               ← 404 page
│   ├── [subject]/
│   │   ├── page.jsx                ← topics for a subject, grouped by paper
│   │   └── [topic]/
│   │       ├── page.jsx            ← server component — fetches cards, renders quiz
│   │       └── FlashcardQuiz.jsx   ← client component — flip/got it/missed it UI
│   └── dashboard/
│       └── page.jsx                ← Phase 2 placeholder
├── lib/
│   └── supabase.js                 ← createClient() helper
├── data/
│   ├── example-subject.json        ← format reference (ignored by seed script)
│   └── english-language.json       ← your content files go here
├── scripts/
│   └── seed.js                     ← loads data/ JSON files into Supabase
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  ← run once to create tables + RLS policies
├── .env.local.example
└── README.md
```

---

## Running locally

### 1. Clone and install

```bash
git clone <your-repo-url>
cd the-revision-hub
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Note:** `SUPABASE_SERVICE_ROLE_KEY` is only needed by the seed script — it never runs in the browser. Never commit it to git.

### 3. Run the database migration

Open the [Supabase SQL editor](https://app.supabase.com/) for your project and paste the contents of `supabase/migrations/001_initial_schema.sql`, then run it.

This creates the `subjects`, `topics`, `cards`, `sessions`, and `card_attempts` tables and configures Row Level Security.

### 4. Seed content

Add your subject JSON files to `data/` (see format below), then run:

```bash
npm run seed
```

The script is safe to re-run — it upserts subjects and topics, and replaces cards per block.

### 5. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Adding a new subject

1. Create `data/your-subject-slug.json` following the format below.
2. Run `npm run seed`.
3. The subject will appear on the home page immediately.

### JSON format

```json
{
  "subject": {
    "name": "English Language",
    "slug": "english-language",
    "colour": "#3b82f6"
  },
  "topics": [
    {
      "name": "Language & structure techniques",
      "paper": "Paper 1 & 2",
      "display_order": 1,
      "blocks": [
        {
          "block_number": 1,
          "cards": [
            { "keyword": "Simile", "definition": "A comparison using 'like' or 'as', e.g. 'as cold as ice'." },
            { "keyword": "Metaphor", "definition": "A direct comparison that states one thing IS another." }
          ]
        },
        {
          "block_number": 2,
          "cards": [
            { "keyword": "Alliteration", "definition": "Repetition of the same consonant sound at the start of nearby words." }
          ]
        }
      ]
    }
  ]
}
```

**Rules:**
- `slug` must be unique and URL-safe (lowercase, hyphens only).
- `colour` is a hex code used for UI theming.
- Each block should contain exactly 10 cards (the quiz works with any number, but 10 is the convention).
- `display_order` controls the order topics appear on the subject page.

---

## Deploying to Vercel

1. Push your repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the three environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(mark as secret / don't expose to browser)*
4. Deploy. Vercel auto-detects Next.js — no build config needed.

> Content changes (new JSON files) require re-running `npm run seed` locally against the production Supabase project, or from CI.

---

## Phase 2 (not yet built)

- **Supabase Auth** — magic link login
- **Progress dashboard** — line charts of score per topic/block over time using the `sessions` and `card_attempts` tables (schema already in place)

The `/dashboard` route exists as a placeholder with "coming soon" messaging.
