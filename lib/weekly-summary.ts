interface WeeklyWorkoutSessionSummaryRow {
    completed?: boolean | null
}

interface WeeklyHabitSummaryRow {
    date: string
    habit_key: string
    value?: string | null
}

interface WeeklyBodyStatSummaryRow {
    date: string
    weight?: number | null
}

export interface WeeklySummaryMetrics {
    averageProteinGrams: number | null
    proteinTrackedDays: number
    averageSleepHours: number | null
    sleepTrackedDays: number
    completedWorkouts: number
    startWeightKg: number | null
    latestWeightKg: number | null
    weightTrendKg: number | null
}

export interface ProteinGapHint {
    trackedGrams: number
    targetGrams: number
    remainingGrams: number
    title: string
    message: string
}

const MINUTES_PER_DAY = 24 * 60

function roundToOneDecimal(value: number) {
    return Math.round(value * 10) / 10
}

function average(values: number[]) {
    if (!values.length) return null
    return values.reduce((sum, value) => sum + value, 0) / values.length
}

function parseLoggedNumber(value?: string | null) {
    if (!value) return null

    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function parseTimeToMinutes(value?: string | null) {
    if (!value) return null

    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return null

    const hours = Number.parseInt(match[1], 10)
    const minutes = Number.parseInt(match[2], 10)

    if (hours > 23 || minutes > 59) return null
    return (hours * 60) + minutes
}

export function calculateSleepHours(bedTime?: string | null, wakeTime?: string | null) {
    const bedMinutes = parseTimeToMinutes(bedTime)
    const wakeMinutes = parseTimeToMinutes(wakeTime)

    if (bedMinutes === null || wakeMinutes === null) return null

    const sleepMinutes = wakeMinutes >= bedMinutes
        ? wakeMinutes - bedMinutes
        : (MINUTES_PER_DAY - bedMinutes) + wakeMinutes

    return sleepMinutes / 60
}

export function formatHoursAndMinutes(hours?: number | null) {
    if (hours === null || hours === undefined) return '--'

    const totalMinutes = Math.round(hours * 60)
    const hourPart = Math.floor(totalMinutes / 60)
    const minutePart = totalMinutes % 60

    return minutePart === 0
        ? `${hourPart}h`
        : `${hourPart}h ${minutePart}m`
}

export function buildWeeklySummary(
    sessions: WeeklyWorkoutSessionSummaryRow[] = [],
    habits: WeeklyHabitSummaryRow[] = [],
    stats: WeeklyBodyStatSummaryRow[] = [],
): WeeklySummaryMetrics {
    const proteinValues = habits
        .filter((habit) => habit.habit_key === 'protein_grams')
        .map((habit) => parseLoggedNumber(habit.value))
        .filter((value): value is number => value !== null)

    const sleepByDate = new Map<string, { bedTime?: string | null; wakeTime?: string | null }>()
    habits.forEach((habit) => {
        if (habit.habit_key !== 'sleep_bed' && habit.habit_key !== 'sleep_wake') return

        const existing = sleepByDate.get(habit.date) || {}
        if (habit.habit_key === 'sleep_bed') {
            existing.bedTime = habit.value
        }
        if (habit.habit_key === 'sleep_wake') {
            existing.wakeTime = habit.value
        }
        sleepByDate.set(habit.date, existing)
    })

    const sleepValues = Array.from(sleepByDate.values())
        .map((entry) => calculateSleepHours(entry.bedTime, entry.wakeTime))
        .filter((value): value is number => value !== null)

    const completedWorkouts = sessions.filter((session) => Boolean(session.completed)).length

    const weightEntries = [...stats]
        .filter((stat): stat is Required<WeeklyBodyStatSummaryRow> => typeof stat.weight === 'number')
        .sort((left, right) => left.date.localeCompare(right.date))

    const startWeightKg = weightEntries[0]?.weight ?? null
    const latestWeightKg = weightEntries.at(-1)?.weight ?? null
    const weightTrendKg = startWeightKg !== null && latestWeightKg !== null && weightEntries.length > 1
        ? roundToOneDecimal(latestWeightKg - startWeightKg)
        : null

    return {
        averageProteinGrams: proteinValues.length ? roundToOneDecimal(average(proteinValues)!) : null,
        proteinTrackedDays: proteinValues.length,
        averageSleepHours: sleepValues.length ? roundToOneDecimal(average(sleepValues)!) : null,
        sleepTrackedDays: sleepValues.length,
        completedWorkouts,
        startWeightKg,
        latestWeightKg,
        weightTrendKg,
    }
}

export function buildProteinGapHint(currentProteinGrams: number | null, targetProteinGrams: number): ProteinGapHint {
    const trackedGrams = currentProteinGrams !== null && Number.isFinite(currentProteinGrams)
        ? Math.max(0, roundToOneDecimal(currentProteinGrams))
        : 0
    const targetGrams = Math.max(0, roundToOneDecimal(targetProteinGrams))
    const remainingGrams = Math.max(0, roundToOneDecimal(targetGrams - trackedGrams))

    if (trackedGrams === 0) {
        return {
            trackedGrams,
            targetGrams,
            remainingGrams,
            title: 'Protein still needs a plan',
            message: `Aim for ${targetGrams}g today. Start with dal, sattu, or roasted chana so dinner does not have to do all the work.`,
        }
    }

    if (remainingGrams === 0) {
        return {
            trackedGrams,
            targetGrams,
            remainingGrams,
            title: 'Protein goal is covered',
            message: `You are at ${trackedGrams}g already. Keep dinner simple and recovery-focused tonight.`,
        }
    }

    if (remainingGrams <= 15) {
        return {
            trackedGrams,
            targetGrams,
            remainingGrams,
            title: 'Small protein gap left',
            message: `You are at ${trackedGrams}g. Add sattu, dal, or roasted chana to close the last ${remainingGrams}g.`,
        }
    }

    return {
        trackedGrams,
        targetGrams,
        remainingGrams,
        title: 'Protein gap to close',
        message: `You are at ${trackedGrams}g. Use a stronger protein meal like soya chunks or extra dal, then top up with sattu or chana.`,
    }
}
