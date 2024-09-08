const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const configPath = require('../config/configPath'); // Adjust path as needed

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
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));
app.use('/api/data', require('./routes/data'));

// Catch-all handler for any request that doesn't match the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
