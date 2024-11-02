import React, { useEffect, useState } from "react";
import { AssignedClassesStudents } from "../../API /TeacherAPI"; // Adjusted path
import Navbar2 from "../Navbar2";

const ViewClass = () => {
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() => {
        const fetchAssignedClasses = async () => {
            setLoading(true);
            try {
                const teacherEmail = localStorage.getItem("teacherEmail");

                const data = await AssignedClassesStudents(teacherEmail);

                if (Array.isArray(data)) {
                    setAssignedClasses(data);
                } else {
                    console.error("Unexpected data format:", data);
                    setError("Received invalid data format");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to fetch student data");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedClasses();
    }, []);

    // Get unique class names for dropdown
    const classOptions = [...new Set(assignedClasses.map(student => student.className))];

    // Filter students by selected class
    const filteredStudents = selectedClass
        ? assignedClasses.filter(student => student.className === selectedClass)
        : assignedClasses;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "0" }}>
            <Navbar2 />
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}>
                    Assigned Classes
                </h2>
                {/* Class Selection Dropdown */}
                <div style={{ marginBottom: "24px" }}>
                    <select
                        style={{
                            padding: "8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            width: "256px",
                            marginLeft: "20px",
                        }}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">All Classes</option>
                        {classOptions.map(className => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loading and Error States */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "32px" }}>Loading...</div>
                ) : error ? (
                    <div style={{ color: "red", padding: "16px" }}>{error}</div>
                ) : filteredStudents.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px" }}>No students found</div>
                ) : (
                    <div style={{ overflowX: "auto", marginLeft: "30px" }}>
                        <table
                            style={{
                                minWidth: "fit-content",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                borderRadius: "0.375rem",
                                borderCollapse: "collapse",
                                border: "none",
                            }}
                        >
                            <thead style={{ backgroundColor: "#f3f4f6" }}>
                                <tr>
                                    <th style={{ padding: "8px", textAlign: "left", fontWeight: "bold" }}>
                                        Student Name
                                    </th>
                                    <th style={{ padding: "8px", textAlign: "left", fontWeight: "bold" }}>
                                        Class
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr
                                        key={index}
                                        style={{
                                            borderBottom: "1px solid #e5e7eb",
                                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                                            transition: "background-color 0.2s",
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#e5e7eb"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f9fafb"; }}
                                    >
                                        <td>{student.studentFullName}</td>
                                        <td>{student.className}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewClass;
