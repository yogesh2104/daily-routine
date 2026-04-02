'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardHeader, Input, NumberInput } from '@/components/ui'
import {
    buildWorkoutTemplate,
    getTodaysGymDay,
    getWorkoutDayLabel,
    gymProgram,
    isGymDayKey,
    workoutDayOptions,
} from '@/config/workout-program'
import { supabase } from '@/lib/supabase/client'
import { checkForNewPRs, type PRCheckResult } from '@/lib/personal-records'
import type { GymDayKey, WorkoutSession } from '@/types/database'

interface SetData {
    local_id: string
    exercise_name: string
    exercise_order: number
    set_number: number
    reps_target: string
    reps_done?: number
    weight_used?: number
    duration_sec?: number
    rpe?: number
    completed: boolean
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const getDurationFromTarget = (target: string) => {
    const match = target.trim().match(/^(\d+)\s*s$/i)
    return match ? Number(match[1]) : undefined
}

function buildSets(dayKey: GymDayKey): SetData[] {
    return buildWorkoutTemplate(dayKey).map((setTemplate) => ({
        local_id: makeId(),
        exercise_name: setTemplate.exercise_name,
        exercise_order: setTemplate.exercise_order,
        set_number: setTemplate.set_number,
        reps_target: setTemplate.reps_target,
        duration_sec: setTemplate.duration_sec,
        completed: false,
    }))
}

function normalizeOrders(sets: SetData[]) {
    const orderMap = new Map<number, number>()
    let nextOrder = 0

    return [...sets]
        .sort((a, b) => a.exercise_order - b.exercise_order || a.set_number - b.set_number)
        .map((set) => {
            if (!orderMap.has(set.exercise_order)) {
                orderMap.set(set.exercise_order, nextOrder)
                nextOrder += 1
            }

            return { ...set, exercise_order: orderMap.get(set.exercise_order)! }
        })
}

export default function WorkoutPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [session, setSession] = useState<WorkoutSession | null>(null)
    const [sets, setSets] = useState<SetData[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedGymDayKey, setSelectedGymDayKey] = useState<GymDayKey>('day_1_push')
    const [sessionLabel, setSessionLabel] = useState('')
    const [sessionNotes, setSessionNotes] = useState('')
    const [newExerciseName, setNewExerciseName] = useState('')
    const [newExerciseSets, setNewExerciseSets] = useState<number | undefined>(3)
    const [newExerciseTarget, setNewExerciseTarget] = useState('10-12')
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [newPRs, setNewPRs] = useState<PRCheckResult[]>([])
    const [showPRToast, setShowPRToast] = useState(false)

    const todayStr = new Date().toISOString().split('T')[0]
    const { key: scheduledGymDayKey, day: scheduledGymDay } = getTodaysGymDay()
    const selectedTemplateDay = selectedGymDayKey === 'custom' ? null : gymProgram.days[selectedGymDayKey]

    useEffect(() => {
        if (!authLoading && !user) router.push('/login')
    }, [authLoading, router, user])

    useEffect(() => {
        if (!user) return
        const userId = user.id

        async function loadSession() {
            setLoading(true)

            const { data: existingSession, error: sessionError } = await supabase
                .from('workout_sessions')
                .select('*')
                .eq('user_id', userId)
                .eq('date', todayStr)
                .maybeSingle()

            if (sessionError) {
                console.error('Error loading workout session:', sessionError)
                setLoading(false)
                return
            }

            if (!existingSession) {
                setSelectedGymDayKey(scheduledGymDayKey)
                setSessionLabel(scheduledGymDay.label)
                setSets(buildSets(scheduledGymDayKey))
                setLoading(false)
                return
            }

            const storedGymDayKey = isGymDayKey(existingSession.gym_day_key)
                ? existingSession.gym_day_key
                : scheduledGymDayKey

            setSession(existingSession)
            setSelectedGymDayKey(storedGymDayKey)
            setSessionLabel(existingSession.session_label || getWorkoutDayLabel(storedGymDayKey))
            setSessionNotes(existingSession.notes || '')

            const { data: existingSets, error: setsError } = await supabase
                .from('exercise_sets')
                .select('*')
                .eq('session_id', existingSession.id)
                .order('exercise_order', { ascending: true })
                .order('set_number', { ascending: true })

            if (setsError) console.error('Error loading exercise sets:', setsError)

            setSets(
                existingSets?.length
                    ? existingSets.map((set) => ({
                        local_id: makeId(),
                        exercise_name: set.exercise_name,
                        exercise_order: set.exercise_order ?? 0,
                        set_number: set.set_number,
                        reps_target: set.reps_target || '',
                        reps_done: set.reps_done ?? undefined,
                        weight_used: set.weight_used ?? undefined,
                        duration_sec: set.duration_sec ?? undefined,
                        rpe: set.rpe ?? undefined,
                        completed: set.completed,
                    }))
                    : buildSets(storedGymDayKey)
            )

            setLoading(false)
        }

        loadSession()
    }, [scheduledGymDay.label, scheduledGymDayKey, todayStr, user])

