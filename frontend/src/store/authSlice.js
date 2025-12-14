import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: localStorage.getItem('username') || null,
        token: localStorage.getItem('token') || null
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload.username;
            state.token = action.payload.token;
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('username');
            localStorage.removeItem('token');
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;