/**
 * RootLayout component.
 *
 * Defines the main application layout with a common AppBar (header) and
 * an <Outlet /> placeholder for rendering child routes.
 *
 * Includes:
 * - Navigation bar with links (e.g., to Flights, Cart).
 * - Toggle Theme button (light/dark mode).
 * - Cart button with badge showing number of selected tickets.
 *
 * Used as a wrapper for all routes in AppRouter.
 */

import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from '@/widgets/Header/Header';

export function RootLayout() {
    return (
        <>
            <Header />
            <Container sx={{ mt: 10 }}>
                <Outlet />
            </Container>
        </>
    );
}
