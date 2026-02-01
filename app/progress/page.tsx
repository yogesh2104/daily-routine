'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Button, NumberInput } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'
import type { BodyStat } from '@/types/database'

export default function ProgressPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<BodyStat[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form state
    const [weight, setWeight] = useState<number | undefined>()
    const [bodyFat, setBodyFat] = useState<number | undefined>()
    const [waist, setWaist] = useState<number | undefined>()

    const todayStr = new Date().toISOString().split('T')[0]

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return

        const userId = user.id

        async function loadStats() {
            const { data, error } = await supabase
                .from('body_stats')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(30)

            if (!error && data) {
                setStats(data)

                // Set initial form values if today's entry exists
                const todayEntry = data.find(s => s.date === todayStr)
                if (todayEntry) {
                    setWeight(todayEntry.weight ?? undefined)
                    setBodyFat(todayEntry.body_fat ?? undefined)
                    setWaist(todayEntry.waist ?? undefined)
                }
            }
            setLoading(false)
        }

        loadStats()
    }, [user, todayStr])

    const saveStats = async () => {
        if (!user) return
        setSaving(true)

        const { error } = await supabase
            .from('body_stats')
            .upsert({
                user_id: user.id,
                date: todayStr,
                weight: weight || null,
                body_fat: bodyFat || null,
                waist: waist || null
            }, { onConflict: 'user_id,date' })

        if (!error) {
            // Reload list
            const { data } = await supabase
                .from('body_stats')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(30)
            if (data) setStats(data)
        }

        setSaving(false)
    }

    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted">Loading progress...</div>
            </div>
        )
    }

    return (
        <PageContainer title="Body Progress" subtitle="Track your transformation">
            {/* Input Form */}
            <Card className="mb-6">
                <CardHeader title="Today's Stats" icon="📏" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="space-y-1">
                        <label className="text-xs text-muted block text-center">Weight (kg)</label>
                        <NumberInput
                            value={weight}
                            onChange={setWeight}
                            placeholder="70.0"
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-muted block text-center">Body Fat %</label>
                        <NumberInput
                            value={bodyFat}
                            onChange={setBodyFat}
                            placeholder="15.0"
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-muted block text-center">Waist (cm)</label>
                        <NumberInput
                            value={waist}
                            onChange={setWaist}
                            placeholder="80.0"
                            step={0.5}
                        />
                    </div>
                </div>
                <Button
                    fullWidth
                    className="mt-4"
                    onClick={saveStats}
                    loading={saving}
                >
                    Save Today's Progress
                </Button>
            </Card>

            {/* History List */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted px-1">Recent History</h3>
                {stats.length === 0 ? (
                    <p className="text-center text-muted py-8 text-sm">No stats recorded yet.</p>
                ) : (
                    stats.map(stat => (
                        <Card key={stat.id} className="py-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground">
                                    {new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <div className="flex gap-4 text-sm">
                                    {stat.weight && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-muted text-[10px] uppercase">Weight</span>
                                            <span>{stat.weight}kg</span>
                                        </div>
                                    )}
                                    {stat.body_fat && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-muted text-[10px] uppercase">Fat</span>
                                            <span>{stat.body_fat}%</span>
                                        </div>
                                    )}
                                    {stat.waist && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-muted text-[10px] uppercase">Waist</span>
                                            <span>{stat.waist}cm</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </PageContainer>
    )
}
