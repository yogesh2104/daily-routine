import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
    const Component = onClick ? 'button' : 'div'

    return (
        <Component
            className={`bg-surface border border-border rounded-xl p-4 text-left w-full ${onClick ? 'cursor-pointer hover:bg-surface-elevated active:scale-[0.99] transition-all' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </Component>
    )
}

interface CardHeaderProps {
    title: string
    subtitle?: string
    icon?: string
    action?: ReactNode
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
                {icon && <span className="text-xl">{icon}</span>}
                <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    )
}

interface CardSectionProps {
    title?: string
    children: ReactNode
    className?: string
}

export function CardSection({ title, children, className = '' }: CardSectionProps) {
    return (
        <div className={className}>
            {title && (
                <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    {title}
                </h4>
            )}
            {children}
        </div>
    )
}
