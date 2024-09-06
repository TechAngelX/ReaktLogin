const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const configPath = require('../config/configPath'); // Import the configPath module

const app = express();

// Load environment variables from the file specified in configPath
const envFilePath = configPath.envPath;
if (fs.existsSync(envFilePath)) {
    require('dotenv').config({ path: envFilePath });
} else {
    console.error('Environment file not found:', envFilePath);
    process.exit(1);
}

// Log environment variables for debugging
console.log("Env file path: " + envFilePath);
console.log("Database User: " + process.env.DB_USER);
console.log("Database Password: " + process.env.DB_PASSWORD);
console.log("Database Connect String: " + process.env.DB_CONNECT_STRING);
console.log("Server Port: " + (process.env.PORT || 5503));

// Configure database connection using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Use the PORT from environment variables or default to 5503
const PORT = process.env.PORT || 5503;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    let connection;

    console.log("Login request received. Username: " + username);

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Successfully connected to the database with config:", dbConfig);

        // Actual login query
        const result = await connection.execute(
            `SELECT PWORD FROM USER_ACC WHERE USERNAME = :username`,
            [username],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        console.log("Actual query result:", result);

        if (result.rows.length > 0) {
            const hashedPassword = result.rows[0].PWORD;

            // Compare the plain password with the hashed password
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ message: 'Database connection error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("Database connection closed.");
            } catch (err) {
                console.error('Error closing the database connection:', err);
            }
        }
    }
});

// Data Route
app.get('/api/data', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Successfully connected to the database with config:", dbConfig);

        const result = await connection.execute('SELECT * FROM USER_ACC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).send('Database connection error');
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("Database connection closed.");
            } catch (err) {
                console.error('Error closing the database connection:', err);
            }
        }
    }
});

// Catch-all handler for any request that doesn't match the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
