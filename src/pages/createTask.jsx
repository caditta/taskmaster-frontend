import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTask = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState(''); // Almacenar category_id
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]); // Lista de categorías
    const [message, setMessage] = useState('');

    // Traer la lista de usuarios para la asignación
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        fetchUsers();
    }, []);

    // Traer la lista de categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/enabled');
                setCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Asegúrate de que todos los campos requeridos estén llenos
        if (!title || assignedTo.length === 0 || !dueDate || !priority || !category) {
            setMessage('Por favor completa todos los campos requeridos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const createdBy = localStorage.getItem('userId'); // Obtén el ID del usuario desde localStorage
            await axios.post(
                'http://localhost:5000/api/tasks',
                {
                    title,
                    description,
                    assignedTo,
                    dueDate,
                    priority,
                    category_id: category, // Enviar category_id al backend
                    createdBy,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage('Tarea creada exitosamente');
            // Restablecer el formulario
            setTitle('');
            setDescription('');
            setAssignedTo([]);
            setDueDate('');
            setPriority('');
            setCategory('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            if (error.response) {
                setMessage(`Error: ${error.response.data.message}`); // Mensaje de error del servidor
            } else {
                setMessage('Error al crear la tarea. Verifica los datos ingresados.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Crear Tarea</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="assignedTo">Asignar a (selecciona uno o más):</label><br />
                    <select
                        id="assignedTo"
                        value={assignedTo}
                        onChange={(e) =>
                            setAssignedTo([...e.target.selectedOptions].map((option) => option.value))
                        }
                        multiple
                        className="form-control"
                        required
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Fecha de Vencimiento:</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Prioridad:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="alto">Alto</option>
                        <option value="medio">Medio</option>
                        <option value="bajo">Bajo</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Categoría:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} // category_id
                        className="form-control"
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}> {/* Usar cat.id como value */}
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Crear Tarea</button>
                <button type="button" onClick={onClose} className="btn btn-secondary mt-3 ml-2">Cancelar</button>
            </form>
        </div>
    );
};

export default CreateTask;
