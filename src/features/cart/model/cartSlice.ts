//Redux shopping cart model

// src/features/cart/model/cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CartItem = { flightId: string; seat: string; price: number };
export type CartState = { items: CartItem[] };

export const initialCartState: CartState = { items: [] };

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addItem(s, a: PayloadAction<CartItem>) {
            // hardening: ensure array
            if (!Array.isArray(s.items)) s.items = [];
            const { flightId, seat } = a.payload;
            const exists = s.items.some(i => i.flightId === flightId && i.seat === seat);
            if (!exists) s.items.push(a.payload);
        },
        removeItem(s, a: PayloadAction<{ flightId: string; seat: string }>) {
            if (!Array.isArray(s.items)) s.items = [];
            const { flightId, seat } = a.payload;
            s.items = s.items.filter(i => !(i.flightId === flightId && i.seat === seat));
        },
        clear(s) {
            s.items = [];
        },
    },
});

export const { addItem, removeItem, clear } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

