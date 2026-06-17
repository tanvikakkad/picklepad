import dayjs from 'dayjs';
import type { Booking, Slot } from '../types';

export function generateSlots(
    courtId: string,
    date: string,
    bookingsList: Booking[],
    openTime: string,
    closeTime: string,
    price: number
): Slot[] {
    const slots: Slot[] = [];
    const now = dayjs();
    const dateObj = dayjs(date);
    const isToday = dateObj.isSame(now, 'day');

    const startHour = parseInt(openTime.split(':')[0], 10);
    const endHour = parseInt(closeTime.split(':')[0], 10);

    for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${String(hour).padStart(2, '0')}:00`;
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

        // Check if slot is in the past
        const slotStart = dayjs(`${date} ${startTime}`);
        const isPast = isToday && slotStart.isBefore(now);

        // Check if slot is already booked
        const isBooked = bookingsList.some(
            (b) =>
                b.courtId === courtId &&
                b.date === date &&
                (b.status === 'confirmed' || b.status === 'completed')&&
                startTime >= b.startTime &&
                startTime < b.endTime
        );

        let status: Slot['status'] = 'available';
        if (isPast) status = 'past';
        else if (isBooked) status = 'booked';

        slots.push({
            id: `${courtId}_${date}_${startTime}`,
            startTime,
            endTime,
            status,
            price,
        });
    }

    return slots;
}
