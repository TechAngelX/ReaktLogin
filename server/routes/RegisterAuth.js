const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Email domains
const emailStudDomain = "@std.techangelx.ac.uk";
const emailStaffDomain = "@techangelx.ac.uk";

// Generate a unique username
function generateAcctUsername(fname, lname) {
    const firstInitial = fname ? fname.charAt(0).toLowerCase() : '';
    const lastFour = lname.length >= 5 ? lname.substring(0, 5).toLowerCase() : lname.toLowerCase();
    let randomNumbers;
    do {
        randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    } while (randomNumbers.startsWith('1') || randomNumbers.startsWith('0'));
    return firstInitial + lastFour + randomNumbers;
}

// Handle POST request for registration
router.post('/', async (req, res) => {
    console.log("Received registration request:", req.body);

    const { fname, lname, pword, pwordConfirm, accType, awardname, programme, staffrole, dept } = req.body;

    if (pword !== pwordConfirm) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Successfully connected to the database with config:", dbConfig);

        const username = generateAcctUsername(fname, lname);

        // Check if the username already exists
        const userCheck = await connection.execute(
            `SELECT USERNAME FROM USER_ACC WHERE USERNAME = :username`,
            [username],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(pword, 10);

        // Determine the email domain based on the account type
        const email = accType === '1' ? generateAcctUsername(fname, lname) + emailStudDomain.toLowerCase() :
            accType === '2' ? generateAcctUsername(fname, lname) + emailStaffDomain.toLowerCase() :
                null;

        if (!email) {
            return res.status(400).json({ message: 'Invalid account type' });
        }

        // Insert the new user into USER_ACC table
        const result = await connection.execute(
            `INSERT INTO USER_ACC (USERNAME, PWORD, FNAME, LNAME, EMAIL, ACCTYPEID) 
            VALUES (:username, :pword, :fname, :lname, :email, :accType)`,
            [username, hashedPassword, fname, lname, email, accType],
            { autoCommit: true }
        );

        const userId = result.lastRowid; // Get the generated USERID

        if (accType === '1') { // Student
            await connection.execute(
                `INSERT INTO STUDENT (STUDENTID, FNAME, LNAME, EMAIL, PROGID, DEGREETYPEID, STUDYLEVELID, DEPTID, AWARDNAME, USERID) 
                VALUES (TO_NUMBER('2' || student_id_seq.NEXTVAL), :fname, :lname, :email, :programme, :degreeTypeId, :studyLevelId, :dept, :awardname, :userId)`,
                [fname, lname, email, programme, /* degreeTypeId */, /* studyLevelId */, /* deptId */, awardname, userId],
                { autoCommit: true }
            );
        } else if (accType === '2') { // Staff
            await connection.execute(
                `INSERT INTO STAFF (STAFFID, STAFFROLEID, EMAIL, FNAME, LNAME, DEPTID, USERID) 
                VALUES (generate_staff_id(:fname, :lname), :staffrole, :email, :fname, :lname, :dept, :userId)`,
                [staffrole, email, fname, lname, dept, userId],
                { autoCommit: true }
            );
        }

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
