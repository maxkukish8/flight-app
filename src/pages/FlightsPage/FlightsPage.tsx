import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetFlightsQuery } from '@/entities/flight/api';
import {
    Card, CardContent, Typography, CircularProgress, IconButton,
    Box, FormControl, InputLabel, Select, MenuItem, Button, Divider
} from '@mui/material';
import { Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { toggle as toggleFav } from '@/features/favorites/model/favoritesSlice';
import type { Flight } from '@/shared/types/flight';
import { fmtTime, fmtDate, fmtDuration } from '@/shared/lib/date';

export function FlightsPage() {
    const [params, setParams] = useSearchParams();
    const airline = params.get('airline') ?? '';
    const sort = params.get('sort') ?? '';
    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const fav = useAppSelector((s) => s.favorites?.ids ?? []);
    const { data, isLoading, error } = useGetFlightsQuery();

    const airlines = useMemo(() => {
        const set = new Set<string>();
        (data ?? []).forEach((f) => f.airline && set.add(f.airline));
        return Array.from(set).sort();
    }, [data]);

    const flights: Flight[] = useMemo(() => {
        let list = [...(data as Flight[] | undefined ?? [])];
        if (airline) list = list.filter((f) => f.airline === airline);
        if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
        return list;
    }, [data, airline, sort]);

    const updateParam = (key: string, value: string) => {
        setParams(prev => {
            const p = new URLSearchParams(prev);
            if (!value) p.delete(key);
            else p.set(key, value);
            return p;
        });
    };

    const cartItems = useAppSelector(s => s.cart.items);

    const pickedCountByFlight = useMemo(() => {
        const m = new Map<string, number>();
        for (const i of cartItems) {
            m.set(i.flightId, (m.get(i.flightId) ?? 0) + 1);
        }
        return m;
    }, [cartItems]);

    if (isLoading) return <Box p={3}><CircularProgress /></Box>;
    if (error) return <Box p={3}><Typography color="error">Loading error</Typography></Box>;

    return (
        <Box sx={{ p: { xs: "20px 0", md: 2 } }}>
            {/* Filter/Sort panel */}
            <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel shrink id="airline-label">Airlines</InputLabel>
                    <Select
                        labelId="airline-label"
                        label="Airlines"
                        value={airline}
                        onChange={(e) => updateParam('airline', String(e.target.value))}
                        displayEmpty
                    >
                        <MenuItem value=""><em>All airlines</em></MenuItem>
                        {airlines.map((a) => (
                            <MenuItem key={a} value={a}>{a}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel shrink id="sort-label">Ticket prices</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Ticket`s price"
                        value={sort}
                        onChange={(e) => updateParam('sort', String(e.target.value))}
                        displayEmpty
                    >
                        <MenuItem value=""><em>Price</em></MenuItem>
                        <MenuItem value="price_asc">Cheapest first</MenuItem>
                        <MenuItem value="price_desc">Most expensive first</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* List of cards */}
            {flights.length === 0 ? (
                <Typography>No flights</Typography>
            ) : (
                <Grid container spacing={2}>
                    {flights.map((f) => {
                        const depT = fmtTime(f.departureTime);
                        const arrT = fmtTime(f.arrivalTime);
                        const depD = fmtDate(f.departureTime);
                        const dur = fmtDuration(f.departureTime, f.arrivalTime);

                        return (
                            <Grid key={f.id} size={{ xs: 12, md: 12, lg: 6 }}>
                                <Card elevation={0} sx={(theme) => ({
                                    height: "100%",
                                    boxShadow:
                                        theme.palette.mode === "dark"
                                            ? "0 1px 3px 0 rgba(255,255,255,0.2)"
                                            : "0 1px 3px 0 #25201f4d",
                                    "&:hover": {
                                        boxShadow:
                                            theme.palette.mode === "dark"
                                                ? "0 4px 14px 0 rgba(255,255,255,0.25)"
                                                : "0 4px 14px 0 #25201f40",
                                    },
                                })}>
                                    <CardContent sx={{
                                        p: "0",
                                        '&:last-child': { pb: "0", },
                                    }}>
                                        <Box display="flex" position="relative" sx={{
                                            '@media (max-width:600px)': {
                                                flexDirection: "column"
                                            }
                                        }}>
                                            {/* The left large part with information */}
                                            <Box flex={1} p={2} onClick={() => nav(`/flights/${f.id}`)} sx={{ cursor: 'pointer' }}>
                                                <Typography variant="caption" color="text.secondary">ID: {f.id}</Typography>
                                                <Typography variant="h6" mt={0.5}>{f.airline}</Typography>

                                                {/* Time/cities/duration */}
                                                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mt={1} mb={0.5} sx={{
                                                    '@media (max-width:600px)': {
                                                        justifyContent: "space-between"
                                                    }
                                                }}>
                                                    <Box>
                                                        <Typography variant="h6" component="div">{depT}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{f.from}</Typography>
                                                    </Box>

                                                    <Box textAlign="center" flex="1">
                                                        <Typography variant="caption" color="text.secondary">{dur || '—'}</Typography>
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
                                                        <Box sx={{ fontSize: 12, color: 'primary.main' }}>Direct</Box>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="h6" component="div">{arrT}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{f.to}</Typography>
                                                    </Box>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary">{depD}</Typography>

                                                {/* Terminal/Gate and Tickets */}
                                                <Box mt={1} display="flex" gap={1} flexWrap="wrap" color="text.secondary">
                                                    {(f.terminal || f.gate) && (
                                                        <Typography variant="body2">
                                                            {f.terminal ? `Terminal ${f.terminal}` : ''}
                                                            {f.terminal && f.gate ? ' · ' : ''}
                                                            {f.gate ? `Gate ${f.gate}` : ''}
                                                        </Typography>
                                                    )}

                                                    {f.tickets && typeof f.tickets.total !== 'undefined' && (
                                                        <Typography variant="body2">
                                                            {(() => {
                                                                const picked = pickedCountByFlight.get(f.id) ?? 0;
                                                                const total = f.tickets?.total ?? 0;
                                                                const baseRemaining = typeof f.tickets.remaining === 'number'
                                                                    ? f.tickets.remaining
                                                                    : total;
                                                                const remainingUI = Math.max(0, baseRemaining - picked);
                                                                return ` · Tickets ${remainingUI}/${total}`;
                                                            })()}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                            />
                                            <Divider
                                                orientation="horizontal"
                                                flexItem
                                                sx={{ display: { xs: 'block', sm: 'none' } }}
                                            />
                                            <Box p={2} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center" sx={{
                                                position: {sm: "relative"},
                                                width: {sm: "180px"}
                                            }}>
                                                <Box position="absolute" display="flex" right="15px" top="7px">
                                                    <IconButton onClick={() => dispatch(toggleFav(f.id))} aria-label="favorite" size="small">
                                                        <FavoriteIcon color={fav.includes(f.id) ? 'error' : 'disabled'} />
                                                    </IconButton>
                                                </Box>

                                                <Box textAlign="right" width="100%" sx={{
                                                    '@media (max-width:600px)': {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "end",
                                                    }
                                                }}>
                                                    <Typography variant="h6" sx={{mr: {xs: "10px", sm: 0}}}>€{f.price.toLocaleString()}</Typography>

                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        endIcon={<ArrowForwardIosIcon fontSize="inherit" />}
                                                        sx={(theme) => ({
                                                            backgroundColor: theme.palette.mainTheme?.main,
                                                            '&:hover': {
                                                                backgroundColor: "#154679",
                                                            },
                                                            mt: {sm: 1},
                                                            width: "150px"
                                                        })}
                                                        onClick={() => nav(`/flights/${f.id}`)}
                                                    >
                                                        Select
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}
