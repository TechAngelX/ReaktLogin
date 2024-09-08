const oracledb = require('oracledb');
const fs = require('fs');
const configPath = require('../config/configPath'); // Import the configPath module

// Load environment variables from the file specified in configPath
const envFilePath = configPath.envPath;
if (fs.existsSync(envFilePath)) {
    require('dotenv').config({ path: envFilePath });
} else {
    console.error('Environment file not found:', envFilePath);
    process.exit(1);
}

async function testDBConnection() {
    let connection;

    const dbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING
    };

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Env file path: " + envFilePath);
        console.log("Database User: " + process.env.DB_USER);
        console.log("Database Password: " + process.env.DB_PASSWORD);
        console.log("Database Connect String: " + process.env.DB_CONNECT_STRING);
        console.log("Server Port: " + (process.env.PORT || 5503));

        console.log("\nSuccessfully connected to the database!".toUpperCase());

        // Generate a random color
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;

        // Insert a new record with a random color
        const insertQuery = `
            INSERT INTO UPDATEME (favecolour)
            VALUES (:favecolour)
        `;
        await connection.execute(
            insertQuery,
            [randomColor],
            { autoCommit: true }
        );

        console.log(`Inserted new record with color: ${randomColor}`);

    } catch (err) {
        console.error("Error connecting to the database:", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing the connection:", err);
            }
        }
    }
}

testDBConnection();
