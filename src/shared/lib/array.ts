// Safe flatten for 2D arrays. Works even if arr is undefined.
export function flatten2D<T>(arr?: T[][]): T[] {
    if (!arr) return [];
    // використовуємо reduce, без any
    return arr.reduce<T[]>((acc, row) => acc.concat(row), []);
}

