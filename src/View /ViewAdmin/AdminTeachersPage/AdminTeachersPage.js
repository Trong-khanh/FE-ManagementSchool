import React, { useState, useEffect } from "react";
import {
  addTeacher,
  getTeachers,
  assignTeacherToClass,
  getAssignedTeachers,
  updateTeacher,
  deleteTeacherById,
  getTeachersBySubject,
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
    className: "",
  });
  const [isDialogOpen, setDialogOpen] = useState({ type: "", open: false });
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  useEffect(() => {
    fetchTeachers();
    fetchAssignedTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const result = await getTeachers();
      console.log("Fetched teachers:", result);
      setTeachers(result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAssignedTeachers = async () => {
    try {
      const result = await getAssignedTeachers();
      console.log("Fetched assigned teachers:", result);
      setAssignedTeachers(result);
    } catch (error) {
      console.error(error.message);
    }
  };  

  const showErrorDialog = (message) => {
    setErrorDialog({ open: true, message });
  };

  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, message: "" });
  };

  const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchTeachersBySubject = async () => {
    try {
      const result = await getTeachersBySubject(subjectName);
      setTeachers(result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddTeacher = async () => {
    if (!isValidName(newTeacher.name)) {
      showErrorDialog(
        "Invalid teacher name. Only letters and spaces are accepted."
      );
      return;
    }

    if (!isValidEmail(newTeacher.email)) {
      showErrorDialog("Invalid email.");
      return;
    }

    const isDuplicateEmail = teachers.some(
      (teacher) => teacher.email === newTeacher.email
    );
    if (isDuplicateEmail) {
      showErrorDialog("Teacher email already exists, please enter another email.");
      return;
    }

    if (!newTeacher.subjectId) {
      showErrorDialog("Please provide subject Id");
      return;
    }

    try {
      const addedTeacher = await addTeacher(newTeacher);
      setTeachers([...teachers, addedTeacher]);
      setNewTeacher({ name: "", email: "", subjectId: "" });
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  const handleOpenDialog = (type, data) => {
    if (type === "assign") {
      setAssignment({
        teacherFullName: data.name,
        teacherEmail: data.email,
        className: "",
      });
    } else if (type === "edit") {
      setEditTeacher(data);
    } else if (type === "delete") {
      setDeletingTeacher(data);
    }
    setDialogOpen({ type, open: true });
  };

  const handleCloseDialog = () => {
    setDialogOpen({ type: "", open: false });
  };

  const handleAssignTeacher = async () => {
    if (!isValidName(assignment.teacherFullName)) {
      showErrorDialog(
        "Invalid teacher name. Only letters and spaces are accepted."
      );
      return;
    }

    if (!isValidEmail(assignment.teacherEmail)) {
      showErrorDialog("Invalid email.");
      return;
    }

    if (!assignment.className) {
      showErrorDialog("Please enter class name.");
      return;
    }

    try {
      await assignTeacherToClass(assignment);
      fetchAssignedTeachers(); // Refresh the assigned teachers list
      handleCloseDialog();
    } catch (error) {
      showErrorDialog(error.message);
    }
  };

  const handleUpdateTeacher = async () => {
    if (!isValidName(editTeacher.name)) {
      showErrorDialog("Invalid teacher name. Only letters and spaces are allowed.");
      return;
    }

    if (!isValidEmail(editTeacher.email)) {
      showErrorDialog("Invalid email format.");
      return;
    }

    const isDuplicateEmail = teachers.some(teacher => teacher.email === newTeacher.email);
    if (isDuplicateEmail) {
      showErrorDialog("Teacher email already exists, please enter another email.");
      return;
    }

    if (!editTeacher.subjectId) {
      showErrorDialog("Please provide a subject ID.");
      return;
    }

    try {
      await updateTeacher(editTeacher.teacherId, {
        name: editTeacher.name,
        email: editTeacher.email,
        subjectId: editTeacher.subjectId,
      });
      fetchTeachers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating teacher:", error.message);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deletingTeacher) {
      console.error("No teacher selected for deletion");
      return;
    }

    try {
      await deleteTeacherById(deletingTeacher.teacherId);
      fetchTeachers(); // Refresh the teacher list
      handleCloseDialog();
    } catch (error) {
      console.error("Error when deleting teacher:", error.message || error);
      showErrorDialog("Failed to delete teacher. Please try again.");
    }
  };

  return (
    <div>
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      <h2>Teacher Management</h2>

      <div className="teacher-form">
        <h3>Add New Teacher</h3>
        <TextField
          label="Teacher Name"
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

      <div className="subject-search">
        <TextField
          label="Search by Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <Button onClick={fetchTeachersBySubject}>Search</Button>
      </div>

      <div className="teacher-list">
        <h3>Teachers</h3>
        <ul>
          {teachers.map((teacher) => (
            <li key={teacher.id}>
              {teacher.name} ({teacher.email}) - Subject: {teacher.subjectName}
              <Button onClick={() => handleOpenDialog("edit", teacher)}>
                Edit
              </Button>
              <Button onClick={() => handleOpenDialog("delete", teacher)}>
                Delete
              </Button>
              <Button
                onClick={() =>
                  handleOpenDialog("assign", {
                    name: teacher.name,
                    email: teacher.email,
                  })
                }
              >
                Assign Class
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
        {isDialogOpen.type === "edit" && (
          <>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogContent>
              <TextField
                label="Teacher Name"
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleUpdateTeacher}>Update</Button>
            </DialogActions>
          </>
        )}

        {isDialogOpen.type === "assign" && (
          <>
            <DialogTitle>Assign Teacher to Class</DialogTitle>
            <DialogContent>
              <TextField
                label="Teacher Full Name"
                value={assignment.teacherFullName}
                onChange={(e) =>
                  setAssignment({ ...assignment, teacherFullName: e.target.value })
                }
              />
              <TextField
                label="Teacher Email"
                value={assignment.teacherEmail}
                onChange={(e) =>
                  setAssignment({ ...assignment, teacherEmail: e.target.value })
                }
              />
              <TextField
                label="Class Name"
                value={assignment.className}
                onChange={(e) =>
                  setAssignment({ ...assignment, className: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleAssignTeacher}>Assign</Button>
            </DialogActions>
          </>
        )}

        {isDialogOpen.type === "delete" && (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the teacher {deletingTeacher?.name}?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDeleteTeacher}>Delete</Button>
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

      <div className="assigned-teachers">
  <h3>Assigned Teachers</h3>
  <ul>
    {assignedTeachers.map((assignment) => (
      <li key={assignment.teacherId}>
        Teacher Name: {assignment.teacherName} - Email: {assignment.teacherEmail}
        <br />
        Assigned Class: {assignment.className}
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default AdminTeachersPage;
