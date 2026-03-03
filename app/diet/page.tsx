'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader } from '@/components/ui'
import { getTodaysDiet, dietPlan, budgetInfo } from '@/config/diet-plan'
import { dayOfWeekToGymDay, gymProgram } from '@/config/workout-program'
import type { Meal } from '@/config/diet-plan'

const DAY_LABELS = [
    { key: 0, short: 'Sun', full: 'Sunday' },
    { key: 1, short: 'Mon', full: 'Monday' },
    { key: 2, short: 'Tue', full: 'Tuesday' },
    { key: 3, short: 'Wed', full: 'Wednesday' },
    { key: 4, short: 'Thu', full: 'Thursday' },
    { key: 5, short: 'Fri', full: 'Friday' },
    { key: 6, short: 'Sat', full: 'Saturday' },
]

const MEAL_ICONS: Record<string, string> = {
    morning: '🌅',
    pre_workout: '⚡',
    lunch: '🍲',
    evening_snack: '🥜',
    dinner: '🌙',
}

const MEAL_LABELS: Record<string, string> = {
    morning: 'Breakfast',
    pre_workout: 'Pre-Workout',
    lunch: 'Lunch',
    evening_snack: 'Evening Snack',
    dinner: 'Dinner',
}

function MealCard({ mealKey, meal }: { mealKey: string; meal: Meal }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <Card
            className="cursor-pointer transition-all hover:border-primary/30"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{MEAL_ICONS[mealKey]}</span>
                    <div>
                        <p className="text-xs text-muted uppercase tracking-wider font-medium">
                            {MEAL_LABELS[mealKey]}
                        </p>
                        <h3 className="text-foreground font-semibold text-sm mt-0.5">
                            {meal.name}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {meal.protein_g}g P
                    </span>
                    <span>{meal.calories} cal</span>
                    <span className="text-success">₹{meal.cost_approx}</span>
                </div>
            </div>

            {expanded && (
                <div className="mt-3 pt-3 border-t border-border">
                    <div className="space-y-1.5">
                        {meal.items.map((item, i) => (
                            <div key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    )
}

function GroceryList() {
    const [show, setShow] = useState(false)

    return (
        <Card className="mt-4">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShow(!show)}
            >
                <CardHeader icon="🛒" title="Weekly Grocery List" subtitle={`~₹${budgetInfo.weekly_total}/week`} />
                <span className="text-muted text-xs">{show ? '▲' : '▼'}</span>
            </div>

            {show && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {budgetInfo.weekly_grocery_list.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <span className="text-foreground/90">{item.item}</span>
                            </div>
                            <div className="flex items-center gap-4 text-muted">
                                <span className="text-xs">{item.qty}</span>
                                <span className="text-success font-medium text-xs w-10 text-right">₹{item.cost}</span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2 border-t border-border mt-2">
                        {budgetInfo.notes.map((note, i) => (
                            <div key={i} className="text-xs text-muted flex items-start gap-2 mt-1.5">
                                <span className="text-warning">💡</span>
                                {note}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    )
}

export default function DietPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const todayDow = new Date().getDay()
    const [selectedDay, setSelectedDay] = useState(todayDow)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted">Loading...</div>
            </div>
        )
    }

    const gymDayKey = dayOfWeekToGymDay[selectedDay]
    const diet = getTodaysDiet(gymDayKey)
    const gymDay = gymProgram.days[gymDayKey]
    const isToday = selectedDay === todayDow

    const mealEntries = Object.entries(diet.meals) as [string, Meal][]

    return (
        <PageContainer>
            {/* Header */}
            <header className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🍽️</span>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{diet.label}</h1>
                        <p className="text-xs text-muted">{diet.workout_focus}</p>
                    </div>
                </div>
            </header>

            {/* Day Selector */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
                {DAY_LABELS.map((d) => (
                    <button
                        key={d.key}
                        onClick={() => setSelectedDay(d.key)}
                        className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedDay === d.key
                                ? 'bg-primary text-background'
                                : d.key === todayDow
                                    ? 'bg-primary/15 text-primary border border-primary/30'
                                    : 'bg-surface text-muted hover:bg-surface-elevated'
                            }`}
                    >
                        {d.short}
                        {d.key === todayDow && selectedDay !== d.key && (
                            <span className="ml-1 text-[8px]">●</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Daily Totals Bar */}
            <Card className="mb-4 bg-primary/5 border-primary/15">
                <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <p className="text-lg font-bold text-primary">{diet.total_protein_g}g</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">Protein</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center flex-1">
                        <p className="text-lg font-bold text-foreground">{diet.total_calories}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">Calories</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center flex-1">
                        <p className="text-lg font-bold text-success">₹{diet.total_cost}</p>
                        <p className="text-[10px] text-muted uppercase tracking-wider">Cost/Day</p>
                    </div>
                </div>
            </Card>

            {/* Workout Reference */}
            {gymDay && (
                <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="text-sm">🏋️</span>
                    <p className="text-xs text-muted">
                        <span className="font-medium text-foreground/80">{gymDay.label}</span>
                        {' — '}
                        {gymDay.exercises
                            ? `${gymDay.exercises.length} exercises`
                            : gymDayKey === 'day_7_rest'
                                ? 'No gym today'
                                : 'Active recovery'}
                    </p>
                </div>
            )}

            {/* Meal Cards */}
            <div className="space-y-3 mb-4">
                {mealEntries.map(([key, meal]) => (
                    <MealCard key={key} mealKey={key} meal={meal} />
                ))}
            </div>

            {/* Tips */}
            <Card className="mb-4">
                <CardHeader icon="💡" title="Diet Tips" />
                <div className="space-y-2 mt-2">
                    {diet.tips.map((tip, i) => (
                        <div key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-warning mt-0.5">→</span>
                            {tip}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Budget Info */}
            <Card className="mb-4 bg-success/5 border-success/15">
                <div className="flex items-center gap-3">
                    <span className="text-xl">💰</span>
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            Monthly Budget: ₹{budgetInfo.monthly_budget}
                        </p>
                        <p className="text-xs text-muted">
                            Average ₹{budgetInfo.daily_average}/day • Focus on dal, soya, seasonal veggies
                        </p>
                    </div>
                </div>
            </Card>

            {/* Grocery List */}
            <GroceryList />

            {/* Bottom spacing for nav */}
            <div className="h-4" />
        </PageContainer>
    )
}
