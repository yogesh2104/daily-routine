# Suggestions

## Health suggestions

- Protect sleep first. With your 7:20 AM departure and 8 PM return, the biggest recovery win is a consistent 11:00 PM sleep target and a 45-60 minute gym cap.
- Keep breakfast fixed and simple: oats + 2 bananas works, but add 25-30g sattu or a small roasted chana portion on harder training days if protein is low.
- Carry 2 office snacks every day so commute fatigue does not ruin diet control:
  - roasted chana
  - peanut + chana mix or 1 banana
- For a low-budget, no-protein-powder plan, build most protein from soya chunks, dal, sattu, roasted chana, peanuts when budget allows.
- If you still eat eggs sometimes, treat them as optional, not required. The base plan should still work without them.
- Track waist weekly and body weight 3 times per week in the morning, then use the average. That is more useful than one random weigh-in.
- On pain or heavy soreness days, reduce load and log the actual trainer change instead of forcing the original plan.
- Drink enough water with a little salt and lemon on long commute + gym days, especially before leg day or summer sessions.

## Product suggestions

- Add pain/recovery tags to workout notes like `shoulder pain`, `low energy`, `machine busy`, `trainer changed`.
- Add a small weekly summary card for:
  - average protein
  - average sleep
  - completed workouts
  - body weight trend
- Add a quick toggle for `template`, `trainer modified`, and `fully custom` session types.
- Add exercise-level notes later if you want to track form cues or pain on a specific movement.
- Add a "duplicate yesterday/last pull day" option if your trainer often reuses similar sessions.
- Show a protein gap hint on the dashboard, for example: `You are at 58g, add sattu or dal at dinner.`

## Project context

- Project type: personal daily routine + fitness tracker.
- Stack: Next.js 16, React 19, TypeScript, Supabase.
- Main user need: track daily habits, diet, body stats, and gym workouts around a long office commute.
- Important change already done: workout logging is now flexible instead of fully static.

## Key files

- `app/workout/page.tsx`
- `config/workout-program.ts`
- `config/daily-routine.ts`
- `config/diet-plan.ts`
- `config/habits.ts`
- `types/database.ts`
- `types/workout.ts`
- `supabase/schema.sql`
- `supabase/migrations/phase_12_flexible_workouts.sql`

## Current app state

- Workout page supports:
  - loading a template day
  - switching to a custom session
  - editing session label
  - adding/removing exercises
  - adding/removing sets
  - editing target reps per set
  - saving the real trainer-led session
- Workout data now includes:
  - `session_label` on `workout_sessions`
  - `exercise_order` on `exercise_sets`
- Routine config now matches your real schedule better:
  - 7:20 AM leave for office
  - around 8 PM return
  - late evening gym
- Diet config now focuses on:
  - budget around INR 2,000/month
  - no protein powder
  - plant-first protein sources
- Home dashboard now shows:
  - a realistic daily timeline
  - day-specific suggestions

## Important pending step

- Supabase migration still needs to be applied:
  - `supabase/migrations/phase_12_flexible_workouts.sql`
- Until that migration is applied, the new workout fields may not work fully in production.

## Good next tasks for a new chat

- Apply and verify the new Supabase migration.
- Add a recent-exercise picker for faster custom workout entry.
- Add weekly nutrition and sleep summaries.
- Improve the dashboard tips so they reflect actual tracked protein and sleep.
- Add an easier mobile UX for custom workouts if the current builder feels too long.

## New chat handoff

Use this context in the next chat:

`This project is a Next.js + Supabase daily routine and fitness tracker. The workout page was refactored to support flexible trainer-led sessions with custom exercises, custom set counts, editable target reps, session_label, and exercise_order. The new migration phase_12_flexible_workouts.sql may still need to be applied. Please continue from suggestion.md and improve the next highest-value task without rewriting the existing flexibility work.`
