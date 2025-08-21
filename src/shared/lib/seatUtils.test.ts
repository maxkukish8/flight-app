import { genStableSeatGridByTickets } from './seatUtils';

describe('genStableSeatGridByTickets', () => {
    test('creates total seats and marks (total - remaining) as occupied', () => {
        const res = genStableSeatGridByTickets({ total: 10, remaining: 4 }, 7, 'FL001');
        const flat = res.grid.flat();
        expect(flat).toHaveLength(10);                 // рівно total
        const occupied = flat.filter(s => s.occupied).length;
        expect(occupied).toBe(10 - 4);                 // total - remaining
    });

    test('uses deterministic ids for the same flight id (stable layout)', () => {
        const a = genStableSeatGridByTickets({ total: 8, remaining: 4 }, 7, 'FLX');
        const b = genStableSeatGridByTickets({ total: 8, remaining: 4 }, 7, 'FLX');
        expect(a.grid.flat().map(s => s.id)).toEqual(b.grid.flat().map(s => s.id));
    });
});
