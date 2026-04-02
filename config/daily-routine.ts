import type { RoutineSlot, WeeklyRoutine } from '@/types/workout'

function createOfficeDayTimeline(gymLabel: string, preWorkoutMeal: string): RoutineSlot[] {
    return [
        { time: '6:00 AM', label: 'Wake up', details: 'Drink water, get sunlight, and do 5 minutes of easy mobility.' },
        { time: '6:15 AM', label: 'Breakfast', details: 'Oats + 2 bananas. Keep it simple so you never skip it.' },
        { time: '6:40 AM', label: 'Pack and get ready', details: 'Carry lunch, roasted chana, and a full water bottle before leaving.' },
        { time: '7:20 AM', label: 'Leave for office', details: 'Use commute time for hydration, not extra junk snacks.' },
        { time: '10:30 AM', label: 'Mid-morning', details: 'Seed drink on alternate days, otherwise 1 fruit or plain water.' },
        { time: '1:00 PM', label: 'Lunch', details: '2 roti + sabzi + low-oil soya and peanut mix.' },
        { time: '5:30 PM', label: 'Office snack', details: 'Roasted chana or peanut-chana mix so you do not reach home too hungry.' },
        { time: '8:15 PM', label: 'Pre-workout meal', details: preWorkoutMeal },
        { time: '9:00 PM', label: 'Gym', details: `${gymLabel}. Keep it to 45-60 minutes.` },
        { time: '10:15 PM', label: 'Dinner', details: 'Dal + rice + salad. Add extra dal or tofu if lunch protein was low.' },
        { time: '11:00 PM', label: 'Sleep', details: 'Try to keep lights low and protect at least 7 hours of sleep.' },
    ]
}

function createRecoveryTimeline(label: string): RoutineSlot[] {
    return [
        { time: '6:30 AM', label: 'Wake up slower', details: 'Hydrate, light stretching, and 10 minutes of walking.' },
        { time: '7:00 AM', label: 'Breakfast', details: 'Oats or poha with banana and seeds.' },
        { time: '10:30 AM', label: 'Mid-morning', details: 'Fruit, seed drink, or plain lemon water.' },
        { time: '1:00 PM', label: 'Lunch', details: 'Simple dal, rice, roti, and sabzi.' },
        { time: '5:30 PM', label: 'Snack', details: 'Roasted chana, peanuts, or sprouts.' },
        { time: '7:30 PM', label: label, details: 'Walk, stretch, or rest based on how your body feels.' },
        { time: '9:30 PM', label: 'Dinner', details: 'Keep dinner easy to digest and lower in oil.' },
        { time: '10:45 PM', label: 'Sleep', details: 'Use recovery days to catch up on rest, not to stay up late.' },
    ]
}

