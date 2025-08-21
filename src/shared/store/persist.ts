import type { Middleware } from '@reduxjs/toolkit';

/**
 * Safe read from localStorage with JSON.parse and fallback on any error.
 */
export function safeRead<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw) as unknown;
        return (parsed as T) ?? fallback;
    } catch {
        return fallback;
    }
}

/**
 * Safe write to localStorage with JSON.stringify and silent failure.
 */
export function safeWrite<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage quota / privacy mode errors
    }
}

/**
 * Backward-compatible alias if десь уже використовується loadState.
 */
export const loadState = safeRead;

/**
 * Middleware that persists selected top-level slices to localStorage
 * after every action. It never throws if storage is unavailable.
 *
 * @param keys - list of top-level slice keys to persist, e.g. ['cart', 'favorites']
 */
export const persistMiddleware =
    (keys: readonly string[]): Middleware =>
        (storeApi) =>
            (next) =>
                (action) => {
                    const result = next(action);

                    try {
                        const state = storeApi.getState() as Record<string, unknown>;
                        for (const k of keys) {
                            // write each selected slice safely
                            safeWrite(k, state[k]);
                        }
                    } catch {
                        // silently ignore storage errors
                    }

                    return result;
                };
