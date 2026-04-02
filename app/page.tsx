'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Button, Checkbox, Input } from '@/components/ui'
import { getTodaysRoutine, getDayName } from '@/config/daily-routine'
import { getTodaysGymDay } from '@/config/workout-program'
import { getTodaysDiet } from '@/config/diet-plan'
import { habitDefinitions } from '@/config/habits'
import { supabase } from '@/lib/supabase/client'
import { getStreakData, CHALLENGE_DAYS, type StreakData } from '@/lib/streak'
import { getRecentPRs, type PersonalRecord } from '@/lib/personal-records'
import { buildProteinGapHint } from '@/lib/weekly-summary'
import type { HabitKey } from '@/types/database'

const PRO_TIPS = [
  "Prioritize protein (1.6-2g/kg) to maintain muscle while losing fat.",
  "Track your waist circumference; it's a better measure of fat loss than the scale.",
  "Sleep in a cool room (18-20°C) for better growth hormone production.",
  "Log RPE (Rate of Perceived Exertion) to ensure you're training near failure.",
  "Hit 10k steps daily for a consistent, sustainable calorie burn.",
  "Drink 3-4L of water to minimize water retention and optimize metabolism."
]

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

export default function TodayDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<Record<string, boolean>>({})
  const [habitValues, setHabitValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [currentTip] = useState(() => PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)])
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [recentPRs, setRecentPRs] = useState<PersonalRecord[]>([])

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const { routine, constants } = getTodaysRoutine()
  const { key: gymDayKey, day: gymDay } = getTodaysGymDay()
  const todayDiet = getTodaysDiet(gymDayKey)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    const userId = user.id

    async function loadHabits() {
      const { data: serverHabits } = await supabase
        .from('daily_habits')
        .select('*')
        .eq('user_id', userId)
        .eq('date', todayStr)

      if (serverHabits) {
        const habitMap: Record<string, boolean> = {}
        const valueMap: Record<string, string> = {}
        serverHabits.forEach(h => {
          habitMap[h.habit_key] = h.completed
          if (h.value) valueMap[h.habit_key] = h.value
        })
        setHabits(habitMap)
        setHabitValues(valueMap)
      }
      setLoading(false)
    }

    async function loadStreakAndPRs() {
      const [streak, prs] = await Promise.all([
        getStreakData(userId),
        getRecentPRs(userId),
      ])
      setStreakData(streak)
      setRecentPRs(prs)
    }

    loadHabits()
    loadStreakAndPRs()
  }, [user, todayStr])

  // Toggle habit
  const toggleHabit = async (habitKey: string) => {
    if (!user) return
    const newValue = !habits[habitKey]
    const currentValue = habitValues[habitKey] || ''

    // Update UI immediately
    setHabits(prev => ({ ...prev, [habitKey]: newValue }))

    // Save to Supabase
    await supabase
      .from('daily_habits')
      .upsert({
        user_id: user.id,
        date: todayStr,
        habit_key: habitKey as HabitKey,
        completed: newValue,
        value: currentValue
      }, { onConflict: 'user_id,date,habit_key' })
  }

  const updateHabitValue = async (habitKey: string, value: string) => {
    if (!user) return

    setHabitValues(prev => ({ ...prev, [habitKey]: value }))

    // Save to Supabase
    const isCompleted = habits[habitKey] || false
    await supabase
      .from('daily_habits')
      .upsert({
        user_id: user.id,
        date: todayStr,
        habit_key: habitKey as HabitKey,
        completed: isCompleted,
        value: value
      }, { onConflict: 'user_id,date,habit_key' })
  }

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const completedHabits = Object.values(habits).filter(Boolean).length
  const totalHabits = habitDefinitions.length
  const loggedProtein = Number.parseFloat(habitValues['protein_grams'] || '')
  const proteinTarget = Math.max(todayDiet.total_protein_g, 90)
  const proteinGapHint = buildProteinGapHint(Number.isFinite(loggedProtein) ? loggedProtein : null, proteinTarget)
  const proteinStatusClassName = proteinGapHint.remainingGrams === 0
    ? 'bg-success/5 border-success/20'
    : 'bg-warning/5 border-warning/20'
  const proteinValueClassName = proteinGapHint.remainingGrams === 0 ? 'text-success' : 'text-warning'

  return (
    <PageContainer>
      {/* Header with date */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wide">
              {getDayName(today).toUpperCase()}
            </p>
            <h1 className="text-2xl font-bold text-foreground mt-1">
              {formatDate(today)}
            </h1>
            <p className="text-muted text-sm mt-1">Built around your office commute and evening gym.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/settings')}
          >
            👤
          </Button>
        </div>
      </header>

      {/* Streak & Challenge Card */}
      {streakData && (
        <Card className="mb-4 bg-gradient-to-r from-warning/10 via-danger/5 to-primary/10 border-warning/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{streakData.currentStreak > 0 ? '🔥' : '💪'}</span>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {streakData.currentStreak > 0
                    ? `${streakData.currentStreak} Day Streak!`
                    : 'Start Your Streak Today!'}
                </h4>
                <p className="text-[10px] text-muted">
                  Best: {streakData.longestStreak} days • {streakData.totalActiveDays} total active days
                </p>
              </div>
            </div>
            {streakData.currentMilestone && (
              <span className="text-2xl" title={streakData.currentMilestone.label}>
                {streakData.currentMilestone.icon}
              </span>
            )}
          </div>

          {/* 180-Day Challenge Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted uppercase tracking-wider font-semibold">6-Month Challenge</span>
              <span className="text-foreground font-bold">Day {streakData.challengeDay}/{CHALLENGE_DAYS}</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-warning via-danger to-primary transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((streakData.challengeDay / CHALLENGE_DAYS) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Next Milestone */}
          {streakData.nextMilestone && (
            <p className="text-[10px] text-muted">
              Next: {streakData.nextMilestone.icon} {streakData.nextMilestone.label} in{' '}
              <span className="text-foreground font-medium">
                {streakData.nextMilestone.days - streakData.currentStreak} days
              </span>
            </p>
          )}
        </Card>
      )}

      {/* Recent PRs Card */}
      {recentPRs.length > 0 && (
        <Card className="mb-4 bg-success/5 border-success/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏆</span>
            <h4 className="text-sm font-bold text-foreground">Recent PRs This Week</h4>
          </div>
          <div className="space-y-2">
            {recentPRs.slice(0, 3).map((pr) => (
              <div key={pr.exercise_name} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80 truncate max-w-[60%]">{pr.exercise_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-success">{pr.weight}kg × {pr.reps}</span>
                  <span className="text-[10px] text-muted bg-surface px-1.5 py-0.5 rounded">
                    ~{pr.estimated_1rm}kg 1RM
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pro Tip Card */}
      <Card className="mb-6 bg-primary/10 border-primary/20">
        <div className="flex gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
              Pro Tip for Aesthetics
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {currentTip}
            </p>
          </div>
        </div>
      </Card>

      {/* Today's Workout Card */}
      <Link href="/workout" className="block mb-4">
        <Card className="hover:border-primary/30 transition-colors">
          <CardHeader
            icon="🏋️"
            title={gymDay.label}
            subtitle={routine.workout.evening_gym}
          />
          {gymDay.exercises && (
            <p className="text-sm text-muted">
              {gymDay.exercises.length} exercises • 45-60 min
            </p>
          )}
          {gymDayKey === 'day_7_rest' && (
            <p className="text-sm text-success">Rest day - focus on recovery</p>
          )}
        </Card>
      </Link>

      <Card className="mb-4">
        <CardHeader title="Today&apos;s Timeline" subtitle="A realistic flow for your 7:20 AM departure and 8 PM return." />
        <div className="space-y-3 mt-3">
          {routine.timeline.map((slot) => (
            <div key={`${slot.time}-${slot.label}`} className="grid grid-cols-[68px_1fr] gap-3">
              <div className="text-xs font-semibold text-primary pt-0.5">{slot.time}</div>
              <div>
                <div className="text-sm font-medium text-foreground">{slot.label}</div>
                <div className="text-xs text-muted mt-0.5">{slot.details}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Morning Routine */}
      <Card className="mb-4">
        <CardHeader icon="🌅" title="Morning" subtitle={routine.workout.morning} />
        <div className="space-y-2 mt-3">
          {constants.morning.map((item, i) => (
            <div key={i} className="text-sm text-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader title="Today&apos;s Suggestions" />
        <div className="space-y-2 mt-2">
          {routine.suggestions.map((tip, i) => (
            <div key={i} className="text-sm text-foreground/80 flex items-start gap-2">
              <span className="text-primary mt-0.5">+</span>
              {tip}
            </div>
          ))}
        </div>
      </Card>

      <Card className={`mb-4 ${proteinStatusClassName}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-foreground">Protein Gap</h4>
            <p className="text-xs text-muted mt-1">
              {proteinGapHint.trackedGrams}g tracked of {proteinGapHint.targetGrams}g today
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${proteinValueClassName}`}>
              {proteinGapHint.remainingGrams === 0 ? 'On target' : `${proteinGapHint.remainingGrams}g left`}
            </div>
            <div className="text-[10px] text-muted uppercase tracking-wide mt-1">{proteinGapHint.title}</div>
          </div>
        </div>
        <p className="text-sm text-foreground/85 mt-3 leading-relaxed">
          {proteinGapHint.message}
        </p>
      </Card>

      {/* Daily Habits */}
      <Card className="mb-4">
        <CardHeader
          icon="✅"
          title="Daily Habits"
          subtitle={`${completedHabits}/${totalHabits} complete`}
        />
        <div className="space-y-3 mt-3">
          {habitDefinitions.map((habit) => (
            <div key={habit.key} className="space-y-2">
              <Checkbox
                checked={habits[habit.key] || false}
                onChange={() => toggleHabit(habit.key)}
                label={habit.label}
                icon={habit.icon}
              />

              {/* Sleep Inputs */}
              {habit.key === 'sleep' && habits['sleep'] && (
                <div className="flex gap-2 pl-12">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted uppercase block mb-1">Bedtime</label>
                    <Input
                      type="time"
                      className="py-1 px-2 text-xs"
                      value={habitValues['sleep_bed'] || ''}
                      onChange={(e) => updateHabitValue('sleep_bed', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted uppercase block mb-1">Wake up</label>
                    <Input
                      type="time"
                      className="py-1 px-2 text-xs"
                      value={habitValues['sleep_wake'] || ''}
                      onChange={(e) => updateHabitValue('sleep_wake', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Protein Inputs */}
              {habit.key === 'protein' && (
                <div className="pl-12">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Total grams"
                      className="py-1 px-2 text-xs w-24"
                      value={habitValues['protein_grams'] || ''}
                      onChange={(e) => updateHabitValue('protein_grams', e.target.value)}
                    />
                    <span className="text-xs text-muted">grams tracked today</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Skincare Tonight */}
      <Card className="mb-4">
        <CardHeader icon="✨" title="Tonight's Skincare" />
        <div className="space-y-2 mt-2">
          {constants.pm_skincare_base.map((item, i) => (
            <div key={i} className="text-sm text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted" />
              {item}
            </div>
          ))}
          <div className="text-sm text-primary flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {routine.skincare_pm}
          </div>
        </div>
      </Card>

      {/* Today's Diet Plan */}
      {(() => {
        const todayDiet = getTodaysDiet(gymDayKey)
        return (
          <Link href="/diet" className="block mb-4">
            <Card className="hover:border-primary/30 transition-colors">
              <CardHeader icon="🍽️" title={todayDiet.label} subtitle={todayDiet.workout_focus} />
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">{todayDiet.total_protein_g}g</span>
                  <span className="text-[10px] text-muted">Protein</span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">{todayDiet.total_calories}</span>
                  <span className="text-[10px] text-muted">Cal</span>
                </div>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-success">₹{todayDiet.total_cost}</span>
                  <span className="text-[10px] text-muted">Cost</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-2">Tap to see full meal plan →</p>
            </Card>
          </Link>
        )
      })()}
    </PageContainer>
  )
}
