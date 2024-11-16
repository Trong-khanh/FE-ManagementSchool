import React, { useState } from "react";
import NavBarParent from "../NavBarParent";
import { getDailyScores } from "../../API /ParentAPI";
import "./ViewParent.css"; // Import the external CSS file

// Map ExamType values to their corresponding display names
const examTypeMap = {
    0: "Test When Class Begins",
    1: "15 Minutes Test",
    2: "45 Minutes Test",
    3: "Semester Test",
};

// Map SemesterType values
const semesterTypeMap = {
    0: "Semester 1",
    1: "Semester 2"
};

const ViewParent = () => {
    const [studentName, setStudentName] = useState("");
    const [className, setClassName] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(0);

    const handleGetScores = async () => {
        if (!studentName || !className || !academicYear) {
            setError("Please complete all the fields ");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getDailyScores(studentName, className, academicYear);
            console.log("Received data: ", data);

            if (!data || data.length === 0) {
                setError("Score not found");
                setScores([]);
            } else {
                setScores(data);
            }
        } catch (err) {
            setError(err.message || "An error occurred while retrieving the data");
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

    // Filter scores based on search query and selected semester
    const filteredScores = scores
        .filter(score =>
            score.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            score.semesterType === selectedSemester
        );

    return (
        <div>
            <NavBarParent searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            {/* Form input */}
            <div className="form-container">
                <h1 className="title">List Student Score</h1>

                <div className="form">
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
                        <label htmlFor="className">Class Name:</label>
                        <input
                            type="text"
                            id="className"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
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

                    <button
                        onClick={handleGetScores}
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? "Loading..." : "View Score"}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>

            {/* Show score table */}
            {filteredScores.length > 0 && (
                <div className="score-table">
                    <h2 className="table-title">List Student SCore</h2>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewParent;
