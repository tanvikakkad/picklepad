// loadState, saveState, removeState
const PREFIX = 'picklepad_';

export function loadState(key: string): unknown {
    try {
        const serialized = localStorage.getItem(`${PREFIX}${key}`);
        if (serialized === null) return undefined;
        return JSON.parse(serialized);
    } catch (err) {
        console.error(`Error loading state for key "${key}":`, err);
        return undefined;
    }
}

export function saveState(key: string, state: unknown): void {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(`${PREFIX}${key}`, serialized);
    } catch (err) {
        console.error(`Error saving state for key "${key}":`, err);
    }
}

export function removeState(key: string): void {
    try {
        localStorage.removeItem(`${PREFIX}${key}`);
    } catch (err) {
        console.error(`Error removing state for key "${key}":`, err);
    }
}

export function clearAllState(): void {
    try {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(PREFIX))
            .forEach((key) => localStorage.removeItem(key));
    } catch (err) {
        console.error('Error clearing all state:', err);
    }
}
