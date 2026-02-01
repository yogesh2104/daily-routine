// Habit definitions for the app
export interface HabitDefinition {
    key: string
    label: string
    icon: string
    category: 'morning' | 'nutrition' | 'fitness' | 'skincare' | 'recovery'
}

export const habitDefinitions: HabitDefinition[] = [
    // Morning habits
    { key: 'morning_routine', label: 'Morning Routine', icon: '🌅', category: 'morning' },

    // Nutrition habits
    { key: 'protein', label: 'Protein Target (150g+)', icon: '🍗', category: 'nutrition' },
    { key: 'water', label: 'Hydration (3L)', icon: '💧', category: 'nutrition' },

    // Fitness habits
    { key: 'steps', label: 'Steps (8k-10k)', icon: '🚶', category: 'fitness' },

    // Skincare habits
    { key: 'skincare_am', label: 'Skincare (AM)', icon: '☀️', category: 'skincare' },
    { key: 'skincare_pm', label: 'Skincare (PM)', icon: '🌙', category: 'skincare' },

    // Recovery habits
    { key: 'sleep', label: 'Quality Sleep (6.5h+)', icon: '😴', category: 'recovery' },
]

export function getHabitsByCategory(category: HabitDefinition['category']) {
    return habitDefinitions.filter(h => h.category === category)
}
