You are a senior full-stack engineer and product designer.

Build a production-ready Personal Fitness & Routine Tracker app using:
- Next.js (App Router)
- TypeScript
- Supabase (Auth + Postgres + Row Level Security)
- PWA (offline-first support)
- Mobile-first UI (simple, minimal, fast)

### CORE GOAL
The app helps a single user track:
1) Weekly gym workouts (sets, reps, weight, completion)
2) Daily routines (hydration, skincare, sleep, habits)
3) Weekly rotation logic (Push/Pull/Legs/etc)
4) Progress over time (consistency, not social features)

This is NOT a social app. It is a focused personal tracker.

---

### FUNCTIONAL REQUIREMENTS

#### 1️⃣ Authentication
- Supabase email/password login
- One primary user (no social feed)
- Persist session across reloads

---

### follow  this JSON
{
  "sleep": {
    "bed_time": "22:30",
    "wake_time": "05:00",
    "target_hours": 6.5
  },

  "daily_constants": {
    "hydration_liters": 3,
    "morning": [
      "Warm water 200-300ml",
      "5 min breathing/stretch"
    ],
    "am_skincare": [
      "Cleanser",
      "Vitamin C",
      "Moisturizer",
      "Sunscreen SPF50"
    ],
    "pm_skincare_base": [
      "Cleanser",
      "Moisturizer",
      "Vaseline on lips"
    ]
  },

  "week": {
    "monday": {
      "workout": {
        "morning": "Core workout (leg raises, bicycle crunch, mountain climbers)",
        "evening_gym": "Chest + Triceps + Core"
      },
      "nutrition": {
        "lunch_dal": "Moong Dal Tadka"
      },
      "skincare_pm": "Rest (moisturizer only)"
    },

    "tuesday": {
      "workout": {
        "morning": "Brisk walk / light jog (20–25 min)",
        "evening_gym": "Back + Biceps"
      },
      "nutrition": {
        "lunch_dal": "Masoor Dal with Vegetables"
      },
      "skincare_pm": "Niacinamide 5%"
    },

    "wednesday": {
      "workout": {
        "morning": "Core workout (leg raises, bicycle crunch, mountain climbers)",
        "evening_gym": "Legs + Light Core"
      },
      "nutrition": {
        "lunch_dal": "Chana Dal + Spinach"
      },
      "skincare_pm": "Rest (moisturizer only)"
    },

    "thursday": {
      "workout": {
        "morning": "Brisk walk / light jog (20–25 min)",
        "evening_gym": "Shoulders + Traps"
      },
      "nutrition": {
        "lunch_dal": "Tofu Dal"
      },
      "skincare_pm": "Azelaic Acid 10%"
    },

    "friday": {
      "workout": {
        "morning": "Core workout (light)",
        "evening_gym": "Full Body (compound focus)"
      },
      "nutrition": {
        "lunch_dal": "Mixed Dal (Toor + Moong + Masoor)"
      },
      "skincare_pm": "Rest (moisturizer only)"
    },

    "saturday": {
      "workout": {
        "morning": "Light cardio / yoga / mobility",
        "evening_gym": "Optional mobility or skipped"
      },
      "nutrition": {
        "lunch_dal": "Moong Dal + Vegetables"
      },
      "skincare_pm": "Gentle Exfoliation (biweekly)"
    },

    "sunday": {
      "workout": {
        "morning": "Active recovery walk or complete rest",
        "evening_gym": "No gym"
      },
      "nutrition": {
        "lunch_dal": "Leftovers or no-cook tofu salad"
      },
      "skincare_pm": "Hydration + Mask (optional)"
    }
  }
}

