// src/pages/TaskManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListTask = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks'); // Ajusta la URL según tu API
            setTasks(response.data);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tasks', { title, description, assignedTo: null, createdBy: 1 }); // Cambia 'createdBy' según tu lógica
            // fetchTasks(); // Vuelve a cargar las tareas después de agregar
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };

    return (
        <div>
            <h2>Gestión de Tareas</h2>
            
        </div>
    );
};

export default ListTask;
