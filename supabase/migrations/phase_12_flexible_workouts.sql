-- =============================================
-- Phase 12: Flexible Workouts
-- =============================================

ALTER TABLE workout_sessions
    ADD COLUMN IF NOT EXISTS session_label TEXT;

ALTER TABLE exercise_sets
    ADD COLUMN IF NOT EXISTS exercise_order INTEGER NOT NULL DEFAULT 0;

WITH ranked_sets AS (
    SELECT
        id,
        DENSE_RANK() OVER (
            PARTITION BY session_id
            ORDER BY exercise_name
        ) - 1 AS next_order
    FROM exercise_sets
)
UPDATE exercise_sets
SET exercise_order = ranked_sets.next_order
FROM ranked_sets
WHERE exercise_sets.id = ranked_sets.id
  AND exercise_sets.exercise_order = 0;

CREATE INDEX IF NOT EXISTS idx_exercise_sets_session_order
    ON exercise_sets(session_id, exercise_order, set_number);
