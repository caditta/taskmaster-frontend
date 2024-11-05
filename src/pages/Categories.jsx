// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');

    // Cargar categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/categories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
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

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/categories',
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('Categoría creada exitosamente');
            setName('');
            // Volver a cargar las categorías
            const response = await axios.get('http://localhost:5000/api/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            setMessage('Error al crear la categoría. Verifica los datos ingresados.');
        }
    };

    const handleToggleStatus = async (category) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = !category.is_active; // Cambiar el estado
            await axios.patch(`http://localhost:5000/api/categories/${category.id}/status`, {
                isActive: newStatus,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Actualizar la lista de categorías con el nuevo estado
            setCategories(categories.map(cat => 
                cat.id === category.id ? { ...cat, is_active: newStatus } : cat
            ));
            setMessage(`Categoría ${newStatus ? 'habilitada' : 'deshabilitada'} exitosamente`);
        } catch (error) {
            console.error('Error al actualizar el estado de la categoría:', error);
            setMessage('Error al actualizar el estado de la categoría.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Categorías</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre de la Categoría:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Agregar Categoría</button>
            </form>
            <h3 className="mt-4">Categorías Existentes</h3>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {category.name} - {category.is_active ? 'Habilitada' : 'Deshabilitada'}
                        <button 
                            className={`btn ${category.is_active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(category)}
                        >
                            {category.is_active ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
