import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiGet, apiPost } from '../../services/api';
import type { AuthState, AuthUser, LoginPayload, User } from '../../types';

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
    return await apiGet<User[]>('/users');
});
export const registerUserAsync = createAsyncThunk(
    'auth/registerUser',
    async (params: { name: string; email: string; password: string; role: 'player' | 'owner'; phone?: string }) => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: params.name,
            email: params.email,
            password: params.password,
            role: params.role,
            phone: params.phone || '',
            createdAt: new Date().toISOString(),
        };
        return await apiPost<User>('/users', newUser);
    }
);

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    registeredUsers: [],
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<LoginPayload>) {
            const { email, password } = action.payload;
            const user = state.registeredUsers.find(
                (u) => u.email === email && u.password === password
            );
            if (user) {
                state.user = { id: user.id, name: user.name, email: user.email, role: user.role } as AuthUser;
                state.isLoggedIn = true;
            }
        },
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.registeredUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch users';
            })
            .addCase(registerUserAsync.fulfilled, (state, action) => {
                state.registeredUsers.push(action.payload);
                state.user = {
                    id: action.payload.id,
                    name: action.payload.name,
                    email: action.payload.email,
                    role: action.payload.role,
                };
                state.isLoggedIn = true;
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
