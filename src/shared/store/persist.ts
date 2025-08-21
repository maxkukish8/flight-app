//is responsible for ensuring that the basket and favorites are not lost after a refresh.

import type { Middleware } from '@reduxjs/toolkit';

export const loadState = <T>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

export const persistMiddleware =
    (keys: readonly string[]): Middleware =>
        (storeApi) =>
            (next) =>
                (action) => {
                    const result = next(action);
                    try {
                        const state = storeApi.getState() as Record<string, unknown>;
                        for (const k of keys) {
                            localStorage.setItem(k, JSON.stringify(state[k]));
                        }
                    } catch {
                        // тихо ігноруємо storage помилки
                    }
                    return result;
                };
