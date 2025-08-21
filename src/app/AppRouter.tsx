/**
 * Application router configuration.
 *
 * Defines all routes of the application using React Router v6:
 * - "/" → FlightsPage (list of flights with filters/sorting)
 * - "/flights/:id" → FlightDetailsPage (details of a selected flight)
 * - "/cart" → CartPage (user's cart with selected tickets)
 *
 * This component wraps the route definitions into a RouterProvider
 * and should be rendered inside <AppProviders>.
 */


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FlightsPage } from '@/pages/FlightsPage/FlightsPage';
import { FlightDetailsPage } from '@/pages/FlightDetailsPage/FlightDetailsPage';
import { CartPage } from '@/pages/CartPage/CartPage';
import { RootLayout } from './RootLayout';

const basename = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { index: true, element: <FlightsPage /> },
                { path: 'flights/:id', element: <FlightDetailsPage /> },
                { path: 'cart', element: <CartPage /> },
            ],
        },
    ],
    { basename }
);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
