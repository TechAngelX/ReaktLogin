import React, { useState } from 'react';
import Login from './Login'; // Adjust the path as necessary

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    return (
        <div>
            {!loggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <h2>Welcome! You are logged in.</h2>
            )}
        </div>
    );
};

export default App;
