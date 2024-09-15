import React, { useState, useEffect } from 'react';
import { addTeacher, getTeachers, assignTeacherToClass, getAssignedTeachers, updateTeacher, deleteTeacherById, getTeachersBySubject } from '../../../API /CRUDTeachersAPI';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import NavBar from '../../NavBar';
import '../AdminTeachersPageCSS/AdminTeachersPage.css';

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subjectId: '' });
  const [editTeacher, setEditTeacher] = useState(null);
  const [assignment, setAssignment] = useState({ teacherFullName: '', teacherEmail: '', className: '' });
  const [isDialogOpen, setDialogOpen] = useState({ type: '', open: false });
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchAssignedTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const result = await getTeachers();
      console.log("Fetched teachers:", result); // Log the result to check the structure
      setTeachers(result);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  

  const fetchAssignedTeachers = async () => {
    try {
      const result = await getAssignedTeachers();
      console.log("Fetched assigned teachers:", result); // Log the result to verify
      setAssignedTeachers(result);
    } catch (error) {
      console.error(error.message);
    }
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
    try {
      const addedTeacher = await addTeacher(newTeacher);
      setTeachers([...teachers, addedTeacher]);
      setNewTeacher({ name: '', email: '', subjectId: '' });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenDialog = (type, data) => {
  if (type === 'assign') {
    setAssignment({ teacherFullName: data.name, teacherEmail: data.email, className: '' });
  } else if (type === 'edit') {
    setEditTeacher(data);
  } else if (type === 'delete') {
    setDeletingTeacher(data); // Make sure data includes the correct 'id' field
  }
  setDialogOpen({ type, open: true });
};


  const handleCloseDialog = () => {
    setDialogOpen({ type: '', open: false });
  };

  const handleAssignTeacher = async () => {
    try {
      await assignTeacherToClass(assignment);
      fetchAssignedTeachers();
      handleCloseDialog();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      if (!editTeacher || !editTeacher.teacherId) {
        console.error("Invalid teacher data for update");
        return;
      }
      await updateTeacher(editTeacher.teacherId, {
        name: editTeacher.name,
        email: editTeacher.email,
        subjectId: editTeacher.subjectId
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
  
    console.log("Teacher to delete:", deletingTeacher);  // Debugging line
    console.log("Teacher ID:", deletingTeacher.id);  // Check if the ID is defined
  
    try {
      await deleteTeacherById(deletingTeacher.teacherId);  // Ensure deletingTeacher has a valid 'id'
      fetchTeachers();  // Refresh the teacher list after deletion
      handleCloseDialog();  // Close the dialog after the operation
    } catch (error) {
      console.error("Error when deleting teacher:", error.message || error);
      alert("Failed to delete teacher. Please try again.");
    }
  };
  


  return (
    <div>
      <NavBar searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} />

      <h2>Teacher Management</h2>

      <div className="teacher-form">
        <h3>Add New Teacher</h3>
        <TextField
          label="Teacher Name"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={newTeacher.email}
          onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
        />
        <TextField
          label="Subject ID"
          value={newTeacher.subjectId}
          onChange={(e) => setNewTeacher({ ...newTeacher, subjectId: e.target.value })}
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
            <li key={teacher.id}> {/* Use id instead of email for the key */}
              {teacher.name} ({teacher.email}) - Subject: {teacher.subjectName}
              <Button onClick={() => handleOpenDialog('edit', teacher)}>Edit</Button>
              <Button onClick={() => handleOpenDialog('delete', teacher)}>Delete</Button>
              <Button onClick={() => handleOpenDialog('assign', teacher)}>Assign to Class</Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="assigned-teachers">
        <h3>Assigned Teachers</h3>
        <ul>
          {assignedTeachers.map((assignment, index) => (
            <li key={index}>
              {assignment.teacherFullName} ({assignment.teacherEmail}) - Class: {assignment.className}
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={isDialogOpen.open && isDialogOpen.type === 'assign'} onClose={handleCloseDialog}>
        <DialogTitle>Assign Teacher to Class</DialogTitle>
        <DialogContent>
          <TextField
            label="Class Name"
            value={assignment.className}
            onChange={(e) => setAssignment({ ...assignment, className: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignTeacher}>Assign</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen.open && isDialogOpen.type === 'edit'} onClose={handleCloseDialog}>
        <DialogTitle>Edit Teacher Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Teacher Name"
            value={editTeacher?.name}
            onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
          />
          <TextField
            label="Email"
            value={editTeacher?.email}
            onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
          />
          <TextField
            label="Subject ID"
            value={editTeacher?.subjectId}
            onChange={(e) => setEditTeacher({ ...editTeacher, subjectId: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateTeacher}>Update</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen.open && isDialogOpen.type === 'delete'} onClose={handleCloseDialog}>
        <DialogTitle>Delete Teacher</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete {deletingTeacher?.name}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTeacher}>Delete</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTeachersPage;
