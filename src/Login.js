import React, { useState } from 'react';
import './App.css'; // Assuming you want to use App.css for styling

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5503/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });

            if (response.ok) {
                onLogin(); // Notify parent component of successful login
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid username or password');
            }
        } catch (err) {
            setError('Error occurred. Data not sent to database.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="text-center mt-3">
                <a href="./register">Don't have an account? Register here</a>
            </div>
        </div>
    );
};

export default Login;
