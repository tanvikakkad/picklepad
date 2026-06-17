import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet, apiPost, apiPatch } from '../../services/api';
import type { ReviewState, Review, Venue } from '../../types';

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async () => {
    return await apiGet<Review[]>('/reviews');
});
export const addReviewAsync = createAsyncThunk(
    'reviews/addReview',
    async (review: Review) => {
        const saved = await apiPost<Review>('/reviews', review);
        const venueReviews = await apiGet<Review[]>(`/reviews?venueId=${review.venueId}`);
        const totalRatings = venueReviews.length;
        const rating = Math.round((venueReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings) * 10) / 10;
        const updatedVenue = await apiPatch<Venue>(`/venues/${review.venueId}`, { rating, totalRatings });
        return { review: saved, venue: updatedVenue };
    }
);

const initialState: ReviewState = {
    reviewsList: [],
    status: 'idle',
    error: null,};

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviewsList = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch reviews';
            })
            .addCase(addReviewAsync.fulfilled, (state, action) => {
                state.reviewsList.push(action.payload.review);
            });
    },
});

export default reviewSlice.reducer;
