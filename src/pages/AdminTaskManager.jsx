import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminTaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks/tadmin', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTasks(response.data);
        } catch (err) {
            setError('Error al cargar las tareas.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setAlertMessage('Tarea eliminada correctamente');
                setAlertType('success');
                setTasks(tasks.filter(task => task.id !== id));
            }
        } catch (err) {
            setAlertMessage('Error al eliminar la tarea.');
            setAlertType('danger');
        }
    };

    if (loading) return <p>Cargando tareas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <h2>Gestión de Tareas (Admin)</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td>
                                {/* Botón para eliminar tarea */}
                                <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTaskManager;
