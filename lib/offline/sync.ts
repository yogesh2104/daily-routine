import { supabase } from '@/lib/supabase/client'
import {
    getUnsyncedItems,
    markAsSynced,
    initDB
} from './indexed-db'

interface SyncableHabit {
    id: string
    user_id: string
    date: string
    habit_key: string
    completed: boolean
    value?: string
}

interface SyncableSession {
    id: string
    user_id: string
    date: string
    gym_day_key: string
    completed: boolean
}

interface SyncableSet {
    id: string
    session_id: string
    exercise_name: string
    set_number: number
    reps_target?: string
    reps_done?: number
    weight_used?: number
    rpe?: number
    completed: boolean
}

interface SyncableBodyStat {
    id: string
    user_id: string
    date: string
    weight?: number
    body_fat?: number
    waist?: number
    notes?: string
}

// Check if online
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine
}

// Sync habits to Supabase
async function syncHabits(): Promise<void> {
    const unsyncedHabits = await getUnsyncedItems<SyncableHabit>('habits')

    if (unsyncedHabits.length === 0) return

    const { error } = await supabase
        .from('daily_habits')
        .upsert(
            unsyncedHabits.map(h => ({
                user_id: h.user_id,
                date: h.date,
                habit_key: h.habit_key,
                completed: h.completed,
                value: h.value
            })),
            { onConflict: 'user_id,date,habit_key' }
        )

    if (!error) {
        await markAsSynced('habits', unsyncedHabits.map(h => h.id))
    }
}

// Sync workout sessions to Supabase
async function syncWorkoutSessions(): Promise<void> {
    const unsyncedSessions = await getUnsyncedItems<SyncableSession>('workout_sessions')

    if (unsyncedSessions.length === 0) return

    const { error } = await supabase
        .from('workout_sessions')
        .upsert(
            unsyncedSessions.map(s => ({
                user_id: s.user_id,
                date: s.date,
                gym_day_key: s.gym_day_key,
                completed: s.completed
            })),
            { onConflict: 'user_id,date' }
        )

    if (!error) {
        await markAsSynced('workout_sessions', unsyncedSessions.map(s => s.id))
    }
}

// Sync exercise sets to Supabase
async function syncExerciseSets(): Promise<void> {
    const unsyncedSets = await getUnsyncedItems<SyncableSet>('exercise_sets')

    if (unsyncedSets.length === 0) return

    const { error } = await supabase
        .from('exercise_sets')
        .upsert(
            unsyncedSets.map(s => ({
                session_id: s.session_id,
                exercise_name: s.exercise_name,
                set_number: s.set_number,
                reps_target: s.reps_target,
                reps_done: s.reps_done,
                weight_used: s.weight_used,
                rpe: s.rpe,
                completed: s.completed
            })),
            { onConflict: 'session_id,exercise_name,set_number' }
        )

    if (!error) {
        await markAsSynced('exercise_sets', unsyncedSets.map(s => s.id))
    }
}

// Sync body stats to Supabase
async function syncBodyStats(): Promise<void> {
    const unsyncedStats = await getUnsyncedItems<SyncableBodyStat>('body_stats')

    if (unsyncedStats.length === 0) return

    const { error } = await supabase
        .from('body_stats')
        .upsert(
            unsyncedStats.map(s => ({
                user_id: s.user_id,
                date: s.date,
                weight: s.weight,
                body_fat: s.body_fat,
                waist: s.waist,
                notes: s.notes
            })),
            { onConflict: 'user_id,date' }
        )

    if (!error) {
        await markAsSynced('body_stats', unsyncedStats.map(s => s.id))
    }
}

// Main sync function
export async function syncAll(): Promise<void> {
    if (!isOnline()) {
        console.log('Offline - skipping sync')
        return
    }

    try {
        await initDB()
        await syncHabits()
        await syncWorkoutSessions()
        await syncExerciseSets()
        await syncBodyStats()
        console.log('Sync complete')
    } catch (error) {
        console.error('Sync failed:', error)
    }
}

// Setup online listener for auto-sync
export function setupOnlineSync(): () => void {
    const handleOnline = () => {
        console.log('Back online - syncing...')
        syncAll()
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline)

        // Also sync on page visibility change (when user comes back to app)
        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && isOnline()) {
                syncAll()
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            window.removeEventListener('online', handleOnline)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }

    return () => { }
}
