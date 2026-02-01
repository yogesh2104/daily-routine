'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { href: '/', label: 'Today', icon: '📅' },
    { href: '/workout', label: 'Workout', icon: '🏋️' },
    { href: '/weekly', label: 'Week', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom z-50">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-muted hover:text-foreground'
                                }`}
                        >
                            <span className="text-xl mb-0.5">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
