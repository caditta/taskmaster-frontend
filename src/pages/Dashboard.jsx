// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ListTask from './ListTask'; // Asegúrate de que el nombre del archivo es correcto
import CreateTask from './createTask'; // Importar el componente para crear tareas

const Dashboard = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRole = useSelector((state) => state.auth.userRole);
    const navigate = useNavigate();
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [showCreateTask, setShowCreateTask] = useState(false); // Estado para mostrar el formulario de crear tarea

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Elimina el token al cerrar sesión
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'tasks':
                // return <ListTask />; // Renderiza el componente de gestión de tareas
            case 'createTask':
                return <CreateTask onClose={() => setShowCreateTask(false)} />; // Muestra el formulario para crear tarea
            case 'home':
            default:
                return <h1>Bienvenido al Dashboard</h1>;
        }
    };

    const goToHome = () => {
        setActiveTab('home');
        navigate('/dashboard');
    };

    const toggleSubMenu = () => {
        setIsSubMenuVisible(!isSubMenuVisible);
    };

    return (
        <div className="d-flex">
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
                        <li className="nav-item">
                            <button className="nav-link" onClick={goToHome}>
                                {isMenuExpanded ? 'Inicio' : '🏠'}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-start" onClick={toggleSubMenu}>
                                {isMenuExpanded ? 'Gestionar Tareas' : '📋'}
                            </button>
                            {isSubMenuVisible && (
                                <ul className="nav flex-column ms-3">
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={() => { setShowCreateTask(true); setActiveTab('createTask'); }}>
                                            {isMenuExpanded ? 'Crear Tarea' : '➕'}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={() => { setActiveTab('tasks'); }}>
                                            {isMenuExpanded ? 'Visualizar Tareas' : '👁️'}
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#perfil">
                                {isMenuExpanded ? 'Perfil' : '👤'}
                            </a>
                        </li>
                        {userRole === 'admin' && (
                            <li className="nav-item">
                                <a className="nav-link" href="#configuracion">
                                    {isMenuExpanded ? 'Configuración' : '⚙️'}
                                </a>
                            </li>
                        )}
                        <li className="nav-item">
                            <button className="nav-link btn btn-link text-start" onClick={handleLogout}>
                                {isMenuExpanded ? 'Logout' : '🚪'}
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            <div className="p-4" style={{ flex: 1 }}>
                {showCreateTask ? <CreateTask onClose={() => setShowCreateTask(false)} /> : renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
