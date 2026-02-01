// IndexedDB wrapper for offline storage
const DB_NAME = 'fitness-tracker'
const DB_VERSION = 1

interface OfflineData {
    habits: Array<{
        id: string
        user_id: string
        date: string
        habit_key: string
        completed: boolean
        synced: boolean
    }>
    workout_sessions: Array<{
        id: string
        user_id: string
        date: string
        gym_day_key: string
        completed: boolean
        synced: boolean
    }>
    exercise_sets: Array<{
        id: string
        session_id: string
        exercise_name: string
        set_number: number
        reps_target?: string
        reps_done?: number
        weight_used?: number
        completed: boolean
        synced: boolean
    }>
}

let db: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
    if (db) return db

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
            db = request.result
            resolve(db)
        }

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result

            // Habits store
            if (!database.objectStoreNames.contains('habits')) {
                const habitsStore = database.createObjectStore('habits', { keyPath: 'id' })
                habitsStore.createIndex('by_date', 'date')
                habitsStore.createIndex('by_synced', 'synced')
            }

            // Workout sessions store
            if (!database.objectStoreNames.contains('workout_sessions')) {
                const sessionsStore = database.createObjectStore('workout_sessions', { keyPath: 'id' })
                sessionsStore.createIndex('by_date', 'date')
                sessionsStore.createIndex('by_synced', 'synced')
            }

            // Exercise sets store
            if (!database.objectStoreNames.contains('exercise_sets')) {
                const setsStore = database.createObjectStore('exercise_sets', { keyPath: 'id' })
                setsStore.createIndex('by_session', 'session_id')
                setsStore.createIndex('by_synced', 'synced')
            }
        }
    })
}

// Generic put operation
export async function putItem<T extends { id: string }>(
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets',
    item: T
): Promise<void> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put({ ...item, synced: false })

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
    })
}

// Get all items from a store
export async function getAllItems<T>(
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets'
): Promise<T[]> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

// Get items by date
export async function getItemsByDate<T>(
    storeName: 'habits' | 'workout_sessions',
    date: string
): Promise<T[]> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const index = store.index('by_date')
        const request = index.getAll(date)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

// Get unsynced items
export async function getUnsyncedItems<T>(
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets'
): Promise<T[]> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const index = store.index('by_synced')
        const request = index.getAll(IDBKeyRange.only(0)) // Use 0 for false in IndexedDB

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

// Mark items as synced
export async function markAsSynced(
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets',
    ids: string[]
): Promise<void> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)

        ids.forEach(id => {
            const getRequest = store.get(id)
            getRequest.onsuccess = () => {
                const item = getRequest.result
                if (item) {
                    item.synced = true
                    store.put(item)
                }
            }
        })

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

// Clear all data (for logout)
export async function clearAllData(): Promise<void> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(
            ['habits', 'workout_sessions', 'exercise_sets'],
            'readwrite'
        )

        transaction.objectStore('habits').clear()
        transaction.objectStore('workout_sessions').clear()
        transaction.objectStore('exercise_sets').clear()

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}
