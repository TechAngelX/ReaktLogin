const oracledb = require('oracledb');

// Load environment variables from the .env_reactlogin file
require('dotenv').config({ path: '/Users/xeon2035/Documents/LOCALDEV/CONFIG_ENVS/node/.env_reactlogin' });

// Confirm that environment variables are being loaded correctly
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_CONNECT_STRING:', process.env.DB_CONNECT_STRING);

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING  // Use the connection string directly from .env
};

console.log('Database configuration:', dbConfig); // Verify the configuration

async function testConnection() {
    let connection;

    try {
        // Attempt to connect to the Oracle database
        connection = await oracledb.getConnection(dbConfig);
        console.log('Successfully connected to the Oracle database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        // Close the connection if it was successfully established
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed successfully');
            } catch (err) {
                console.error('Error closing the database connection:', err);
            }
        }
    }
}

// Run the connection test
testConnection();
