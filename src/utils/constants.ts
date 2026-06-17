import type { Venue } from '../types';

// ─── Areas ─────────────────────────────────────────────
export const AREAS: string[] = [
    'All Areas',
    'Satellite',
    'Bodakdev',
    'Vastrapur',
    'Navrangpura',
    'Thaltej',
    'SG Highway',
    'Prahlad Nagar',
    'Paldi',
    'Bopal',
];

// ─── Amenities List ────────────────────────────────────
export const AMENITIES: string[] = [
    'Indoor',
    'Outdoor',
    'AC',
    'Parking',
    'Drinking Water',
    'Washroom',
    'Night Lighting',
    'Equipment Rental',
    'Cafeteria',
    'Pro Shop',
    'Coaching',
    'Spectator Gallery',
];

// ─── Surface Types ─────────────────────────────────────
export const SURFACE_TYPES: string[] = [
    'Indoor Cushioned',
    'Indoor Professional',
    'Indoor Wood',
    'Indoor Multi-purpose',
    'Outdoor Concrete',
    'Outdoor Asphalt',
    'Outdoor Cushioned',
    'Outdoor Professional',
    'Outdoor Standard',
];

// ─── Venue helpers ─────────────────────────────────────

/** Get the min price across all courts in a venue */
export function getVenueMinPrice(venue: Venue): number {
    if (!venue.courts?.length) return 0;
    return Math.min(...venue.courts.map((c) => c.pricePerSlot));
}

/** Get the max price across all courts in a venue */
export function getVenueMaxPrice(venue: Venue): number {
    if (!venue.courts?.length) return 0;
    return Math.max(...venue.courts.map((c) => c.pricePerSlot));
}

/** Format a price range string for display */
export function getVenuePriceDisplay(venue: Venue): string {
    const min = getVenueMinPrice(venue);
    const max = getVenueMaxPrice(venue);
    if (min === max) return `₹${min}/hr`;
    return `₹${min}–${max}/hr`;
}
