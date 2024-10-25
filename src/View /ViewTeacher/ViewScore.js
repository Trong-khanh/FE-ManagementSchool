import React, { useEffect, useState } from "react";
import {
  ViewAllSemesters,
  AssignedClassesStudents,
  addScore,
} from "../../API /TeacherAPI";
import Navbar2 from "../Navbar2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";

const ViewScore = () => {
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");

  const [scoreData, setScoreData] = useState({
    value: "",
    semesterId: "",
    academicYear: "",
    examType: "",
    classId: "",
    testType: "", 
  });

  const teacherEmail = localStorage.getItem("teacherEmail");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semestersData = await ViewAllSemesters();
        console.log("Semesters Data:", semestersData);
        setSemesters(semestersData);
        setAcademicYears([
          ...new Set(semestersData.map((sem) => sem.academicYear)),
        ]);

        const classesData = await AssignedClassesStudents(teacherEmail);
        setAssignedClasses(classesData);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherEmail]);

  const handleAddScore = async () => {
    try {
      const response = await addScore(
        { ...scoreData, studentId: currentStudentId },
        teacherEmail
      );
      alert(response.data);
      resetScoreData();
      handleCloseDialog();
    } catch (err) {
      alert(
        "Error adding score: " +
          (err.response ? err.response.data : err.message)
      );
    }
  };

  const resetScoreData = () => {
    setScoreData({
      value: "",
      semesterId: "",
      academicYear: "",
      examType: "",
      classId: "",
      testType: "",
    });
  };

  const handleOpenDialog = (studentId) => {
    const classInfo = assignedClasses.find((c) => c.studentId === studentId);

    setCurrentStudentId(studentId);
    setScoreData({
      value: "",
      semesterId: classInfo.semesterId || "",
      academicYear: classInfo.academicYear || "",
      examType: "",
      classId: classInfo.classId || "", // Lấy ID lớp từ thông tin lớp
      testType: "", // Set initial value for test type
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetScoreData();
  };

  const filteredClasses = selectedClass
    ? assignedClasses.filter(
        (classInfo) => classInfo.className === selectedClass
      )
    : assignedClasses;

  const classOptions = [
    ...new Set(assignedClasses.map((classInfo) => classInfo.className)),
  ];

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "25px 0",
    fontSize: "18px",
    textAlign: "left",
    border: "1px solid #dddddd",
  };

  const thTdStyles = {
    padding: "12px 15px",
    border: "1px solid #dddddd",
  };

  const theadStyles = {
    backgroundColor: "#f2f2f2",
    border: "1px solid #dddddd",
  };

  return (
    <div>
      <Navbar2 />
      <h2>Assigned Students List</h2>

      {classOptions.length > 0 ? (
        <div>
          <label htmlFor="class-select">Select Class: </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classOptions.map((className, index) => (
              <option key={index} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No classes available</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error}</p>
      ) : (
        <div>
          <h3>Student Scores</h3>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thTdStyles}>Student Name</th>
                <th style={thTdStyles}>Class</th>
                <th style={thTdStyles}>Score</th>
                <th style={thTdStyles}>Semester</th>
                <th style={thTdStyles}>Academic Year</th>
                <th style={thTdStyles}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classInfo, index) => {
                const semester = semesters.find(
                  (sem) => sem.semesterId === classInfo.semesterId
                );
                return (
                  <tr key={index}>
                    <td style={thTdStyles}>{classInfo.studentFullName}</td>
                    <td style={thTdStyles}>{classInfo.className}</td>
                    <td style={thTdStyles}>
                      {classInfo.scoreValue || "No score yet"}
                    </td>
                    <td style={thTdStyles}>
                      {semester ? semester.name : "N/A"}
                    </td>
                    <td style={thTdStyles}>
                      {semester ? semester.academicYear : "N/A"}
                    </td>
                    <td style={thTdStyles}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenDialog(classInfo.studentId)}
                      >
                        Add Score
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Score</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Score Value"
            type="number"
            fullWidth
            variant="outlined"
            value={scoreData.value}
            onChange={(e) =>
              setScoreData({ ...scoreData, value: e.target.value })
            }
          />
          <Select
            margin="dense"
            fullWidth
            variant="outlined"
            value={scoreData.semesterId}
            onChange={(e) =>
              setScoreData({ ...scoreData, semesterId: e.target.value })
            }
          >
            <MenuItem value="">Select Semester</MenuItem>
            {semesters.map((semester) => (
              <MenuItem key={semester.semesterId} value={semester.semesterId}>
                {semester.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            margin="dense"
            fullWidth
            variant="outlined"
            value={scoreData.academicYear}
            onChange={(e) =>
              setScoreData({ ...scoreData, academicYear: e.target.value })
            }
          >
            <MenuItem value="">Select Academic Year</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          <Select
            margin="dense"
            fullWidth
            variant="outlined"
            value={scoreData.testType}
            onChange={(e) =>
              setScoreData({ ...scoreData, testType: e.target.value })
            }
          >
            <MenuItem value="">Select Test Type</MenuItem>
            <MenuItem value="Test when class begins">
              Test when class begins
            </MenuItem>
            <MenuItem value="15 minutes test">15 minutes test</MenuItem>
            <MenuItem value="45 minutes test">45 minutes test</MenuItem>
            <MenuItem value="semester test">Semester test</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Class ID"
            type="text"
            fullWidth
            variant="outlined"
            value={scoreData.classId}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddScore} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewScore;
