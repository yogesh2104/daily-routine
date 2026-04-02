'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader } from '@/components/ui'
import { habitDefinitions } from '@/config/habits'
import { gymProgram, dayOfWeekToGymDay } from '@/config/workout-program'
import { supabase } from '@/lib/supabase/client'
import { buildWeeklySummary, formatHoursAndMinutes, type WeeklySummaryMetrics } from '@/lib/weekly-summary'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface DayData {
    date: string
    dayOfWeek: number
    isToday: boolean
    workoutCompleted: boolean
    habitsCompleted: number
    totalHabits: number
    bodyWeight?: number
    bodyWaist?: number
}

export default function WeeklyPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [weekData, setWeekData] = useState<DayData[]>([])
    const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    // Load week data
    useEffect(() => {
        if (!user) return

        const userId = user.id

        async function loadWeekData() {
            const today = new Date()
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay()) // Start from Sunday

            const days: DayData[] = []

            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek)
                date.setDate(startOfWeek.getDate() + i)
                const dateStr = date.toISOString().split('T')[0]

                days.push({
                    date: dateStr,
                    dayOfWeek: i,
                    isToday: dateStr === today.toISOString().split('T')[0],
                    workoutCompleted: false,
                    habitsCompleted: 0,
                    totalHabits: habitDefinitions.length
                })
            }

            // Fetch workout sessions
            const startDate = days[0].date
            const endDate = days[6].date

            const [
                { data: sessions },
                { data: habits },
                { data: stats },
            ] = await Promise.all([
                supabase
                    .from('workout_sessions')
                    .select('date, completed')
                    .eq('user_id', userId)
                    .gte('date', startDate)
                    .lte('date', endDate),
                supabase
                    .from('daily_habits')
                    .select('date, habit_key, completed, value')
                    .eq('user_id', userId)
                    .gte('date', startDate)
                    .lte('date', endDate),
                supabase
                    .from('body_stats')
                    .select('date, weight, waist')
                    .eq('user_id', userId)
                    .gte('date', startDate)
                    .lte('date', endDate),
            ])

            // Map data to days
            days.forEach(day => {
                const session = sessions?.find(s => s.date === day.date)
                day.workoutCompleted = session?.completed || false

                const dayHabits = habits?.filter(h => h.date === day.date && h.completed) || []
                day.habitsCompleted = dayHabits.length

                const dayStat = stats?.find(s => s.date === day.date)
                if (dayStat) {
                    day.bodyWeight = dayStat.weight ?? undefined
                    day.bodyWaist = dayStat.waist ?? undefined
                }
            })

            setWeekData(days)
            setWeeklySummary(buildWeeklySummary(sessions || [], habits || [], stats || []))
            setLoading(false)
        }

        loadWeekData()
    }, [user])

    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted">Loading...</div>
            </div>
        )
    }

    const completedWorkouts = weekData.filter(d => d.workoutCompleted).length
    const avgHabits = weekData.reduce((sum, d) => sum + d.habitsCompleted, 0) / 7
    const plannedWorkouts = weekData.filter((day) => dayOfWeekToGymDay[day.dayOfWeek] !== 'day_7_rest').length
    const summary = weeklySummary ?? {
        averageProteinGrams: null,
        proteinTrackedDays: 0,
        averageSleepHours: null,
        sleepTrackedDays: 0,
        completedWorkouts: 0,
        startWeightKg: null,
        latestWeightKg: null,
        weightTrendKg: null,
    }
    const weightTrendClassName = summary.weightTrendKg === null
        ? 'text-muted'
        : summary.weightTrendKg < 0
            ? 'text-success'
            : summary.weightTrendKg > 0
                ? 'text-warning'
                : 'text-primary'
    const weightTrendValue = summary.weightTrendKg === null
        ? summary.latestWeightKg !== null && summary.latestWeightKg !== undefined
            ? `${summary.latestWeightKg}kg`
            : '--'
        : `${summary.weightTrendKg > 0 ? '+' : ''}${summary.weightTrendKg}kg`
    const weightTrendNote = summary.weightTrendKg === null
        ? summary.latestWeightKg !== null && summary.latestWeightKg !== undefined
            ? 'First weigh-in this week'
            : 'Add 2-3 weigh-ins for a weekly trend'
        : `${summary.startWeightKg}kg to ${summary.latestWeightKg}kg`

    return (
        <PageContainer title="This Week" subtitle="Your weekly overview">
            <Card className="mb-6 bg-primary/5 border-primary/15">
                <CardHeader
                    title="Weekly Summary"
                    subtitle="Average protein, average sleep, completed workouts, and body-weight trend."
                />
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-surface/80 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Avg Protein</div>
                        <div className="mt-1 text-2xl font-bold text-foreground">
                            {summary.averageProteinGrams !== null && summary.averageProteinGrams !== undefined
                                ? `${summary.averageProteinGrams}g`
                                : '--'}
                        </div>
                        <div className="mt-1 text-[11px] text-muted">
                            {summary.proteinTrackedDays
                                ? `${summary.proteinTrackedDays} tracked day${summary.proteinTrackedDays === 1 ? '' : 's'}`
                                : 'Log protein grams to see your real average'}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface/80 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Avg Sleep</div>
                        <div className="mt-1 text-2xl font-bold text-foreground">
                            {formatHoursAndMinutes(summary.averageSleepHours)}
                        </div>
                        <div className="mt-1 text-[11px] text-muted">
                            {summary.sleepTrackedDays
                                ? `${summary.sleepTrackedDays} logged night${summary.sleepTrackedDays === 1 ? '' : 's'}`
                                : 'Log bedtime and wake time for a weekly sleep average'}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface/80 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Workouts</div>
                        <div className="mt-1 text-2xl font-bold text-primary">{completedWorkouts}/{plannedWorkouts}</div>
                        <div className="mt-1 text-[11px] text-muted">
                            {plannedWorkouts === 0 ? 'No planned sessions this week' : 'Completed planned training days'}
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface/80 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Weight Trend</div>
                        <div className={`mt-1 text-2xl font-bold ${weightTrendClassName}`}>{weightTrendValue}</div>
                        <div className="mt-1 text-[11px] text-muted">{weightTrendNote}</div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-muted">
                    Habit consistency this week: <span className="font-semibold text-foreground">{avgHabits.toFixed(1)}</span> completed habits per day.
                </div>
            </Card>

            {/* Week Calendar */}
            <Card className="mb-4">
                <div className="grid grid-cols-7 gap-1">
                    {weekData.map(day => {
                        const gymDayKey = dayOfWeekToGymDay[day.dayOfWeek]

                        return (
                            <div
                                key={day.date}
                                className={`text-center p-2 rounded-lg ${day.isToday ? 'bg-primary/20 ring-2 ring-primary' : ''
                                    }`}
                            >
                                <div className="text-xs text-muted mb-1">{dayNames[day.dayOfWeek]}</div>
                                <div className={`text-sm font-medium mb-2 ${day.isToday ? 'text-primary' : 'text-foreground'}`}>
                                    {new Date(day.date).getDate()}
                                </div>

                                {/* Workout status */}
                                <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs ${day.workoutCompleted
                                    ? 'bg-success text-white'
                                    : gymDayKey === 'day_7_rest'
                                        ? 'bg-surface text-muted'
                                        : 'bg-surface-elevated text-muted'
                                    }`}>
                                    {day.workoutCompleted ? '✓' : gymDayKey === 'day_7_rest' ? '😴' : '○'}
                                </div>

                                {/* Habits indicator */}
                                <div className="mt-2 flex justify-center gap-0.5">
                                    {[...Array(Math.min(day.habitsCompleted, 6))].map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Daily Breakdown */}
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
                Daily Schedule
            </h3>
            <div className="space-y-2">
                {weekData.map(day => {
                    const gymDayKey = dayOfWeekToGymDay[day.dayOfWeek]
                    const gymDay = gymProgram.days[gymDayKey]

                    return (
                        <Card
                            key={day.date}
                            className={`${day.isToday ? 'border-primary/50' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${day.isToday
                                        ? 'bg-primary text-background'
                                        : 'bg-surface-elevated text-foreground'
                                        }`}>
                                        {new Date(day.date).getDate()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground text-sm">
                                            {dayNames[day.dayOfWeek]}
                                        </div>
                                        <div className="text-xs text-muted truncate max-w-[180px]">
                                            {gymDay.label}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {(day.bodyWeight || day.bodyWaist) && (
                                        <div className="text-right">
                                            {day.bodyWeight && (
                                                <div className="text-sm font-bold text-foreground">{day.bodyWeight}kg</div>
                                            )}
                                            {day.bodyWaist && (
                                                <div className="text-[10px] text-muted">{day.bodyWaist}cm waist</div>
                                            )}
                                        </div>
                                    )}

                                    {day.workoutCompleted && (
                                        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </PageContainer>
    )
}
