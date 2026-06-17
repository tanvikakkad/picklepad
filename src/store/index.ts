// configureStore + localStorage sync
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courtReducer from './slices/courtSlice';
import wishlistReducer from './slices/wishlistSlice';
import bookingReducer from './slices/bookingSlice';
import reviewReducer from './slices/reviewSlice';
import type { AuthState, BookingState, ReviewState } from '../types';
import { loadState, saveState } from '../utils/localStorage';
import { fetchVenues } from './slices/courtSlice';
import { fetchUsers } from './slices/authSlice';
import { fetchBookings } from './slices/bookingSlice';
import { fetchReviews } from './slices/reviewSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        courts: courtReducer,
        wishlist: wishlistReducer,
        bookings: bookingReducer,
        reviews: reviewReducer,
    },
    preloadedState: {
        auth: (loadState('auth') as AuthState) ?? undefined,
        bookings: (loadState('bookings') as BookingState) ?? { bookingsList: [] },
        reviews: (loadState('reviews') as ReviewState) ?? { reviewsList: [] },
    },
});

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;

export function initializeStore() {
    const state = store.getState();
    if (!state.auth.registeredUsers?.length) {
        store.dispatch(fetchUsers());
    }
    if (!state.courts.venuesList?.length) {
        store.dispatch(fetchVenues());
    }
    if (!state.bookings.bookingsList?.length) {
        store.dispatch(fetchBookings());
    }
    if (!state.reviews.reviewsList?.length) {
        store.dispatch(fetchReviews());
    }
}

let previousState = store.getState();

store.subscribe(() => {
    const currentState = store.getState();

    if (currentState.auth !== previousState.auth) {
        saveState('auth', currentState.auth);
    }
    if (currentState.bookings !== previousState.bookings) {  
        saveState('bookings', currentState.bookings);
    }
    if (currentState.reviews !== previousState.reviews) {
        saveState('reviews', currentState.reviews);
    }
  
    previousState = currentState;
});

export default store;
