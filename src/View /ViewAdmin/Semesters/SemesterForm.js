import React, { useState, useEffect } from 'react';

const SemesterForm = ({ onAddSemester, editingSemester }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [academicYear, setAcademicYear] = useState('');

    useEffect(() => {
        if (editingSemester) {
            setName(editingSemester.name);
            setStartDate(editingSemester.startDate);
            setEndDate(editingSemester.endDate);
            setAcademicYear(editingSemester.academicYear);
        } else {
            setName('');
            setStartDate('');
            setEndDate('');
            setAcademicYear('');
        }
    }, [editingSemester]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const semester = { name, startDate, endDate, academicYear };
        onAddSemester(semester);
        setName('');
        setStartDate('');
        setEndDate('');
        setAcademicYear('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div>
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div>
                <label>Academic Year</label>
                <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required />
            </div>
            <button type="submit">{editingSemester ? 'Update Semester' : 'Add Semester'}</button>
        </form>
    );
};

export default SemesterForm;
