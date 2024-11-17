import React, { useState, useEffect, useCallback } from 'react';
import { getDailyScores, getSubjectsAverageScores, getAverageScores } from '../../API /ParentAPI';
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
    const [overallAverages, setOverallAverages] = useState(null);
    const [loadingOverall, setLoadingOverall] = useState(false);

    // State for showing different tables
    const [showDailyScores, setShowDailyScores] = useState(false);
    const [showAverageScores, setShowAverageScores] = useState(false);
    const [showOverallAverages, setShowOverallAverages] = useState(false);

    // Existing fetch functions remain the same...
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
                setShowAverageScores(false);
                setShowOverallAverages(false);
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
                setShowDailyScores(false);
                setShowOverallAverages(false);
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

    // New function to fetch overall averages
    const fetchOverallAverages = useCallback(async () => {
        if (!studentName || !academicYear) {
            setError('Please enter student name and academic year');
            return;
        }

        setLoadingOverall(true);
        setError(null);
        try {
            const result = await getAverageScores(studentName, academicYear);
            if (result && Array.isArray(result) && result.length > 0) {
                setOverallAverages(result[0]); // Taking first item since it's one record per student
                setShowOverallAverages(true);
                setShowDailyScores(false);
                setShowAverageScores(false);
            } else {
                setError('No overall averages found');
                setOverallAverages(null);
            }
        } catch (error) {
            setError('Failed to fetch overall averages');
            setOverallAverages(null);
        } finally {
            setLoadingOverall(false);
        }
    }, [studentName, academicYear]);

    // Existing filter function and effects remain the same...
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

    // Existing rendering functions remain the same...
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

    // New function to render overall averages
    const renderOverallAverages = () => {
        if (!showOverallAverages || !overallAverages) return null;

        return (
            <div className="scores-container">
                <h2>Overall Average Scores</h2>
                <div className="overall-averages-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Semester 1 Average</th>
                            <th>Semester 2 Average</th>
                            <th>Academic Year Average</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{overallAverages.averageSemester1}</td>
                            <td>{overallAverages.averageSemester2}</td>
                            <td>{overallAverages.averageAcademicYear}</td>
                        </tr>
                        </tbody>
                    </table>
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
                    <button
                        type="button"
                        onClick={fetchOverallAverages}
                        disabled={loadingOverall}
                        className={showOverallAverages ? 'active' : ''}
                    >
                        {loadingOverall ? 'Loading...' : 'View Overall Averages'}
                    </button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="tables-container">
                {renderDailyScoresTable()}
                {renderAverageScoresTable()}
                {renderOverallAverages()}
            </div>
        </div>
    );
};

export default ViewParent;