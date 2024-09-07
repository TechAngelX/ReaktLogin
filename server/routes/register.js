const express = require('express');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');

const router = express.Router();

// Database configuration (import or define as needed)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

router.post('/', async (req, res) => {
    console.log("Received registration request:", req.body);
    const { username, password } = req.body;
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Successfully connected to the database with config:", dbConfig);

        // Check if the username already exists
        const userCheck = await connection.execute(
            `SELECT USERNAME FROM USER_ACC WHERE USERNAME = :username`,
            [username],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (userCheck.rows.length > 0) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await connection.execute(
            `INSERT INTO USER_ACC (USERNAME, PWORD) VALUES (:username, :pword)`,
            [username, hashedPassword],
            { autoCommit: true }
        );

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error connecting to the database or registering user:', error);
        res.status(500).json({ message: 'Database connection error or registration failed' });
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

module.exports = router;
