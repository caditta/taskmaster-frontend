// TestComponent.jsx
import React, { useEffect, useState } from 'react';

const TestComponent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token en TestComponent:', token);
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div>
            {isAuthenticated ? <p>Usuario autenticado</p> : <p>No autenticado</p>}
        </div>
    );
};

export default TestComponent;