export const weeklyRoutine: WeeklyRoutine = {
    sleep: {
        bed_time: '23:00',
        wake_time: '06:00',
        target_hours: 7,
    },
    daily_constants: {
        hydration_liters: 3.5,
        morning: [
            '300-400ml water after waking',
            '5 minutes of mobility, breathing, or sunlight',
            'Pack lunch and an office snack before leaving',
        ],
        am_skincare: [
            'Cleanser',
            'Moisturizer',
            'Sunscreen SPF 50',
        ],
        pm_skincare_base: [
            'Cleanser',
            'Moisturizer',
            'Lip balm',
        ],
        travel_snacks: [
            'Roasted chana',
            'Peanut + chana mix',
            'Banana',
            'Sattu in a shaker bottle',
        ],
        protein_sources: [
            'Soya chunks',
            'Dal + rice',
            'Sattu',
            'Roasted chana',
            'Tofu 2-3 times per week',
        ],
    },
    week: {
        monday: {
            workout: {
                morning: 'Mobility and breathing for 5-10 minutes',
                evening_gym: 'Push day or trainer-led upper body',
            },
            nutrition: {
                lunch_dal: '2 roti + sabzi + low-oil soya peanut mix',
            },
            skincare_pm: 'Moisturizer only',
            gym_day: 'day_1_push',
            timeline: createOfficeDayTimeline(
                'Push workout or trainer-adjusted chest and triceps session',
                '1 banana + sattu drink or tofu/soya snack about 40 minutes before gym'
            ),
            suggestions: [
                'Use Monday to set the week rhythm, not to train to failure.',
                'If shoulders feel tight from commute, warm up longer and press lighter.',
            ],
        },
        tuesday: {
            workout: {
                morning: '5 minutes of walking and upper-back mobility',
                evening_gym: 'Pull day or pain-free back work',
            },
            nutrition: {
                lunch_dal: 'Masoor dal if available with roti and soya sabzi',
            },
            skincare_pm: 'Niacinamide or basic moisturizer',
            gym_day: 'day_2_pull',
            timeline: createOfficeDayTimeline(
                'Pull workout with back, biceps, and posture work',
                'Banana + roasted chana + water, then train once energy settles'
            ),
            suggestions: [
                'Long sitting makes back training important, but form matters more than load.',
                'If elbows ache, reduce curling volume and focus on rows and pulldowns.',
            ],
        },
        wednesday: {
            workout: {
                morning: 'Light walk only',
                evening_gym: 'Cardio, abs, or a lighter trainer-led day',
            },
            nutrition: {
                lunch_dal: 'Keep lunch lighter with dal, sabzi, and one carb source',
            },
            skincare_pm: 'Moisturizer only',
            gym_day: 'day_3_active_cardio_abs',
            timeline: createOfficeDayTimeline(
                'Light cardio, abs, or recovery-based session',
                '1 banana and water. Keep pre-workout lighter on easier gym days'
            ),
            suggestions: [
                'Use this as a low-fatigue day if your body is sore.',
                'Do not add hard cardio just because the session feels shorter.',
            ],
        },
        thursday: {
            workout: {
                morning: 'Ankle, hip, and hamstring mobility',
                evening_gym: 'Legs and core or trainer-led lower body',
            },
            nutrition: {
                lunch_dal: 'Add more rice or an extra roti if leg day is hard',
            },
            skincare_pm: 'Basic moisturizer',
            gym_day: 'day_4_legs_core',
            timeline: createOfficeDayTimeline(
                'Leg workout with squats, hinges, and core',
                'Banana + sattu drink or banana + roasted chana 40 minutes before gym'
            ),
            suggestions: [
                'Leg day is the day to eat enough carbs, not to stay too light.',
                'If knees hurt, swap deep bends for safer machine or goblet variations.',
            ],
        },
        friday: {
            workout: {
                morning: 'Quick shoulder circles and thoracic mobility',
                evening_gym: 'Shoulders, arms, or mixed upper body',
            },
            nutrition: {
                lunch_dal: 'Keep protein high with dal plus soya or tofu if possible',
            },
            skincare_pm: 'Moisturizer only',
            gym_day: 'day_5_shoulders_calisthenics',
            timeline: createOfficeDayTimeline(
                'Shoulders, carries, and calisthenics based on recovery',
                'Banana + peanut-chana mix, then a short warm-up before training'
            ),
            suggestions: [
                'Friday fatigue is normal after long travel, so choose clean reps over ego lifting.',
                'If wrists or shoulders are irritated, replace overhead work with lateral and rear-delt work.',
            ],
        },
        saturday: {
            workout: {
                morning: 'Walk, mobility, or a short recovery session',
                evening_gym: 'Optional light cardio or skipped gym',
            },
            nutrition: {
                lunch_dal: 'Simple dal-rice-sabzi day to recover and digest well',
            },
            skincare_pm: 'Gentle reset and moisturizer',
            gym_day: 'day_6_light_cardio',
            timeline: createRecoveryTimeline('Recovery block'),
            suggestions: [
                'Use Saturday to catch up on mobility and meal prep.',
                'If the week was exhausting, choose rest over forcing another hard gym session.',
            ],
        },
        sunday: {
            workout: {
                morning: 'Active recovery walk or full rest',
                evening_gym: 'No gym',
            },
            nutrition: {
                lunch_dal: 'Comfort food is fine, just keep oil moderate and protein present',
            },
            skincare_pm: 'Hydration only',
            gym_day: 'day_7_rest',
            timeline: createRecoveryTimeline('Full rest'),
            suggestions: [
                'Review the coming week and prep oats, chana, and lunch basics in advance.',
                'A good Sunday sleep schedule makes your weekday training sustainable.',
            ],
        },
    },
}

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export function getTodaysRoutine() {
    const dayOfWeek = new Date().getDay()
    const dayName = dayNames[dayOfWeek]

    return {
        dayName,
        routine: weeklyRoutine.week[dayName],
        constants: weeklyRoutine.daily_constants,
        sleep: weeklyRoutine.sleep,
    }
}

export function getDayName(date: Date = new Date()): string {
    return dayNames[date.getDay()]
}
