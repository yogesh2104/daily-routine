-- =============================================
-- Phase 11: Body & Diet Enhancements
-- =============================================

-- Add RPE (Rate of Perceived Exertion) to exercise sets
ALTER TABLE exercise_sets ADD COLUMN IF NOT EXISTS rpe INTEGER;

-- Create Body Stats table for tracking physical progress
CREATE TABLE IF NOT EXISTS body_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2), -- in kg
    body_fat DECIMAL(4,1), -- percentage
    waist DECIMAL(5,2), -- in cm
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One entry per user per day
    UNIQUE(user_id, date)
);

-- Enable RLS for body_stats
ALTER TABLE body_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own body stats"
    ON body_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body stats"
    ON body_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body stats"
    ON body_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- Update sleep habits logic
-- We will use the 'value' column in daily_habits to store '22:30-05:00' format
