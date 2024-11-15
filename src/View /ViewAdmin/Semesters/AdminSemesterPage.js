import React, {useEffect, useState} from "react";
import {
    addSemester, getAllSemesters, updatedSemester, deleteSemester,
} from "../../../API /CRUDSemesterAPI"; // Ensure correct path without space
import NavBar from "../../NavBar";

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({
        SemesterType: "", StartDate: "", EndDate: "", AcademicYear: "",
    });
    const [editingSemesterId, setEditingSemesterId] = useState(null);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const data = await getAllSemesters();
            console.log("Fetched Semesters:", data);
            setSemesters(data);
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Semester:", form);
        try {
            const formattedStartDate = new Date(form.StartDate.split("/").reverse().join("-"))
                .toISOString()
                .split("T")[0];
            const formattedEndDate = new Date(form.EndDate.split("/").reverse().join("-"))
                .toISOString()
                .split("T")[0];

            const dataToSend = {
                ...form, StartDate: formattedStartDate, EndDate: formattedEndDate,
            };

            if (editingSemesterId) {
                await updatedSemester(editingSemesterId, dataToSend);
            } else {
                await addSemester(dataToSend);
            }
            setForm({
                SemesterType: "", StartDate: "", EndDate: "", AcademicYear: "",
            });
            setEditingSemesterId(null);
            fetchSemesters();
        } catch (error) {
            console.error("Error submitting semester:", error);
        }
    };

    const handleEdit = (semester) => {
        setForm({
            SemesterType: semester.semesterType,
            StartDate: formatDate(semester.startDate),
            EndDate: formatDate(semester.endDate),
            AcademicYear: semester.academicYear,
        });
        setEditingSemesterId(semester.semesterId);
    };

    const handleDelete = async (id) => {
        console.log("Deleting Semester ID:", id);
        if (window.confirm("Are you sure you want to delete this semester?")) {
            try {
                await deleteSemester(id);
                fetchSemesters();
            } catch (error) {
                console.error("Error deleting semester:", error);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
        }, formContainer: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "20px",
            width: "400px",
        }, listContainer: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "15px",
            margin: "20px",
            maxWidth: "800px",
        }, table: {
            borderCollapse: "collapse", width: "100%", textAlign: "center",
        }, thTd: {
            padding: "10px", border: "1px solid #ddd",
        }, submitBtn: {
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "56%",
            marginTop: "10px",
            marginLeft: "89px",
            marginBottom: "20px",
        }, inputContainer: {
            marginBottom: "15px", display: "flex", flexDirection: "column", alignItems: "center",
        }, input: {
            padding: "10px", width: "100%", maxWidth: "200px",
        }, actionBtn: {
            marginRight: "5px",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
        },
    };


    return (<div style={styles.container}>
        <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange}/>
        <h1 style={{textAlign: "center"}}>Class Management</h1>
        <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div style={styles.inputContainer}>
                <label>Semester Type:</label>
                <select
                    name="SemesterType"
                    value={form.SemesterType}
                    onChange={handleChange}
                    required
                    style={styles.input}
                >
                    <option value="">Select Semester</option>
                    <option value="Semester1">Semester 1</option>
                    <option value="Semester2">Semester 2</option>
                </select>
            </div>
            <div style={styles.inputContainer}>
                <label>Start Date:</label>
                <input
                    type="text"
                    name="StartDate"
                    value={form.StartDate}
                    onChange={handleChange}
                    placeholder="Start Date (dd/mm/yyyy)"
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>End Date:</label>
                <input
                    type="text"
                    name="EndDate"
                    value={form.EndDate}
                    onChange={handleChange}
                    placeholder="End Date (dd/mm/yyyy)"
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.inputContainer}>
                <label>Academic Year:</label>
                <input
                    type="text"
                    name="AcademicYear"
                    value={form.AcademicYear}
                    onChange={handleChange}
                    placeholder="Academic Year"
                    required
                    style={styles.input}
                />
            </div>
            <button type="submit" style={styles.submitBtn}>
                {editingSemesterId ? "Update" : "Add"}
            </button>
        </form>

        <h3 style={{margin: "20px", textAlign: "center"}}>Semester List</h3>
        <div style={styles.listContainer}>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={{...styles.thTd}}>Semester Type</th>
                    <th style={{...styles.thTd}}>Start Date</th>
                    <th style={{...styles.thTd}}>End Date</th>
                    <th style={{...styles.thTd}}>Academic Year</th>
                    <th style={{...styles.thTd}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {semesters.map((semester) => (<tr key={semester.semesterId}>
                    <td style={styles.thTd}>{semester.semesterType}</td>
                    <td style={styles.thTd}>{formatDate(semester.startDate)}</td>
                    <td style={styles.thTd}>{formatDate(semester.endDate)}</td>
                    <td style={styles.thTd}>{semester.academicYear}</td>
                    <td style={styles.thTd}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <button
                                onClick={() => handleEdit(semester)}
                                style={{
                                    ...styles.actionBtn, backgroundColor: "#FFA500",
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(semester.semesterId)}
                                style={{
                                    ...styles.actionBtn, backgroundColor: "#F44336", // Red color
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>))}
                </tbody>
            </table>
        </div>
    </div>);
};

export default AdminSemesterPage;