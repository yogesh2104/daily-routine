'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Checkbox } from '@/components/ui'
import { getTodaysRoutine, getDayName } from '@/config/daily-routine'
import { getTodaysGymDay, gymProgram } from '@/config/workout-program'
import { habitDefinitions } from '@/config/habits'
import { supabase } from '@/lib/supabase/client'
import type { HabitKey } from '@/types/database'

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
  const [loadingHabits, setLoadingHabits] = useState(true)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const { routine, constants } = getTodaysRoutine()
  const { key: gymDayKey, day: gymDay } = getTodaysGymDay()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Load habits from Supabase
  useEffect(() => {
    if (!user) return

    const userId = user.id

    async function loadHabits() {
      const { data, error } = await supabase
        .from('daily_habits')
        .select('habit_key, completed')
        .eq('user_id', userId)
        .eq('date', todayStr)

      if (!error && data) {
        const habitsMap: Record<string, boolean> = {}
        data.forEach(h => {
          habitsMap[h.habit_key] = h.completed
        })
        setHabits(habitsMap)
      }
      setLoadingHabits(false)
    }

    loadHabits()
  }, [user, todayStr])

  // Toggle habit
  const toggleHabit = async (habitKey: string) => {
    if (!user) return

    const newValue = !habits[habitKey]
    setHabits(prev => ({ ...prev, [habitKey]: newValue }))

    // Upsert to database
    await supabase
      .from('daily_habits')
      .upsert({
        user_id: user.id,
        date: todayStr,
        habit_key: habitKey as HabitKey,
        completed: newValue
      }, {
        onConflict: 'user_id,date,habit_key'
      })
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const completedHabits = Object.values(habits).filter(Boolean).length
  const totalHabits = habitDefinitions.length

  return (
    <PageContainer>
      {/* Header with date */}
      <header className="mb-6">
        <p className="text-sm text-primary font-medium uppercase tracking-wide">
          {getDayName(today).toUpperCase()}
        </p>
        <h1 className="text-2xl font-bold text-foreground mt-1">
          {formatDate(today)}
        </h1>
      </header>

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

      {/* Daily Habits */}
      <Card className="mb-4">
        <CardHeader
          icon="✅"
          title="Daily Habits"
          subtitle={`${completedHabits}/${totalHabits} complete`}
        />
        <div className="space-y-2 mt-3">
          {habitDefinitions.map(habit => (
            <Checkbox
              key={habit.key}
              checked={habits[habit.key] || false}
              onChange={() => toggleHabit(habit.key)}
              label={habit.label}
              icon={habit.icon}
            />
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

      {/* Nutrition Suggestion */}
      <Card className="mb-4">
        <CardHeader icon="🍲" title="Lunch Suggestion" />
        <p className="text-foreground font-medium">{routine.nutrition.lunch_dal}</p>
      </Card>
    </PageContainer>
  )
}
