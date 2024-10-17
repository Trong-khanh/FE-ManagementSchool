import React, { useState } from 'react';
import { AddScore } from '../../API /TeacherAPI';
import Navbar2 from '../Navbar2';

const ViewScore = () => {
    const [studentId, setStudentId] = useState('');
    const [value, setValue] = useState('');
    const [semesterName, setSemesterName] = useState('');
    const [examType, setExamType] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const scoreDto = {
            studentId,
            value: parseFloat(value),
            semesterName,
            examType,
            academicYear,
        };

        try {
            await AddScore(scoreDto);
            setMessage('Score added successfully!');
            // Reset form
            setStudentId('');
            setValue('');
            setSemesterName('');
            setExamType('');
            setAcademicYear('');
        } catch (err) {
            setError('Failed to add score: ' + err.message);
        }
    };

    return (
        <div>
            <Navbar2 />
            <h2>Add Score</h2>
            <form onSubmit={handleSubmit} className="add-score-form">
                <label>
                    Student ID:
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Score (0-10):
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        min="0"
                        max="10"
                        required
                    />
                </label>
                <label>
                    Semester Name:
                    <input
                        type="text"
                        value={semesterName}
                        onChange={(e) => setSemesterName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Exam Type:
                    <input
                        type="text"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Academic Year:
                    <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Add Score</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ViewScore;
