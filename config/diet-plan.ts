// Daily Diet Plan Config - Mapped to workout type
// Vegetarian | Budget: ~₹2,000/month (~₹65/day)
// Protein sources: Dal, Soya Chunks, Paneer, Sprouts, Curd, Dry Fruits

export interface Meal {
    name: string
    items: string[]
    protein_g: number
    calories: number
    cost_approx: number // ₹ per serving
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

// Maps gym_day_key → full diet plan for that day
export const dietPlan: Record<string, DailyDiet> = {

    // ─── DAY 1: PUSH (Chest + Triceps) ────────────────────────
    day_1_push: {
        label: 'Push Day Diet',
        workout_focus: 'Chest + Triceps — High Protein',
        total_protein_g: 125,
        total_calories: 2100,
        total_cost: 65,
        meals: {
            morning: {
                name: 'Power Breakfast',
                items: [
                    '2 Besan Chilla with mint chutney',
                    '1 glass warm milk + 5 almonds',
                    '1 banana'
                ],
                protein_g: 22,
                calories: 420,
                cost_approx: 15
            },
            pre_workout: {
                name: 'Pre-Gym Fuel',
                items: [
                    '1 handful roasted chana',
                    '1 small banana',
                    'Black coffee (optional)'
                ],
                protein_g: 8,
                calories: 180,
                cost_approx: 5
            },
            lunch: {
                name: 'Protein-Packed Lunch',
                items: [
                    'Moong Dal Tadka (1.5 bowl)',
                    '2 roti (multigrain)',
                    'Soya Chunk Sabzi (100g dry)',
                    'Cucumber raita',
                    'Seasonal sabzi'
                ],
                protein_g: 42,
                calories: 650,
                cost_approx: 20
            },
            evening_snack: {
                name: 'Recovery Snack',
                items: [
                    'Sprouted moong chaat with lemon',
                    '1 glass chaas (buttermilk)',
                    '3 walnuts'
                ],
                protein_g: 15,
                calories: 200,
                cost_approx: 8
            },
            dinner: {
                name: 'Muscle Repair Dinner',
                items: [
                    'Paneer Bhurji (80g paneer)',
                    '2 roti',
                    'Dal Palak (spinach dal)',
                    'Salad with lemon'
                ],
                protein_g: 38,
                calories: 650,
                cost_approx: 17
            }
        },
        tips: [
            'Eat pre-workout meal 60-90 min before gym',
            'Have dinner within 1 hour of workout',
            'Soya chunks are cheapest protein — soak 30 min before cooking'
        ]
    },

    // ─── DAY 2: PULL (Back + Biceps) ──────────────────────────
    day_2_pull: {
        label: 'Pull Day Diet',
        workout_focus: 'Back + Biceps — High Protein',
        total_protein_g: 130,
        total_calories: 2150,
        total_cost: 62,
        meals: {
            morning: {
                name: 'Protein Morning',
                items: [
                    'Poha with peanuts & veggies',
                    '1 glass milk + 4 cashews',
                    '1 boiled egg alternative: Soya milk'
                ],
                protein_g: 20,
                calories: 400,
                cost_approx: 12
            },
            pre_workout: {
                name: 'Energy Booster',
                items: [
                    '1 roti with peanut butter',
                    '1 banana'
                ],
                protein_g: 10,
                calories: 250,
                cost_approx: 6
            },
            lunch: {
                name: 'Dal Power Bowl',
                items: [
                    'Masoor Dal (1.5 bowl)',
                    'Soya Chunk Curry (100g dry)',
                    '2 roti + rice (small)',
                    'Onion-tomato salad',
                    'Curd (100g)'
                ],
                protein_g: 45,
                calories: 700,
                cost_approx: 18
            },
            evening_snack: {
                name: 'Post-Workout Recovery',
                items: [
                    'Sattu drink with lemon & salt',
                    '1 handful mixed dry fruits (10g)',
                    'Roasted makhana (1 cup)'
                ],
                protein_g: 18,
                calories: 220,
                cost_approx: 10
            },
            dinner: {
                name: 'Repair & Rest',
                items: [
                    'Chana Dal (thick)',
                    'Lauki/Turai sabzi',
                    '2 roti',
                    'Small bowl curd'
                ],
                protein_g: 37,
                calories: 580,
                cost_approx: 16
            }
        },
        tips: [
            'Sattu is a superfood — 20g protein per 100g, very cheap',
            'Add curd to every meal for gut health + protein',
            'Back exercises need good recovery — eat dinner early'
        ]
    },

    // ─── DAY 3: ACTIVE CARDIO + ABS ───────────────────────────
    day_3_active_cardio_abs: {
        label: 'Cardio Day Diet',
        workout_focus: 'Cardio + Abs — Moderate, Carb-Focused',
        total_protein_g: 100,
        total_calories: 1900,
        total_cost: 55,
        meals: {
            morning: {
                name: 'Light Energy Start',
                items: [
                    'Oats porridge with milk & banana',
                    '4 almonds + 2 dates',
                    'Green tea'
                ],
                protein_g: 15,
                calories: 380,
                cost_approx: 12
            },
            pre_workout: {
                name: 'Quick Carbs',
                items: [
                    '1 banana',
                    '1 toast with honey'
                ],
                protein_g: 4,
                calories: 180,
                cost_approx: 5
            },
            lunch: {
                name: 'Balanced Lunch',
                items: [
                    'Chana Dal + Spinach',
                    'Jeera Rice (small bowl)',
                    '1 roti',
                    'Mixed veg sabzi',
                    'Lemon-onion salad'
                ],
                protein_g: 32,
                calories: 600,
                cost_approx: 16
            },
            evening_snack: {
                name: 'Recovery Fuel',
                items: [
                    'Fruit chaat (seasonal)',
                    '1 glass chaas',
                    'Handful of roasted chana'
                ],
                protein_g: 12,
                calories: 200,
                cost_approx: 8
            },
            dinner: {
                name: 'Light Dinner',
                items: [
                    'Moong Dal Khichdi',
                    'Curd (100g)',
                    'Steamed veggies',
                    'Salad'
                ],
                protein_g: 30,
                calories: 500,
                cost_approx: 14
            }
        },
        tips: [
            'Cardio days need more carbs for energy, less heavy protein',
            'Stay hydrated — 500ml water before and after cardio',
            'Khichdi is perfect post-cardio: easy to digest + balanced'
        ]
    },

    // ─── DAY 4: LEGS + CORE ───────────────────────────────────
    day_4_legs_core: {
        label: 'Leg Day Diet',
        workout_focus: 'Legs + Core — High Protein & Carbs',
        total_protein_g: 130,
        total_calories: 2200,
        total_cost: 65,
        meals: {
            morning: {
                name: 'Heavy Breakfast',
                items: [
                    'Stuffed Paratha (aloo/paneer) with curd',
                    '1 glass milk',
                    '5 almonds + 2 walnuts'
                ],
                protein_g: 22,
                calories: 500,
                cost_approx: 15
            },
            pre_workout: {
                name: 'Leg Day Fuel',
                items: [
                    'Peanut butter toast',
                    '1 banana',
                    'Black coffee'
                ],
                protein_g: 10,
                calories: 280,
                cost_approx: 6
            },
            lunch: {
                name: 'Mega Protein Lunch',
                items: [
                    'Rajma / Chole (1.5 bowl)',
                    '2 roti + small rice',
                    'Soya Chunk Dry Fry (80g)',
                    'Curd raita',
                    'Green salad'
                ],
                protein_g: 45,
                calories: 750,
                cost_approx: 20
            },
            evening_snack: {
                name: 'Post-Leg Recovery',
                items: [
                    'Sattu drink (40g sattu)',
                    'Banana + handful mixed nuts (10g)',
                    'Roasted makhana'
                ],
                protein_g: 20,
                calories: 280,
                cost_approx: 10
            },
            dinner: {
                name: 'Recovery Dinner',
                items: [
                    'Paneer Tikka (80g paneer) or Tofu',
                    'Dal Fry (Toor dal)',
                    '2 roti',
                    'Palak/Methi sabzi'
                ],
                protein_g: 38,
                calories: 650,
                cost_approx: 14
            }
        },
        tips: [
            'Leg day burns the most calories — don\'t skip carbs!',
            'Rajma/Chole are excellent for legs: protein + complex carbs',
            'Eat sattu post-workout for fast recovery'
        ]
    },

    // ─── DAY 5: SHOULDERS + CALISTHENICS ──────────────────────
    day_5_shoulders_calisthenics: {
        label: 'Shoulder Day Diet',
        workout_focus: 'Shoulders + Calisthenics — Moderate-High Protein',
        total_protein_g: 120,
        total_calories: 2050,
        total_cost: 60,
        meals: {
            morning: {
                name: 'Energizing Breakfast',
                items: [
                    'Upma with veggies & peanuts',
                    '1 glass milk + 4 almonds',
                    '1 fruit (apple/guava)'
                ],
                protein_g: 18,
                calories: 400,
                cost_approx: 12
            },
            pre_workout: {
                name: 'Quick Fuel',
                items: [
                    'Handful of dry fruits (15g)',
                    '1 banana'
                ],
                protein_g: 6,
                calories: 180,
                cost_approx: 7
            },
            lunch: {
                name: 'Protein Packed',
                items: [
                    'Mixed Dal (Toor + Moong + Masoor)',
                    'Soya Chunk Masala (80g dry)',
                    '2 roti',
                    'Baingan/Bhindi sabzi',
                    'Buttermilk'
                ],
                protein_g: 40,
                calories: 650,
                cost_approx: 18
            },
            evening_snack: {
                name: 'Shoulder Recovery',
                items: [
                    'Sprouted chana chaat',
                    'Nimbu pani with salt',
                    'Roasted peanuts (30g)'
                ],
                protein_g: 18,
                calories: 230,
                cost_approx: 7
            },
            dinner: {
                name: 'Balanced Dinner',
                items: [
                    'Palak Paneer (60g paneer)',
                    'Moong Dal',
                    '2 roti',
                    'Cucumber-tomato salad'
                ],
                protein_g: 35,
                calories: 590,
                cost_approx: 16
            }
        },
        tips: [
            'Shoulder exercises need good shoulder mobility — eat anti-inflammatory foods',
            'Peanuts are the cheapest protein snack: 25g protein per 100g',
            'Don\'t skip the salad — fiber helps with digestion'
        ]
    },

    // ─── DAY 6: LIGHT CARDIO + MOBILITY ──────────────────────
    day_6_light_cardio: {
        label: 'Light Day Diet',
        workout_focus: 'Light Cardio + Mobility — Moderate',
        total_protein_g: 95,
        total_calories: 1800,
        total_cost: 50,
        meals: {
            morning: {
                name: 'Easy Morning',
                items: [
                    'Daliya (broken wheat) porridge with milk',
                    '3 almonds + 1 date',
                    'Herbal tea / green tea'
                ],
                protein_g: 14,
                calories: 350,
                cost_approx: 10
            },
            pre_workout: {
                name: 'Light Fuel',
                items: [
                    '1 fruit (seasonal)',
                    'Few dry fruits (5g)'
                ],
                protein_g: 3,
                calories: 120,
                cost_approx: 5
            },
            lunch: {
                name: 'Comfort Lunch',
                items: [
                    'Moong Dal + Vegetables',
                    'Rice (1 bowl)',
                    'Aloo Gobi sabzi',
                    'Curd',
                    'Papad'
                ],
                protein_g: 28,
                calories: 600,
                cost_approx: 15
            },
            evening_snack: {
                name: 'Light Munch',
                items: [
                    'Fruit chaat / seasonal fruit',
                    'Roasted makhana (1 cup)',
                    'Green tea'
                ],
                protein_g: 8,
                calories: 150,
                cost_approx: 6
            },
            dinner: {
                name: 'Simple Dinner',
                items: [
                    'Sabzi Roti (2 roti)',
                    'Dal Tadka',
                    'Salad',
                    'Warm milk before bed'
                ],
                protein_g: 30,
                calories: 550,
                cost_approx: 14
            }
        },
        tips: [
            'Light days = lighter meals. No need to force extra protein.',
            'Focus on hydration and stretching recovery',
            'Good day for meal prep for the heavy days ahead'
        ]
    },

    // ─── DAY 7: REST ──────────────────────────────────────────
    day_7_rest: {
        label: 'Rest Day Diet',
        workout_focus: 'Full Rest — Recovery Focus',
        total_protein_g: 90,
        total_calories: 1750,
        total_cost: 48,
        meals: {
            morning: {
                name: 'Relaxed Breakfast',
                items: [
                    'Idli/Dosa with sambar & chutney',
                    '1 glass milk',
                    '3 almonds'
                ],
                protein_g: 15,
                calories: 380,
                cost_approx: 12
            },
            pre_workout: {
                name: 'Morning Snack',
                items: [
                    'Seasonal fruit',
                    'Handful of peanuts (20g)'
                ],
                protein_g: 7,
                calories: 150,
                cost_approx: 4
            },
            lunch: {
                name: 'Wholesome Lunch',
                items: [
                    'Arhar/Toor Dal',
                    '2 roti',
                    'Seasonal sabzi',
                    'Curd',
                    'Salad with lemon'
                ],
                protein_g: 28,
                calories: 550,
                cost_approx: 14
            },
            evening_snack: {
                name: 'Evening Light',
                items: [
                    'Sprout salad or fruit',
                    'Chaas (buttermilk)',
                    '2 walnuts'
                ],
                protein_g: 10,
                calories: 160,
                cost_approx: 6
            },
            dinner: {
                name: 'Easy Digest Dinner',
                items: [
                    'Khichdi with ghee',
                    'Raita',
                    'Papad',
                    'Warm turmeric milk before bed'
                ],
                protein_g: 25,
                calories: 480,
                cost_approx: 12
            }
        },
        tips: [
            'Rest day = repair day. Sleep 7+ hours tonight.',
            'Turmeric milk (haldi doodh) reduces inflammation',
            'No need to eat heavy — listen to your body'
        ]
    }
}

// Helper to get today's diet based on gym day key
export function getTodaysDiet(gymDayKey: string): DailyDiet {
    return dietPlan[gymDayKey] || dietPlan['day_7_rest']
}

// Monthly budget breakdown
export const budgetInfo = {
    monthly_budget: 2000,
    daily_average: 58,
    weekly_grocery_list: [
        { item: 'Mixed Dals (Moong, Masoor, Chana, Toor)', qty: '2 kg', cost: 200 },
        { item: 'Soya Chunks', qty: '500g', cost: 60 },
        { item: 'Paneer', qty: '400g (2x/week)', cost: 160 },
        { item: 'Seasonal Vegetables', qty: '3-4 kg', cost: 150 },
        { item: 'Milk', qty: '3.5 L', cost: 180 },
        { item: 'Curd', qty: '1 kg', cost: 50 },
        { item: 'Dry Fruits (Almonds, Walnuts, Cashews)', qty: '100g', cost: 120 },
        { item: 'Peanuts + Roasted Chana', qty: '500g', cost: 50 },
        { item: 'Atta (Multigrain)', qty: '2 kg', cost: 80 },
        { item: 'Rice', qty: '1 kg', cost: 40 },
        { item: 'Fruits (Seasonal)', qty: '1.5 kg', cost: 60 },
        { item: 'Oil + Spices + Others', qty: '-', cost: 50 },
    ],
    weekly_total: 1200,
    notes: [
        'Buy seasonal vegetables — cheapest and freshest',
        'Buy dal in bulk (5kg/month) for better rates',
        'Soya chunks are the cheapest protein source: ₹12/100g = 50g protein',
        'Use paneer only 2-3 times/week to save budget',
        'Sprout moong/chana at home — free protein boost'
    ]
}
