import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Box, Typography, Paper, Divider} from '@mui/material';
import { useGetFlightByIdQuery } from '@/entities/flight/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { addItem } from '@/features/cart/model/cartSlice';
import { genStableSeatGridByTickets } from '@/shared/lib/seatUtils';
import { fmtTime, fmtDate, fmtDuration } from '@/shared/lib/date';
import { useTheme, useMediaQuery } from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const MAX_COLS = 7;

export function FlightDetailsPage() {
    const { id = '' } = useParams();
    const { data: flight, isLoading, error } = useGetFlightByIdQuery(id);
    const dispatch = useAppDispatch();

    // All items in cart
    const cartItems = useAppSelector((s) => s.cart.items);
    const pickedForThisFlight = useMemo(
        () => cartItems.filter((i) => i.flightId === id),
        [cartItems, id]
    );
    const pickedSet = useMemo(
        () => new Set(pickedForThisFlight.map((i) => i.seat)),
        [pickedForThisFlight]
    );

    // Build a stable grid ONCE per (tickets,id,maxCols). Does NOT include cart.
    const gridResult = useMemo(() => {
        return genStableSeatGridByTickets(flight?.tickets, MAX_COLS, id);
    }, [flight?.tickets, id]);

    // Keep local grid state; do not regenerate on every cart change
    const [seats, setSeats] = useState(gridResult.grid);
    useEffect(() => {
        setSeats(
            gridResult.grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    occupied: cell.occupied || pickedSet.has(cell.id),
                }))
            )
        );
    }, [gridResult.grid, pickedSet]);

    // Build an aisle layout like [2,3,2] with real gaps between column groups
    const buildAisleLayout = (
        cols: number,               // logical columns = gridResult.cols (<= MAX_COLS)
        groups: number[] = [2, 3, 2],
        seatPx = 48,
        aislePx = 32
    ) => {
        // Use as many groups as we can fit into `cols`
        const used: number[] = [];
        let remaining = cols;
        for (let i = 0; i < groups.length && remaining > 0; i++) {
            const take = Math.min(groups[i], remaining);
            used.push(take);
            remaining -= take;
        }
        if (remaining > 0) used.push(remaining); // if cols > sum(groups), add a last group

        // Breakpoints (after which an aisle appears)
        const breaks: number[] = [];
        let acc = 0;
        for (let i = 0; i < used.length - 1; i++) {
            acc += used[i];
            breaks.push(acc); // after column index `acc - 1`, insert aisle
        }

        // CSS template: seats + aisle px between groups
        const template = used
            .map((n, i) => `repeat(${n}, ${seatPx}px)` + (i < used.length - 1 ? ` ${aislePx}px` : ''))
            .join(' ');

        // For a logical column index c (0-based), how many aisles are before it?
        const offsetForCol = (c: number) => breaks.filter((b) => c >= b).length;

        return { template, offsetForCol };
    };

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    const SEAT_PX  = isSmDown ? 30 : isMdDown ? 36 : 48;
    const AISLE_PX = isSmDown ? 4 : isMdDown ? 20 : 32;

    const { template, offsetForCol } = useMemo(
        () => buildAisleLayout(gridResult.cols, [2, 3, 2], SEAT_PX, AISLE_PX),
        [gridResult.cols, SEAT_PX, AISLE_PX]
    );

    if (isLoading) return <Typography>Loading…</Typography>;
    if (error) return <Typography color="error">Error loading flight.</Typography>;
    if (!flight) return <Typography>No flight found</Typography>;

    // Derived UI numbers: total from API; remaining decreases by picked count
    const totalUI = gridResult.total;
    const remainingUI = Math.max(0, (flight.tickets?.remaining ?? 0) - pickedForThisFlight.length);

    const flatSeats = seats.flat();
    const allBusy = flatSeats.length > 0 && flatSeats.every((s) => s.occupied);

    const handlePick = (seatId: string) => {
        const found = seats.flat().find(s => s.id === seatId);
        if (!found || found.occupied) return;

        dispatch(addItem({ flightId: flight.id, seat: seatId, price: flight.price }));

        // локально позначаємо зайнятим, щоб не чекати ре-рендера від кошика
        setSeats(prev =>
            prev.map(row =>
                row.map(cell => (cell.id === seatId ? { ...cell, occupied: true } : cell))
            )
        );
    };

    return (
        <Box sx={{ p: { sm: 2 } }}>
            {/* Flight header block – same style as on the list */}
            <Box
                sx={{
                    p: {xs: "20px 0", sm: 2},
                    maxWidth: "600px",
                    m: "0 auto 10px"
                }}
            >
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    ID: {flight.id}
                </Typography>

                <Typography variant="h5" sx={{ mb: 1 }}>
                    {flight.airline}
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0,1fr) auto',
                        alignItems: 'center',
                        columnGap: 3,
                        mb: 0.5,
                    }}
                >
                    <Box>
                        <Typography variant="h5">{fmtTime(flight.departureTime)}</Typography>
                        <Typography variant="body2" color="text.secondary">{flight.from}</Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">
                            {fmtDuration(flight.departureTime, flight.arrivalTime)}
                        </Typography>
                        <Box
                            sx={{
                                m: "5px 0",
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                gap: 1,
                            }}
                        >
                            <Box sx={{ flex: 1, height: 2, bgcolor: '#c1c7cf', borderRadius: 1 }} />
                            <AirplanemodeActiveIcon sx={{ fontSize: 20, color: 'primary.main', transform: 'rotate(90deg)' }} />
                            <Box sx={{ flex: 1, height: 2, bgcolor: '#c1c7cf', borderRadius: 1 }} />
                        </Box>
                        <Typography variant="caption" color="primary" display="block">
                            Direct
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Typography variant="h5">{fmtTime(flight.arrivalTime)}</Typography>
                        <Typography variant="body2" color="text.secondary">{flight.to}</Typography>
                    </Box>
                </Box>

                {/* Date */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {fmtDate(flight.departureTime)}
                </Typography>

                {/* Terminal / Gate / Tickets / Price */}
                <Box display="flex" gap={1} flexWrap="wrap" color="text.secondary">
                    {(flight.terminal || flight.gate) && (
                        <Typography variant="body2">
                            {flight.terminal ? `Terminal ${flight.terminal}` : ''}
                            {flight.terminal && flight.gate ? ' · ' : ''}
                            {flight.gate ? `Gate ${flight.gate}` : ''}
                        </Typography>
                    )}

                    <Typography variant="body2">· Tickets {remainingUI}/{totalUI} · </Typography>

                    <Typography variant="body2">€{flight.price}</Typography>
                </Box>
            </Box>

            <Divider orientation="horizontal" flexItem />

            {flatSeats.length === 0 ? (
                <Typography color="warning.main">No seat map available</Typography>
            ) : allBusy ? (
                <Typography color="warning.main" textAlign="center" mt={2}>All seats are occupied</Typography>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns={template}
                    gap={1}
                    sx={{
                        overflowX: 'auto',
                        justifyContent: 'center',
                        justifyItems: 'center',
                        pb: 1,
                        mt: 4
                    }}
                >
                    {seats.map((row, rIdx) =>
                        row.map((seat, cIdx) => (
                            <Paper
                                key={seat.id}
                                sx={{
                                    fontSize: { xs: 13, sm: 16 },
                                    gridRow: rIdx + 1,
                                    gridColumn: offsetForCol(cIdx) + cIdx + 1,
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: seat.occupied ? 'not-allowed' : 'pointer',
                                    opacity: seat.occupied ? 0.4 : 1,
                                    userSelect: 'none',
                                    minWidth: SEAT_PX,
                                    minHeight: SEAT_PX,
                                }}
                                onClick={() => handlePick(seat.id)}
                                aria-disabled={seat.occupied}
                                title={seat.occupied ? 'Occupied' : 'Pick seat'}
                            >
                                {seat.id}
                            </Paper>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
}
