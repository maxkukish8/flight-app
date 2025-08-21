import { Box, Typography, IconButton, Divider, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { removeItem, clear } from '@/features/cart/model/cartSlice';

export function CartPage() {
    const items = useAppSelector(s => s.cart?.items ?? []);
    const dispatch = useAppDispatch();
    const total = items.reduce((sum, i) => sum + i.price, 0);

    if (items.length === 0) {
        return (
            <Box p={3}>
                <Typography>Your cart is empty</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>Cart</Typography>
            {items.map(i => (
                <Box key={`${i.flightId}-${i.seat}`} mb={1}>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography>{i.flightId} — Seat: {i.seat}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}><Typography>€{i.price}</Typography></Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <IconButton onClick={() => dispatch(removeItem({ flightId: i.flightId, seat: i.seat }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                </Box>
            ))}
            <Typography variant="h6">Total: €{total}</Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => dispatch(clear())}>Clear</Button>
        </Box>
    );
}
