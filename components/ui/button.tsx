import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: ReactNode
    fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        loading = false,
        icon,
        fullWidth = false,
        className = '',
        children,
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

        const variantClasses = {
            primary: 'bg-primary text-background hover:bg-primary-hover',
            secondary: 'bg-surface border border-border text-foreground hover:bg-surface-elevated',
            ghost: 'text-foreground hover:bg-surface',
            danger: 'bg-danger text-white hover:bg-danger/90'
        }

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base'
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
                {...props}
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : icon ? (
                    icon
                ) : null}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
