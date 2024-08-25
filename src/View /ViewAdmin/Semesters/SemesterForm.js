import React, { useState } from 'react';

const SemesterForm = ({ onAddSemester }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [academicYear, setAcademicYear] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSemester = {
            name,
            startDate,
            endDate,
            academicYear
        };
        onAddSemester(newSemester);
        setName('');
        setStartDate('');
        setEndDate('');
        setAcademicYear('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Academic Year:</label>
                <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Semester</button>
        </form>
    );
};

export default SemesterForm;
