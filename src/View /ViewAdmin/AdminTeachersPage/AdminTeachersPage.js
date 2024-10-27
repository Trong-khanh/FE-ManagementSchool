import React, { useState, useEffect, useCallback } from "react";
import {
  addTeacher,
  getTeachers,
  assignTeacherToClass,
  getAssignedTeachers,
  updateTeacher,
  deleteTeacherById,
} from "../../../API /CRUDTeachersAPI";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import NavBar from "../../NavBar";

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    subjectId: "",
  });
  const [editTeacher, setEditTeacher] = useState(null);
  const [assignment, setAssignment] = useState({
    teacherFullName: "",
    teacherEmail: "",
    subjectName: "",
    className: "",
  });
  const [isDialogOpen, setDialogOpen] = useState({ type: "", open: false });
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignedTeachers, setShowAssignedTeachers] = useState(false);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const result = await getTeachers();
      setTeachers(result || []);
    } catch (error) {
      showErrorDialog("Failed to fetch teachers. Please try again.");
    }
  }, []);

  // Fetch assigned teachers
  const fetchAssignedTeachers = useCallback(async () => {
    try {
      const result = await getAssignedTeachers();
      setAssignedTeachers(result || []);
    } catch (error) {
      showErrorDialog("Failed to fetch assigned teachers. Please try again.");
    }
  }, []);

  // Fetch teachers when the component mounts
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Error dialog handler
  const showErrorDialog = (message) => {
    setErrorDialog({ open: true, message });
  };

  // Handle closing dialogs
  const handleCloseDialog = () => {
    setDialogOpen({ type: "", open: false });
    setEditTeacher(null); // Reset editTeacher when dialog is closed
  };

  // Error dialog close handler
  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, message: "" });
  };

  // Handle adding a new teacher
  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subjectId) {
      showErrorDialog("Please enter full information.");
      return;
    }

    try {
      await addTeacher(newTeacher);
      setNewTeacher({ name: "", email: "", subjectId: "" });
      await fetchTeachers();
      await fetchAssignedTeachers();
    } catch (error) {
      showErrorDialog(error.message || "Failed to add teacher.");
    }
  };

  const handleOpenDialog = (type, data) => {
    if (type === "assign") {
      setAssignment({
        teacherFullName: data.name,
        teacherEmail: data.email,
        subjectName: data.subjectName,
        className: "",
      });
    } else if (type === "edit") {
      // Set editTeacher data to populate the dialog fields
      setEditTeacher(data);
    } else if (type === "delete") {
      setDeletingTeacher(data);
    }
    setDialogOpen({ type, open: true });
  };

  // Handle assigning a teacher to a class
  const handleAssignTeacher = async () => {
    if (!assignment.className) {
      showErrorDialog("Please enter class name.");
      return;
    }

    try {
      await assignTeacherToClass(assignment);
      await fetchAssignedTeachers();
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message || "Failed to assign teacher to class.");
    }
  };

  // Handle updating a teacher
  const handleUpdateTeacher = async () => {
    if (!editTeacher || !editTeacher.teacherId) {
      showErrorDialog("Teacher ID is missing.");
      return;
    }

    try {
      await updateTeacher(editTeacher.teacherId, {
        name: editTeacher.name,
        email: editTeacher.email,
        subjectId: editTeacher.subjectId,
      });

      await fetchTeachers(); // Fetch updated list of teachers
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message || "Failed to update teacher.");
    }
  };

  // Handle deleting a teacher
  const handleDeleteTeacher = async () => {
    if (!deletingTeacher || !deletingTeacher.teacherId) {
      showErrorDialog("No teacher selected for deletion.");
      return;
    }

    try {
      await deleteTeacherById(deletingTeacher.teacherId);
      setTeachers((prevTeachers) =>
        prevTeachers.filter(
          (teacher) => teacher.teacherId !== deletingTeacher.teacherId
        )
      );

      await fetchAssignedTeachers();
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message || "Failed to delete teacher.");
    }
  };

  // Show assigned teachers
  const handleShowAssignedTeachers = async () => {
    await fetchAssignedTeachers();
    setShowAssignedTeachers((prev) => !prev);
  };

  return (
    <div>
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      <h1 style={{ textAlign: "center" }}>Teacher Management</h1>
      <div
        className="section"
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "20px",
          alignItems: "flex-start",
        }}
      >
        <h3 style={{ margin: "20px" }}>Add New Teacher</h3>

        <div
          className="form-input"
          style={{
            marginLeft: "20px",
            width: "300px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            label="Name"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
            style={{ marginBottom: "10px" }}
            fullWidth
          />
          <TextField
            label="Email"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
            style={{ marginBottom: "10px" }}
            fullWidth
          />
          <TextField
            label="Subject ID"
            value={newTeacher.subjectId}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, subjectId: e.target.value })
            }
            style={{ marginBottom: "10px" }}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "green",
              color: "white",
            }}
            onClick={handleAddTeacher}
          >
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Table of Teachers */}
      <div className="section" style={{ padding: "10px", margin: "20px" }}>
        <h3>Teachers</h3>
        <TableContainer
          style={{
            width: "90%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                  Name
                </TableCell>
                <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                  Email
                </TableCell>
                <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                  Subject
                </TableCell>
                <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.teacherId}>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {teacher.name}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {teacher.email}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    {teacher.subjectName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleOpenDialog("assign", teacher)}
                    >
                      Assign
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleOpenDialog("edit", teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog("delete", teacher)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Toggle assigned teachers */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "orange",
          marginLeft: "30px"
        }}
        onClick={handleShowAssignedTeachers}
      >
        {showAssignedTeachers ? "Hide Assigned Teachers" : "Show Assigned Teachers"}
      </Button>

      {/* Assigned teachers */}
      {showAssignedTeachers && (
        <div className="section" style={{  margin: "20px" }}>
          <h3>Assigned Teachers</h3>
          <TableContainer
            style={{
              width: "90%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginLeft: '11px'
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    Teacher Name
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    Class Name
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    Subject Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedTeachers.map((assignedTeacher, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      {assignedTeacher.teacherFullName}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      {assignedTeacher.className}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      {assignedTeacher.subjectName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Dialog for adding and editing teachers */}
      {isDialogOpen.type === "assign" && (
        <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
          <DialogTitle>Assign Teacher to Class</DialogTitle>
          <DialogContent style={{padding: '5px'}}>
            <TextField
              label="Class Name"
              value={assignment.className}
              onChange={(e) =>
                setAssignment({ ...assignment, className: e.target.value })
              }
              fullWidth
              style={{ marginBottom: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAssignTeacher}>Assign</Button>
          </DialogActions>
        </Dialog>
      )}

      {isDialogOpen.type === "edit" && (
        <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogContent style={{padding: '5px'}}>
            <TextField
              label="Name"
              value={editTeacher.name}
              onChange={(e) =>
                setEditTeacher({ ...editTeacher, name: e.target.value })
              }
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Email"
              value={editTeacher.email}
              onChange={(e) =>
                setEditTeacher({ ...editTeacher, email: e.target.value })
              }
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Subject ID"
              value={editTeacher.subjectId}
              onChange={(e) =>
                setEditTeacher({ ...editTeacher, subjectId: e.target.value })
              }
              fullWidth
              style={{ marginBottom: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleUpdateTeacher}>Update</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog for confirming teacher deletion */}
      {isDialogOpen.type === "delete" && (
        <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {deletingTeacher.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeleteTeacher}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Error Dialog */}
      {errorDialog.open && (
        <Dialog open={errorDialog.open} onClose={handleCloseErrorDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>{errorDialog.message}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminTeachersPage;
