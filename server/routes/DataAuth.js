const express = require('express');
const oracledb = require('oracledb');

const router = express.Router();

// Database configuration (import or define as needed)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

router.get('/', async (req, res) => {
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

module.exports = router;
