// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: !!localStorage.getItem('token'), // inicializar basado en el token en localStorage
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    
    reducers: {
        setAuth(state, action) {
            state.isAuthenticated = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            localStorage.removeItem('token'); // eliminar el token al cerrar sesión
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
