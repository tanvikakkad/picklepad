import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import AuthPage from '../pages/AuthPage';
import HomePage from '../pages/HomePage';
import CourtDetailPage from '../pages/CourtDetailPage';

// Lazy-loaded pages
const PlayerDashboardPage = lazy(() => import('../pages/PlayerDashboardPage'));
const OwnerDashboardPage = lazy(() => import('../pages/OwnerDashboardPage'));

function SuspenseWrapper({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
            {children}
        </Suspense>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/venue/:id" element={<CourtDetailPage />} />
            <Route path="/court/:id" element={<CourtDetailPage />} />
            <Route
                path="/dashboard/player"
                element={
                    <ProtectedRoute allowedRoles={["player"]}>
                        <SuspenseWrapper>
                            <PlayerDashboardPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/owner"
                element={
                    <ProtectedRoute allowedRoles={["owner"]}>
                        <SuspenseWrapper>
                            <OwnerDashboardPage />
                        </SuspenseWrapper>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}
