'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, CardHeader, Button, NumberInput, LineChart, BarChart } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'
import { getPersonalRecords, type PersonalRecord } from '@/lib/personal-records'
import type { BodyStat } from '@/types/database'

type TimeRange = '30' | '60' | '90'

export default function ProgressPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<BodyStat[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [timeRange, setTimeRange] = useState<TimeRange>('30')
    const [allPRs, setAllPRs] = useState<PersonalRecord[]>([])

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
                .limit(90)

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

            // Load PRs
            const prs = await getPersonalRecords(userId)
            setAllPRs(prs)

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
                .limit(90)
            if (data) setStats(data)
        }

        setSaving(false)
    }

    // Chart data
    const chartData = useMemo(() => {
        const days = parseInt(timeRange)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        const cutoffStr = cutoff.toISOString().split('T')[0]

        const filtered = stats
            .filter(s => s.date >= cutoffStr)
            .sort((a, b) => a.date.localeCompare(b.date))

        const formatDate = (d: string) => {
            const date = new Date(d)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }

        const weightData = filtered
            .filter(s => s.weight)
            .map(s => ({ label: formatDate(s.date), value: s.weight! }))

        const waistData = filtered
            .filter(s => s.waist)
            .map(s => ({ label: formatDate(s.date), value: s.waist! }))

        // Calculate changes for summary
        const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1].value : null
        const firstWeight = weightData.length > 1 ? weightData[0].value : null
        const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : null

        const latestWaist = waistData.length > 0 ? waistData[waistData.length - 1].value : null
        const firstWaist = waistData.length > 1 ? waistData[0].value : null
        const waistChange = latestWaist && firstWaist ? latestWaist - firstWaist : null

        return { weightData, waistData, weightChange, waistChange, latestWeight, latestWaist }
    }, [stats, timeRange])

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
                    Save Today&apos;s Progress
                </Button>
            </Card>

            {/* Time Range Selector */}
            <div className="flex gap-2 mb-4">
                {(['30', '60', '90'] as TimeRange[]).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                ? 'bg-primary text-background'
                                : 'bg-surface text-muted hover:bg-surface-elevated'
                            }`}
                    >
                        {range}D
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            {(chartData.latestWeight || chartData.latestWaist) && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {chartData.latestWeight && (
                        <Card className="text-center py-3">
                            <div className="text-2xl font-bold text-foreground">{chartData.latestWeight}kg</div>
                            <div className="text-xs text-muted mt-0.5">Current Weight</div>
                            {chartData.weightChange !== null && (
                                <div className={`text-xs font-bold mt-1 ${chartData.weightChange <= 0 ? 'text-success' : 'text-warning'
                                    }`}>
                                    {chartData.weightChange > 0 ? '+' : ''}{chartData.weightChange.toFixed(1)}kg
                                </div>
                            )}
                        </Card>
                    )}
                    {chartData.latestWaist && (
                        <Card className="text-center py-3">
                            <div className="text-2xl font-bold text-foreground">{chartData.latestWaist}cm</div>
                            <div className="text-xs text-muted mt-0.5">Current Waist</div>
                            {chartData.waistChange !== null && (
                                <div className={`text-xs font-bold mt-1 ${chartData.waistChange <= 0 ? 'text-success' : 'text-warning'
                                    }`}>
                                    {chartData.waistChange > 0 ? '+' : ''}{chartData.waistChange.toFixed(1)}cm
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            )}

            {/* Weight Chart */}
            <Card className="mb-4">
                <CardHeader icon="⚖️" title="Weight Trend" subtitle={`Last ${timeRange} days`} />
                <div className="mt-3">
                    <LineChart
                        data={chartData.weightData}
                        color="var(--primary)"
                        gradientId="weightGradient"
                        unit="kg"
                        formatValue={(v) => v.toFixed(1)}
                    />
                </div>
            </Card>

            {/* Waist Chart */}
            <Card className="mb-4">
                <CardHeader icon="📐" title="Waist Trend" subtitle={`Last ${timeRange} days`} />
                <div className="mt-3">
                    <LineChart
                        data={chartData.waistData}
                        color="var(--success)"
                        gradientId="waistGradient"
                        unit="cm"
                        formatValue={(v) => v.toFixed(1)}
                    />
                </div>
            </Card>

            {/* PR Wall */}
            {allPRs.length > 0 && (
                <Card className="mb-4">
                    <CardHeader icon="🏆" title="Personal Records" subtitle={`${allPRs.length} exercises tracked`} />
                    <div className="space-y-2 mt-3">
                        {allPRs.map((pr) => (
                            <div
                                key={pr.exercise_name}
                                className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground truncate">
                                        {pr.exercise_name}
                                    </div>
                                    <div className="text-[10px] text-muted">
                                        {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-primary">
                                            {pr.weight}kg × {pr.reps}
                                        </div>
                                        <div className="text-[10px] text-muted">
                                            ~{pr.estimated_1rm}kg 1RM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* History List */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted px-1">Recent History</h3>
                {stats.length === 0 ? (
                    <p className="text-center text-muted py-8 text-sm">No stats recorded yet.</p>
                ) : (
                    stats.slice(0, 15).map(stat => (
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

            {/* Bottom spacing */}
            <div className="h-4" />
        </PageContainer>
    )
}
