/**
 * Entry point of the application.
 * Mounts the React app into the DOM and wraps it with global providers:
 * - AppProviders (theme, Redux store, etc.)
 * - AppRouter (application routing)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/AppRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppProviders>
            <AppRouter />
        </AppProviders>
    </React.StrictMode>
);
