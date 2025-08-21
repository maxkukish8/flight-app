import { createSlice } from '@reduxjs/toolkit';

export type FavoritesState = { ids: string[] };
export const initialFavoritesState: FavoritesState = { ids: [] };

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: initialFavoritesState,
    reducers: {
        toggle(state, action: { payload: string }) {
            const id = action.payload;
            const i = state.ids.indexOf(id);
            if (i === -1) state.ids.push(id);
            else state.ids.splice(i, 1);
        },
        clear(state) {
            state.ids = [];
        },
    },
});

export const { toggle, clear } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
