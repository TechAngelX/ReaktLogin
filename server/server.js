const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');
const app = express();

// Load environment variables from .env_reactlogin
require('dotenv').config({ path: '/Users/xeon2035/Documents/LOCALDEV/CONFIG_ENVS/node/.env_reactlogin' });

// Configure database connection using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_SERVER + '/' + process.env.DB_DATABASE
};

const PORT = process.env.PORT || 5503; // Use the PORT from environment variables or default to 5503

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT * FROM USER_ACC WHERE USERNAME = :username AND PWORD = :password`,
            [username, password],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
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

        const result = await connection.execute('SELECT * FROM USER_ACC');

        res.json(result.rows);
    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).send('Database connection error');
    } finally {
        if (connection) {
            try {
                await connection.close();
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
