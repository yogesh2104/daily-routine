'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PageContainer } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import { weeklyRoutine } from '@/config/daily-routine'

export default function SettingsPage() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted">Loading...</div>
            </div>
        )
    }

    return (
        <PageContainer title="Settings">
            {/* Profile */}
            <Card className="mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                        👤
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                            {user.email}
                        </div>
                        <div className="text-xs text-muted">
                            Member since {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Schedule Info */}
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3 mt-6">
                Your Schedule
            </h3>

            <Card className="mb-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Target Sleep</span>
                        <span className="text-sm font-medium text-foreground">
                            {weeklyRoutine.sleep.target_hours}h ({weeklyRoutine.sleep.bed_time} - {weeklyRoutine.sleep.wake_time})
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Daily Water</span>
                        <span className="text-sm font-medium text-foreground">
                            {weeklyRoutine.daily_constants.hydration_liters}L
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Workouts/Week</span>
                        <span className="text-sm font-medium text-foreground">5 days</span>
                    </div>
                </div>
            </Card>

            {/* App Info */}
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3 mt-6">
                App
            </h3>

            <Card className="mb-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Version</span>
                        <span className="text-sm text-foreground">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Theme</span>
                        <span className="text-sm text-foreground">System</span>
                    </div>
                </div>
            </Card>

            {/* Logout */}
            <div className="mt-8">
                <Button
                    variant="danger"
                    fullWidth
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted mt-8">
                Built for focused fitness tracking 💪
            </p>
        </PageContainer>
    )
}
