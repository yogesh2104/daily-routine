import { supabase } from '@/lib/supabase/client'

// Challenge config: 180 days (6 months)
export const CHALLENGE_DAYS = 180

// Milestone definitions
export const MILESTONES = [
    { days: 7, label: '1 Week', icon: '🥉', color: 'text-orange-400' },
    { days: 14, label: '2 Weeks', icon: '🏅', color: 'text-yellow-500' },
    { days: 30, label: '1 Month', icon: '🥈', color: 'text-gray-300' },
    { days: 60, label: '2 Months', icon: '⭐', color: 'text-yellow-400' },
    { days: 90, label: '3 Months', icon: '🥇', color: 'text-yellow-300' },
    { days: 120, label: '4 Months', icon: '💪', color: 'text-primary' },
    { days: 150, label: '5 Months', icon: '🔥', color: 'text-danger' },
    { days: 180, label: '6 Months', icon: '💎', color: 'text-primary' },
]

export interface StreakData {
    currentStreak: number
    longestStreak: number
    challengeDay: number // Day X out of 180
    challengeStartDate: string | null
    totalActiveDays: number
    currentMilestone: typeof MILESTONES[number] | null
    nextMilestone: typeof MILESTONES[number] | null
}

/**
 * Calculate streak data from daily habits.
 * A "streak day" = at least 4 out of 7 habits completed on that day.
 */
export async function getStreakData(userId: string): Promise<StreakData> {
    // Fetch all daily habits ordered by date
    const { data: habits } = await supabase
        .from('daily_habits')
        .select('date, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('date', { ascending: false })

    // Fetch workout sessions
    const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('date, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('date', { ascending: false })

    // Build a map of date -> completed habit count
    const dateCompletions = new Map<string, number>()

    habits?.forEach(h => {
        const count = dateCompletions.get(h.date) || 0
        dateCompletions.set(h.date, count + 1)
    })

    // Add workout completions to the count
    workouts?.forEach(w => {
        const count = dateCompletions.get(w.date) || 0
        dateCompletions.set(w.date, count + 1)
    })

    // A day is "active" if at least 4 items were completed (habits + workout)
    const activeDates = new Set<string>()
    dateCompletions.forEach((count, date) => {
        if (count >= 4) {
            activeDates.add(date)
        }
    })

    // Sort dates descending
    const sortedDates = Array.from(activeDates).sort((a, b) => b.localeCompare(a))

    // Calculate current streak (consecutive days ending today or yesterday)
    let currentStreak = 0
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // Start counting from today or yesterday
    let checkDate = new Date(today)
    if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
        checkDate = new Date(yesterday)
    } else if (!activeDates.has(todayStr)) {
        currentStreak = 0
    }

    if (activeDates.has(todayStr) || activeDates.has(yesterdayStr)) {
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0]
            if (activeDates.has(dateStr)) {
                currentStreak++
                checkDate.setDate(checkDate.getDate() - 1)
            } else {
                break
            }
        }
    }

    // Calculate longest streak ever
    let longestStreak = 0
    if (sortedDates.length > 0) {
        const ascDates = [...sortedDates].reverse()
        let tempStreak = 1
        for (let i = 1; i < ascDates.length; i++) {
            const prev = new Date(ascDates[i - 1])
            const curr = new Date(ascDates[i])
            const diffMs = curr.getTime() - prev.getTime()
            const diffDays = diffMs / (1000 * 60 * 60 * 24)

            if (diffDays === 1) {
                tempStreak++
            } else {
                longestStreak = Math.max(longestStreak, tempStreak)
                tempStreak = 1
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak)
    }
    longestStreak = Math.max(longestStreak, currentStreak)

    // Challenge: find earliest active date as challenge start
    const challengeStartDate = sortedDates.length > 0
        ? sortedDates[sortedDates.length - 1]
        : null

    // Challenge day = days since start
    let challengeDay = 0
    if (challengeStartDate) {
        const start = new Date(challengeStartDate)
        const diffMs = today.getTime() - start.getTime()
        challengeDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
        challengeDay = Math.min(challengeDay, CHALLENGE_DAYS)
    }

    // Calculate milestones
    const currentMilestone = [...MILESTONES]
        .reverse()
        .find(m => currentStreak >= m.days) || null

    const nextMilestone = MILESTONES.find(m => currentStreak < m.days) || null

    return {
        currentStreak,
        longestStreak,
        challengeDay,
        challengeStartDate,
        totalActiveDays: activeDates.size,
        currentMilestone,
        nextMilestone,
    }
}
