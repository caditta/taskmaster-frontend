// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: !!localStorage.getItem('token'), // inicializar basado en el token en localStorage
    userRole: null, // Inicializa el rol como null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated; // Ajusta el estado de autenticación
            state.userRole = action.payload.role; // Almacena el rol del usuario
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userRole = null; // Limpia el rol al cerrar sesión
            localStorage.removeItem('token'); // eliminar el token al cerrar sesión
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
