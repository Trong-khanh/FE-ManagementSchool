import React, { useState, useEffect, useCallback } from "react";
import {
  addTeacher,
  getTeachers,
  assignTeacherToClass,
  getAssignedTeachers,
  updateTeacher,
  deleteTeacherById,
} from "../../../API /CRUDTeachersAPI"; // Fixed API import path
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NavBar from "../../NavBar";
import "../AdminTeachersPageCSS/AdminTeachersPage.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

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
      await fetchTeachers(); // Fetch updated list of teachers
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
      // Update the list of teachers after deletion
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

  const handleShowAssignedTeachers = async () => {
    await fetchAssignedTeachers();
    setShowAssignedTeachers(true);
  };

  return (
    <div>
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      <h2>Teacher Management</h2>

      <div className="section">
        <h3>Add New Teacher</h3>
        <TextField
          label="Name"
          value={newTeacher.name}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, name: e.target.value })
          }
        />
        <TextField
          label="Email"
          value={newTeacher.email}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, email: e.target.value })
          }
        />
        <TextField
          label="Subject ID"
          value={newTeacher.subjectId}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, subjectId: e.target.value })
          }
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "green",
            color: "white",
            marginTop: "5px",
            marginLeft: "10px",
          }} // Add marginTop for spacing
          onClick={handleAddTeacher}
        >
          Add Teacher
        </Button>
      </div>

      <div className="section teacher-list">
        <h3>Teachers</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                  Teacher Name
                </TableCell>
                <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                  Email
                </TableCell>
                <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                  Subject
                </TableCell>
                <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.teacherId}>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    {teacher.name}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    {teacher.email}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    {teacher.subjectName}
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "yellow",
                        color: "black",
                        marginRight: "10px",
                      }}
                      onClick={() => handleOpenDialog("edit", teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "red",
                        color: "white",
                        marginRight: "10px",
                      }}
                      onClick={() => handleOpenDialog("delete", teacher)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "purple", color: "white" }}
                      onClick={() => handleOpenDialog("assign", teacher)}
                    >
                      Assign Class
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="section assigned-teacher-list">
        <h3>Assigned Teachers</h3>
        <Button onClick={handleShowAssignedTeachers}>
          Show Assigned Teachers
        </Button>
        {showAssignedTeachers && assignedTeachers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    Teacher Name
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    Email
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    Subject
                  </TableCell>
                  <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {assignedTeachers.map((teacher) => (
                  <TableRow key={teacher.teacherId}>
                    <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                      {teacher.teacherFullName}
                    </TableCell>
                    <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                      {teacher.teacherEmail}
                    </TableCell>
                    <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                      {teacher.subjectName}
                    </TableCell>
                    <TableCell style={{ ...cellStyle, textAlign: "center" }}>
                      {teacher.className}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          showAssignedTeachers && <p>No assigned teachers found.</p>
        )}
      </div>

      {/* Dialogs for Add/Edit/Delete */}
      <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
        <DialogTitle>
          {isDialogOpen.type === "edit"
            ? "Edit Teacher"
            : isDialogOpen.type === "delete"
            ? "Delete Teacher"
            : "Assign Teacher to Class"}
        </DialogTitle>
        <DialogContent>
          {isDialogOpen.type === "edit" && (
            <>
              <TextField
                label="Name"
                value={editTeacher?.name || ""}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={editTeacher?.email || ""}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, email: e.target.value })
                }
              />
              <TextField
                label="Subject ID"
                value={editTeacher?.subjectId || ""}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, subjectId: e.target.value })
                }
              />
            </>
          )}
          {isDialogOpen.type === "assign" && (
            <>
              <TextField
                label="Class Name"
                value={assignment.className}
                onChange={(e) =>
                  setAssignment({ ...assignment, className: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {isDialogOpen.type === "edit" && (
            <Button onClick={handleUpdateTeacher}>Save</Button>
          )}
          {isDialogOpen.type === "delete" && (
            <Button onClick={handleDeleteTeacher}>Confirm Delete</Button>
          )}
          {isDialogOpen.type === "assign" && (
            <Button onClick={handleAssignTeacher}>Assign</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{errorDialog.message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ccc",
};

export default AdminTeachersPage;
