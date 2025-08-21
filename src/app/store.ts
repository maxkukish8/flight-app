import { configureStore } from '@reduxjs/toolkit';
import {
    cartReducer,
    initialCartState,
    type CartState,
    type CartItem,
} from '@/features/cart/model/cartSlice';
import {
    favoritesReducer,
    initialFavoritesState,
    type FavoritesState,
} from '@/features/favorites/model/favoritesSlice';
import { flightApi } from '@/entities/flight/api';
import { safeRead, safeWrite } from '@/shared/store/persist';

function isCartItem(x: unknown): x is CartItem {
    if (!x || typeof x !== 'object') return false;
    const o = x as Record<string, unknown>;
    return (
        typeof o.flightId === 'string' &&
        typeof o.seat === 'string' &&
        typeof o.price === 'number'
    );
}

function fixCartShape(input: unknown): CartState {
    const f = (input as Partial<CartState>) ?? {};
    const items = Array.isArray(f.items) ? f.items.filter(isCartItem) : [];
    return { items };
}

function fixFavoritesShape(input: unknown): FavoritesState {
    const f = (input as Partial<FavoritesState>) ?? {};
    const ids = Array.isArray(f.ids) ? f.ids.filter((v): v is string => typeof v === 'string') : [];
    return { ids };
}

const preloaded = {
    cart: fixCartShape(safeRead<CartState>('cart', initialCartState)),
    favorites: fixFavoritesShape(safeRead<FavoritesState>('favorites', initialFavoritesState)),
};

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        favorites: favoritesReducer,
        [flightApi.reducerPath]: flightApi.reducer,
    },
    preloadedState: preloaded,
    middleware: (gDM) => gDM().concat(flightApi.middleware),
});

store.subscribe(() => {
    const s = store.getState();
    safeWrite('cart', s.cart);
    safeWrite('favorites', s.favorites);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
