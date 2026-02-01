'use client'

import { useState } from 'react'

interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    sublabel?: string
    icon?: string
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function Checkbox({
    checked,
    onChange,
    label,
    sublabel,
    icon,
    disabled = false,
    size = 'md'
}: CheckboxProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-7 h-7'
    }

    return (
        <label
            className={`flex items-center gap-3 p-3 bg-surface border border-border rounded-lg cursor-pointer transition-all hover:bg-surface-elevated active:scale-[0.98] ${checked ? 'border-primary/50 bg-primary-muted' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="relative flex-shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={`${sizeClasses[size]} rounded-md border-2 flex items-center justify-center transition-all ${checked
                            ? 'bg-primary border-primary'
                            : 'border-border bg-transparent'
                        }`}
                >
                    {checked && (
                        <svg
                            className="w-4 h-4 text-background"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {(icon || label) && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
                    <div className="flex-1 min-w-0">
                        {label && (
                            <span className={`block text-sm font-medium ${checked ? 'line-through text-muted' : 'text-foreground'}`}>
                                {label}
                            </span>
                        )}
                        {sublabel && (
                            <span className="block text-xs text-muted truncate">{sublabel}</span>
                        )}
                    </div>
                </div>
            )}
        </label>
    )
}

// Simple toggle for inline use
export function Toggle({
    checked,
    onChange
}: {
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'
                }`}
        >
            <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    )
}
