import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from '@/features/cart/model/cartSlice';
import { favoritesReducer } from '@/features/favorites/model/favoritesSlice';
import { flightApi } from '@/entities/flight/api';
import { loadState, persistMiddleware } from '@/shared/store/persist';

//Initial state with localStorage
const preloaded = {
    cart: loadState('cart', { items: [] }),
    favorites: loadState('favorites', { ids: [] }),
};

const PERSIST_KEYS = ['cart', 'favorites'] as const;

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        favorites: favoritesReducer,
        [flightApi.reducerPath]: flightApi.reducer,
    },
    preloadedState: preloaded,
    middleware: (gDM) =>
        gDM().concat(
            flightApi.middleware,
            // типізація ключів через const-assertion (без RootState усередині persist)
            persistMiddleware(PERSIST_KEYS)
        ),
});

// Типи стора
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;