import type { GymDayKey } from '@/types/database'
import type {
    GymProgram,
    WorkoutSetTemplate,
    WorkoutTemplateOption,
} from '@/types/workout'

type TemplateGymDayKey = Exclude<GymDayKey, 'custom'>

export const gymProgram: GymProgram = {
    frequency_per_week: 5,
    notes: [
        'Keep sessions 45-60 minutes',
        'Use progressive overload when recovery is good',
        'Swap painful movements instead of forcing them',
        'Recovery is part of the program, not a break from it',
    ],
    days: {
        day_1_push: {
            label: 'Push (Chest + Triceps + Core)',
            exercises: [
                { name: 'Push-ups', sets: 3, reps: 'max', type: 'warmup' },
                { name: 'Bench Press', sets: 4, reps: '8-10', intensity: 'heavy' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
                { name: 'Machine Chest Press', sets: 3, reps: '10-12' },
                { name: 'Triceps Pushdown', sets: 3, reps: '12-15' },
            ],
            core: [
                { name: 'Cable Crunch', sets: 3, reps: 12 },
                { name: 'Front Plank', sets: 3, duration_sec: 45 },
            ],
            finisher: {
                name: 'Incline Treadmill Walk',
                duration_min: 8,
            },
        },
        day_2_pull: {
            label: 'Pull (Back + Biceps + Core Stability)',
            exercises: [
                { name: 'Lat Pulldown', sets: 4, reps: '8-10' },
                { name: 'Seated Cable Row', sets: 3, reps: '10-12' },
                { name: 'One-Arm Dumbbell Row', sets: 3, reps: '10-12' },
                { name: 'Face Pull', sets: 3, reps: '12-15' },
                { name: 'Hammer Curl', sets: 3, reps: '10-12' },
            ],
            core: [
                { name: 'Dead Hang', sets: 3, duration_sec: 30 },
                { name: 'Pallof Press', sets: 3, reps: 12, per_side: true },
            ],
            finisher: {
                name: 'Rowing Machine',
                duration_min: 8,
            },
        },
        day_3_active_cardio_abs: {
            label: 'Active Cardio + Abs',
            cardio: [
                { name: 'Incline Treadmill', duration_min: 6 },
                { name: 'Rowing', duration_min: 4 },
            ],
            abs_circuit: {
                rounds: 3,
                exercises: [
                    { name: 'Hanging Leg Raises', reps: 10 },
                    { name: 'Bicycle Crunch', reps: 20 },
                    { name: 'Mountain Climbers', duration_sec: 40 },
                ],
            },
            notes: ['Keep this day light if recovery is low'],
        },
        day_4_legs_core: {
            label: 'Legs + Core',
            exercises: [
                { name: 'Goblet Squat or Leg Press', sets: 4, reps: '10-12' },
                { name: 'Walking Lunges', sets: 3, reps: '10 each leg', per_leg: true },
                { name: 'Romanian Deadlift', sets: 3, reps: '8-10' },
                { name: 'Leg Curl', sets: 3, reps: '12-15' },
                { name: 'Standing Calf Raise', sets: 4, reps: '15-20' },
            ],
            core: [
                { name: 'Decline Sit-up', sets: 3, reps: 15 },
                { name: 'Reverse Crunch', sets: 3, reps: 15 },
            ],
            finisher: {
                name: 'Fast Walk',
                duration_min: 8,
            },
        },
        day_5_shoulders_calisthenics: {
            label: 'Shoulders + Calisthenics',
            exercises: [
                { name: 'Overhead Press', sets: 4, reps: '8-10' },
                { name: 'Dumbbell Lateral Raise', sets: 4, reps: '12-15' },
                { name: 'Rear Delt Fly', sets: 3, reps: '12-15' },
                { name: 'Pike Push-up', sets: 3, reps: 'max' },
                { name: 'Farmer Carry', sets: 3, reps: '40m' },
            ],
            core: [
                { name: 'Hanging Knee Raise', sets: 3, reps: 12 },
                { name: 'Side Plank', sets: 3, duration_sec: 30, per_side: true },
            ],
        },
        day_6_light_cardio: {
            label: 'Light Cardio + Mobility',
            activities: [
                { name: 'Walking', duration_min: '30-40' },
                { name: 'Mobility + Stretching', duration_min: 15, focus: ['hips', 'hamstrings', 'lower back'] },
            ],
        },
        day_7_rest: {
            label: 'Rest Day',
            notes: [
                'No gym',
                'Focus on sleep and hydration',
                'Light walking and mobility only',
            ],
        },
    },
}

export const dayOfWeekToGymDay: Record<number, TemplateGymDayKey> = {
    0: 'day_7_rest',
    1: 'day_1_push',
    2: 'day_2_pull',
    3: 'day_3_active_cardio_abs',
    4: 'day_4_legs_core',
    5: 'day_5_shoulders_calisthenics',
    6: 'day_6_light_cardio',
}

export const workoutDayOptions: WorkoutTemplateOption[] = [
    {
        key: 'day_1_push',
        shortLabel: 'Push',
        label: 'Push',
        description: 'Chest, triceps, and simple core work',
    },
    {
        key: 'day_2_pull',
        shortLabel: 'Pull',
        label: 'Pull',
        description: 'Back, biceps, and posture work',
    },
    {
        key: 'day_3_active_cardio_abs',
        shortLabel: 'Cardio',
        label: 'Cardio + Abs',
        description: 'Lighter day when recovery is low',
    },
    {
        key: 'day_4_legs_core',
        shortLabel: 'Legs',
        label: 'Legs',
        description: 'Lower-body strength and core',
    },
    {
        key: 'day_5_shoulders_calisthenics',
        shortLabel: 'Shoulders',
        label: 'Shoulders',
        description: 'Shoulders, carries, and calisthenics',
    },
    {
        key: 'day_6_light_cardio',
        shortLabel: 'Light',
        label: 'Light Cardio',
        description: 'Walking, mobility, or an easy recovery session',
    },
    {
        key: 'custom',
        shortLabel: 'Custom',
        label: 'Custom',
        description: 'Build the exact session your trainer gives you today',
    },
]

export function isGymDayKey(value: string): value is GymDayKey {
    return workoutDayOptions.some((option) => option.key === value)
}

export function getWorkoutDayLabel(dayKey: GymDayKey): string {
    if (dayKey === 'custom') {
        return 'Custom Trainer Session'
    }

    return gymProgram.days[dayKey]?.label || 'Workout Session'
}

export function buildWorkoutTemplate(dayKey: GymDayKey): WorkoutSetTemplate[] {
    if (dayKey === 'custom') {
        return []
    }

    const day = gymProgram.days[dayKey]
    if (!day) {
        return []
    }

    const template: WorkoutSetTemplate[] = []
    let exerciseOrder = 0

    const addExercise = (
        exerciseName: string,
        totalSets: number,
        repsTarget: string,
        durationSec?: number
    ) => {
        for (let setNumber = 1; setNumber <= totalSets; setNumber += 1) {
            template.push({
                exercise_name: exerciseName,
                exercise_order: exerciseOrder,
                set_number: setNumber,
                reps_target: repsTarget,
                duration_sec: durationSec,
            })
        }

        exerciseOrder += 1
    }

    day.exercises?.forEach((exercise) => {
        addExercise(
            exercise.name,
            exercise.sets,
            String(exercise.reps),
            exercise.duration_sec
        )
    })

    day.core?.forEach((exercise) => {
        addExercise(
            `${exercise.name} (Core)`,
            exercise.sets,
            exercise.reps ? String(exercise.reps) : `${exercise.duration_sec}s`,
            exercise.duration_sec
        )
    })

    if (day.abs_circuit) {
        for (let round = 1; round <= day.abs_circuit.rounds; round += 1) {
            day.abs_circuit.exercises.forEach((exercise) => {
                addExercise(
                    `${exercise.name} (Round ${round})`,
                    1,
                    exercise.reps ? String(exercise.reps) : `${exercise.duration_sec}s`,
                    exercise.duration_sec
                )
            })
        }
    }

    return template
}

export function getTodaysGymDay() {
    const dayOfWeek = new Date().getDay()
    const gymDayKey = dayOfWeekToGymDay[dayOfWeek]

    return {
        key: gymDayKey,
        day: gymProgram.days[gymDayKey],
    }
}
