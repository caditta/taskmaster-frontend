import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal'; // Componente para el modal
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/tasklist.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        fetchTasks(); // Llama a fetchTasks al montar el componente
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // Obtén el rol del usuario desde localStorage
        const userId = localStorage.getItem('userId'); // Obtén el userId desde localStorage

        if (!token || !role || !userId) {
            console.error("Faltan datos en el localStorage (token, role, userId)");
            return; // Salimos si falta algún dato
        }

        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Filtra las tareas dependiendo del rol
            let filteredTasks = response.data;
            if (role !== 'admin') { // Si el usuario no es admin, filtra las tareas por el assigned_to
                
                filteredTasks = filteredTasks.filter(tasks => tasks.assigned_to === userId); 
            
            }

            console.log('Tareas obtenidas:', filteredTasks);
            setTasks(filteredTasks);
            setFilteredTasks(filteredTasks); // Actualiza las tareas filtradas

        } catch (error) {
            console.error('Error al obtener tareas:', error);
        }
    };

    const handleShowModal = (task) => {
        setCurrentTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentTask(null);
    };

    const handleTaskUpdated = () => {
        fetchTasks(); // Actualiza las tareas después de que se ha guardado el estado
        handleCloseModal(); // Cierra el modal
    };

    // Filtrar las tareas por su estado
    const filterTasks = (status) => {
        const filtered = tasks.filter(task => task.status === status);
        setFilteredTasks(filtered);
    };

    // Renderizar las tarjetas de tareas según el estado
    const renderTaskCards = (status) => {
        const tasksToRender = filteredTasks.filter(task => task.status === status);

        if (tasksToRender.length === 0) {
            return <p>No hay tareas en esta categoría.</p>; // Mensaje si no hay tareas
        }

        return (
            <div className="row">
                {tasksToRender.map(task => (
                    <div className="col-md-4 mb-4" key={task.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className={`card-title ${task.status === 'pending' ? 'text-warning' : task.status === 'in_progress' ? 'text-info' : task.status === 'completed' ? 'text-success' : task.status === 'cancelled' ? 'text-secondary' : 'text-danger'}`}>
                                    {task.title}
                                </h5>
                                <p className="card-text">{task.description}</p>
                                <button className="btn btn-primary" onClick={() => handleShowModal(task)}>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Renderizar tareas vencidas
    const renderExpiredTasks = () => {
        const now = new Date();
        const expiredTasks = tasks.filter(task => new Date(task.due_date) < now); // Filtra tareas vencidas

        if (expiredTasks.length === 0) {
            return <p>No hay tareas vencidas.</p>; // Mensaje si no hay tareas vencidas
        }

        return (
            <div className="row">
                {expiredTasks.map(task => (
                    <div className="col-md-4 mb-4" key={task.id}>
                        <div className="card bg-light">
                            <div className="card-body">
                                <h5 className="card-title text-danger">{task.title}</h5>
                                <p className="card-text">{task.description}</p>
                                <p className="text-danger">Estado: Vencida</p> {/* Indica que está vencida */}
                                <button className="btn btn-primary" onClick={() => handleShowModal(task)}>
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleRefresh = () => {
        fetchTasks(); // Vuelve a obtener las tareas
    };

    return (
        <div className="container mt-4">
            <h2>Tareas</h2>
            <div className="mb-4">
                <div className="mb-2">
                    <button className="btn btn-info" onClick={() => filterTasks('pending')}>Pendientes</button>
                    <button className="btn btn-info" onClick={() => filterTasks('in_progress')}>En Progreso</button>
                    <button className="btn btn-info" onClick={() => filterTasks('completed')}>Completadas</button>
                    <button className="btn btn-info" onClick={() => filterTasks('cancelled')}>Canceladas</button>
                    <button className="btn btn-info" onClick={() => setFilteredTasks(tasks)}>Ver Todas</button>
                </div>
                <button className="btn btn-warning" onClick={handleRefresh}>Actualizar Vista</button> {/* Botón para actualizar */}
            </div>
            <h4 className="mt-4">Pendientes</h4>
            {renderTaskCards('pending')}
            <h4 className="mt-4">En Progreso</h4>
            {renderTaskCards('in_progress')}
            <h4 className="mt-4">Completadas</h4>
            {renderTaskCards('completed')}
            <h4 className="mt-4">Canceladas</h4>
            {renderTaskCards('cancelled')}
            <h4 className="mt-4">Tareas Vencidas</h4>
            {renderExpiredTasks()} {/* Renderiza tareas vencidas */}

            {/* Modal para mostrar detalles de la tarea */}
            {showModal && <TaskModal task={currentTask} onClose={handleCloseModal} onTaskUpdated={handleTaskUpdated} />}
        </div>
    );
};

export default TaskList;