    const exerciseGroups = useMemo(() => {
        const groups = new Map<number, SetData[]>()
        ;[...sets]
            .sort((a, b) => a.exercise_order - b.exercise_order || a.set_number - b.set_number)
            .forEach((set) => {
                const current = groups.get(set.exercise_order) || []
                current.push(set)
                groups.set(set.exercise_order, current)
            })

        return Array.from(groups.entries()).map(([exerciseOrder, exerciseSets]) => ({
            exerciseOrder,
            exerciseName: exerciseSets[0]?.exercise_name || '',
            sets: exerciseSets,
        }))
    }, [sets])

    const updateSet = (localId: string, patch: Partial<SetData>) => {
        setSets((previous) => previous.map((set) => (
            set.local_id === localId ? { ...set, ...patch } : set
        )))
    }

    const renameExercise = (exerciseOrder: number, exerciseName: string) => {
        setSets((previous) => previous.map((set) => (
            set.exercise_order === exerciseOrder ? { ...set, exercise_name: exerciseName } : set
        )))
    }

    const applyTemplate = (dayKey: GymDayKey) => {
        setSelectedGymDayKey(dayKey)
        setSessionLabel(getWorkoutDayLabel(dayKey))
        setSets(buildSets(dayKey))
        setMessage(dayKey === 'custom' ? 'Custom session started.' : 'Template loaded. Edit it freely.')
        setErrorMessage('')
    }

    const addExercise = () => {
        const exerciseName = newExerciseName.trim()
        if (!exerciseName) {
            setErrorMessage('Enter an exercise name first.')
            return
        }

        const totalSets = Math.max(1, Math.round(newExerciseSets || 1))
        const repsTarget = newExerciseTarget.trim() || '10-12'
        const nextOrder = sets.length ? Math.max(...sets.map((set) => set.exercise_order)) + 1 : 0

        const nextSets = Array.from({ length: totalSets }, (_, index) => ({
            local_id: makeId(),
            exercise_name: exerciseName,
            exercise_order: nextOrder,
            set_number: index + 1,
            reps_target: repsTarget,
            duration_sec: getDurationFromTarget(repsTarget),
            completed: false,
        }))

        setSets((previous) => [...previous, ...nextSets])
        setNewExerciseName('')
        setNewExerciseSets(3)
        setNewExerciseTarget('10-12')
        setMessage(`${exerciseName} added.`)
        setErrorMessage('')
    }

    const addSetToExercise = (exerciseOrder: number) => {
        const exerciseSets = sets.filter((set) => set.exercise_order === exerciseOrder)
        const lastSet = [...exerciseSets].sort((a, b) => a.set_number - b.set_number).at(-1)
        if (!lastSet) return

        setSets((previous) => [...previous, { ...lastSet, local_id: makeId(), set_number: lastSet.set_number + 1, completed: false }])
    }

    const removeLastSetFromExercise = (exerciseOrder: number) => {
        const exerciseSets = sets.filter((set) => set.exercise_order === exerciseOrder)
        const lastSet = [...exerciseSets].sort((a, b) => a.set_number - b.set_number).at(-1)
        if (!lastSet) return

        const remaining = exerciseSets.length === 1
            ? normalizeOrders(sets.filter((set) => set.exercise_order !== exerciseOrder))
            : sets.filter((set) => set.local_id !== lastSet.local_id)

        setSets(remaining)
    }

    const removeExercise = (exerciseOrder: number) => {
        setSets((previous) => normalizeOrders(previous.filter((set) => set.exercise_order !== exerciseOrder)))
    }

