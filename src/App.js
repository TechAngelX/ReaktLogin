import React, { useState } from 'react';
import LoginTest from './LoginTest'; // Adjust the path as necessary

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    return (
        <div>
            {!loggedIn ? (
                <LoginTest onLogin={handleLogin} />
            ) : (
                <h2>Welcome! You are logged in.</h2>
            )}
        </div>
    );
};

export default App;
