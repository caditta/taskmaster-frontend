// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice'; // Acción para logout (si la tienes en Redux)

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Lógica para el logout, eliminando el token y cambiando el estado
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        dispatch(logout()); // Cambia el estado de autenticación
        navigate('/login'); // Redirige al login
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    TaskMaster
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/configuracion">
                                Configuración
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/tareas">
                                Tareas
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
