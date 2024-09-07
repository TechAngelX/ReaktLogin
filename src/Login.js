import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                onLogin(); // Call onLogin if login is successful
            } else {
                if (result.message === 'Invalid username or password') {
                    setError('Invalid username or password. Please try again.');
                } else {
                    setError(result.message || 'An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('NOW WHAT DA FUCK@ error');
        }

    };

    return (
        <div className="container form-container">
            <div className="form-box">
                <h1 className="text-center"><b>Login</b></h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input
                            className="form-control"
                            type="text"
                            name="username"
                            id="username"
                            required
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            id="password"
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="form-group">
                            <p className="text-danger">{error}</p>
                        </div>
                    )}

                    <button className="btn btn-primary btn-block" type="submit">Login</button>
                </form>

                <p className="text-center mt-3">
                    <a href="/register">Don't have an account? Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
