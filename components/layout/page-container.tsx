import { ReactNode } from 'react'

interface PageContainerProps {
    children: ReactNode
    title?: string
    subtitle?: string
    className?: string
}

export function PageContainer({
    children,
    title,
    subtitle,
    className = ''
}: PageContainerProps) {
    return (
        <div className={`min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto ${className}`}>
            {title && (
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted mt-1">{subtitle}</p>
                    )}
                </header>
            )}
            {children}
        </div>
    )
}
