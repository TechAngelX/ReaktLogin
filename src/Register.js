import React, { useEffect, useState } from 'react';
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
    const [awards, setAwards] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [staffRoles, setStaffRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedAward, setSelectedAward] = useState('');
    const [selectedAccType, setSelectedAccType] = useState('');

    useEffect(() => {
        // Fetch staff roles
        fetch("/data/staffchoices.json") // Adjust the path based on your setup
            .then(response => response.json())
            .then(data => setStaffRoles(data))
            .catch(error => console.error('Error fetching staff roles:', error));

        // Fetch departments
        fetch("/data/deptchoices.json") // Adjust the path based on your setup
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.error('Error fetching departments:', error));

        // Fetch student awards and programmes
        fetch("/data/studentchoices.json") // Adjust the path based on your setup
            .then(response => response.json())
            .then(data => {
                setAwards(data.map(item => ({ AWARDNAME: item.AWARDNAME })));
                setProgrammes(data);
            })
            .catch(error => console.error('Error fetching student choices:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form submission logic here
        console.log({
            fname,
            lname,
            pword,
            accType,
            awardname,
            programme,
            staffrole,
            dept,
        });
    };

    const handleAccTypeChange = (e) => {
        setSelectedAccType(e.target.value);
        setAccType(e.target.value);
    };

    const handleAwardChange = (e) => {
        setSelectedAward(e.target.value);
        setAwardname(e.target.value);
    };

    return (
        <div className="container form-container">
            <div className="form-box">
                <h1 className="text-center">Univ-DB</h1>
                <form id="registrationForm" onSubmit={handleSubmit}>
                    <h3 className="text-center">Registration</h3>
                    <p className="text-center">Please complete the form to create an account</p>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="fname"><strong>First Name:</strong></label>
                            <input
                                className="form-control"
                                type="text"
                                name="fname"
                                id="fname"
                                placeholder="Enter your first name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="lname"><strong>Last Name:</strong></label>
                            <input
                                className="form-control"
                                type="text"
                                name="lname"
                                id="lname"
                                placeholder="Enter your last name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="pword"><strong>Password:</strong></label>
                            <input
                                className="form-control"
                                type="password"
                                name="pword"
                                id="pword"
                                placeholder="Enter your password"
                                value={pword}
                                onChange={(e) => setPword(e.target.value)}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="pwordConfirm"><strong>Confirm Password:</strong></label>
                            <input
                                className="form-control"
                                type="password"
                                name="pwordConfirm"
                                id="pwordConfirm"
                                placeholder="Confirm your password"
                                value={pwordConfirm}
                                onChange={(e) => setPwordConfirm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="accType">Register as:</label>
                        <select
                            className="form-control"
                            id="accType"
                            name="accType"
                            required
                            value={accType}
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
                                    value={awardname}
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
                                <select
                                    className="form-control"
                                    id="programme"
                                    name="programme"
                                    value={programme}
                                    onChange={(e) => setProgramme(e.target.value)}
                                >
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
                                <label htmlFor="staffrole">Staff Role:</label>
                                <select
                                    className="form-control"
                                    id="staffrole"
                                    name="staffrole"
                                    value={staffrole}
                                    onChange={(e) => setStaffrole(e.target.value)}
                                >
                                    <option value="">Select Role</option>
                                    {staffRoles.map(role => (
                                        <option key={role.STAFFROLEID} value={role.STAFFROLEID}>
                                            {role.STAFFROLENAME}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="dept">Department:</label>
                                <select
                                    className="form-control"
                                    id="dept"
                                    name="dept"
                                    value={dept}
                                    onChange={(e) => setDept(e.target.value)}
                                >
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

                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
