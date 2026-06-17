import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generateSuggestions } from '../utils/pricingEngine';
import type { RootState, Court, PricingSuggestion } from '../types';

interface ExtendedSuggestion extends PricingSuggestion {
    venueId: string;
    courtId: string;
    courtNumber: number;
}

/**
 * Generates pricing suggestions for all courts within a venue.
 */
export function usePricingSuggestions(venueId: string, courts: Court[] = []): ExtendedSuggestion[] {
    const bookingsList = useSelector((state: RootState) => state.bookings.bookingsList);

    const suggestions = useMemo((): ExtendedSuggestion[] => {
        if (!venueId || !courts.length) return [];

        return courts.flatMap((court) =>
            generateSuggestions(court.id, court.pricePerSlot, bookingsList).map((s) => ({
                ...s,
                venueId,
                courtId: court.id,
                courtNumber: court.courtNumber,
            }))
        );
    }, [venueId, courts, bookingsList]);

    return suggestions;
}
