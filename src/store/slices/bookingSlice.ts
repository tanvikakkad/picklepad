import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet, apiPost, apiPatch } from '../../services/api';
import type { Booking, BookingState } from "../../types";

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
    return await apiGet<Booking[]>('/bookings');
});
export const addBookingAsync = createAsyncThunk('bookings/addBooking', async (booking: Booking) => {
    return await apiPost<Booking>('/bookings', booking);
});
export const cancelBookingAsync = createAsyncThunk('bookings/cancelBooking', async (bookingId: string) => {
    return await apiPatch<Booking>(`/bookings/${bookingId}`, { status: 'cancelled' });
});

const initialState: BookingState = {
    bookingsList: [],
    status: 'idle',
    error: null,};

export const bookingSlice = createSlice({
    name:"Bookings",
    initialState,
     reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookingsList = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch bookings';
            })
            .addCase(addBookingAsync.fulfilled, (state, action) => {
                state.bookingsList.push(action.payload);
            })
            .addCase(cancelBookingAsync.fulfilled, (state, action) => {
                const index = state.bookingsList.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookingsList[index] = action.payload;
                }
            });
    }
});

export default bookingSlice.reducer;