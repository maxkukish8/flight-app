/**
 * Build a seat grid sized by tickets.total (rows x cols) and mark exactly (total - remaining)
 * seats as occupied, using a deterministic RNG seeded by `seedKey`.
 *
 * @param tickets { total, remaining }
 * @param maxCols max columns to use (layout width)
 * @param seedKey any stable string to seed randomness (e.g., flight id)
 */
export type Seat = { id: string; occupied: boolean };
export type SeatGrid = Seat[][];
export type SeatGridResult = {
    grid: SeatGrid;
    rows: number;
    cols: number;
    total: number;
    remaining: number;
};

/** Deterministic PRNG from a numeric seed (Mulberry32) */
const mulberry32 = (seed: number) => {
    let t = seed >>> 0;
    return () => {
        t |= 0;
        t = (t + 0x6D2B79F5) | 0;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
};

/** Simple string hash → number (for seeding by flight id) */
const hashString = (s: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

/** Convert column index to letters: 0->A, 1->B, … 25->Z, 26->AA, … */
const toLetters = (n: number) => {
    let s = '';
    n++;
    while (n > 0) {
        const rem = (n - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
};

/** Shuffle in place with provided RNG for deterministic randomness */
const shuffleWithRng = <T,>(arr: T[], rnd: () => number) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};

export const genStableSeatGridByTickets = (
    tickets: { total?: number; remaining?: number } | undefined,
    maxCols: number,
    seedKey: string
): SeatGridResult => {
    const total = Math.max(0, tickets?.total ?? 0);
    const remaining = Math.max(0, Math.min(tickets?.remaining ?? total, total));

    // Choose columns (at most maxCols, but not more than total)
    const cols = Math.max(1, Math.min(maxCols, total || 1));
    const rows = Math.max(1, Math.ceil((total || 1) / cols));

    // Build exactly `total` seats
    const grid: SeatGrid = [];
    let count = 0;
    for (let r = 0; r < rows; r++) {
        const row: Seat[] = [];
        for (let c = 0; c < cols; c++) {
            if (count >= total) break;
            row.push({ id: `${r + 1}${toLetters(c)}`, occupied: false });
            count++;
        }
        grid.push(row);
    }

    const flat = grid.flat();
    const needOccupied = Math.max(0, total - remaining);

    // Pick exactly `needOccupied` random seats to occupy, using a deterministic RNG
    const rnd = mulberry32(hashString(seedKey));
    const indices = Array.from({ length: flat.length }, (_, i) => i);
    shuffleWithRng(indices, rnd);
    const toOcc = new Set(indices.slice(0, Math.min(needOccupied, flat.length)));

    for (let i = 0; i < flat.length; i++) {
        if (toOcc.has(i)) flat[i].occupied = true;
    }

    return { grid, rows, cols, total, remaining };
};
