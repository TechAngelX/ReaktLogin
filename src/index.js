import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css'; // Import your CSS file if needed
import Login from './Login';
import Register from './Register';
import reportWebVitals from './reportWebVitals';

// Define the Home component directly in this file
const Home = () => {
    return (
        <div className="container">
            <div className="welcome-box">
                <h1 className="text-center">Welcome to Uni-DB Application, the University login marking academic portal</h1>
                <p className="text-center">Please choose an option:</p>
                <div className="text-center">
                    <Link className="btn btn-primary" to="/login">Login</Link>
                    <Link className="btn btn-secondary" to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

// Render the Home component and set up routing
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

reportWebVitals();
