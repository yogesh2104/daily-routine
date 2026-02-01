// Workout program types

export interface Exercise {
    name: string
    sets: number
    reps: string | number
    type?: 'warmup'
    intensity?: 'heavy'
    per_side?: boolean
    per_leg?: boolean
    duration_sec?: number
}

export interface CoreExercise {
    name: string
    sets: number
    reps?: number
    duration_sec?: number
    per_side?: boolean
}

export interface Finisher {
    name: string
    duration_min: number
}

export interface CardioExercise {
    name: string
    duration_min: number | string
    focus?: string[]
}

export interface AbsCircuit {
    rounds: number
    exercises: {
        name: string
        reps?: number
        duration_sec?: number
    }[]
}

export interface GymDay {
    label: string
    exercises?: Exercise[]
    core?: CoreExercise[]
    finisher?: Finisher
    cardio?: CardioExercise[]
    abs_circuit?: AbsCircuit
    activities?: CardioExercise[]
    notes?: string[]
}

export interface GymProgram {
    frequency_per_week: number
    notes: string[]
    days: Record<string, GymDay>
}

// Daily routine types
export interface WeekDay {
    workout: {
        morning: string
        evening_gym: string
    }
    nutrition: {
        lunch_dal: string
    }
    skincare_pm: string
    gym_day?: string
}

export interface DailyConstants {
    hydration_liters: number
    morning: string[]
    am_skincare: string[]
    pm_skincare_base: string[]
}

export interface SleepConfig {
    bed_time: string
    wake_time: string
    target_hours: number
}

export interface WeeklyRoutine {
    sleep: SleepConfig
    daily_constants: DailyConstants
    week: Record<string, WeekDay>
}
