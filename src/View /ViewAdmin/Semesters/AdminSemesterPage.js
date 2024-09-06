import React, { useState, useEffect } from "react";
import SemesterForm from "./SemesterForm";
import SemesterList from "./SemesterList";
import NavBar from "../../NavBar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "../SemestersCSS/AdminSemesterPage.css";
import {
  addSemester,
  getAllSemesters,
  updatedSemester,
  deleteSemester,
} from "../../../API /CRUDSemesterAPI"; 

function AdminSemesterPage() {
  const [semesters, setSemesters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSemester, setEditingSemester] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingSemester, setDeletingSemester] = useState(null);

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Fetch all semesters from the backend
  const fetchSemesters = async () => {
    try {
      const semesterData = await getAllSemesters();
      setSemesters(semesterData);
    } catch (error) {
      console.error("An error occurred while retrieving the semester list:", error);
    }
  };

  // Add or Update Semester
  const handleAddOrUpdateSemester = async (semester) => {
    try {
      if (editingSemester) {
        await updatedSemester(editingSemester.semesterId, semester); // Call API to update
      } else {
        await addSemester(semester); // Call API to add new
      }
      fetchSemesters(); // Refresh semester list
      setEditingSemester(null); // Reset form
    } catch (error) {
      console.error(editingSemester ? "An error occurred while updating the semester:" : "An error occurred while adding a semester:", error);
    }
  };

  // Handle edit action
  const handleEdit = (semester) => {
    setEditingSemester(semester);
  };

  // Open delete confirmation dialog
  const handleOpenConfirmDialog = (semester) => {
    setDeletingSemester(semester);
    setOpenConfirmDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeletingSemester(null);
  };

  // Confirm and delete semester
  const handleConfirmDelete = async () => {
    if (!deletingSemester) return;
    try {
      await deleteSemester(deletingSemester.semesterId); // Call API to delete
      fetchSemesters(); // Refresh semester list
    } catch (error) {
      console.error("error when deleting a semester:", error);
    }
    handleCloseConfirmDialog();
  };

  // Search handler
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="admin-semester-page">
      <div className="nav-bar">
        <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      </div>
      <div className="content">
        <div className="form-container">
          <SemesterForm
            onAddSemester={handleAddOrUpdateSemester}
            editingSemester={editingSemester}
          />
        </div>
        <div className="list-container">
          <SemesterList
            semesters={semesters.filter((semester) =>
              semester.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onEdit={handleEdit}
            onDelete={handleOpenConfirmDialog}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to delete the semester? {deletingSemester?.name}? This action cannot be undone.
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

export default AdminSemesterPage;
