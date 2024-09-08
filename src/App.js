import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Ensure Home is imported from the correct file */}
                <Route path="/login" element={<Login />} /> {/* Ensure paths are lowercase */}
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