    async function saveWorkout() {
        if (!user) return

        const cleanedLabel = sessionLabel.trim() || getWorkoutDayLabel(selectedGymDayKey)
        const cleanedSets = sets.map((set) => ({
            ...set,
            exercise_name: set.exercise_name.trim(),
            reps_target: set.reps_target.trim(),
        }))

        if (!cleanedSets.length) {
            setErrorMessage('Add at least one exercise before saving.')
            return
        }

        if (cleanedSets.some((set) => !set.exercise_name || !set.reps_target)) {
            setErrorMessage('Each exercise needs a name and target reps.')
            return
        }

        setSaving(true)
        setErrorMessage('')

        try {
            const prResults = await checkForNewPRs(user.id, cleanedSets)
            if (prResults.length) {
                setNewPRs(prResults)
                setShowPRToast(true)
                setTimeout(() => setShowPRToast(false), 5000)
            }

            let sessionId = session?.id
            if (!sessionId) {
                const { data: newSession, error } = await supabase
                    .from('workout_sessions')
                    .upsert({
                        user_id: user.id,
                        date: todayStr,
                        gym_day_key: selectedGymDayKey,
                        session_label: cleanedLabel,
                        completed: cleanedSets.every((set) => set.completed),
                        notes: sessionNotes || null,
                    }, { onConflict: 'user_id,date' })
                    .select()
                    .single()

                if (error) throw error
                sessionId = newSession.id
                setSession(newSession)
            } else {
                const { error } = await supabase
                    .from('workout_sessions')
                    .update({
                        gym_day_key: selectedGymDayKey,
                        session_label: cleanedLabel,
                        completed: cleanedSets.every((set) => set.completed),
                        notes: sessionNotes || null,
                    })
                    .eq('id', sessionId)

                if (error) throw error
            }

            const { error: deleteError } = await supabase
                .from('exercise_sets')
                .delete()
                .eq('session_id', sessionId)

            if (deleteError) throw deleteError

            const { error: insertError } = await supabase
                .from('exercise_sets')
                .insert(cleanedSets.map((set) => ({
                    session_id: sessionId,
                    exercise_name: set.exercise_name,
                    exercise_order: set.exercise_order,
                    set_number: set.set_number,
                    reps_target: set.reps_target,
                    reps_done: set.reps_done,
                    weight_used: set.weight_used,
                    duration_sec: set.duration_sec,
                    rpe: set.rpe,
                    completed: set.completed,
                })))

            if (insertError) throw insertError

            setSessionLabel(cleanedLabel)
            setSets(cleanedSets)
            setMessage('Workout saved.')
        } catch (error) {
            console.error('Error saving workout:', error)
            setErrorMessage('Could not save the workout. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (authLoading || !user || loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="text-muted">Loading workout...</div></div>
    }

    const completedSets = sets.filter((set) => set.completed).length
    const totalSets = sets.length
    const progress = totalSets ? (completedSets / totalSets) * 100 : 0

    return (
        <PageContainer>
            <header className="mb-6">
                <p className="text-sm text-primary font-medium uppercase tracking-wide">Today&apos;s Workout</p>
                <h1 className="text-2xl font-bold text-foreground mt-1">{sessionLabel || getWorkoutDayLabel(selectedGymDayKey)}</h1>
                <p className="text-sm text-muted mt-2">Suggested today: {scheduledGymDay.label}</p>
            </header>

            <Card className="mb-4 bg-primary/5 border-primary/15">
                <CardHeader title="Session Builder" subtitle="Load a base template or track the exact trainer-led session." />
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {workoutDayOptions.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => applyTemplate(option.key as GymDayKey)}
                            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedGymDayKey === option.key ? 'bg-primary text-background' : 'bg-surface-elevated text-muted hover:bg-surface'}`}
                            title={option.description}
                        >
                            {option.shortLabel}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <Input label="Session Label" value={sessionLabel} onChange={(event) => setSessionLabel(event.target.value)} placeholder="Custom Trainer Session" />
                </div>
            </Card>

            <Card className="mb-4">
                <CardHeader title="Add Exercise" subtitle="Useful when your trainer changes movements or volume." />
                <div className="space-y-3">
                    <Input value={newExerciseName} onChange={(event) => setNewExerciseName(event.target.value)} placeholder="Exercise name" />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Sets</label>
                            <NumberInput value={newExerciseSets} onChange={setNewExerciseSets} min={1} max={10} />
                        </div>
                        <div>
                            <label className="text-xs text-muted uppercase tracking-wide block mb-2">Target Reps</label>
                            <input value={newExerciseTarget} onChange={(event) => setNewExerciseTarget(event.target.value)} placeholder="8-10 or 40s" className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                    </div>
                    <Button onClick={addExercise} fullWidth>Add Exercise</Button>
                </div>
            </Card>

            {(message || errorMessage) && (
                <Card className={`mb-4 ${errorMessage ? 'border-danger/40 bg-danger/5' : 'border-success/30 bg-success/5'}`}>
                    <p className={`text-sm ${errorMessage ? 'text-danger' : 'text-success'}`}>{errorMessage || message}</p>
                </Card>
            )}

            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Progress</span>
                    <span className="text-foreground font-medium">{completedSets}/{totalSets} sets</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {exerciseGroups.length === 0 ? (
                <Card className="text-center py-8">
                    <h2 className="text-lg font-semibold text-foreground mb-2">No exercises added yet</h2>
                    <p className="text-sm text-muted">Choose a template or add the exercises your trainer gave you today.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {exerciseGroups.map((group) => (
                        <Card key={group.exerciseOrder}>
                            <Input value={group.exerciseName} onChange={(event) => renameExercise(group.exerciseOrder, event.target.value)} placeholder="Exercise name" />
                            <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                <Button size="sm" variant="secondary" onClick={() => addSetToExercise(group.exerciseOrder)}>+ Set</Button>
                                <Button size="sm" variant="secondary" onClick={() => removeLastSetFromExercise(group.exerciseOrder)}>- Last Set</Button>
                                <Button size="sm" variant="danger" onClick={() => removeExercise(group.exerciseOrder)}>Remove Exercise</Button>
                            </div>

                            <div className="grid grid-cols-[72px_1fr_80px_80px_56px] gap-2 text-xs text-muted mb-2 px-1">
                                <span>Set</span>
                                <span className="text-center">Target</span>
                                <span className="text-center">Done</span>
                                <span className="text-center">Kg</span>
                                <span className="text-center">RPE</span>
                            </div>

                            <div className="space-y-2">
                                {group.sets.map((set) => (
                                    <div key={set.local_id} className={`grid grid-cols-[72px_1fr_80px_80px_56px] gap-2 items-center p-2 rounded-lg transition-colors ${set.completed ? 'bg-success/10' : 'bg-surface-elevated'}`}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateSet(set.local_id, { completed: !set.completed })}
                                                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${set.completed ? 'bg-success border-success' : 'border-border hover:border-muted'}`}
                                            >
                                                {set.completed && (
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className="text-xs text-muted font-medium">S{set.set_number}</span>
                                        </div>

                                        <input
                                            value={set.reps_target}
                                            onChange={(event) => updateSet(set.local_id, { reps_target: event.target.value, duration_sec: getDurationFromTarget(event.target.value) })}
                                            placeholder="8-10"
                                            className="w-full px-2 py-1.5 text-center bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />

                                        <div className="flex justify-center">
                                            <NumberInput value={set.reps_done} onChange={(value) => updateSet(set.local_id, { reps_done: value })} placeholder="-" />
                                        </div>
                                        <div className="flex justify-center">
                                            <NumberInput value={set.weight_used} onChange={(value) => updateSet(set.local_id, { weight_used: value })} placeholder="-" step={0.5} />
                                        </div>
                                        <div className="flex justify-center">
                                            <NumberInput value={set.rpe} onChange={(value) => updateSet(set.local_id, { rpe: value })} placeholder="-" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="mt-4 mb-4">
                <CardHeader title="Session Notes" subtitle="Write pain, swaps, energy, or trainer feedback." />
                <textarea
                    className="w-full mt-2 bg-surface-elevated border border-border rounded-lg p-3 text-sm text-foreground placeholder-muted resize-none focus:outline-none focus:border-primary/50 transition-colors"
                    rows={3}
                    placeholder="Example: replaced overhead press because shoulders felt tight."
                    value={sessionNotes}
                    onChange={(event) => setSessionNotes(event.target.value)}
                />
            </Card>

            {selectedTemplateDay?.finisher ? (
                <Card className="mt-4 mb-24">
                    <CardHeader title="Template Finisher" subtitle="Optional if energy is still good." />
                    <p className="text-foreground">{selectedTemplateDay.finisher.name} - {selectedTemplateDay.finisher.duration_min} min</p>
                </Card>
            ) : (
                <Card className="mt-4 mb-24">
                    <CardHeader title="Custom Session Tip" />
                    <p className="text-sm text-muted">Keep custom sessions simple: 4-6 exercises, 2-4 sets each, and note why the trainer changed the plan.</p>
                </Card>
            )}

            <div className="fixed bottom-20 left-0 right-0 px-4 safe-bottom">
                <div className="max-w-lg mx-auto">
                    <Button fullWidth onClick={saveWorkout} loading={saving} className="shadow-lg">
                        {saving ? 'Saving...' : 'Save Workout'}
                    </Button>
                </div>
            </div>

            {showPRToast && newPRs.length > 0 && (
                <div className="fixed top-4 left-4 right-4 z-50 animate-bounce">
                    <div className="max-w-lg mx-auto bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-yellow-400/30">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">PR</span>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">NEW PERSONAL RECORD</h4>
                                {newPRs.map((pr) => (
                                    <p key={pr.exercise_name} className="text-white/90 text-xs mt-0.5">
                                        {pr.exercise_name}: {pr.currentBest}kg 1RM
                                        {pr.previousBest > 0 && <span className="text-yellow-200"> (+{pr.improvement}%)</span>}
                                    </p>
                                ))}
                            </div>
                            <button type="button" onClick={() => setShowPRToast(false)} className="text-white/70 hover:text-white text-lg">x</button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}
