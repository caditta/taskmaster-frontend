// src/pages/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
// import { login, setAuth } from '../slices/authSlice';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Hook para despachar acciones

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });
            setMessage('Inicio de sesión exitoso');
            setIsError(false);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                dispatch(setAuth(true)); // Establecer autenticación a true
                dispatch(setAuth({ isAuthenticated: true, role: response.data.role }));
                navigate('/dashboard');
            } else {
                setMessage('No se recibió el token del servidor');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error al iniciar sesión. Verifica tus credenciales.');
            }
            setIsError(true);
        }
        
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            {message && <p className={isError ? 'error-message' : ''}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
