import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Resetear el mensaje

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });
            setMessage('Inicio de sesión exitoso');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            setMessage('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            {message && <p>{message}</p>}
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
