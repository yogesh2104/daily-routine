// Database types for Supabase tables

export interface WorkoutSession {
    id: string
    user_id: string
    date: string // ISO date string YYYY-MM-DD
    gym_day_key: GymDayKey
    completed: boolean
    notes?: string
    created_at: string
    updated_at: string
}

export interface ExerciseSet {
    id: string
    session_id: string
    exercise_name: string
    set_number: number
    reps_target?: string
    reps_done?: number
    weight_used?: number
    duration_sec?: number
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

// Enum types
export type GymDayKey =
    | 'day_1_push'
    | 'day_2_pull'
    | 'day_3_active_cardio_abs'
    | 'day_4_legs_core'
    | 'day_5_shoulders_calisthenics'
    | 'day_6_light_cardio'
    | 'day_7_rest'

export type HabitKey =
    | 'water'
    | 'morning_routine'
    | 'skincare_am'
    | 'skincare_pm'
    | 'steps'
    | 'sleep_bed'
    | 'sleep_wake'

// Database insert types (without auto-generated fields)
export type WorkoutSessionInsert = Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>
export type ExerciseSetInsert = Omit<ExerciseSet, 'id' | 'created_at'>
export type DailyHabitInsert = Omit<DailyHabit, 'id' | 'created_at' | 'updated_at'>

// Database update types
export type WorkoutSessionUpdate = Partial<Omit<WorkoutSession, 'id' | 'user_id' | 'created_at'>>
export type ExerciseSetUpdate = Partial<Omit<ExerciseSet, 'id' | 'session_id' | 'created_at'>>
export type DailyHabitUpdate = Partial<Omit<DailyHabit, 'id' | 'user_id' | 'created_at'>>
