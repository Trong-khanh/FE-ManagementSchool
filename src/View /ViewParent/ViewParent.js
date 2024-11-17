import React, { useState, useEffect, useCallback } from 'react';
import { getDailyScores, getSubjectsAverageScores } from '../../API /ParentAPI';
import './ViewParent.css';
import NavBarParent from "../NavBarParent";

const ViewParent = () => {
    const [studentName, setStudentName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [semesterType, setSemesterType] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [scores, setScores] = useState([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingAvg, setLoadingAvg] = useState(false);
    const [averageScores, setAverageScores] = useState([]);

    // Separate state for showing different tables
    const [showDailyScores, setShowDailyScores] = useState(false);
    const [showAverageScores, setShowAverageScores] = useState(false);

    // Fetch Daily Scores
    const fetchDailyScores = useCallback(async () => {
        if (!studentName || !academicYear) {
            setError('Please enter student name and academic year');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await getDailyScores(studentName, academicYear);
            if (result && Array.isArray(result) && result.length > 0) {
                setScores(result);
                setShowDailyScores(true);
                setShowAverageScores(false); // Hide average scores table
            } else {
                setError('No daily scores found');
                setScores([]);
            }
        } catch (error) {
            setError('Failed to fetch daily scores');
            setScores([]);
        } finally {
            setLoading(false);
        }
    }, [studentName, academicYear]);

    // Fetch Subject Average Scores
    const fetchAverageScores = useCallback(async () => {
        if (!studentName || !academicYear) {
            setError('Please enter student name and academic year');
            return;
        }

        setLoadingAvg(true);
        setError(null);
        try {
            const result = await getSubjectsAverageScores(studentName, academicYear);
            if (result && Array.isArray(result) && result.length > 0) {
                setAverageScores(result);
                setShowAverageScores(true);
                setShowDailyScores(false); // Hide daily scores table
            } else {
                setError('No average scores found');
                setAverageScores([]);
            }
        } catch (error) {
            setError('Failed to fetch average scores');
            setAverageScores([]);
        } finally {
            setLoadingAvg(false);
        }
    }, [studentName, academicYear]);

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
        filterScoresBySemester();
    }, [semesterType, searchQuery, scores, filterScoresBySemester]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
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

    const renderDailyScoresTable = () => {
        if (!showDailyScores) return null;

        return (
            <div className="scores-container">
                <h2>Daily Scores</h2>
                <div className="semester-filter">
                    <label>
                        Select Semester:
                        <select
                            value={semesterType}
                            onChange={(e) => setSemesterType(e.target.value)}
                        >
                            <option value="">All Semesters</option>
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
                        <p>No daily scores found for the selected criteria.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderAverageScoresTable = () => {
        if (!showAverageScores) return null;

        return (
            <div className="scores-container">
                <h2>Subject Average Scores</h2>
                <div className="average-scores-table">
                    {averageScores.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Semester 1 Average</th>
                                <th>Semester 2 Average</th>
                                <th>Annual Average</th>
                            </tr>
                            </thead>
                            <tbody>
                            {averageScores.map((avg, index) => (
                                <tr key={index}>
                                    <td>{avg.subjectName}</td>
                                    <td>{avg.semesterAverage1}</td>
                                    <td>{avg.semesterAverage2}</td>
                                    <td>{avg.annualAverage}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No average scores available.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="view-parent-container">
            <NavBarParent searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <h1 style={{ textAlign: 'center' }}>View Student Scores</h1>

            <form className="search-form">
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
                        Academic Year:
                        <input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="button-group">
                    <button
                        type="button"
                        onClick={fetchDailyScores}
                        disabled={loading}
                        className={showDailyScores ? 'active' : ''}
                    >
                        {loading ? 'Loading...' : 'View Daily Scores'}
                    </button>
                    <button
                        type="button"
                        onClick={fetchAverageScores}
                        disabled={loadingAvg}
                        className={showAverageScores ? 'active' : ''}
                    >
                        {loadingAvg ? 'Loading...' : 'View Average Scores'}
                    </button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="tables-container">
                {renderDailyScoresTable()}
                {renderAverageScoresTable()}
            </div>
        </div>
    );
};

export default ViewParent;