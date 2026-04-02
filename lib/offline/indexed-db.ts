// IndexedDB wrapper for offline storage
const DB_NAME = 'fitness-tracker'
const DB_VERSION = 2

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

            // Body stats store
            if (!database.objectStoreNames.contains('body_stats')) {
                const statsStore = database.createObjectStore('body_stats', { keyPath: 'id' })
                statsStore.createIndex('by_date', 'date')
                statsStore.createIndex('by_synced', 'synced')
            }
        }
    })
}

// Generic put operation
export async function putItem<T extends { id: string }>(
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets' | 'body_stats',
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
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets' | 'body_stats'
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
    storeName: 'habits' | 'workout_sessions' | 'body_stats',
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
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets' | 'body_stats'
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
    storeName: 'habits' | 'workout_sessions' | 'exercise_sets' | 'body_stats',
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
            ['habits', 'workout_sessions', 'exercise_sets', 'body_stats'],
            'readwrite'
        )

        transaction.objectStore('habits').clear()
        transaction.objectStore('workout_sessions').clear()
        transaction.objectStore('exercise_sets').clear()
        transaction.objectStore('body_stats').clear()

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}
