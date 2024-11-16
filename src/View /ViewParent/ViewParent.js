import React, { useState } from "react";
import NavBarParent from "../NavBarParent";
import { getDailyScores, getSubjectsAverageScores } from "../../API /ParentAPI";
import "./ViewParent.css";

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

const ViewParent = () => {
    const [studentName, setStudentName] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [scores, setScores] = useState([]);
    const [averageScores, setAverageScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAverageModalOpen, setIsAverageModalOpen] = useState(false);

    const handleGetScores = async () => {
        if (!studentName || !academicYear) {
            setError("Please complete all the fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getDailyScores(studentName, academicYear);
            console.log("Received data: ", data);

            if (!data || data.length === 0) {
                setError("Score not found");
                setScores([]);
            } else {
                setScores(data);
                setIsModalOpen(true); // Show the modal when scores are fetched
            }
        } catch (err) {
            setError(err.message || "An error occurred while retrieving the data");
        } finally {
            setLoading(false);
        }
    };

    const handleGetAverageScores = async () => {
        if (!studentName || !academicYear) {
            setError("Please complete all the fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getSubjectsAverageScores(studentName, academicYear);
            console.log("Received average scores: ", data); // Đã log ra DevTools

            if (!data || data.length === 0) {
                setError("No average scores found");
                setAverageScores([]); // Nếu không có dữ liệu, xóa danh sách cũ
            } else {
                setAverageScores(data); // Gán dữ liệu vào state
                setIsAverageModalOpen(true); // Mở modal
            }
        } catch (err) {
            setError(err.message || "An error occurred while retrieving the average scores");
        } finally {
            setLoading(false);
        }
    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSemesterChange = (event) => {
        setSelectedSemester(Number(event.target.value));
    };

    const filteredScores = scores
        .filter(
            (score) =>
                score.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                score.semesterType === selectedSemester
        );

    return (
        <div>
            <NavBarParent searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            {/* Form input */}
            <div className="form">
                <h1 className="title">List Student Score</h1>
                <div className="input-group">
                    <label htmlFor="studentName">Student Full Name:</label>
                    <input
                        type="text"
                        id="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="academicYear">Academic Year:</label>
                    <input
                        type="text"
                        id="academicYear"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button
                    onClick={handleGetScores}
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? "Loading..." : "View Score"}
                </button>

                <button
                    onClick={handleGetAverageScores}
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? "Loading..." : "Get Subject Average Score"}
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Modal for displaying filtered scores */}
            {isModalOpen && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
                        <span
                            className="modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>

                        <h2 className="table-title">List of Student Scores</h2>

                        {/* Semester Dropdown for filtering scores */}
                        <div className="input-group">
                            <label htmlFor="semester">Select Semester:</label>
                            <select
                                id="semester"
                                value={selectedSemester}
                                onChange={handleSemesterChange}
                                className="input-field"
                            >
                                <option value={0}>Semester 1</option>
                                <option value={1}>Semester 2</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="table-header">Subject</th>
                                    <th className="table-header">Semester</th>
                                    <th className="table-header">Exam Type</th>
                                    <th className="table-header">Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredScores.length > 0 ? (
                                    filteredScores.map((score, index) => (
                                        <tr key={index}>
                                            <td>{score.subjectName}</td>
                                            <td>{semesterTypeMap[score.semesterType]}</td>
                                            <td>{examTypeMap[score.examType]}</td>
                                            <td>{score.scoreValue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No scores available for the selected semester.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for displaying average scores */}
            {isAverageModalOpen && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="modal-content">
            <span
                className="modal-close"
                onClick={() => setIsAverageModalOpen(false)}
            >
                &times;
            </span>

                        <h2 className="table-title">Subject Average Scores</h2>

                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="table-header">Subject</th>
                                    <th className="table-header">Semester 1 Average</th>
                                    <th className="table-header">Semester 2 Average</th>
                                    <th className="table-header">Annual Average</th>
                                </tr>
                                </thead>
                                <tbody>
                                {averageScores.length > 0 ? (
                                    averageScores.map((score, index) => (
                                        <tr key={index}>
                                            <td>{score.subjectName}</td>
                                            <td>{score.semesterAverage1}</td>
                                            <td>{score.semesterAverage2}</td>
                                            <td>{score.annualAverage}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No average scores available.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewParent;
