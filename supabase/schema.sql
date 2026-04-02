-- =============================================
-- Personal Fitness & Routine Tracker
-- Supabase Database Schema
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- WORKOUT SESSIONS
-- =============================================
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gym_day_key TEXT NOT NULL,
    session_label TEXT,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, date);

-- =============================================
-- EXERCISE SETS
-- =============================================
CREATE TABLE exercise_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    exercise_order INTEGER NOT NULL DEFAULT 0,
    set_number INTEGER NOT NULL,
    reps_target TEXT,
    reps_done INTEGER,
    weight_used DECIMAL(6,2),
    duration_sec INTEGER,
    rpe INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, exercise_name, set_number)
);

CREATE INDEX idx_exercise_sets_session ON exercise_sets(session_id);
CREATE INDEX idx_exercise_sets_session_order ON exercise_sets(session_id, exercise_order, set_number);

-- =============================================
-- DAILY HABITS
-- =============================================
CREATE TABLE daily_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    habit_key TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, habit_key)
);

CREATE INDEX idx_daily_habits_user_date ON daily_habits(user_id, date);

-- =============================================
-- BODY STATS
-- =============================================
CREATE TABLE body_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2),
    body_fat DECIMAL(4,1),
    waist DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- =============================================
-- RLS
-- =============================================
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout sessions"
    ON workout_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions"
    ON workout_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions"
    ON workout_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sessions"
    ON workout_sessions FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercise sets"
    ON exercise_sets FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
              AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own exercise sets"
    ON exercise_sets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
              AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own exercise sets"
    ON exercise_sets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
              AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own exercise sets"
    ON exercise_sets FOR DELETE
    USING (
        EXISTS (
            SELECT 1
            FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
              AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own daily habits"
    ON daily_habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily habits"
    ON daily_habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily habits"
    ON daily_habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily habits"
    ON daily_habits FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own body stats"
    ON body_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body stats"
    ON body_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body stats"
    ON body_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workout_sessions_updated_at
    BEFORE UPDATE ON workout_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_habits_updated_at
    BEFORE UPDATE ON daily_habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_body_stats_updated_at
    BEFORE UPDATE ON body_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
