// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth.userRole); // Obtener el rol del usuario
    const navigate = useNavigate();
    const [isMenuExpanded, setIsMenuExpanded] = useState(true); // Estado para controlar el menú

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token al cerrar sesión
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    return (
        <div className="d-flex">
            {/* Menú lateral visible solo si el usuario está autenticado */}
            {isAuthenticated && (
                <div
                    className={`bg-light p-3 vh-100 ${isMenuExpanded ? 'expanded' : 'collapsed'}`}
                    style={{ width: isMenuExpanded ? '200px' : '80px', transition: 'width 0.3s' }}
                >
                    <button className="btn btn-primary mb-3" onClick={toggleMenu}>
                        {isMenuExpanded ? '⬅️' : '➡️'}
                    </button>
                    <h4 className={`text-center ${isMenuExpanded ? '' : 'd-none'}`}>Dashboard</h4>
                    <ul className="nav flex-column">
                        {userRole === 'admin' && ( // Mostrar solo para administradores
                            <li className="nav-item">
                                <a className="nav-link" href="#configuracion">
                                    {isMenuExpanded ? 'Configuración' : '⚙️'}
                                </a>
                            </li>
                        )}
                        <li className="nav-item">
                            <a className="nav-link" href="#tareas">
                                {isMenuExpanded ? 'Tareas' : '📋'}
                            </a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-start" onClick={handleLogout}>
                                {isMenuExpanded ? 'Logout' : '🚪'}
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Contenido principal del Dashboard */}
            <div className="p-4" style={{ flex: 1 }}>
                <h1>Dashboard</h1>
                {isAuthenticated ? <p>Usuario autenticado</p> : <p>No autenticado</p>}
            </div>
        </div>
    );
};

export default Dashboard;
