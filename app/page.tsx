'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Button, Checkbox, Input } from '@/components/ui'
import { getTodaysRoutine, getDayName } from '@/config/daily-routine'
import { getTodaysGymDay, gymProgram } from '@/config/workout-program'
import { habitDefinitions } from '@/config/habits'
import { supabase } from '@/lib/supabase/client'
import { syncAll, isOnline as checkOnline } from '@/lib/offline/sync'
import { putItem, getItemsByDate } from '@/lib/offline/indexed-db'
import type { DailyHabit, HabitKey } from '@/types/database'

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
  const [isOnline, setIsOnline] = useState(true)
  const [currentTip] = useState(() => PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)])

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

  useEffect(() => {
    if (!user) return

    const userId = user.id

    async function loadHabits() {
      // First try offline data
      const localHabits = await getItemsByDate<DailyHabit & { synced?: boolean }>('habits', todayStr)

      if (localHabits.length > 0) {
        const habitMap: Record<string, boolean> = {}
        const valueMap: Record<string, string> = {}
        localHabits.forEach(h => {
          habitMap[h.habit_key] = h.completed
          if (h.value) valueMap[h.habit_key] = h.value
        })
        setHabits(habitMap)
        setHabitValues(valueMap)
        setLoading(false)
      }

      // Sync with Supabase
      if (checkOnline()) {
        setIsOnline(true)
        await syncAll()

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
      } else {
        setIsOnline(false)
      }
      setLoading(false)
    }

    loadHabits()
  }, [user, todayStr])

  // Toggle habit
  const toggleHabit = async (habitKey: string) => {
    if (!user) return
    const newValue = !habits[habitKey]
    const currentValue = habitValues[habitKey] || ''

    // Update UI immediately
    setHabits(prev => ({ ...prev, [habitKey]: newValue }))

    // Save local
    const habitId = `${user.id}-${todayStr}-${habitKey}`
    await putItem('habits', {
      id: habitId,
      user_id: user.id,
      date: todayStr,
      habit_key: habitKey as HabitKey,
      completed: newValue,
      value: currentValue
    })

    // Sync if online
    if (checkOnline()) {
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
  }

  const updateHabitValue = async (habitKey: string, value: string) => {
    if (!user) return

    setHabitValues(prev => ({ ...prev, [habitKey]: value }))

    // Save local
    const isCompleted = habits[habitKey] || false
    const habitId = `${user.id}-${todayStr}-${habitKey}`
    await putItem('habits', {
      id: habitId,
      user_id: user.id,
      date: todayStr,
      habit_key: habitKey as HabitKey,
      completed: isCompleted,
      value: value
    })

    // Debounced or simple sync
    if (checkOnline()) {
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted text-sm">Welcome back!</p>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${isOnline ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
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

      {/* Nutrition Suggestion */}
      <Card className="mb-4">
        <CardHeader icon="🍲" title="Lunch Suggestion" />
        <p className="text-foreground font-medium">{routine.nutrition.lunch_dal}</p>
      </Card>
    </PageContainer>
  )
}
