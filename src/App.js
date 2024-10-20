import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/register';
import Login from './pages/login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                {/* Otras rutas pueden ir aquí */}
            </Routes>
        </Router>
    );
};

export default App;
