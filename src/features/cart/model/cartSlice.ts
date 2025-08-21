//Redux shopping cart model

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CartItem = { flightId: string; seat: string; price: number };
type State = { items: CartItem[] };

const initialState: State = { items: [] };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(s, a: PayloadAction<CartItem>) {
            const exists = s.items.some(
                i => i.flightId === a.payload.flightId && i.seat === a.payload.seat
            );
            if (!exists) s.items.push(a.payload);
        },
        removeItem(s, a: PayloadAction<{ flightId: string; seat: string }>) {
            s.items = s.items.filter(
                i => !(i.flightId === a.payload.flightId && i.seat === a.payload.seat)
            );
        },
        clear(s) { s.items = []; },
    },
});

export const { addItem, removeItem, clear } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
