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
    console.log("---------------------------------------------------------------- ");
    console.log("Login request received:", req.body);
    const { username, password } = req.body;







    let connection;


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
                res.status(401).json({ message: 'Username or password incorrect.' });
            }
        } else {
            res.status(401).json({ message: 'Username or password incorrect.' });
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

module.exports = router;
