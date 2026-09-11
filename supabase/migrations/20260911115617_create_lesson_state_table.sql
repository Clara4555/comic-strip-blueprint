/*
# Create lesson_state table for AI Explorers Lesson 2

1. New Tables
- `lesson_state`: Stores the student's comic blueprint, generated panels, 
  prompt versions, review notes, quiz answers, reflection answers, and 
  progress tracking for Lesson 2 (Bring Your Comic to Life).
  - `id` (uuid, primary key)
  - `student_name` (text, default 'Young Explorer')
  - `blueprint` (jsonb) — the student's comic blueprint from Lesson 1
  - `panels` (jsonb) — 3 comic panels with scene details, image prompts, 
    prompt versions, generated images, and review notes
  - `character_description` (text) — master character description
  - `progress` (jsonb) — current screen index and completed screens
  - `quiz_answers` (jsonb) — student's quiz responses
  - `reflection_answers` (jsonb) — student's reflection responses
  - `challenge_prompt` (text) — mini challenge prompt
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `lesson_state`.
- Single-tenant app (no sign-in): allow anon + authenticated full CRUD 
  because this is a one-on-one educational tool with intentionally shared data.
*/

CREATE TABLE IF NOT EXISTS lesson_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL DEFAULT 'Young Explorer',
  blueprint jsonb NOT NULL DEFAULT '{}'::jsonb,
  panels jsonb NOT NULL DEFAULT '{}'::jsonb,
  character_description text DEFAULT '',
  progress jsonb NOT NULL DEFAULT '{"currentScreen": 0, "completedScreens": []}'::jsonb,
  quiz_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  reflection_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  challenge_prompt text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lesson_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lesson_state" ON lesson_state;
CREATE POLICY "anon_select_lesson_state" ON lesson_state FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lesson_state" ON lesson_state;
CREATE POLICY "anon_insert_lesson_state" ON lesson_state FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lesson_state" ON lesson_state;
CREATE POLICY "anon_update_lesson_state" ON lesson_state FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lesson_state" ON lesson_state;
CREATE POLICY "anon_delete_lesson_state" ON lesson_state FOR DELETE
  TO anon, authenticated USING (true);
