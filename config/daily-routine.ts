import type { WeeklyRoutine } from '@/types/workout'

export const weeklyRoutine: WeeklyRoutine = {
    sleep: {
        bed_time: '22:30',
        wake_time: '05:00',
        target_hours: 6.5
    },
    daily_constants: {
        hydration_liters: 3,
        morning: [
            'Warm water 200-300ml',
            '5 min breathing/stretch'
        ],
        am_skincare: [
            'Cleanser',
            'Vitamin C',
            'Moisturizer',
            'Sunscreen SPF50'
        ],
        pm_skincare_base: [
            'Cleanser',
            'Moisturizer',
            'Vaseline on lips'
        ]
    },
    week: {
        monday: {
            workout: {
                morning: 'Core workout (leg raises, bicycle crunch, mountain climbers)',
                evening_gym: 'Chest + Triceps + Core'
            },
            nutrition: {
                lunch_dal: 'Moong Dal Tadka + 100g Paneer/Tofu'
            },
            skincare_pm: 'Rest (moisturizer only)',
            gym_day: 'day_1_push'
        },
        tuesday: {
            workout: {
                morning: 'Brisk walk / light jog (20–25 min)',
                evening_gym: 'Back + Biceps'
            },
            nutrition: {
                lunch_dal: 'Masoor Dal + Soya Chunks'
            },
            skincare_pm: 'Niacinamide 5%',
            gym_day: 'day_2_pull'
        },
        wednesday: {
            workout: {
                morning: 'Core workout (leg raises, bicycle crunch, mountain climbers)',
                evening_gym: 'Legs + Light Core'
            },
            nutrition: {
                lunch_dal: 'Chana Dal + Spinach'
            },
            skincare_pm: 'Rest (moisturizer only)',
            gym_day: 'day_3_active_cardio_abs'
        },
        thursday: {
            workout: {
                morning: 'Brisk walk / light jog (20–25 min)',
                evening_gym: 'Shoulders + Traps'
            },
            nutrition: {
                lunch_dal: 'Tofu Dal'
            },
            skincare_pm: 'Azelaic Acid 10%',
            gym_day: 'day_4_legs_core'
        },
        friday: {
            workout: {
                morning: 'Core workout (light)',
                evening_gym: 'Full Body (compound focus)'
            },
            nutrition: {
                lunch_dal: 'Mixed Dal (Toor + Moong + Masoor)'
            },
            skincare_pm: 'Rest (moisturizer only)',
            gym_day: 'day_5_shoulders_calisthenics'
        },
        saturday: {
            workout: {
                morning: 'Light cardio / yoga / mobility',
                evening_gym: 'Optional mobility or skipped'
            },
            nutrition: {
                lunch_dal: 'Moong Dal + Boiled Sprouted Salad'
            },
            skincare_pm: 'Gentle Exfoliation (biweekly)',
            gym_day: 'day_6_light_cardio'
        },
        sunday: {
            workout: {
                morning: 'Active recovery walk or complete rest',
                evening_gym: 'No gym'
            },
            nutrition: {
                lunch_dal: 'Leftovers or no-cook tofu salad'
            },
            skincare_pm: 'Hydration + Mask (optional)',
            gym_day: 'day_7_rest'
        }
    }
}

// Day names for lookup
const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export function getTodaysRoutine() {
    const dayOfWeek = new Date().getDay()
    const dayName = dayNames[dayOfWeek]
    return {
        dayName,
        routine: weeklyRoutine.week[dayName],
        constants: weeklyRoutine.daily_constants,
        sleep: weeklyRoutine.sleep
    }
}

export function getDayName(date: Date = new Date()): string {
    return dayNames[date.getDay()]
}
