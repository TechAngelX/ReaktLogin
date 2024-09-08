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

router.post('/register', async (req, res) => {
    console.log("Received registration request:", req.body);

    // Extract fields from the request body
    const { fname, lname, pword, pwordConfirm, accType, awardname, programme, staffrole, dept } = req.body;

    // Check if passwords match
    if (pword !== pwordConfirm) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Successfully connected to the database with config:", dbConfig);

        // Check if the username already exists
        const username = generateAcctUsername(fname, lname);
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
        const hashedPassword = await bcrypt.hash(pword, 10);

        // Insert the new user into the database
        const result = await connection.execute(
            `INSERT INTO USER_ACC (USERNAME, PWORD, FNAME, LNAME, ACC_TYPE, AWARDNAME, PROGRAMME, STAFFROLE, DEPT) 
            VALUES (:username, :pword, :fname, :lname, :accType, :awardname, :programme, :staffrole, :dept)`,
            [username, hashedPassword, fname, lname, accType, awardname, programme, staffrole, dept],
            { autoCommit: true }
        );

        const userId = result.lastRowid; // Get the generated USERID

        if (accType === '1') { // Student
            await connection.execute(
                `INSERT INTO STUDENT (STUDENTID, FNAME, LNAME, EMAIL, PROGID, DEGREETYPEID, STUDYLEVELID, DEPTID, AWARDNAME, USERID) 
                VALUES (TO_NUMBER('2' || student_id_seq.NEXTVAL), :fname, :lname, :email, :progId, :degreeTypeId, :studyLevelId, :deptId, :awardName, :userId)`,
                [fname, lname, username + '@std.techangelx.ac.uk', programme, /* degreeTypeId */, /* studyLevelId */, /* deptId */, awardname, userId],
                { autoCommit: true }
            );
        } else if (accType === '2') { // Staff
            await connection.execute(
                `INSERT INTO STAFF (STAFFID, STAFFROLEID, EMAIL, FNAME, LNAME, DEPTID, USERID) 
                VALUES (generate_staff_id(:fname, :lname), :staffRoleId, :email, :fname, :lname, :deptId, :userId)`,
                [staffrole, username + '@techangelx.ac.uk', fname, lname, dept, userId],
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
