
import { User, Quest } from '../types';

const DB_NAME = 'LifeQuestDB';
const DB_VERSION = 1;
const STORES = {
    USERS: 'users',
    QUESTS: 'quests',
    SESSION: 'session',
};

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject('Error opening database');
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = (event.target as IDBOpenDBRequest).result;
            if (!tempDb.objectStoreNames.contains(STORES.USERS)) {
                const userStore = tempDb.createObjectStore(STORES.USERS, { keyPath: 'id' });
                userStore.createIndex('username', 'username', { unique: true });
                userStore.createIndex('email', 'email', { unique: true });
            }
            if (!tempDb.objectStoreNames.contains(STORES.QUESTS)) {
                const questStore = tempDb.createObjectStore(STORES.QUESTS, { keyPath: 'id' });
                questStore.createIndex('userId', 'userId', { unique: false });
            }
            if (!tempDb.objectStoreNames.contains(STORES.SESSION)) {
                tempDb.createObjectStore(STORES.SESSION, { keyPath: 'key' });
            }
        };
    });
};

const getStore = (storeName: string, mode: IDBTransactionMode): IDBObjectStore => {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
};

// --- User Operations ---
export const addUser = (user: User): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.USERS, 'readwrite');
        const request = store.add(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getUser = (userId: string): Promise<User | undefined> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.USERS, 'readonly');
        const request = store.get(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getAllUsers = (): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.USERS, 'readonly');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const updateUser = (user: User): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.USERS, 'readwrite');
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};


// --- Session Operations ---
const SESSION_KEY = 'currentUser';

export const setCurrentSession = (userId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.SESSION, 'readwrite');
        const request = store.put({ key: SESSION_KEY, userId });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getCurrentSession = (): Promise<string | null> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.SESSION, 'readonly');
        const request = store.get(SESSION_KEY);
        request.onsuccess = () => resolve(request.result ? request.result.userId : null);
        request.onerror = () => reject(request.error);
    });
};

export const clearCurrentSession = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.SESSION, 'readwrite');
        const request = store.delete(SESSION_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// --- Quest Operations ---
export const getQuestsByUserId = (userId: string): Promise<Quest[]> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.QUESTS, 'readonly');
        const index = store.index('userId');
        const request = index.getAll(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const updateQuest = (quest: Quest): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const store = getStore(STORES.QUESTS, 'readwrite');
        const request = store.put(quest);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};


export const replaceUserQuests = (userId: string, newQuests: Quest[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await openDB();
        const transaction = db.transaction(STORES.QUESTS, 'readwrite');
        const store = transaction.objectStore(STORES.QUESTS);
        const index = store.index('userId');
        
        // Step 1: Delete old quests
        const deleteRequest = index.openKeyCursor(IDBKeyRange.only(userId));
        deleteRequest.onsuccess = () => {
            const cursor = deleteRequest.result;
            if (cursor) {
                store.delete(cursor.primaryKey);
                cursor.continue();
            }
        };

        // Step 2: Add new quests after deletion is complete
        transaction.oncomplete = () => {
            const addTransaction = db.transaction(STORES.QUESTS, 'readwrite');
            const addStore = addTransaction.objectStore(STORES.QUESTS);
            newQuests.forEach(quest => addStore.add(quest));
            
            addTransaction.oncomplete = () => resolve();
            addTransaction.onerror = () => reject(addTransaction.error);
        };
        
        transaction.onerror = () => reject(transaction.error);
    });
};
