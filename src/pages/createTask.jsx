import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTask = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const createdBy = localStorage.getItem('userId'); // o 'userId' si usas el ID
    // console.log(createdBy);

    //Traer la lista de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    //////////////////////////////////////////////////////////////////////////////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/tasks',
                {
                    title,
                    description,
                    assignedTo,
                    createdBy, // Agregar createdBy en la solicitud
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(title, description, assignedTo, createdBy);
            setMessage('Tarea creada exitosamente');
            setTitle('');
            setDescription('');
            setAssignedTo('');
        } catch (error) {
            console.log(title, description, assignedTo, createdBy)
            console.error('Error al crear la tarea:', error);
            setMessage('Error al crear la tarea. Verifica los datos ingresados.');
        }
    };

    return (
        <div>
            <h2>Crear Tarea</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="assignedTo">Asignar a:</label>
                    <select
                        id="assignedTo"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un usuario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.email} {/* Muestra el correo del usuario o cualquier otro identificador */}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Crear Tarea</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

export default CreateTask;
