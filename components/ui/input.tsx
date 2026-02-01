import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={`w-full px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${icon ? 'pl-10' : ''
                            } ${error ? 'border-danger' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-danger mt-1">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

// Number input specifically for weight/reps
interface NumberInputProps {
    value: number | undefined
    onChange: (value: number | undefined) => void
    placeholder?: string
    min?: number
    max?: number
    step?: number
    unit?: string
    className?: string
}

export function NumberInput({
    value,
    onChange,
    placeholder = '0',
    min = 0,
    max,
    step = 1,
    unit,
    className = ''
}: NumberInputProps) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <input
                type="number"
                inputMode="decimal"
                value={value ?? ''}
                onChange={(e) => {
                    const val = e.target.value
                    onChange(val === '' ? undefined : parseFloat(val))
                }}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                className="w-16 px-2 py-1.5 text-center bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {unit && <span className="text-xs text-muted">{unit}</span>}
        </div>
    )
}
