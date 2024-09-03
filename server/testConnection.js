
const oracledb = require('oracledb');

// Oracle Database configuration
const env = require('./env');

const dbConfig = env.dbConfig;
console.log(dbConfig);
async function testConnection() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Successfully connected to the Oracle database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the database connection:', err);
            }
        }
    }
}

testConnection();