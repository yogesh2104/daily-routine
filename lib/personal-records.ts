import { supabase } from '@/lib/supabase/client'

export interface PersonalRecord {
    exercise_name: string
    weight: number
    reps: number
    date: string
    estimated_1rm: number // Epley formula
}

export interface PRCheckResult {
    exercise_name: string
    newPR: boolean
    previousBest: number // previous estimated 1RM
    currentBest: number  // new estimated 1RM
    improvement: number  // percentage improvement
}

/**
 * Calculate estimated 1RM using Epley formula:
 * 1RM = weight × (1 + reps/30)
 */
function calculateE1RM(weight: number, reps: number): number {
    if (reps <= 0 || weight <= 0) return 0
    if (reps === 1) return weight
    return Math.round(weight * (1 + reps / 30) * 10) / 10
}

/**
 * Get all personal records for a user (best estimated 1RM per exercise)
 */
export async function getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id, date')
        .eq('user_id', userId)
        .order('date', { ascending: false })

    if (!sessions || sessions.length === 0) return []

    const sessionIds = sessions.map(s => s.id)
    const dateMap = new Map(sessions.map(s => [s.id, s.date]))

    // Fetch all sets with weight data
    const { data: sets } = await supabase
        .from('exercise_sets')
        .select('session_id, exercise_name, reps_done, weight_used')
        .in('session_id', sessionIds)
        .not('weight_used', 'is', null)
        .not('reps_done', 'is', null)
        .gt('weight_used', 0)
        .gt('reps_done', 0)

    if (!sets || sets.length === 0) return []

    // Find best estimated 1RM per exercise
    const prMap = new Map<string, PersonalRecord>()

    sets.forEach(set => {
        const e1rm = calculateE1RM(set.weight_used!, set.reps_done!)
        const existing = prMap.get(set.exercise_name)
        const date = dateMap.get(set.session_id) || ''

        if (!existing || e1rm > existing.estimated_1rm) {
            prMap.set(set.exercise_name, {
                exercise_name: set.exercise_name,
                weight: set.weight_used!,
                reps: set.reps_done!,
                date,
                estimated_1rm: e1rm,
            })
        }
    })

    return Array.from(prMap.values()).sort((a, b) => b.estimated_1rm - a.estimated_1rm)
}

/**
 * Get recent PRs (PRs set in the last 7 days)
 */
export async function getRecentPRs(userId: string): Promise<PersonalRecord[]> {
    const allPRs = await getPersonalRecords(userId)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoff = sevenDaysAgo.toISOString().split('T')[0]

    return allPRs.filter(pr => pr.date >= cutoff)
}

/**
 * Check if today's workout sets contain any new PRs
 */
export async function checkForNewPRs(
    userId: string,
    todaySets: Array<{ exercise_name: string; reps_done?: number; weight_used?: number }>
): Promise<PRCheckResult[]> {
    const existingPRs = await getPersonalRecords(userId)
    const prMap = new Map(existingPRs.map(pr => [pr.exercise_name, pr]))
    const results: PRCheckResult[] = []

    // Group today's sets by exercise and find best e1rm
    const todayBest = new Map<string, number>()
    todaySets.forEach(set => {
        if (!set.weight_used || !set.reps_done || set.weight_used <= 0 || set.reps_done <= 0) return
        const e1rm = calculateE1RM(set.weight_used, set.reps_done)
        const existing = todayBest.get(set.exercise_name) || 0
        if (e1rm > existing) {
            todayBest.set(set.exercise_name, e1rm)
        }
    })

    todayBest.forEach((currentE1RM, exercise) => {
        const previousPR = prMap.get(exercise)
        const previousBest = previousPR?.estimated_1rm || 0

        if (currentE1RM > previousBest && previousBest > 0) {
            results.push({
                exercise_name: exercise,
                newPR: true,
                previousBest,
                currentBest: currentE1RM,
                improvement: Math.round(((currentE1RM - previousBest) / previousBest) * 100),
            })
        } else if (previousBest === 0 && currentE1RM > 0) {
            // First time recording this exercise with weight
            results.push({
                exercise_name: exercise,
                newPR: true,
                previousBest: 0,
                currentBest: currentE1RM,
                improvement: 100,
            })
        }
    })

    return results
}
