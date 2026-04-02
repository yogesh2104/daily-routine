// Database types for Supabase tables

export interface WorkoutSession {
    id: string
    user_id: string
    date: string // ISO date string YYYY-MM-DD
    gym_day_key: GymDayKey
    session_label?: string
    completed: boolean
    notes?: string
    created_at: string
    updated_at: string
}

export interface ExerciseSet {
    id: string
    session_id: string
    exercise_name: string
    exercise_order?: number
    set_number: number
    reps_target?: string
    reps_done?: number
    weight_used?: number
    duration_sec?: number
    rpe?: number // Added rpe field
    completed: boolean
    created_at: string
}

export interface DailyHabit {
    id: string
    user_id: string
    date: string // ISO date string YYYY-MM-DD
    habit_key: HabitKey
    completed: boolean
    value?: string
    created_at: string
    updated_at: string
}

export interface BodyStat {
    id: string
    user_id: string
    date: string
    weight?: number
    body_fat?: number
    waist?: number
    notes?: string
    created_at: string
    updated_at: string
}

// Enum types
export type GymDayKey =
    | 'day_1_push'
    | 'day_2_pull'
    | 'day_3_active_cardio_abs'
    | 'day_4_legs_core'
    | 'day_5_shoulders_calisthenics'
    | 'day_6_light_cardio'
    | 'day_7_rest'
    | 'custom'

export type HabitKey =
    | 'water'
    | 'morning_routine'
    | 'skincare_am'
    | 'skincare_pm'
    | 'steps'
    | 'sleep'
    | 'sleep_bed'
    | 'sleep_wake'
    | 'protein'
    | 'protein_grams'

// Database insert types (without auto-generated fields)
export type WorkoutSessionInsert = Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>
export type ExerciseSetInsert = Omit<ExerciseSet, 'id' | 'created_at'>
export type DailyHabitInsert = Omit<DailyHabit, 'id' | 'created_at' | 'updated_at'>

// Database update types
export type WorkoutSessionUpdate = Partial<Omit<WorkoutSession, 'id' | 'user_id' | 'created_at'>>
export type ExerciseSetUpdate = Partial<Omit<ExerciseSet, 'id' | 'session_id' | 'created_at'>>
export type DailyHabitUpdate = Partial<Omit<DailyHabit, 'id' | 'user_id' | 'created_at'>>
