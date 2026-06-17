picklepad/
├── public/
│   └── vite.svg
│
├── src/
│   ├── main.tsx                         # React app entry point (M1)
│   ├── App.tsx                          # Root component — BrowserRouter + Toaster (M1)
│   ├── index.css                        # Global styles + Tailwind @imports (M1)
│   ├── vite-env.d.ts                    # Vite type reference (auto-generated)
│   │
│   ├── types/
│   │   └── index.ts                     # All TypeScript interfaces (M1)
│   │
│   ├── store/                           # Redux store (M1)
│   │   ├── index.ts                     # configureStore + localStorage sync
│   │   └── slices/
│   │       ├── authSlice.ts             # user, isLoggedIn, registeredUsers
│   │       ├── courtSlice.ts            # venuesList, searchQuery, filters, sortBy
│   │       ├── bookingSlice.ts          # bookingsList — add, cancel, complete
│   │       ├── reviewSlice.ts           # reviewsList — add reviews
│   │       └── wishlistSlice.ts         # items: { [userId]: venueId[] }
│   │
│   ├── hooks/                           # Custom React hooks (M1)
│   │   ├── useAuth.ts                   # login, register, logout helpers
│   │   ├── useSlots.ts                  # slot generation, selection, conflict check
│   │   ├── useBooking.ts                # createBooking, cancelBooking, queries
│   │   └── usePricingSuggestions.ts     # pricing engine hook wrapper
│   │
│   ├── utils/                           # Pure utility functions (M1)
│   │   ├── localStorage.ts             # loadState, saveState, removeState
│   │   ├── generateSlots.ts            # slot generation + booking conflict check
│   │   ├── pricingEngine.ts            # rule-based pricing suggestions
│   │   └── mockData.ts                 # seed data — 8 venues, 3 users, 5 bookings, 4 reviews
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx               # All route definitions + lazy loading (M1)
│   │
│   ├── components/
│   │   ├── shared/                      # Reusable UI components
│   │   │   ├── Navbar.tsx              # Top navigation bar (M2)
│   │   │   ├── ProtectedRoute.tsx      # Auth + role guard wrapper (M1)
│   │   │   ├── LoadingSpinner.tsx      # Loading state spinner (M1)
│   │   │   └── EmptyState.tsx          # Empty list placeholder (M1)
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx           # Login with React Hook Form + Yup (M1)
│   │   │   └── RegisterForm.tsx        # Register with role selection (M1)
│   │   │
│   │   ├── court/
│   │   │   ├── CourtCard.tsx           # Court listing card (M2)
│   │   │   ├── CourtFilters.tsx        # Filter sidebar (M2)
│   │   │   ├── SlotGrid.tsx            # Visual slot grid (M3)
│   │   │   └── AcademyBadge.tsx        # Academy indicator badge (M2)
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingSummary.tsx       # Selected slots + price summary (M3)
│   │   │   ├── BookingCard.tsx          # Booking item in dashboard (M4)
│   │   │   └── BookingReceipt.tsx       # Confirmation receipt modal (M3)
│   │   │
│   │   ├── review/
│   │   │   ├── ReviewList.tsx           # Reviews display list (M3)
│   │   │   ├── ReviewForm.tsx           # Submit review form (M3)
│   │   │   └── StarRating.tsx           # Interactive star selector (M3)
│   │   │
│   │   └── dashboard/
│   │       ├── StatCard.tsx             # Stats display card (M4)
│   │       ├── PricingSuggestionCard.tsx # Pricing recommendation card (M4)
│   │       └── AddCourtForm.tsx         # Add/edit venue modal form (M4)
│   │
│   └── pages/
│       ├── AuthPage.tsx                 # /login and /register (M1)
│       ├── HomePage.tsx                 # / — Court discovery (M2)
│       ├── CourtDetailPage.tsx          # /venue/:id — Detail + booking (M3)
│       ├── PlayerDashboardPage.tsx      # /dashboard/player (M4)
│       └── OwnerDashboardPage.tsx       # /dashboard/owner (M4)
│
├── .gitignore
├── index.html                           # Vite HTML entry — loads /src/main.tsx
├── package.json
├── tsconfig.json                        # TypeScript config (strict mode)
├── tsconfig.node.json                   # TS config for Vite/Node
├── tailwind.config.js                   # Tailwind theme customisation
├── postcss.config.js                    # PostCSS with Tailwind + Autoprefixer
├── vite.config.ts                       # Vite config with React plugin
├── eslint.config.js                     # ESLint flat config
├── newdevplan.md                        # This file
└── README.md
```