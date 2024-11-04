// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
// import Navbar from './components/Navbar';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './AuthContext';
import './App.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                {/* <div className="container "> */}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                {/* </div> */}
            </Router>
        </AuthProvider>
    );
};

export default App;
