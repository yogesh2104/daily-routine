// Daily Diet Plan Config
// Plant-first, no protein powder, commute-friendly, budget-focused

export interface Meal {
    name: string
    items: string[]
    protein_g: number
    calories: number
    cost_approx: number
}

export interface DailyDiet {
    label: string
    workout_focus: string
    total_protein_g: number
    total_calories: number
    total_cost: number
    meals: {
        morning: Meal
        pre_workout: Meal
        lunch: Meal
        evening_snack: Meal
        dinner: Meal
    }
    tips: string[]
}

export const dietPlan: Record<string, DailyDiet> = {
    day_1_push: {
        label: 'Push Day Diet',
        workout_focus: 'Higher-protein workday with easy pre-gym fuel',
        total_protein_g: 102,
        total_calories: 2140,
        total_cost: 64,
        meals: {
            morning: {
                name: 'Fast Commute Breakfast',
                items: [
                    'Oats with water',
                    '2 bananas',
                    '1 spoon flax + chia mix',
                    '25g sattu in water or mixed into oats',
                ],
                protein_g: 18,
                calories: 430,
                cost_approx: 12,
            },
            pre_workout: {
                name: 'Pre-Gym Fuel',
                items: [
                    '1 banana',
                    'Roasted chana',
                    'Black coffee or lemon water if needed',
                ],
                protein_g: 10,
                calories: 210,
                cost_approx: 7,
            },
            lunch: {
                name: 'Office Lunch',
                items: [
                    '2 roti',
                    'Seasonal sabzi',
                    'Low-oil soya chunks with peanut, onion, and chilli',
                    'Cucumber slices',
                ],
                protein_g: 34,
                calories: 640,
                cost_approx: 20,
            },
            evening_snack: {
                name: 'Travel Snack',
                items: [
                    'Roasted chana',
                    'Small peanut handful',
                    'Water instead of packaged drink',
                ],
                protein_g: 12,
                calories: 200,
                cost_approx: 6,
            },
            dinner: {
                name: 'Recovery Dinner',
                items: [
                    'Dal',
                    'Rice',
                    'Salad',
                    'Extra bowl of dal or tofu if lunch protein was low',
                ],
                protein_g: 28,
                calories: 660,
                cost_approx: 19,
            },
        },
        tips: [
            'Keep breakfast fixed so office travel never makes you skip protein.',
            'If you still eat eggs, 2 eggs can replace the extra dal or tofu at dinner.',
            'Push day works best when lunch and pre-workout are both on time.',
        ],
    },
    day_2_pull: {
        label: 'Pull Day Diet',
        workout_focus: 'Steady energy for back day without expensive foods',
        total_protein_g: 99,
        total_calories: 2080,
        total_cost: 61,
        meals: {
            morning: {
                name: 'Portable Breakfast',
                items: [
                    'Oats',
                    '2 bananas',
                    'Seed drink on alternate days',
                    '20-25g roasted peanut powder or sattu',
                ],
                protein_g: 17,
                calories: 420,
                cost_approx: 12,
            },
            pre_workout: {
                name: 'Simple Fuel',
                items: [
                    '1 banana',
                    'Roasted chana or peanut-chana mix',
                ],
                protein_g: 9,
                calories: 190,
                cost_approx: 6,
            },
            lunch: {
                name: 'Back Day Lunch',
                items: [
                    '2 roti',
                    'Sabzi',
                    'Masoor dal if available',
                    'Low-oil soya chunks',
                ],
                protein_g: 35,
                calories: 650,
                cost_approx: 20,
            },
            evening_snack: {
                name: 'Office Exit Snack',
                items: [
                    'Roasted chana',
                    '1 fruit if hunger is high',
                ],
                protein_g: 11,
                calories: 180,
                cost_approx: 5,
            },
            dinner: {
                name: 'Late Recovery Meal',
                items: [
                    'Dal + rice',
                    'Salad',
                    'Sprouts or tofu twice a week',
                ],
                protein_g: 27,
                calories: 640,
                cost_approx: 18,
            },
        },
        tips: [
            'Pull day fatigue gets worse if lunch is too low in carbs, so keep the roti.',
            'Your commute already burns energy, so do not go to the gym half-fed.',
            'Use sattu on days when dinner will be delayed.',
        ],
    },
    day_3_active_cardio_abs: {
        label: 'Cardio + Abs Diet',
        workout_focus: 'Lighter digestion day with enough carbs for recovery',
        total_protein_g: 88,
        total_calories: 1910,
        total_cost: 56,
        meals: {
            morning: {
                name: 'Light Start',
                items: [
                    'Oats',
                    '2 bananas',
                    'Flax and chia mix',
                ],
                protein_g: 13,
                calories: 380,
                cost_approx: 10,
            },
            pre_workout: {
                name: 'Quick Pre-Workout',
                items: [
                    '1 banana',
                    'Lemon water',
                ],
                protein_g: 1,
                calories: 100,
                cost_approx: 3,
            },
            lunch: {
                name: 'Balanced Lunch',
                items: [
                    '2 roti or 1 roti + rice',
                    'Sabzi',
                    'Chana dal or moong dal',
                    'Small soya serving',
                ],
                protein_g: 30,
                calories: 610,
                cost_approx: 17,
            },
            evening_snack: {
                name: 'Light Snack',
                items: [
                    'Roasted chana',
                    'Cucumber or fruit',
                ],
                protein_g: 10,
                calories: 160,
                cost_approx: 5,
            },
            dinner: {
                name: 'Easy Dinner',
                items: [
                    'Dal rice',
                    'Big salad',
                    'Add sprouts if still hungry',
                ],
                protein_g: 34,
                calories: 660,
                cost_approx: 21,
            },
        },
        tips: [
            'Keep this day easier on oil and digestion.',
            'If your trainer cancels hard training, stay consistent with meals instead of overeating.',
            'Cardio day is a good day to focus on hydration.',
        ],
    },
    day_4_legs_core: {
        label: 'Leg Day Diet',
        workout_focus: 'Highest-energy day of the week',
        total_protein_g: 106,
        total_calories: 2230,
        total_cost: 66,
        meals: {
            morning: {
                name: 'Heavy-Day Breakfast',
                items: [
                    'Oats',
                    '2 bananas',
                    '30g sattu',
                    '1 spoon mixed seeds',
                ],
                protein_g: 20,
                calories: 470,
                cost_approx: 13,
            },
            pre_workout: {
                name: 'Leg Day Fuel',
                items: [
                    '1 banana',
                    'Roasted chana',
                    'Black coffee if it suits you',
                ],
                protein_g: 10,
                calories: 210,
                cost_approx: 7,
            },
            lunch: {
                name: 'Strong Lunch',
                items: [
                    '2 roti + small rice if possible',
                    'Sabzi',
                    'Large soya-peanut fry',
                    'Dal',
                ],
                protein_g: 38,
                calories: 720,
                cost_approx: 22,
            },
            evening_snack: {
                name: 'Commute Recovery Snack',
                items: [
                    'Roasted chana',
                    'Peanut handful',
                ],
                protein_g: 12,
                calories: 210,
                cost_approx: 6,
            },
            dinner: {
                name: 'Post-Leg Dinner',
                items: [
                    'Dal',
                    'Rice',
                    'Salad',
                    'Tofu or extra dal if legs session was hard',
                ],
                protein_g: 26,
                calories: 620,
                cost_approx: 18,
            },
        },
        tips: [
            'Do not under-eat on leg day just because you want to stay lean.',
            'If the session is brutal, add extra rice at dinner before adding junk food.',
            'Late-night cramps usually mean low water, low salt, or low carbs.',
        ],
    },
    day_5_shoulders_calisthenics: {
        label: 'Shoulder Day Diet',
        workout_focus: 'Moderate calories with clean protein sources',
        total_protein_g: 96,
        total_calories: 2040,
        total_cost: 60,
        meals: {
            morning: {
                name: 'Routine Breakfast',
                items: [
                    'Oats',
                    '2 bananas',
                    'Seed mix',
                    '20g sattu or peanut powder',
                ],
                protein_g: 17,
                calories: 420,
                cost_approx: 11,
            },
            pre_workout: {
                name: 'Easy Lift Fuel',
                items: [
                    '1 banana',
                    'Roasted chana',
                ],
                protein_g: 9,
                calories: 190,
                cost_approx: 6,
            },
            lunch: {
                name: 'Shoulder Day Lunch',
                items: [
                    '2 roti',
                    'Sabzi',
                    'Soya chunk fry with onion and peanuts',
                    'Dal if available',
                ],
                protein_g: 34,
                calories: 650,
                cost_approx: 20,
            },
            evening_snack: {
                name: 'Travel Snack',
                items: [
                    'Roasted chana',
                    'Lemon water or plain water',
                ],
                protein_g: 10,
                calories: 160,
                cost_approx: 5,
            },
            dinner: {
                name: 'Balanced Dinner',
                items: [
                    'Dal rice',
                    'Salad',
                    'Sprouts or tofu on days you need extra protein',
                ],
                protein_g: 26,
                calories: 620,
                cost_approx: 18,
            },
        },
        tips: [
            'Shoulder day does not need the same food volume as leg day.',
            'If shoulder pain is present, lower the load and keep meals anti-inflammatory with less fried food.',
            'Your evening snack matters because commute fatigue can kill gym intensity.',
        ],
    },
    day_6_light_cardio: {
        label: 'Light Day Diet',
        workout_focus: 'Recovery-focused day that still keeps protein present',
        total_protein_g: 84,
        total_calories: 1840,
        total_cost: 54,
        meals: {
            morning: {
                name: 'Easy Morning',
                items: [
                    'Oats or daliya',
                    '1-2 bananas',
                    'Seed mix',
                ],
                protein_g: 12,
                calories: 340,
                cost_approx: 9,
            },
            pre_workout: {
                name: 'Optional Fuel',
                items: [
                    'Fruit or lemon water only if you train',
                ],
                protein_g: 1,
                calories: 80,
                cost_approx: 3,
            },
            lunch: {
                name: 'Comfort Lunch',
                items: [
                    'Dal',
                    'Rice',
                    'Sabzi',
                    'Small soya serving if dinner will be light',
                ],
                protein_g: 28,
                calories: 590,
                cost_approx: 17,
            },
            evening_snack: {
                name: 'Recovery Snack',
                items: [
                    'Roasted chana',
                    'Fruit or cucumber',
                ],
                protein_g: 9,
                calories: 150,
                cost_approx: 5,
            },
            dinner: {
                name: 'Simple Dinner',
                items: [
                    'Dal rice or khichdi',
                    'Salad',
                    'Extra sprouts if hunger is high',
                ],
                protein_g: 34,
                calories: 680,
                cost_approx: 20,
            },
        },
        tips: [
            'Light day is where digestion and sleep should improve.',
            'If you skip the gym, still keep the same meal timings.',
            'Use this day for meal prep: roast chana, soak soya, and portion oats.',
        ],
    },
    day_7_rest: {
        label: 'Rest Day Diet',
        workout_focus: 'Rest, digestion, and keeping the routine alive',
        total_protein_g: 80,
        total_calories: 1780,
        total_cost: 50,
        meals: {
            morning: {
                name: 'Rest Day Breakfast',
                items: [
                    'Oats or poha',
                    'Banana',
                    'Seed mix',
                ],
                protein_g: 11,
                calories: 330,
                cost_approx: 9,
            },
            pre_workout: {
                name: 'Mid-Morning Bite',
                items: [
                    'Fruit or roasted chana',
                ],
                protein_g: 6,
                calories: 110,
                cost_approx: 4,
            },
            lunch: {
                name: 'Simple Lunch',
                items: [
                    'Dal',
                    'Rice or roti',
                    'Seasonal sabzi',
                    'Salad',
                ],
                protein_g: 24,
                calories: 540,
                cost_approx: 15,
            },
            evening_snack: {
                name: 'Keep Hunger Stable',
                items: [
                    'Roasted chana',
                    'Peanuts in a small portion',
                ],
                protein_g: 10,
                calories: 180,
                cost_approx: 5,
            },
            dinner: {
                name: 'Easy Recovery Dinner',
                items: [
                    'Khichdi or dal rice',
                    'Salad',
                    'Sprouts if the day was low in protein',
                ],
                protein_g: 29,
                calories: 620,
                cost_approx: 17,
            },
        },
        tips: [
            'Rest day is for recovery, not random cheat meals.',
            'If you want to stay near a 2k monthly budget, keep rest-day food very simple.',
            'Prep tomorrow breakfast and snacks at night so Monday starts smoothly.',
        ],
    },
}

