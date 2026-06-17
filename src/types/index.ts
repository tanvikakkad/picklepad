// All TypeScript interfaces
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'player' | 'owner';
    phone: string;
    createdAt: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'player' | 'owner';
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'player' | 'owner';
    phone?: string;
}
export interface Court{
    id: string;
    courtNumber: number;
    surfaceType:string;
    pricePerSlot: number;
}

export interface AcademyDetails {
    coachName: string;
    batchTimings: string[];
    monthlyFee: number;
    trialAvailable: boolean;
}

export interface Venue {
    id: string;
    ownerId: string;
    name: string;
    area: string;
    address: string;
    description: string;
    courts: Court[];
    amenities: string[];
    openTime: string;
    closeTime: string;
    rating: number;
    totalRatings: number;
    images: string[];
    isAcademy: boolean;
    priceRange: {
        min: number;
        max: number;
    };
    academyDetails?: AcademyDetails | null;
    isPublished: boolean;
    createdAt: string;
}

export interface Booking {
    id: string;
    userId: string;
    venueId: string;
    courtId: string;
    venueName: string;
    courtNumber: number;
    date: string;
    startTime: string;
    endTime: string;
    amount: number;
    status: 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    venueId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    status: 'available' | 'booked' | 'past';
    price: number;
}

export interface PricingSuggestion {
    id: string;
    type: 'increase' | 'decrease' | 'weekend_surcharge' | 'promo';
    reason: string;
    currentPrice: number;
    suggestedPrice: number;
    confidence: number;
}

// ─── Redux State Types ─────────────────────────────────────

export interface AuthState {
    user: AuthUser | null;
    isLoggedIn: boolean;
    registeredUsers: User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface CourtsFilters {
    area: string;
    maxPrice: number;
    minRating: number;
    amenities: string[];
    showAcademies: boolean;
    showCourts: boolean;
}

export interface CourtsState {
    venuesList: Venue[];
    searchQuery: string;
    filters: CourtsFilters;
    sortBy: 'rating' | 'price_low' | 'price_high' | 'name';
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface BookingState {
    bookingsList: Booking[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface ReviewState {
    reviewsList: Review[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface WishlistState {
    items: Record<string, string[]>;
}

export interface RootState {
    auth: AuthState;
    courts: CourtsState;
    bookings: BookingState;
    reviews: ReviewState;
    wishlist: WishlistState;
}