### 🏋️‍♂️ Weekly Gym Program JSON (App-Ready)
{
  "gym_program": {
    "frequency_per_week": 5,
    "notes": [
      "Keep sessions 45–60 min",
      "Progressive overload",
      "No excessive cardio",
      "Recovery is mandatory"
    ],

    "days": {
      "day_1_push": {
        "label": "Push (Chest + Triceps + Core Load)",
        "exercises": [
          { "name": "Push-ups", "sets": 3, "reps": "max", "type": "warmup" },
          { "name": "Bench Press", "sets": 4, "reps": "8–10", "intensity": "heavy" },
          { "name": "Incline Dumbbell Press", "sets": 3, "reps": 10 },
          { "name": "Triceps Dips", "sets": 3, "reps": "max" },
          { "name": "Triceps Pushdown", "sets": 3, "reps": 12 }
        ],
        "core": [
          { "name": "Cable Crunch", "sets": 3, "reps": 12 },
          { "name": "Front Plank", "sets": 3, "duration_sec": 60 }
        ],
        "finisher": {
          "name": "Incline Treadmill Walk",
          "duration_min": 8
        }
      },

      "day_2_pull": {
        "label": "Pull (Back + Biceps + Core Stability)",
        "exercises": [
          { "name": "Pull-ups / Assisted", "sets": 4, "reps": "max" },
          { "name": "Lat Pulldown", "sets": 3, "reps": 10 },
          { "name": "One-Arm Dumbbell Row", "sets": 4, "reps": 10 },
          { "name": "Seated Cable Row", "sets": 3, "reps": 12 },
          { "name": "Barbell or Dumbbell Curl", "sets": 3, "reps": 10 },
          { "name": "Hammer Curl", "sets": 2, "reps": 12 }
        ],
        "core": [
          { "name": "Dead Hang", "sets": 3, "duration_sec": 40 },
          { "name": "Pallof Press", "sets": 3, "reps": 12, "per_side": true }
        ],
        "finisher": {
          "name": "Rowing Machine",
          "duration_min": 8
        }
      },

      "day_3_active_cardio_abs": {
        "label": "Active Cardio + Abs (Light)",
        "cardio": [
          { "name": "Incline Treadmill", "duration_min": 5 },
          { "name": "Rowing", "duration_min": 3 },
          { "name": "Air Runner", "duration_min": 1 }
        ],
        "abs_circuit": {
          "rounds": 3,
          "exercises": [
            { "name": "Hanging Leg Raises", "reps": 12 },
            { "name": "Bicycle Crunch", "reps": 20 },
            { "name": "Mountain Climbers", "duration_sec": 40 }
          ]
        },
        "notes": ["No additional cardio"]
      },

      "day_4_legs_core": {
        "label": "Legs + Core (Abs Pop Day)",
        "exercises": [
          { "name": "Goblet Squats", "sets": 4, "reps": 12 },
          { "name": "Dumbbell Lunges", "sets": 3, "reps": 12, "per_leg": true },
          { "name": "Leg Curl", "sets": 3, "reps": 12 },
          { "name": "Leg Extension", "sets": 3, "reps": 12 },
          { "name": "Standing Calf Raise", "sets": 4, "reps": 15 }
        ],
        "core": [
          { "name": "Decline Sit-ups", "sets": 3, "reps": 15 },
          { "name": "Reverse Crunch", "sets": 3, "reps": 15 }
        ],
        "finisher": {
          "name": "Fast Walk",
          "duration_min": 8
        }
      },

      "day_5_shoulders_calisthenics": {
        "label": "Shoulders + Calisthenics (V-Taper Day)",
        "exercises": [
          { "name": "Overhead Press", "sets": 4, "reps": 8 },
          { "name": "Dumbbell Lateral Raise", "sets": 4, "reps": 12 },
          { "name": "Pike Push-ups", "sets": 3, "reps": "max" },
          { "name": "Dumbbell Shrugs", "sets": 3, "reps": 12 },
          { "name": "Farmer Carry", "sets": 4, "duration_sec": 45 }
        ],
        "core": [
          { "name": "Hanging Knee Raises", "sets": 3, "reps": 15 },
          { "name": "Side Plank", "sets": 3, "duration_sec": 30, "per_side": true }
        ]
      },

      "day_6_light_cardio": {
        "label": "Light Cardio + Mobility",
        "activities": [
          { "name": "Walking", "duration_min": "30–40" },
          { "name": "Mobility & Stretching", "focus": ["hips", "hamstrings", "lower back"] }
        ]
      },

      "day_7_rest": {
        "label": "Rest Day",
        "notes": [
          "No gym",
          "Focus on recovery",
          "Sleep, hydration, light walking only"
        ]
      }
    }
  }
}
How to map this to your weekly routine JSON
"monday": {
  "gym_day": "day_1_push"
}


#### 2️⃣ Weekly Workout System
- Workout program is predefined (JSON-driven)
- 7-day structure:
  - Day 1: Push
  - Day 2: Pull
  - Day 3: Active Cardio + Abs
  - Day 4: Legs + Core
  - Day 5: Shoulders + Calisthenics
  - Day 6: Light Cardio + Mobility
  - Day 7: Rest (locked)

Each workout contains:
- Exercises
- Sets
- reps_target
- weight_used (number)
- completed (boolean per set)

User must be able to:
- Check off each set
- Enter weight per set
- Mark workout complete
- See today’s workout automatically

---

#### 3️⃣ Daily Routine Tracking
Track daily habits:
- Water intake (boolean or count)
- Morning skincare
- Night skincare
- Steps / walking
- Sleep (bed time + wake time)

Each habit:
- Has a checkbox
- Is stored per date
- Supports streaks later

---

#### 4️⃣ Skincare Rotation Logic
- PM treatments rotate by weekday:
  - Mon/Fri → Rest
  - Tue → Niacinamide
  - Thu → Azelaic Acid
  - Sat → Exfoliation (biweekly)
  - Sun → Hydration only

App should automatically show:
- “Tonight’s skincare” based on day

---

#### 5️⃣ Nutrition Reference (Non-Tracking)
- Show daily “Lunch Dal Suggestion” from weekly rotation
- No calorie counting
- No food logging
- Just reference guidance

---



### DATA MODEL (Supabase)

Design tables for:
- users
- workout_sessions
- exercise_sets
- daily_habits

Include:
- Foreign keys
- RLS policies (user can access only own data)
- Timestamps
- Proper indexes

---

### UI / UX REQUIREMENTS

- Mobile-first
- One-hand friendly
- Minimal colors
- No distractions
- Fast interactions

Screens:
1. Login
2. Today Dashboard
3. Workout Detail (sets checklist)
4. Weekly Overview
5. Progress (simple stats)
6. Settings

---

### PWA REQUIREMENTS

- Offline support using IndexedDB
- Sync with Supabase when online
- Add to home screen
- Works smoothly on Android

---

### TECHNICAL EXPECTATIONS

- Use clean folder structure
- Strong TypeScript types
- Reusable components
- Avoid overengineering
- No unnecessary libraries

---

### OUTPUT EXPECTED FROM YOU

1. Full project structure
2. Database schema (SQL)
3. Key React components
4. Supabase integration
5. Example JSON workout config
6. Clear explanation of architecture choices

Build this as if it will be used daily by a disciplined fitness-focused user preparing for a deadline goal (fat loss + aesthetics).

Do NOT add social features.
Do NOT add gamification beyond simple streaks.
Focus on reliability, clarity, and speed.


Suggested Supabase Tables (Simple & Scalable)
## workout_sessions

id (uuid)
user_id
date
gym_day_key (day_1_push)
completed (boolean)

## exercise_sets
id
session_id
exercise_name
set_number
reps_target
reps_done
weight_used
completed


## daily_habits
id
user_id
date
habit_key (water, skincare_am, skincare_pm, steps)
completed

