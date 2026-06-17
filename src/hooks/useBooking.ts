// createBooking, cancelBooking, queries
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { addBookingAsync, cancelBookingAsync } from '../store/slices/bookingSlice';
import type { AppDispatch } from '../store';
import type { RootState, Booking, Slot } from '../types';

interface CreateBookingParams {
    venueId: string;
    courtId: string;
    venueName: string;
    courtNumber: number;
    date: string;
    slots: Slot[];
    totalAmount: number;
}

export function useBooking(userId: string | undefined) {
    const dispatch = useDispatch<AppDispatch>();
    const bookingsList = useSelector((state: RootState) => state.bookings.bookingsList);

    const userBookings = useMemo(
        () => bookingsList.filter((b) => b.userId === userId),
        [bookingsList, userId]
    );

    const upcomingBookings = useMemo(
        () => userBookings.filter((b) => b.status === 'confirmed'),
        [userBookings]
    );

    const completedBookings = useMemo(
        () => userBookings.filter((b) => b.status === 'completed'),
        [userBookings]
    );

    const cancelledBookings = useMemo(
        () => userBookings.filter((b) => b.status === 'cancelled'),
        [userBookings]
    );

    const createBooking = useCallback(
    (data: CreateBookingParams): Booking => {
        const newBooking: Booking = {
            id: `booking_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            userId: userId ?? '',
            venueId: data.venueId,
            venueName: data.venueName,
            courtId: data.courtId,
            courtNumber: data.courtNumber,
            date: data.date,
            startTime: data.slots[0].startTime,
            endTime: data.slots[data.slots.length - 1].endTime,
            amount: data.totalAmount,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };
        dispatch(addBookingAsync(newBooking));
        return newBooking;  // ← return full Booking
    },
    [dispatch, userId]
);

    const handleCancel = useCallback(
        (bookingId: string) => {
            dispatch(cancelBookingAsync(bookingId));
        },
        [dispatch]
    );

    const getBookingsForCourt = useCallback(
        (courtId: string) => bookingsList.filter((b) => b.courtId === courtId),
        [bookingsList]
    );

    const getBookingsForVenue = useCallback(
        (venueId: string) => bookingsList.filter((b) => b.venueId === venueId),
        [bookingsList]
    );

    return {
        allBookings: bookingsList,
        userBookings,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        createBooking,
        cancelBooking: handleCancel,
        getBookingsForCourt,
        getBookingsForVenue,
    };
}
