import React, { useState, useEffect, useCallback } from 'react';
import { getDailyScores } from '../../API /ParentAPI';
import './ViewParent.css';
import NavBarParent from "../NavBarParent";

const ViewParent = () => {
    const [studentName, setStudentName] = useState('');
    const [className, setClassName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [semesterType, setSemesterType] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [scores, setScores] = useState([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchScores = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getDailyScores(studentName, className, academicYear);
            setScores(result);
            setError(null);
        } catch (error) {
            setError('Failed to fetch scores');
            setScores([]);
        } finally {
            setLoading(false);
        }
    }, [studentName, className, academicYear]);

    const filterScoresBySemester = useCallback(() => {
        let filtered = scores;
        if (semesterType !== '') {
            filtered = filtered.filter(score => score.semesterType === parseInt(semesterType));
        }
        if (searchQuery) {
            filtered = filtered.filter(score =>
                score.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                score.scoreValue.toString().includes(searchQuery)
            );
        }
        setFilteredScores(filtered);
    }, [semesterType, searchQuery, scores]);

    useEffect(() => {
        if (studentName && className && academicYear) {
            fetchScores();
        }
    }, [studentName, className, academicYear, fetchScores]);

    useEffect(() => {
        filterScoresBySemester();
    }, [semesterType, searchQuery, scores, filterScoresBySemester]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchScores();
        setShowModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSemesterType('');
    };

    const examTypeMap = {
        0: "Test When Class Begins",
        1: "15 Minutes Test",
        2: "45 Minutes Test",
        3: "Semester Test",
    };

    const semesterTypeMap = {
        0: "Semester 1",
        1: "Semester 2",
    };

    return (
        <div className="view-parent-container">
            <NavBarParent searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <h1 style={{ textAlign: 'center' }}>View Student Scores</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Student Name:
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Class Name:
                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Academic Year:
                        <input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'View Scores'}
                </button>
            </form>

            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

            {showModal && (
                <div className="modal-container">
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <h2>Student Scores</h2>
                        <div className="semester-filter">
                            <label>
                                Select Semester:
                                <select
                                    value={semesterType}
                                    onChange={(e) => setSemesterType(e.target.value)}
                                >
                                    <option value="">Select Semester</option>
                                    <option value="0">Semester 1</option>
                                    <option value="1">Semester 2</option>
                                </select>
                            </label>
                        </div>
                        <div className="scores-table">
                            {filteredScores.length > 0 ? (
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Semester Type</th>
                                        <th>Exam Type</th>
                                        <th>Score</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredScores.map((score, index) => (
                                        <tr key={index}>
                                            <td>{score.subjectName}</td>
                                            <td>{semesterTypeMap[score.semesterType]}</td>
                                            <td>{examTypeMap[score.examType]}</td>
                                            <td>{score.scoreValue}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No scores found for the selected semester or search query.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewParent;
