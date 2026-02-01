-- =============================================
-- Personal Fitness & Routine Tracker
-- Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- WORKOUT SESSIONS TABLE
-- Stores each workout session per user per day
-- =============================================
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    gym_day_key TEXT NOT NULL, -- e.g., 'day_1_push', 'day_2_pull'
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One session per user per day
    UNIQUE(user_id, date)
);

-- Index for faster queries
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, date);

-- =============================================
-- EXERCISE SETS TABLE
-- Individual set tracking within a workout
-- =============================================
CREATE TABLE exercise_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps_target TEXT, -- Can be "max" or a number like "8-10"
    reps_done INTEGER,
    weight_used DECIMAL(6,2), -- Weight in kg
    duration_sec INTEGER, -- For timed exercises
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique set per exercise per session
    UNIQUE(session_id, exercise_name, set_number)
);

-- Index for faster queries
CREATE INDEX idx_exercise_sets_session ON exercise_sets(session_id);

-- =============================================
-- DAILY HABITS TABLE
-- Track daily habit completion
-- =============================================
CREATE TABLE daily_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    habit_key TEXT NOT NULL, -- e.g., 'water', 'skincare_am', 'skincare_pm', 'morning_routine'
    completed BOOLEAN DEFAULT FALSE,
    value TEXT, -- Optional: for sleep times or water count
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One record per habit per user per day
    UNIQUE(user_id, date, habit_key)
);

-- Index for faster queries
CREATE INDEX idx_daily_habits_user_date ON daily_habits(user_id, date);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- Users can only access their own data
-- =============================================

-- Enable RLS on all tables
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;

-- Workout Sessions Policies
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

-- Exercise Sets Policies (via session ownership)
CREATE POLICY "Users can view own exercise sets"
    ON exercise_sets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own exercise sets"
    ON exercise_sets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own exercise sets"
    ON exercise_sets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own exercise sets"
    ON exercise_sets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workout_sessions
            WHERE workout_sessions.id = exercise_sets.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

-- Daily Habits Policies
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

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_workout_sessions_updated_at
    BEFORE UPDATE ON workout_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_habits_updated_at
    BEFORE UPDATE ON daily_habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
