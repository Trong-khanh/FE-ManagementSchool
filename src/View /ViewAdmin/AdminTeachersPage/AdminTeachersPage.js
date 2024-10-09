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

  // Error dialog close handler
  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, message: "" });
  };

  // Handle adding a new teacher
// Handle adding a new teacher
const handleAddTeacher = async () => {
  // Kiểm tra nếu trường thông tin rỗng
  if (!newTeacher.name || !newTeacher.email || !newTeacher.subjectId) {
      showErrorDialog("Please enter full information.");
      return;
  }

  try {
      const addedTeacher = await addTeacher(newTeacher);
      setTeachers([...teachers, addedTeacher]);
      setNewTeacher({ name: "", email: "", subjectId: "" });
      fetchAssignedTeachers();
  } catch (error) {
      showErrorDialog(error.message || "Fail Add Teachers.");
  }
};


  // Handle opening various dialogs (assign, edit, delete)
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

  // Handle closing dialogs
  const handleCloseDialog = () => {
    setDialogOpen({ type: "", open: false });
  };

  // Handle assigning a teacher to a class
  const handleAssignTeacher = async () => {
    if (!assignment.className) {
      showErrorDialog("Please enter class name.");
      return;
    }

    try {
      await assignTeacherToClass(assignment);
      fetchAssignedTeachers();
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message || "Failed to assign teacher to class.");
    }
  };

  // Handle updating a teacher
  const handleUpdateTeacher = async () => {
    try {
      await updateTeacher(editTeacher.teacherId, {
        name: editTeacher.name,
        email: editTeacher.email,
        subjectId: editTeacher.subjectId,
      });
      fetchTeachers();
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message || "Failed to update teacher.");
    }
  };

  // Handle deleting a teacher
  const handleDeleteTeacher = async () => {
    if (!deletingTeacher) {
      showErrorDialog("No teacher selected for deletion.");
      return;
    }

    try {
      await deleteTeacherById(deletingTeacher.teacherId);
      fetchTeachers();
      fetchAssignedTeachers();
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
        <Button onClick={handleAddTeacher}>Add Teacher</Button>
      </div>

      <div className="section teacher-list">
        <h3>Teachers</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.teacherId}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subjectName}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog("edit", teacher)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleOpenDialog("delete", teacher)}>
                      Delete
                    </Button>
                    <Button onClick={() => handleOpenDialog("assign", teacher)}>
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
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Subject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedTeachers.map((assigned) => (
                  <TableRow key={assigned.id}>
                    <TableCell>{assigned.teacherFullName}</TableCell>
                    <TableCell>{assigned.teacherEmail}</TableCell>
                    <TableCell>{assigned.className}</TableCell>
                    <TableCell>{assigned.subjectName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No teachers assigned to any class yet.</p>
        )}
      </div>

      <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
        {isDialogOpen.type === "assign" && (
          <>
            <DialogTitle>
              Assign Class to {assignment.teacherFullName}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Class Name"
                value={assignment.className}
                onChange={(e) =>
                  setAssignment({ ...assignment, className: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAssignTeacher}>Assign</Button>
              <Button onClick={handleCloseDialog}>Cancel</Button>
            </DialogActions>
          </>
        )}
        {isDialogOpen.type === "edit" && (
          <>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={editTeacher.name}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={editTeacher.email}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, email: e.target.value })
                }
              />
              <TextField
                label="Subject ID"
                value={editTeacher.subjectId}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, subjectId: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateTeacher}>Update</Button>
              <Button onClick={handleCloseDialog}>Cancel</Button>
            </DialogActions>
          </>
        )}
        {isDialogOpen.type === "delete" && (
          <>
            <DialogTitle>Delete Teacher</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this teacher?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteTeacher}>Delete</Button>
              <Button onClick={handleCloseDialog}>Cancel</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default AdminTeachersPage;