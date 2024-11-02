import React, { useEffect, useState } from "react";
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
  DeleteStudent,
} from "../../../AdminAPI";
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

  useEffect(() => {
    fetchListStudent();
  }, []);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingIndex === null) {
        await addStudent(formData);
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

  const filteredStudents = showStudentList.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-student-page">
      <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <h1 style={{ textAlign: "center" }}>Student Management</h1>
      <div className="content">
        <div
          className="form-container"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <h2>{editingIndex !== null ? "Edit Student" : "Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            <div
              className="form-group"
              style={{ marginBottom: "15px", marginRight: "15px" }}
            >
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div
              className="form-group"
              style={{ marginBottom: "15px", marginRight: "15px" }}
            >
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div
              className="form-group"
              style={{ marginBottom: "15px", marginRight: "15px" }}
            >
              <label htmlFor="className">Class Name:</label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div
              className="form-group"
              style={{ marginBottom: "15px", marginRight: "15px" }}
            >
              <label htmlFor="parentName">Parent Name:</label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div
              className="form-group"
              style={{ marginBottom: "15px", marginRight: "15px" }}
            >
              <label htmlFor="academicYear">Academic Year:</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <button
              type="submit"
              className="submit-btn"
              style={{
                padding: "10px 15px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {editingIndex !== null ? "Update Student" : "Add Student"}
            </button>
          </form>
        </div>
        <div
          className="list-container"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "15px",
            margin: "0 auto",
            maxWidth: "800px",
          }}
        >
          <h2>Student List</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f2f2f2",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Full Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Address
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Class Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Parent Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Academic Year
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.studentId}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {student.fullName}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {student.address}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {student.class?.className || "No Class Assigned"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {student.parentName || "No Parent Assigned"}{" "}
                    {/* Use parentName directly */}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {student.academicYear}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleEdit(index)}
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        backgroundColor: "#FFC107",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenConfirmDialog(index)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#F44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
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

      {/* Dialogs */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>{"Lỗi"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminStudentPage;
