import React, {useCallback, useEffect, useState} from "react";
import {
    addTeacher,
    assignTeacherToClass,
    deleteTeacherById,
    deleteTeacherFromClass,
    getAssignedTeachers,
    getTeachers,
    updateTeacher,
    updateTeacherClassAssignment,
} from "../../../API /CRUDTeachersAPI";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import NavBar from "../../NavBar";

const AdminTeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [assignedTeachers, setAssignedTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({
        name: "", email: "", subjectId: "",
    });
    const [editTeacher, setEditTeacher] = useState(null);
    const [assignment, setAssignment] = useState({
        teacherFullName: "", teacherEmail: "", subjectName: "", className: "",
    });
    const [updateTeacherAssignment, setUpdateTeacherAssignment] = useState({
        teacherFullName: "", teacherEmail: "", currentClassName: "", newClassName: "",
    });
    const [isDialogOpen, setDialogOpen] = useState({type: "", open: false});
    const [deletingTeacher, setDeletingTeacher] = useState(null);
    const [notificationDialog, setNotificationDialog] = useState({
        open: false, message: "", type: "success",
    });
    const showNotificationDialog = (message, type = "success") => {
        setNotificationDialog({
            open: true, message: message, type: type,
        });
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [showAssignedTeachers, setShowAssignedTeachers] = useState(false);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
        open: false, teacher: null, className: null,
    });

    // Fetch teachers
    const fetchTeachers = useCallback(async () => {
        try {
            const result = await getTeachers();
            setTeachers(result || []);
        } catch (error) {
            showNotificationDialog("Failed to fetch teachers. Please try again.", "error");
        }
    }, []);

    // Fetch assigned teachers
    const fetchAssignedTeachers = useCallback(async () => {
        try {
            const result = await getAssignedTeachers();
            setAssignedTeachers(result || []);
        } catch (error) {
            showNotificationDialog("Failed to fetch assigned teachers. Please try again.");
        }
    }, []);

    const handleDeleteTeacherAssignment = async (assignedTeacher) => {
        // Open the confirmation dialog instead of using window.confirm
        setDeleteConfirmDialog({
            open: true,
            teacher: assignedTeacher.teacherFullName,
            className: assignedTeacher.className,
            data: assignedTeacher, // Store full data for deletion
        });
    };

    const confirmDeleteAssignment = async () => {
        const assignedTeacher = deleteConfirmDialog.data;
        if (!assignedTeacher) return;

        try {
            const assignmentDto = {
                TeacherEmail: assignedTeacher.teacherEmail,
                TeacherFullName: assignedTeacher.teacherFullName,
                ClassName: assignedTeacher.className,
                SubjectName: assignedTeacher.subjectName,
            };

            await deleteTeacherFromClass(assignmentDto);
            const updatedAssignedTeachers = await getAssignedTeachers();
            setAssignedTeachers(updatedAssignedTeachers);
            showNotificationDialog(`Teacher ${assignedTeacher.teacherFullName} has been removed from ${assignedTeacher.className}.`);
        } catch (error) {
            console.error("Error deleting teacher:", error);
            showNotificationDialog("Failed to remove teacher from class.", "error");
        } finally {
            setDeleteConfirmDialog({
                open: false, teacher: null, className: null, data: null,
            });
        }
    };

    const cancelDeleteAssignment = () => {
        setDeleteConfirmDialog({
            open: false, teacher: null, className: null, data: null,
        });
    };

    // Hàm mở form update lớp giáo viên
    const handleUpdateTeacherAssignment = (assignedTeacher) => {
        setUpdateTeacherAssignment({
            teacherFullName: assignedTeacher.teacherFullName,
            teacherEmail: assignedTeacher.teacherEmail,
            currentClassName: assignedTeacher.className,
            newClassName: "", // User will input this
        });
        setDialogOpen({type: "updateAssignment", open: true});
    };

    // Hàm xử lý khi người dùng nhấn Save để update lớp
    const submitUpdatedAssignment = async () => {
        try {
            await updateTeacherClassAssignment(updateTeacherAssignment);
            showNotificationDialog("Teacher's class assignment updated successfully.");
            setDialogOpen({type: "", open: false});
            fetchAssignedTeachers(); // Reload the teacher assignments
        } catch (error) {
            showNotificationDialog(`Failed to update teacher assignment: ${error.message}`);
        }
    };

    // Fetch teachers when the component mounts
    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Handle closing dialogs
    const handleCloseDialog = () => {
        setDialogOpen({type: "", open: false});
        setEditTeacher(null); // Reset editTeacher when dialog is closed
    };

    // Handle adding a new teacher
    const handleAddTeacher = async () => {
        if (!newTeacher.name || !newTeacher.email || !newTeacher.subjectId) {
            showNotificationDialog("Please enter full information.", "error");
            return;
        }

        try {
            await addTeacher(newTeacher);
            setNewTeacher({name: "", email: "", subjectId: ""});
            await fetchTeachers();
            await fetchAssignedTeachers();
        } catch (error) {
            showNotificationDialog(error.message || "Failed to add teacher.", "error");
        }
    };

    const handleOpenDialog = (type, data) => {
        if (type === "assign") {
            setAssignment({
                teacherFullName: data.name, teacherEmail: data.email, subjectName: data.subjectName, className: "",
            });
        } else if (type === "edit") {
            // Set editTeacher data to populate the dialog fields
            setEditTeacher(data);
        } else if (type === "delete") {
            setDeletingTeacher(data);
        }
        setDialogOpen({type, open: true});
    };

    // Handle assigning a teacher to a class
    const handleAssignTeacher = async () => {
        if (!assignment.className) {
            showNotificationDialog("Please enter class name.");
            return;
        }
        try {
            await assignTeacherToClass(assignment);
            await fetchAssignedTeachers();
            handleCloseDialog();
        } catch (error) {
            showNotificationDialog(error.message || "Failed to assign teacher to class.");
        }
    };

    // Handle updating a teacher
    const handleUpdateTeacher = async () => {
        if (!editTeacher || !editTeacher.teacherId) {
            showNotificationDialog("Teacher ID is missing.");
            return;
        }

        try {
            await updateTeacher(editTeacher.teacherId, {
                name: editTeacher.name, email: editTeacher.email, subjectId: editTeacher.subjectId,
            });

            await fetchTeachers(); // Fetch updated list of teachers
            handleCloseDialog();
        } catch (error) {
            showNotificationDialog(error.message || "Failed to update teacher.");
        }
    };

    // Handle deleting a teacher
    const handleDeleteTeacher = async () => {
        if (!deletingTeacher || !deletingTeacher.teacherId) {
            showNotificationDialog("No teacher selected for deletion.");
            return;
        }

        try {
            await deleteTeacherById(deletingTeacher.teacherId);
            setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.teacherId !== deletingTeacher.teacherId));

            await fetchAssignedTeachers();
            handleCloseDialog();
        } catch (error) {
            showNotificationDialog(error.message || "Failed to delete teacher.");
        }
    };

    // Show assigned teachers
    const handleShowAssignedTeachers = async () => {
        await fetchAssignedTeachers();
        setShowAssignedTeachers((prev) => !prev);
    };

    return (<div>
            <NavBar
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
            />

            <h1 style={{textAlign: "center"}}>Teacher Management</h1>
            <div
                className="section"
                style={{
                    display: "flex", flexDirection: "column", margin: "20px", alignItems: "center",
                }}
            >
                <h3 style={{margin: "20px"}}>Add New Teacher</h3>

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
                        onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                        style={{marginBottom: "10px"}}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                        style={{marginBottom: "10px"}}
                        fullWidth
                    />
                    <TextField
                        label="Subject ID"
                        value={newTeacher.subjectId}
                        onChange={(e) => setNewTeacher({...newTeacher, subjectId: e.target.value})}
                        style={{marginBottom: "10px"}}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "green", color: "white",
                        }}
                        onClick={handleAddTeacher}
                    >
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Table of Teachers */}
            <div className="section" style={{padding: "10px", margin: "20px"}}>
                <h3>Teachers</h3>
                {/* Table of Teachers */}
                <TableContainer
                    style={{
                        width: "90%",
                        height: "300px",
                        overflowY: "auto",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        marginLeft: "20px",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "25%", border: "1px solid #ddd" }}>
                                    Name
                                </TableCell>
                                <TableCell style={{ width: "25%", border: "1px solid #ddd" }}>
                                    Email
                                </TableCell>
                                <TableCell style={{ width: "25%", border: "1px solid #ddd" }}>
                                    Subject
                                </TableCell>
                                <TableCell style={{ width: "25%", border: "1px solid #ddd" }}>
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
                    backgroundColor: "orange", marginLeft: "30px", marginBottom: "30px",
                }}
                onClick={handleShowAssignedTeachers}
            >
                {showAssignedTeachers ? "Hide Assigned Teachers" : "Show Assigned Teachers"}
            </Button>

        {showAssignedTeachers && (
            <TableContainer
                style={{
                    width: "90%",
                    height: "300px",
                    overflowY: "auto",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    marginLeft: "20px",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                                Teacher Name
                            </TableCell>
                            <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                                Subject
                            </TableCell>
                            <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                                Class Name
                            </TableCell>
                            <TableCell style={{ width: "20%", border: "1px solid #ddd" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignedTeachers
                            .filter((teacher) =>
                                teacher.teacherFullName
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                            )
                            .map((assignedTeacher, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ border: "1px solid #ddd" }}>
                                        {assignedTeacher.teacherFullName}
                                    </TableCell>
                                    <TableCell style={{ border: "1px solid #ddd" }}>
                                        {assignedTeacher.subjectName}
                                    </TableCell>
                                    <TableCell style={{ border: "1px solid #ddd" }}>
                                        {assignedTeacher.className}
                                    </TableCell>
                                    <TableCell style={{ border: "1px solid #ddd" }}>
                                        <Button
                                            onClick={() =>
                                                handleUpdateTeacherAssignment(assignedTeacher)
                                            }
                                            variant="contained"
                                            color="primary"
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDeleteTeacherAssignment(assignedTeacher)
                                            } // Opens the delete dialog
                                            variant="contained"
                                            color="secondary"
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )}


        <Dialog
                open={isDialogOpen.type === "updateAssignment"}
                onClose={() => setDialogOpen({type: "", open: false})}
            >
                <DialogTitle>Update Teacher's Class Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Teacher Name"
                        value={updateTeacherAssignment.teacherFullName}
                        fullWidth
                        disabled
                        margin="dense"
                    />
                    <TextField
                        label="Teacher Email"
                        value={updateTeacherAssignment.teacherEmail}
                        fullWidth
                        disabled
                        margin="dense"
                    />
                    <TextField
                        label="Current Class Name"
                        value={updateTeacherAssignment.currentClassName}
                        fullWidth
                        disabled
                        margin="dense"
                    />
                    <TextField
                        label="New Class Name"
                        value={updateTeacherAssignment.newClassName}
                        onChange={(e) => setUpdateTeacherAssignment({
                            ...updateTeacherAssignment, newClassName: e.target.value,
                        })}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDialogOpen({type: "", open: false})}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submitUpdatedAssignment}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for assign and editing teachers */}
            {isDialogOpen.type === "assign" && (<Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
                    <DialogTitle>Assign Teacher to Class</DialogTitle>
                    <DialogContent style={{padding: "5px"}}>
                        <TextField
                            label="Class Name"
                            value={assignment.className}
                            onChange={(e) => setAssignment({...assignment, className: e.target.value})}
                            fullWidth
                            style={{marginBottom: "10px"}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleAssignTeacher}>Assign</Button>
                    </DialogActions>
                </Dialog>)}

            {isDialogOpen.type === "edit" && (<Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogContent style={{padding: "5px"}}>
                        <TextField
                            label="Name"
                            value={editTeacher.name}
                            onChange={(e) => setEditTeacher({...editTeacher, name: e.target.value})}
                            fullWidth
                            style={{marginBottom: "10px"}}
                        />
                        <TextField
                            label="Email"
                            value={editTeacher.email}
                            onChange={(e) => setEditTeacher({...editTeacher, email: e.target.value})}
                            fullWidth
                            style={{marginBottom: "10px"}}
                        />
                        <TextField
                            label="Subject ID"
                            value={editTeacher.subjectId}
                            onChange={(e) => setEditTeacher({...editTeacher, subjectId: e.target.value})}
                            fullWidth
                            style={{marginBottom: "10px"}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleUpdateTeacher}>Update</Button>
                    </DialogActions>
                </Dialog>)}

            {/* Dialog for confirming teacher deletion */}
            {isDialogOpen.type === "delete" && (<Dialog open={isDialogOpen.open} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete {deletingTeacher.name}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleDeleteTeacher}>Delete</Button>
                    </DialogActions>
                </Dialog>)}

            {/* Error and Success Dialog */}
            <Dialog
                open={notificationDialog.open}
                onClose={() => setNotificationDialog({open: false})}
            >
                <DialogTitle>
                    {notificationDialog.type === "success" ? "Success" : "Error"}
                </DialogTitle>
                <DialogContent>
                    <p>{notificationDialog.message}</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setNotificationDialog({open: false})}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmDialog.open} onClose={cancelDeleteAssignment}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <p>
                        Are you sure you want to remove {deleteConfirmDialog.teacher} from{" "}
                        {deleteConfirmDialog.className}?
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteAssignment} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteAssignment}
                        color="error"
                        variant="contained"
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </div>);
};

export default AdminTeachersPage;
