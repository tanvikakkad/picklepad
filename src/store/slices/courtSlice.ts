import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../../services/api';
import type { CourtsState, CourtsFilters, Venue } from '../../types';
import { addReviewAsync } from './reviewSlice';


export const fetchVenues = createAsyncThunk('courts/fetchVenues', async () => {
    return await apiGet<Venue[]>('/venues');
});
export const addVenueAsync = createAsyncThunk('courts/addVenue', async (venue: Venue) => {
    return await apiPost<Venue>('/venues', venue);
});
export const updateVenueAsync = createAsyncThunk('courts/updateVenue', async (venue: Venue) => {
    return await apiPut<Venue>(`/venues/${venue.id}`, venue);
});
export const deleteVenueAsync = createAsyncThunk('courts/deleteVenue', async (venueId: string) => {
    await apiDelete(`/venues/${venueId}`);
    return venueId;
});
export const togglePublishAsync = createAsyncThunk(
    'courts/togglePublish',
    async (venue: Venue) => {
        const updated = { ...venue, isPublished: !venue.isPublished };
        return await apiPatch<Venue>(`/venues/${venue.id}`, { isPublished: updated.isPublished });
    }
);

const initialState: CourtsState = {
    venuesList: [],
    searchQuery: '',
    filters: {
        area: 'All Areas',
        maxPrice: 1500,
        minRating: 0,
        amenities: [],
        showAcademies: true,
        showCourts: true,
    },
    sortBy: 'rating',
    status: 'idle',
    error: null,
};

const courtSlice = createSlice({
    name: 'courts',
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setFilters(state, action: PayloadAction<Partial<CourtsFilters>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = initialState.filters;
        },
        setSortBy(state, action: PayloadAction<CourtsState['sortBy']>) {
            state.sortBy = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchVenues.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            
            .addCase(fetchVenues.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.venuesList = action.payload;
            })
            .addCase(fetchVenues.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch venues';
            })

            .addCase(addVenueAsync.fulfilled, (state, action) => {
                state.venuesList.push(action.payload);
            })

            .addCase(updateVenueAsync.fulfilled, (state, action) => {
                const index = state.venuesList.findIndex((v) => v.id === action.payload.id);
                if (index !== -1) {
                    state.venuesList[index] = action.payload;
                }
            })

            .addCase(deleteVenueAsync.fulfilled, (state, action) => {
                state.venuesList = state.venuesList.filter((v) => v.id !== action.payload);
            })

            .addCase(togglePublishAsync.fulfilled, (state, action) => {
                const index = state.venuesList.findIndex((v) => v.id === action.payload.id);
                if (index !== -1) {
                    state.venuesList[index] = action.payload;
                }
            })

            .addCase(addReviewAsync.fulfilled, (state, action) => {
                const venue = action.payload.venue;
                const index = state.venuesList.findIndex((v) => v.id === venue.id);
                if (index !== -1) {
                    state.venuesList[index] = venue;
                }
            });
    },
});

export const { setSearchQuery, setFilters, resetFilters, setSortBy } = courtSlice.actions;
export default courtSlice.reducer;
