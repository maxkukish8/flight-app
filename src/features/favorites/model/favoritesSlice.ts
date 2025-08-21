//Redux slice for saving "selected" flights.

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
type State = { ids: string[] };
const initialState: State = { ids: [] };

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggle(s, a: PayloadAction<string>) {
            const id = a.payload;
            s.ids = s.ids.includes(id) ? s.ids.filter(x => x !== id) : [...s.ids, id];
        },
    },
});

export const { toggle } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
