'use client'

import { useMemo } from 'react'

interface DataPoint {
    label: string
    value: number
}

interface LineChartProps {
    data: DataPoint[]
    height?: number
    color?: string
    gradientId?: string
    unit?: string
    showDots?: boolean
    formatValue?: (value: number) => string
}

export function LineChart({
    data,
    height = 160,
    color = 'var(--primary)',
    gradientId = 'chartGradient',
    unit = '',
    showDots = true,
    formatValue = (v) => String(v),
}: LineChartProps) {
    const chartData = useMemo(() => {
        if (data.length === 0) return null

        const values = data.map(d => d.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const range = max - min || 1

        const padding = { top: 20, right: 16, bottom: 32, left: 8 }
        const width = 340

        const chartWidth = width - padding.left - padding.right
        const chartHeight = height - padding.top - padding.bottom

        const points = data.map((d, i) => ({
            x: padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
            y: padding.top + chartHeight - ((d.value - min) / range) * chartHeight,
            ...d,
        }))

        // Create smooth path
        const pathD = points
            .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
            .join(' ')

        // Area fill path (goes to bottom)
        const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

        return { points, pathD, areaD, min, max, width, padding, chartHeight }
    }, [data, height])

    if (!chartData || data.length < 2) {
        return (
            <div className="flex items-center justify-center text-muted text-sm" style={{ height }}>
                Need at least 2 data points
            </div>
        )
    }

    const { points, pathD, areaD, min, max, width, padding, chartHeight } = chartData

    return (
        <div className="w-full overflow-hidden">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                    const y = padding.top + chartHeight - pct * chartHeight
                    return (
                        <line
                            key={pct}
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y}
                            y2={y}
                            stroke="var(--border)"
                            strokeWidth={0.5}
                            strokeDasharray="4 4"
                        />
                    )
                })}

                {/* Area fill */}
                <path d={areaD} fill={`url(#${gradientId})`} />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Dots */}
                {showDots && points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r={3} fill={color} />
                        <circle cx={p.x} cy={p.y} r={5} fill={color} opacity={0.2} />
                    </g>
                ))}

                {/* Labels on x-axis */}
                {points.filter((_, i) => {
                    // Show first, last, and evenly spaced labels
                    if (points.length <= 7) return true
                    return i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0
                }).map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={height - 4}
                        textAnchor="middle"
                        className="text-[9px]"
                        fill="var(--muted)"
                    >
                        {p.label}
                    </text>
                ))}

                {/* Min/Max labels */}
                <text
                    x={width - padding.right + 2}
                    y={padding.top + 4}
                    className="text-[9px]"
                    fill="var(--muted)"
                    textAnchor="start"
                >
                    {formatValue(max)}{unit}
                </text>
                <text
                    x={width - padding.right + 2}
                    y={padding.top + chartHeight}
                    className="text-[9px]"
                    fill="var(--muted)"
                    textAnchor="start"
                >
                    {formatValue(min)}{unit}
                </text>
            </svg>
        </div>
    )
}

// Bar chart for weekly volume
interface BarData {
    label: string
    value: number
}

interface BarChartProps {
    data: BarData[]
    height?: number
    color?: string
    unit?: string
    formatValue?: (value: number) => string
}

export function BarChart({
    data,
    height = 140,
    color = 'var(--primary)',
    unit = '',
    formatValue = (v) => String(Math.round(v)),
}: BarChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center text-muted text-sm" style={{ height }}>
                No data yet
            </div>
        )
    }

    const max = Math.max(...data.map(d => d.value), 1)

    return (
        <div className="w-full" style={{ height }}>
            <div className="flex items-end justify-between gap-1 h-full pb-6 relative">
                {data.map((d, i) => {
                    const barHeight = (d.value / max) * (height - 40)
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            {d.value > 0 && (
                                <span className="text-[8px] text-muted font-medium">
                                    {formatValue(d.value)}{unit}
                                </span>
                            )}
                            <div
                                className="w-full rounded-t-md transition-all duration-300"
                                style={{
                                    height: `${Math.max(barHeight, 2)}px`,
                                    background: d.value > 0 ? color : 'var(--surface-elevated)',
                                    opacity: d.value > 0 ? 1 : 0.3,
                                }}
                            />
                            <span className="text-[9px] text-muted absolute bottom-0">
                                {d.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
