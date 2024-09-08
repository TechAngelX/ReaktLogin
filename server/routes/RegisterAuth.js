import React, { useState, useEffect } from 'react';
import './App.css';

function Register() {
    const [awards, setAwards] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [staffRoles, setStaffRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedAward, setSelectedAward] = useState('');
    const [selectedAccType, setSelectedAccType] = useState('');

    // Fetch data from JSON files
    useEffect(() => {
        fetch('/data/awards.json')
            .then(response => response.json())
            .then(data => setAwards(data));

        fetch('/data/programmes.json')
            .then(response => response.json())
            .then(data => setProgrammes(data));

        fetch('/data/staffRoles.json')
            .then(response => response.json())
            .then(data => setStaffRoles(data));

        fetch('/data/departments.json')
            .then(response => response.json())
            .then(data => setDepartments(data));
    }, []);

    const handleAccTypeChange = (e) => {
        setSelectedAccType(e.target.value);
    };

    const handleAwardChange = (e) => {
        setSelectedAward(e.target.value);
    };

    return (
        <div className="container form-container">
            <div className="form-box">
                <h1 className="text-center">Univ-DB</h1>
                <form id="registrationForm">
                    <h3 className="text-center">Registration</h3>
                    <p className="text-center">Please complete the form to create an account</p>

                    {/* Other form fields */}

                    <div className="form-group">
                        <label htmlFor="accType">Register as:</label>
                        <select
                            className="form-control"
                            id="accType"
                            name="accType"
                            required
                            onChange={handleAccTypeChange}
                        >
                            <option value="">Select User Type</option>
                            <option value="1">Student</option>
                            <option value="2">Staff</option>
                        </select>
                    </div>

                    {selectedAccType === '1' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="award">Award:</label>
                                <select
                                    className="form-control"
                                    id="award"
                                    name="awardname"
                                    onChange={handleAwardChange}
                                >
                                    <option value="">Select Award</option>
                                    {awards.map((award, index) => (
                                        <option key={index} value={award.AWARDNAME}>
                                            {award.AWARDNAME}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="programme">Programme:</label>
                                <select className="form-control" id="programme" name="programme">
                                    <option value="">Select Programme</option>
                                    {programmes
                                        .filter(prog => prog.AWARDNAME === selectedAward)
                                        .map(prog => (
                                            <option key={prog.PROGID} value={prog.PROGID}>
                                                {prog.PROGNAME}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </>
                    )}

                    {selectedAccType === '2' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="staffrole">Staff Bole:</label>
                                <select className="form-control" id="staffrole" name="staffrole">
                                    <option value="">Select Role</option>
                                    {staffRoles.map(role => (
                                        <option key={role.STAFFROLEID} value={role.STAFFROLEID}>
                                            {role.STAFFROLENAME}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dept">DeFartment:</label>
                                <select className="form-control" id="dept" name="dept">
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.DEPTID} value={dept.DEPTID}>
                                            {dept.DEPTNAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary btn-block">FUCKYAMAMARegister</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
