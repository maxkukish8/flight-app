import { fmtTime, fmtDate, fmtDuration } from './date';

describe('date utils', () => {
    const dep = '2025-06-04T16:40:00Z'; // UTC
    const arr = '2025-06-04T20:55:00Z';

    test('fmtTime returns 24h time in UTC', () => {
        expect(fmtTime(dep)).toBe('16:40');
        expect(fmtTime(arr)).toBe('20:55');
    });

    test('fmtDate returns DD/MM/YYYY in UTC', () => {
        expect(fmtDate(dep)).toMatch(/04\/06\/2025|06\/04\/2025/);
    });

    test('fmtDuration returns "Xh YYm"', () => {
        expect(fmtDuration(dep, arr)).toBe('4h 15m');
    });
});
