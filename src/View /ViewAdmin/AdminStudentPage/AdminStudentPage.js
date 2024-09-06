import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../../NavBar";
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

  useEffect(() => {
    fetchListStudent();
  }, []);

  const fetchListStudent = async () => {
    try {
      const studentData = await GetAllStudent();
      console.log("list student: ", studentData);
      setShowStudentList(studentData);
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
    }
  };

  const handleEdit = (index) => {
    const student = showStudentList[index];
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      address: student.address,
      className: student.class?.className || "No Class Assigned",
      parentName: student.parent?.parentName || "No Parent Assigned",
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
      console.log("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student: " + (error.response || error.message));
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
      <div className="content">
        <div className="form-container">
          <h2>{editingIndex !== null ? "Edit Student" : "Add Student"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="className">Class Name:</label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="parentName">Parent Name:</label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="academicYear">Academic Year:</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              {editingIndex !== null ? "Update Student" : "Add Student"}
            </button>
          </form>
        </div>
        <div className="list-container">
          <h2>Student List</h2>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Address</th>
                <th>Class Name</th>
                <th>Parent Name</th>
                <th>Academic Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.studentId}>
                  <td>{student.fullName}</td>
                  <td>{student.address}</td>
                  <td>{student.class?.className || "No Class Assigned"}</td>
                  <td>{student.parent?.parentName || "No Parent Assigned"}</td>
                  <td>{student.academicYear}</td>
                  <td>
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenConfirmDialog(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}

export default AdminStudentPage;
