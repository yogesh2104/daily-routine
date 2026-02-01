'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Button, NumberInput } from '@/components/ui'
import { getTodaysGymDay, gymProgram } from '@/config/workout-program'
import { supabase } from '@/lib/supabase/client'
import type { WorkoutSession, ExerciseSet } from '@/types/database'

interface SetData {
    exercise_name: string
    set_number: number
    reps_target: string
    reps_done?: number
    weight_used?: number
    duration_sec?: number
    completed: boolean
}

export default function WorkoutPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [session, setSession] = useState<WorkoutSession | null>(null)
    const [sets, setSets] = useState<SetData[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const { key: gymDayKey, day: gymDay } = getTodaysGymDay()

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    // Load or create workout session
    useEffect(() => {
        if (!user) return

        const userId = user.id

        async function loadSession() {
            // Try to get existing session
            const { data: existingSession } = await supabase
                .from('workout_sessions')
                .select('*')
                .eq('user_id', userId)
                .eq('date', todayStr)
                .single()

            if (existingSession) {
                setSession(existingSession)

                // Load existing sets
                const { data: existingSets } = await supabase
                    .from('exercise_sets')
                    .select('*')
                    .eq('session_id', existingSession.id)
                    .order('exercise_name')
                    .order('set_number')

                if (existingSets && existingSets.length > 0) {
                    setSets(existingSets.map(s => ({
                        exercise_name: s.exercise_name,
                        set_number: s.set_number,
                        reps_target: s.reps_target || '',
                        reps_done: s.reps_done ?? undefined,
                        weight_used: s.weight_used ?? undefined,
                        duration_sec: s.duration_sec ?? undefined,
                        completed: s.completed
                    })))
                    setLoading(false)
                    return
                }
            }

            // Generate sets from program
            const generatedSets: SetData[] = []

            // Regular exercises
            if (gymDay.exercises) {
                gymDay.exercises.forEach(ex => {
                    for (let i = 1; i <= ex.sets; i++) {
                        generatedSets.push({
                            exercise_name: ex.name,
                            set_number: i,
                            reps_target: String(ex.reps),
                            completed: false,
                            duration_sec: ex.duration_sec
                        })
                    }
                })
            }

            // Core exercises
            if (gymDay.core) {
                gymDay.core.forEach(ex => {
                    for (let i = 1; i <= ex.sets; i++) {
                        generatedSets.push({
                            exercise_name: `${ex.name} (Core)`,
                            set_number: i,
                            reps_target: ex.reps ? String(ex.reps) : `${ex.duration_sec}s`,
                            completed: false,
                            duration_sec: ex.duration_sec
                        })
                    }
                })
            }

            // Abs circuit
            if (gymDay.abs_circuit) {
                for (let round = 1; round <= gymDay.abs_circuit.rounds; round++) {
                    gymDay.abs_circuit.exercises.forEach(ex => {
                        generatedSets.push({
                            exercise_name: `${ex.name} (R${round})`,
                            set_number: 1,
                            reps_target: ex.reps ? String(ex.reps) : `${ex.duration_sec}s`,
                            completed: false,
                            duration_sec: ex.duration_sec
                        })
                    })
                }
            }

            setSets(generatedSets)
            setLoading(false)
        }

        loadSession()
    }, [user, todayStr, gymDay])

    // Toggle set completion
    const toggleSet = (exerciseName: string, setNumber: number) => {
        setSets(prev => prev.map(s =>
            s.exercise_name === exerciseName && s.set_number === setNumber
                ? { ...s, completed: !s.completed }
                : s
        ))
    }

    // Update weight for a set
    const updateWeight = (exerciseName: string, setNumber: number, weight: number | undefined) => {
        setSets(prev => prev.map(s =>
            s.exercise_name === exerciseName && s.set_number === setNumber
                ? { ...s, weight_used: weight }
                : s
        ))
    }

    // Update reps done
    const updateReps = (exerciseName: string, setNumber: number, reps: number | undefined) => {
        setSets(prev => prev.map(s =>
            s.exercise_name === exerciseName && s.set_number === setNumber
                ? { ...s, reps_done: reps }
                : s
        ))
    }

    // Save workout
    const saveWorkout = async () => {
        if (!user) return
        setSaving(true)

        try {
            // Create or get session
            let sessionId = session?.id

            if (!sessionId) {
                const { data: newSession, error: sessionError } = await supabase
                    .from('workout_sessions')
                    .upsert({
                        user_id: user.id,
                        date: todayStr,
                        gym_day_key: gymDayKey,
                        completed: sets.every(s => s.completed)
                    }, { onConflict: 'user_id,date' })
                    .select()
                    .single()

                if (sessionError) throw sessionError
                sessionId = newSession.id
                setSession(newSession)
            } else {
                // Update completion status
                await supabase
                    .from('workout_sessions')
                    .update({ completed: sets.every(s => s.completed) })
                    .eq('id', sessionId)
            }

            // Delete existing sets and insert new ones
            await supabase
                .from('exercise_sets')
                .delete()
                .eq('session_id', sessionId)

            const setsToInsert = sets.map(s => ({
                session_id: sessionId,
                exercise_name: s.exercise_name,
                set_number: s.set_number,
                reps_target: s.reps_target,
                reps_done: s.reps_done,
                weight_used: s.weight_used,
                duration_sec: s.duration_sec,
                completed: s.completed
            }))

            await supabase
                .from('exercise_sets')
                .insert(setsToInsert)

        } catch (error) {
            console.error('Error saving workout:', error)
        }

        setSaving(false)
    }

    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted">Loading workout...</div>
            </div>
        )
    }

    // Rest day
    if (gymDayKey === 'day_7_rest') {
        return (
            <PageContainer title="Rest Day" subtitle="Focus on recovery">
                <Card className="text-center py-8">
                    <div className="text-5xl mb-4">😴</div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Rest & Recover</h2>
                    <p className="text-muted text-sm">
                        No gym today. Focus on sleep, hydration, and light walking.
                    </p>
                </Card>
            </PageContainer>
        )
    }

    // Group sets by exercise
    const exerciseGroups = sets.reduce((acc, set) => {
        if (!acc[set.exercise_name]) {
            acc[set.exercise_name] = []
        }
        acc[set.exercise_name].push(set)
        return acc
    }, {} as Record<string, SetData[]>)

    const completedSets = sets.filter(s => s.completed).length
    const totalSets = sets.length
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

    return (
        <PageContainer>
            {/* Header */}
            <header className="mb-6">
                <p className="text-sm text-primary font-medium uppercase tracking-wide">
                    Today&apos;s Workout
                </p>
                <h1 className="text-2xl font-bold text-foreground mt-1">
                    {gymDay.label}
                </h1>
            </header>

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Progress</span>
                    <span className="text-foreground font-medium">{completedSets}/{totalSets} sets</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Exercise list */}
            <div className="space-y-4">
                {Object.entries(exerciseGroups).map(([exerciseName, exerciseSets]) => (
                    <Card key={exerciseName}>
                        <h3 className="font-semibold text-foreground mb-3">{exerciseName}</h3>

                        {/* Sets header */}
                        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 text-xs text-muted mb-2 px-1">
                            <span></span>
                            <span className="text-center">Target</span>
                            <span className="text-center">Reps</span>
                            <span className="text-center">kg</span>
                        </div>

                        {/* Sets */}
                        <div className="space-y-2">
                            {exerciseSets.map((set) => (
                                <div
                                    key={`${set.exercise_name}-${set.set_number}`}
                                    className={`grid grid-cols-[auto_1fr_1fr_1fr] gap-2 items-center p-2 rounded-lg transition-colors ${set.completed ? 'bg-success/10' : 'bg-surface-elevated'
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleSet(set.exercise_name, set.set_number)}
                                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${set.completed
                                            ? 'bg-success border-success'
                                            : 'border-border hover:border-muted'
                                            }`}
                                    >
                                        {set.completed && (
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Target */}
                                    <div className="text-center text-sm text-muted">
                                        {set.reps_target}
                                    </div>

                                    {/* Reps done */}
                                    <div className="flex justify-center">
                                        <NumberInput
                                            value={set.reps_done}
                                            onChange={(v) => updateReps(set.exercise_name, set.set_number, v)}
                                            placeholder="-"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div className="flex justify-center">
                                        <NumberInput
                                            value={set.weight_used}
                                            onChange={(v) => updateWeight(set.exercise_name, set.set_number, v)}
                                            placeholder="-"
                                            step={0.5}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Save button */}
            <div className="fixed bottom-20 left-0 right-0 px-4 safe-bottom">
                <div className="max-w-lg mx-auto">
                    <Button
                        fullWidth
                        onClick={saveWorkout}
                        loading={saving}
                        className="shadow-lg"
                    >
                        {saving ? 'Saving...' : 'Save Workout'}
                    </Button>
                </div>
            </div>

            {/* Finisher */}
            {gymDay.finisher && (
                <Card className="mt-4 mb-24">
                    <CardHeader icon="🏃" title="Finisher" />
                    <p className="text-foreground">
                        {gymDay.finisher.name} - {gymDay.finisher.duration_min} min
                    </p>
                </Card>
            )}
        </PageContainer>
    )
}
