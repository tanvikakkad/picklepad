import dayjs from 'dayjs';
import type { Booking, PricingSuggestion } from '../types';

/**
 * Analyse past booking data and generate pricing suggestions for a court.
 *
 * Rules:
 * - occupancy > 70%  → suggest +20% price increase
 * - occupancy < 30%  → suggest -15% price decrease
 * - weekends busier  → suggest +15% weekend surcharge
 * - 0 bookings in 7 days → suggest -15% promo discount
 */
export function generateSuggestions(
    courtId: string,
    currentPrice: number,
    bookingsList: Booking[]
): PricingSuggestion[] {
    const suggestions: PricingSuggestion[] = [];
    const now = dayjs();
    const thirtyDaysAgo = now.subtract(30, 'day');
    const sevenDaysAgo = now.subtract(7, 'day');

    // Get bookings for this court in the last 30 days
    const courtBookings = bookingsList.filter(
        (b) =>
            b.courtId === courtId &&
            dayjs(b.date).isAfter(thirtyDaysAgo) &&
            (b.status === 'confirmed' || b.status === 'completed')
    );

    // Calculate occupancy (assume 17 hours/day open, 30 days)
    const totalSlots = 17 * 30;
    const bookedSlots = courtBookings.length;
    const occupancy = totalSlots > 0 ? bookedSlots / totalSlots : 0;

    // High occupancy → suggest price increase
    if (occupancy > 0.7) {
        const suggestedPrice = Math.round(currentPrice * 1.2);
        suggestions.push({
            id: `${courtId}_high_occ`,
            type: 'increase',
            reason: `Occupancy is ${Math.round(occupancy * 100)}% — demand is high. Consider raising the price.`,
            currentPrice,
            suggestedPrice,
            confidence: Math.min(0.95, occupancy),
        });
    }

    // Low occupancy → suggest price decrease
    if (occupancy < 0.3 && occupancy > 0) {
        const suggestedPrice = Math.round(currentPrice * 0.85);
        suggestions.push({
            id: `${courtId}_low_occ`,
            type: 'decrease',
            reason: `Occupancy is only ${Math.round(occupancy * 100)}%. A price drop may attract more players.`,
            currentPrice,
            suggestedPrice,
            confidence: 0.7,
        });
    }

    // Weekend analysis
    const weekendBookings = courtBookings.filter((b) => {
        const day = dayjs(b.date).day();
        return day === 0 || day === 6;
    });
    const weekdayBookings = courtBookings.filter((b) => {
        const day = dayjs(b.date).day();
        return day !== 0 && day !== 6;
    });

    if (weekendBookings.length > weekdayBookings.length * 1.5 && weekendBookings.length > 3) {
        const suggestedPrice = Math.round(currentPrice * 1.15);
        suggestions.push({
            id: `${courtId}_weekend`,
            type: 'weekend_surcharge',
            reason: `Weekends get ${Math.round((weekendBookings.length / Math.max(weekdayBookings.length, 1)) * 100)}% more bookings. Add a weekend surcharge.`,
            currentPrice,
            suggestedPrice,
            confidence: 0.8,
        });
    }

    // No recent bookings → suggest promo
    const recentBookings = courtBookings.filter((b) => dayjs(b.date).isAfter(sevenDaysAgo));
    if (recentBookings.length === 0 && courtBookings.length > 0) {
        const suggestedPrice = Math.round(currentPrice * 0.85);
        suggestions.push({
            id: `${courtId}_promo`,
            type: 'promo',
            reason: 'No bookings in the last 7 days. A promo discount could re-engage players.',
            currentPrice,
            suggestedPrice,
            confidence: 0.65,
        });
    }

    return suggestions;
}
