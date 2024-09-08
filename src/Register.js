// src/Register.js
import React, { useState } from 'react';
import './App.css'; // Assuming you want to use App.css for styling

const Register = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [pword, setPword] = useState('');
    const [pwordConfirm, setPwordConfirm] = useState('');
    const [accType, setAccType] = useState('');
    const [awardname, setAwardname] = useState('');
    const [programme, setProgramme] = useState('');
    const [staffrole, setStaffrole] = useState('');
    const [dept, setDept] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5503/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fname,
                    lname,
                    pword,
                    pwordConfirm,
                    accType,
                    awardname,
                    programme,
                    staffrole,
                    dept
                }),
            });

            if (response.ok) {
                setSuccess('Registration successful');
                setError('');
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed');
                setSuccess('');
            }
        } catch (err) {
            setError('Error occurred. Data not sent to database.');
            console.error('Registration error:', err);
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fname">First Name:</label>
                    <input
                        type="text"
                        id="fname"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lname">Last Name:</label>
                    <input
                        type="text"
                        id="lname"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pword">Password:</label>
                    <input
                        type="password"
                        id="pword"
                        value={pword}
                        onChange={(e) => setPword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pwordConfirm">Confirm Password:</label>
                    <input
                        type="password"
                        id="pwordConfirm"
                        value={pwordConfirm}
                        onChange={(e) => setPwordConfirm(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="accType">Account Type:</label>
                    <select
                        id="accType"
                        value={accType}
                        onChange={(e) => setAccType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="1">Student</option>
                        <option value="2">Staff</option>
                    </select>
                </div>
                {accType === '1' && (
                    <>
                        <div>
                            <label htmlFor="awardname">Award:</label>
                            <input
                                type="text"
                                id="awardname"
                                value={awardname}
                                onChange={(e) => setAwardname(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="programme">Programme:</label>
                            <input
                                type="text"
                                id="programme"
                                value={programme}
                                onChange={(e) => setProgramme(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                {accType === '2' && (
                    <>
                        <div>
                            <label htmlFor="staffrole">Staff Role:</label>
                            <input
                                type="text"
                                id="staffrole"
                                value={staffrole}
                                onChange={(e) => setStaffrole(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="dept">Department:</label>
                            <input
                                type="text"
                                id="dept"
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">Register</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
            <div className="text-center mt-3">
                <a href="./login">Already have an account? Login here</a>
            </div>
        </div>
    );
};

export default Register;
