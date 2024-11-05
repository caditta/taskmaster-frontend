// src/pages/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [editingUser, setEditingUser] = useState(null); // Estado para manejar el usuario a editar
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Error al cargar los usuarios.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setAlertMessage('Usuario eliminado correctamente');
                setAlertType('success');
                setUsers(users.filter(user => user.id !== id));
            }

        } catch (err) {
            if (err.response && err.response.data.message) {
                setAlertMessage(err.response.data.message);
                setAlertType('danger');
            } else {
                setAlertMessage('Error al eliminar el usuario.');
                setAlertType('danger');
            }
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUsername(user.username);
        setPassword(''); // Limpiar el campo de contraseña
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { username, password };

            const response = await axios.put(`http://localhost:5000/api/users/users/${editingUser.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setAlertMessage('Usuario actualizado correctamente');
                setAlertType('success');
                // Actualizamos la lista de usuarios con los nuevos datos
                setUsers(users.map(user => user.id === editingUser.id ? { ...user, username, password: password || editingUser.password } : user));
                setEditingUser(null); // Cerrar el modal
            }
        } catch (err) {
            setAlertMessage('Error al actualizar el usuario.');
            setAlertType('danger');
        }
    };

    // Redirigir a la lista de usuarios después de mostrar la alerta
    useEffect(() => {
        if (alertMessage) {
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        }
    }, [alertMessage, navigate]);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                    {alertMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <h2>Lista de Usuarios</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)} className="btn btn-warning me-2">
                                    Editar
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para editar usuario */}
            {editingUser && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editUserModalLabel">Editar Usuario</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEditingUser(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateUser}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Dejar vacío para no cambiar"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Actualizar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
