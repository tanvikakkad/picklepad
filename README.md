# PicklePad

A React web app for discovering and booking pickleball courts. Players can explore venues, book courts, manage bookings, and save favourites. Venue owners can manage their venues, view bookings, get pricing suggestions, and track revenue.

## Features

- **Explore** — Browse venues by area, price, and amenities; view court details and availability.
- **Player dashboard** — Upcoming, completed, and cancelled bookings; total spent; favourite area; wishlist.
- **Owner dashboard** — Venues (add, edit, delete, publish); bookings with venue/status filters; pricing suggestions; revenue and per-venue breakdown.
- **Auth** — Login and register as player or owner (mock auth).

## Tech stack

- **React 19** + **TypeScript**
- **Vite** — build and dev server
- **React Router** — routing
- **Redux Toolkit** — state (auth, courts, bookings, wishlist)
- **Tailwind CSS** — styling
- **react-hot-toast** — notifications

## Getting started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Install and run

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project structure

| Path | Description |
|------|-------------|
| `src/pages/` | Page components (Home, Auth, CourtDetail, **PlayerDashboardPage**, **OwnerDashboardPage**) |
| `src/components/dashboard/` | StatCard, PricingSuggestionCard, AddCourtForm |
| `src/components/shared/` | Navbar, EmptyState, ProtectedRoute, LoadingSpinner |
| `src/store/slices/` | authSlice, courtSlice, bookingSlice, wishlistSlice |
| `src/hooks/` | useAuth, usePricingSuggestions, useSlots, useBooking |
| `src/utils/` | mockData, pricingEngine, generateSlots |
| `src/routes/AppRoutes.tsx` | Route definitions |

## Key routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home — explore venues |
| `/login`, `/register` | Public | Auth |
| `/venue/:id`, `/court/:id` | Public | Venue/court detail and booking |
| `/dashboard/player` | Player | Player dashboard (bookings, wishlist, stats) |
| `/dashboard/owner` | Owner | Owner dashboard (venues, bookings, pricing, revenue) |

## Dashboards

- **Player** (`/dashboard/player`) — Stats: total bookings, upcoming, total spent, favourite area. Tabs: Upcoming, Completed, Cancelled, Wishlist. Uses `StatCard`, `BookingCard`, `CourtCard`, `EmptyState`.
- **Owner** (`/dashboard/owner`) — Stats: venues, courts, revenue, bookings, avg rating. Tabs: My Venues, Bookings, Pricing Suggestions, Revenue. Venue CRUD, booking filters, pricing suggestions from `usePricingSuggestions`/`pricingEngine`, revenue breakdown. Responsive layout and empty states throughout.

## License

Private project.
