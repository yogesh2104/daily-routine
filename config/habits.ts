// Habit definitions for the app
export interface HabitDefinition {
    key: string
    label: string
    icon: string
    category: 'morning' | 'daily' | 'evening'
}

export const habitDefinitions: HabitDefinition[] = [
    // Morning habits
    { key: 'morning_routine', label: 'Morning Routine', icon: '🌅', category: 'morning' },
    { key: 'skincare_am', label: 'AM Skincare', icon: '✨', category: 'morning' },

    // Daily habits
    { key: 'water', label: 'Water (3L)', icon: '💧', category: 'daily' },
    { key: 'steps', label: 'Steps / Walking', icon: '👟', category: 'daily' },

    // Evening habits
    { key: 'skincare_pm', label: 'PM Skincare', icon: '🌙', category: 'evening' },
    { key: 'sleep_bed', label: 'Bed by 10:30', icon: '😴', category: 'evening' },
]

export function getHabitsByCategory(category: HabitDefinition['category']) {
    return habitDefinitions.filter(h => h.category === category)
}
