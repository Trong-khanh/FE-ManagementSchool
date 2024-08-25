import React, { useEffect, useState } from "react";
import {
  DialogActions,
  DialogContentText,
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../NavBar";
import {
  addStudent,
  GetAllStudent,
  UpdateStudent,
  DeleteStudent,
} from "../../AdminAPI";

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
    const fetchListStudent = async () => {
      try {
        const studentData = await GetAllStudent();
        console.log("list student: ", studentData);
        setShowStudentList(studentData);
      } catch (error) {
        console.log("error fetch student", error);
      }
    };
    fetchListStudent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Editing index:", editingIndex);
    console.log("Form data:", formData);

    try {
      if (editingIndex === null) {
        await addStudent(formData);
      } else {
        if (formData.studentId) {
          const updatedStudent = await UpdateStudent(
            formData.studentId,
            formData
          );
          const updatedStudents = [...showStudentList];
          const updateIndex = updatedStudents.findIndex(
            (student) => student.studentId === formData.studentId
          );
          if (updateIndex !== -1) {
            updatedStudents[updateIndex] = updatedStudent;
            setShowStudentList(updatedStudents);
            console.log("Student updated successfully");
          } else {
            throw new Error(
              "Unable to find student in list with ID: " + formData.studentId
            );
          }
        } else {
          console.error("Invalid student ID");
        }
      }
      const studentData = await GetAllStudent();
      setShowStudentList(studentData);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error details:", error.response || error.message);
    }

    setFormData({
      fullName: "",
      address: "",
      className: "",
      parentName: "",
      academicYear: "",
    });
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
      const updatedStudents = [...showStudentList];
      updatedStudents.splice(deletingIndex, 1);
      setShowStudentList(updatedStudents);
      console.log("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student: " + (error.response || error.message));
    }

    handleCloseConfirmDialog();
  };

  const toggleStudentList = async () => {
    if (!showStudentList.length) {
      try {
        const studentData = await GetAllStudent();
        setShowStudentList(studentData);
      } catch (error) {
        console.log("error fetch student", error);
      }
    } else {
      setShowStudentList([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <div
        style={{
          width: "400px",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "linear-gradient(to right top, #82aaff 50%, #3d6ef7",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Add Student</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="fullName" style={{ fontWeight: "bold" }}>
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Enter full name"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="address" style={{ fontWeight: "bold" }}>
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Enter address"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="className" style={{ fontWeight: "bold" }}>
              Class Name:
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Enter class name"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="parentName" style={{ fontWeight: "bold" }}>
              Parent Name:
            </label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Enter parent name"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="academicYear" style={{ fontWeight: "bold" }}>
              Academic Year:
            </label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
              placeholder="Enter academic year"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundImage: "linear-gradient(to right, #43a047, #66bb6a)",
            }}
          >
            {editingIndex !== null ? "Save" : "Add Student"}
          </button>
        </form>
        <button
          onClick={toggleStudentList}
          style={{
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#673ab7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {showStudentList.length ? "Hide Student List" : "View All Students"}
        </button>
      </div>

      {showStudentList.length > 0 && (
        <div
          style={{
            width: "800px",
            margin: "20px auto",
            overflowY: "auto",
            maxHeight: "400px",
          }}
        >
          <h2>Information Of Student</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f2f2f2",
                  background: "linear-gradient(to right, #0099ff, #00cc99)",
                  color: "white",
                }}
              >
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Full Name
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Address
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Class Name
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Parent Name
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Academic Year
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {showStudentList.map((student, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {student.fullName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {student.address}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {student.class?.className || "No Class Assigned"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {student.parent?.parentName || "No Parent Assigned"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {student.academicYear}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
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
      )}

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
