import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { login, logout } from '../store/slices/authSlice';
import { registerUserAsync } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';
import type { RootState } from '../types';

interface LoginResult {
    success: boolean;
    error?: string;
    role?: string;
}

interface RegisterParams {
    name: string;
    email: string;
    password: string;
    role: 'player' | 'owner';
    phone?: string;
}

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoggedIn, registeredUsers } = useSelector((state: RootState) => state.auth);

    const handleLogin = useCallback(
        (email: string, password: string): LoginResult => {
            const matchedUser = registeredUsers.find(
                (u) => u.email === email && u.password === password
            );
            if (!matchedUser) {
                return { success: false, error: 'Invalid email or password' };
            }
            dispatch(login({ email, password }));
            return { success: true, role: matchedUser.role };
        },
        [dispatch, registeredUsers]
    );

    const handleRegister = useCallback(
        ({ name, email, password, role, phone }: RegisterParams): LoginResult => {
            const exists = registeredUsers.some((u) => u.email === email);
            if (exists) {
                return { success: false, error: 'An account with this email already exists' };
            }
            dispatch(registerUserAsync({ name, email, password, role, phone }));
            return { success: true, role };
        },
        [dispatch, registeredUsers]
    );

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return {
        user,
        isLoggedIn,
        isPlayer: user?.role === 'player',
        isOwner: user?.role === 'owner',
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };
}

