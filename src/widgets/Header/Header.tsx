/**
 * Header (AppBar) component.
 *
 * Displays the top navigation bar of the application with:
 * - Project title / logo (clickable, redirects to the home page).
 * - "Cart" button with a badge that shows the number of tickets in the cart.
 * - "Toggle Theme" button for switching between light and dark modes.
 *
 * This component is used inside RootLayout and is visible on all pages.
 */

import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/hooks';
import { useThemeMode } from '@/app/providers/ThemeModeContext';

export function Header() {
    const navigate = useNavigate();
    const cartCount = useAppSelector((s) => s.cart?.items?.length ?? 0);
    const theme = useTheme();
    const { toggle } = useThemeMode();

    return (
        <AppBar position="fixed" elevation={1} z-idex="2" sx={{ backgroundColor: (theme) => theme.palette.mainTheme?.main }}>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                px: { xs: 2, md: 5 },
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <AirplaneTicketIcon
                        sx={{
                            fontSize: 28,
                            color: 'inherit',
                        }}
                        aria-label="App logo: airplane"
                    />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'unset' }, }}
                    >
                        SkyFlights
                    </Typography>
                </Box>


                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6 }}>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit" onClick={toggle} aria-label="toggle theme">
                        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
