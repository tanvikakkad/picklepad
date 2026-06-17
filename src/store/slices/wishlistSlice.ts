// items: { [userId]: venueId[] }

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WishlistState } from '../../types';

const initialState: WishlistState = {
    items: {},
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist(state, action: PayloadAction<{ userId: string; venueId: string }>) {
            const { userId, venueId } = action.payload;
            if (!state.items[userId]) {
                state.items[userId] = [];
            }
            const index = state.items[userId].indexOf(venueId);
            if (index === -1) {
                state.items[userId].push(venueId);
            } else {
                state.items[userId].splice(index, 1);
            }
        },
    },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;