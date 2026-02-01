import type { GymProgram } from '@/types/workout'

export const gymProgram: GymProgram = {
    frequency_per_week: 5,
    notes: [
        'Keep sessions 45–60 min',
        'Progressive overload',
        'No excessive cardio',
        'Recovery is mandatory'
    ],
    days: {
        day_1_push: {
            label: 'Push (Chest + Triceps + Core Load)',
            exercises: [
                { name: 'Push-ups', sets: 3, reps: 'max', type: 'warmup' },
                { name: 'Bench Press', sets: 4, reps: '8–10', intensity: 'heavy' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
                { name: 'Triceps Dips', sets: 3, reps: 'max' },
                { name: 'Triceps Pushdown', sets: 3, reps: 12 }
            ],
            core: [
                { name: 'Cable Crunch', sets: 3, reps: 12 },
                { name: 'Front Plank', sets: 3, duration_sec: 60 }
            ],
            finisher: {
                name: 'Incline Treadmill Walk',
                duration_min: 8
            }
        },
        day_2_pull: {
            label: 'Pull (Back + Biceps + Core Stability)',
            exercises: [
                { name: 'Pull-ups / Assisted', sets: 4, reps: 'max' },
                { name: 'Lat Pulldown', sets: 3, reps: 10 },
                { name: 'One-Arm Dumbbell Row', sets: 4, reps: 10 },
                { name: 'Seated Cable Row', sets: 3, reps: 12 },
                { name: 'Barbell or Dumbbell Curl', sets: 3, reps: 10 },
                { name: 'Hammer Curl', sets: 2, reps: 12 }
            ],
            core: [
                { name: 'Dead Hang', sets: 3, duration_sec: 40 },
                { name: 'Pallof Press', sets: 3, reps: 12, per_side: true }
            ],
            finisher: {
                name: 'Rowing Machine',
                duration_min: 8
            }
        },
        day_3_active_cardio_abs: {
            label: 'Active Cardio + Abs (Light)',
            cardio: [
                { name: 'Incline Treadmill', duration_min: 5 },
                { name: 'Rowing', duration_min: 3 },
                { name: 'Air Runner', duration_min: 1 }
            ],
            abs_circuit: {
                rounds: 3,
                exercises: [
                    { name: 'Hanging Leg Raises', reps: 12 },
                    { name: 'Bicycle Crunch', reps: 20 },
                    { name: 'Mountain Climbers', duration_sec: 40 }
                ]
            },
            notes: ['No additional cardio']
        },
        day_4_legs_core: {
            label: 'Legs + Core (Abs Pop Day)',
            exercises: [
                { name: 'Goblet Squats', sets: 4, reps: 12 },
                { name: 'Dumbbell Lunges', sets: 3, reps: 12, per_leg: true },
                { name: 'Leg Curl', sets: 3, reps: 12 },
                { name: 'Leg Extension', sets: 3, reps: 12 },
                { name: 'Standing Calf Raise', sets: 4, reps: 15 }
            ],
            core: [
                { name: 'Decline Sit-ups', sets: 3, reps: 15 },
                { name: 'Reverse Crunch', sets: 3, reps: 15 }
            ],
            finisher: {
                name: 'Fast Walk',
                duration_min: 8
            }
        },
        day_5_shoulders_calisthenics: {
            label: 'Shoulders + Calisthenics (V-Taper Day)',
            exercises: [
                { name: 'Overhead Press', sets: 4, reps: 8 },
                { name: 'Dumbbell Lateral Raise', sets: 4, reps: 12 },
                { name: 'Pike Push-ups', sets: 3, reps: 'max' },
                { name: 'Dumbbell Shrugs', sets: 3, reps: 12 },
                { name: 'Farmer Carry', sets: 4, reps: 45 }
            ],
            core: [
                { name: 'Hanging Knee Raises', sets: 3, reps: 15 },
                { name: 'Side Plank', sets: 3, duration_sec: 30, per_side: true }
            ]
        },
        day_6_light_cardio: {
            label: 'Light Cardio + Mobility',
            activities: [
                { name: 'Walking', duration_min: '30–40' },
                { name: 'Mobility & Stretching', duration_min: 15, focus: ['hips', 'hamstrings', 'lower back'] }
            ]
        },
        day_7_rest: {
            label: 'Rest Day',
            notes: [
                'No gym',
                'Focus on recovery',
                'Sleep, hydration, light walking only'
            ]
        }
    }
}

// Map day of week (0=Sunday) to gym day key
export const dayOfWeekToGymDay: Record<number, string> = {
    0: 'day_7_rest',      // Sunday
    1: 'day_1_push',      // Monday
    2: 'day_2_pull',      // Tuesday
    3: 'day_3_active_cardio_abs', // Wednesday
    4: 'day_4_legs_core', // Thursday
    5: 'day_5_shoulders_calisthenics', // Friday
    6: 'day_6_light_cardio' // Saturday
}

export function getTodaysGymDay() {
    const dayOfWeek = new Date().getDay()
    const gymDayKey = dayOfWeekToGymDay[dayOfWeek]
    return {
        key: gymDayKey,
        day: gymProgram.days[gymDayKey]
    }
}