export function getTodaysDiet(gymDayKey: string): DailyDiet {
    return dietPlan[gymDayKey] || dietPlan['day_7_rest']
}

export const budgetInfo = {
    monthly_budget: 2000,
    daily_average: 60,
    weekly_grocery_list: [
        { item: 'Oats', qty: '500g', cost: 35 },
        { item: 'Bananas', qty: '14-18 pcs', cost: 80 },
        { item: 'Mixed seeds', qty: '100g', cost: 35 },
        { item: 'Soya chunks', qty: '250g', cost: 35 },
        { item: 'Sattu', qty: '250g', cost: 30 },
        { item: 'Mixed dals', qty: '1kg', cost: 110 },
        { item: 'Roasted chana', qty: '250g', cost: 30 },
        { item: 'Peanuts', qty: '250g', cost: 35 },
        { item: 'Atta + rice', qty: 'shared weekly stock', cost: 80 },
        { item: 'Seasonal vegetables + salad items', qty: '3-4 kg', cost: 180 },
        { item: 'Lemon, spices, oil share', qty: '-', cost: 40 },
    ],
    weekly_total: 690,
    notes: [
        'A strict INR 2,000 monthly budget is possible, but protein will depend heavily on soya, dal, sattu, and chana.',
        'To stay closer to budget, buy seasonal vegetables and keep tofu only 2-3 times per week.',
        'Roasted chana and sattu are your best no-powder, low-cost protein upgrades.',
        'If you already eat eggs, they can stay as an optional swap, but the base plan here stays plant-first.',
    ],
}
