import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import NavBar from "../../NavBar.js";
import {
    addStudent,
    GetAllStudent,
    UpdateStudent,
    DeleteStudent
} from "../../../API /CRUDStudentAPI";
import {getAllClasses} from "../../../API /CRUDClassAPI";
import {getAllSemesters} from "../../../API /CRUDSemesterAPI";
import "./AdminStudentPage.css";

function AdminStudentPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        className: "",
        parentName: "",
        academicYear: "",
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [showStudentList, setShowStudentList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [classList, setClassList] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    useEffect(() => {
        fetchListStudent();
        fetchClassList();
        fetchAcademicYears();
    }, []);

    const fetchAcademicYears = async () => {
        try {
            const academicYearData = await getAllSemesters();
            console.log("Fetched academic years:", academicYearData);
            setAcademicYears(academicYearData);
        } catch (error) {
            console.error("Error fetching academic years", error);
        }
    };

    const fetchClassList = async () => {
        try {
            const classData = await getAllClasses();
            setClassList(classData);
        } catch (error) {
            console.error("Error fetching class list", error);
        }
    };

    const fetchListStudent = async () => {
        try {
            const studentData = await GetAllStudent();
            setShowStudentList(studentData);
            console.log("studentData", studentData);
        } catch (error) {
            console.log("error fetch student", error);
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingIndex === null) {
                await addStudent(formData); // Gửi thông tin học sinh bao gồm năm học đã chọn
            } else {
                if (formData.studentId) {
                    await UpdateStudent(formData.studentId, formData);
                } else {
                    console.error("Invalid student ID");
                }
            }
            await fetchListStudent();
            setEditingIndex(null);
            setFormData({
                fullName: "",
                address: "",
                className: "",
                parentName: "",
                academicYear: "",
            });
        } catch (error) {
            console.error("Error details:", error.response || error.message);
            setErrorMessage(
                "School year does not exist, please check the semester again"
            );
            setOpenErrorDialog(true);
        }
    };

    const handleEdit = (index) => {
        const student = showStudentList[index];
        setFormData({
            studentId: student.studentId,
            fullName: student.fullName,
            address: student.address,
            className: student.className,
            parentName: student.parentName,
            academicYear: student.academicYear,
        });
        setEditingIndex(index);
    };

    const handleOpenConfirmDialog = (index) => {
        setDeletingIndex(index);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setDeletingIndex(null);
    };

    const handleConfirmDelete = async () => {
        if (deletingIndex === null) return;

        try {
            const studentId = showStudentList[deletingIndex].studentId;
            await DeleteStudent(studentId);
            await fetchListStudent();
        } catch (error) {
            console.error("Error deleting student:", error);
            setErrorMessage(
                "Error deleting student: " + (error.response || error.message)
            );
            setOpenErrorDialog(true);
        }

        handleCloseConfirmDialog();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredStudents = showStudentList.filter((student) => {
        const matchesSearch = student.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass
            ? student.class?.className === selectedClass
            : true;
        return matchesSearch && matchesClass;
    });

    const styles = {
        pageTitle: {
            textAlign: "center",
            color: '#2d3748',
            marginBottom: '24px',
            fontSize: '28px',
            fontWeight: '600'
        },
        pageContainer: {
            display: 'flex',
            gap: '32px',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px',
        },
        leftSection: {
            flex: '1',
            minWidth: '400px',
        },
        rightSection: {
            flex: '1.8',
            minWidth: 0,
        },
        formCard: {
            position: 'sticky',
            top: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e1e4e8',
        },
        listCard: {
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e1e4e8',
        },
        formTitle: {
            margin: '0 0 24px 0',
            color: '#2c3e50',
            fontSize: '1.5rem',
            fontWeight: '600',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#4a5568',
            fontWeight: '500',
            fontSize: '14px',
        },
        input: {
            width: '100%',
            height: '42px',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
            outline: 'none',
            margin: 0,
            '&:focus': {
                borderColor: '#4CAF50',
                boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
            }
        },

        select: {
            width: '100%',
            height: '42px',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            outline: 'none',
        },
        button: {
            width: '100%',
            height: '42px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#45a049',
            }
        },
        filterContainer: {
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
        },
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        th: {
            backgroundColor: '#f1f5f9',
            padding: '12px 16px',
            textAlign: 'left',
            fontWeight: '600',
            color: '#4a5568',
            borderBottom: '2px solid #e2e8f0',
            whiteSpace: 'nowrap',
            fontSize: '14px',
        },
        td: {
            padding: '12px 16px',
            borderBottom: '1px solid #e2e8f0',
            color: '#2d3748',
            fontSize: '14px',
        },
        actionButton: {
            height: '32px',
            padding: '0 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px',
            transition: 'background-color 0.2s',
        },
        dialog: {
            '& .MuiDialog-paper': {
                borderRadius: '12px',
                padding: '12px',
            }
        }
    };

  return (
      <div style={styles.mainContainer}>
        <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <h1 style={{ textAlign: "center", color: '#2d3748', marginBottom: '24px' }}>Student Management</h1>

        <div style={styles.pageContainer}>
          {/* Left Section - Form */}
          <div style={styles.leftSection}>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>
                {editingIndex !== null ? "Edit Student" : "Add New Student"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                      style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter address"
                      style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Class</label>
                  <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      required
                      style={styles.select}
                  >
                    <option value="">Select Class</option>
                    {classList.map((classItem) => (
                        <option key={classItem.classId} value={classItem.className}>
                          {classItem.className}
                        </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Parent Name</label>
                  <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      placeholder="Enter parent's name"
                      style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Academic Year</label>
                  <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      required
                      style={styles.select}
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                        <option key={year.semesterId} value={year.academicYear}>
                          {year.academicYear}
                        </option>
                    ))}
                  </select>
                </div>
                <button type="submit" style={styles.button}>
                  {editingIndex !== null ? "Update Student" : "Add Student"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Section - Student List */}
          <div style={styles.rightSection}>
            <div style={styles.listCard}>
              <div style={styles.filterContainer}>
                <label style={{...styles.label, marginBottom: 0}}>Filter by Class:</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{...styles.select, width: 'auto'}}
                >
                  <option value="">All Classes</option>
                  {classList.map((classItem) => (
                      <option key={classItem.classId} value={classItem.className}>
                        {classItem.className}
                      </option>
                  ))}
                </select>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                  <tr>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Class Name</th>
                    <th style={styles.th}>Parent Name</th>
                    <th style={styles.th}>Academic Year</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredStudents.map((student, index) => (
                      <tr key={student.studentId}>
                        <td style={styles.td}>{student.fullName}</td>
                        <td style={styles.td}>{student.address}</td>
                        <td style={styles.td}>{student.class?.className || "No Class Assigned"}</td>
                        <td style={styles.td}>{student.parentName}</td>
                        <td style={styles.td}>{student.academicYear}</td>
                        <td style={styles.td}>
                          <button
                              onClick={() => handleEdit(index)}
                              style={{
                                ...styles.actionButton,
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                marginRight: '8px'
                              }}
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => handleOpenConfirmDialog(index)}
                              style={{
                                ...styles.actionButton,
                                backgroundColor: '#ef4444',
                                color: 'white'
                              }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this student?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
            open={openErrorDialog}
            onClose={() => setOpenErrorDialog(false)}
        >
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenErrorDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default AdminStudentPage;
