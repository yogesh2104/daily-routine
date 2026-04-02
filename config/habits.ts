// Habit definitions for the app
export interface HabitDefinition {
    key: string
    label: string
    icon: string
    category: 'morning' | 'nutrition' | 'fitness' | 'skincare' | 'recovery'
}

export const habitDefinitions: HabitDefinition[] = [
    { key: 'morning_routine', label: 'Morning Routine', icon: '🌅', category: 'morning' },
    { key: 'protein', label: 'Protein Goal (90g+)', icon: '🥣', category: 'nutrition' },
    { key: 'water', label: 'Hydration (3.5L)', icon: '💧', category: 'nutrition' },
    { key: 'steps', label: 'Steps (8k+)', icon: '🚶', category: 'fitness' },
    { key: 'skincare_am', label: 'Skincare (AM)', icon: '☀️', category: 'skincare' },
    { key: 'skincare_pm', label: 'Skincare (PM)', icon: '🌙', category: 'skincare' },
    { key: 'sleep', label: 'Quality Sleep (7h+)', icon: '😴', category: 'recovery' },
]

export function getHabitsByCategory(category: HabitDefinition['category']) {
    return habitDefinitions.filter((habit) => habit.category === category)
}
