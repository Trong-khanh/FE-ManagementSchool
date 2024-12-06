import React, { useEffect, useState } from "react";
import {
  ViewAllSemesters,
  AssignedClassesStudents,
  addScore,
  getScoresForStudent,
  calculateSemesterAverage,
  getSemesterAverageForStudent,
} from "../../API /TeacherAPI";
import "./ViewScore.css";
import Navbar2 from "../Navbar2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const ViewScore = () => {
  const [semesters, setSemesters] = useState([]);
  const [examTypes] = useState([
    { value: "TestWhenClassBegins", label: "Test When Class Begins" },
    { value: "FifteenMinutesTest", label: "15 Minutes Test" },
    { value: "FortyFiveMinutesTest", label: "45 Minutes Test" },
    { value: "SemesterTest", label: "Semester Test" },
  ]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openScoreDialog, setOpenScoreDialog] = useState(false);
  const [openCalculateDialog, setOpenCalculateDialog] = useState(false);
  const [openViewSemesterDialog, setOpenViewSemesterDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [semesterAverageScore, setSemesterAverageScore] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [scoreData, setScoreData] = useState({
    semesterId: "",
    scoreValue: "",
    examType: "",
  });
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSemesterForView, setSelectedSemesterForView] = useState("");
  const [calculatedAverage, setCalculatedAverage] = useState(null);
  const [missingScoresMessage, setMissingScoresMessage] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semestersData = await ViewAllSemesters();
        setSemesters(semestersData);

        const classesData = await AssignedClassesStudents();
        setAssignedClasses(classesData);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationOpen(true);
  };
  const handleAddScore = async () => {
    // Use the selectedSemester instead of scoreData.semesterId
    const { scoreValue, examType } = scoreData;

    // Use selectedSemester for semesterId
    const semesterId = selectedSemester;

    if (!semesterId || !scoreValue || !examType) {
      showNotification("All fields (Semester, Score, and Exam Type) are required.", "error");
      return;
    }

    const parsedScoreValue = parseFloat(scoreValue);
    if (isNaN(parsedScoreValue) || parsedScoreValue < 0 || parsedScoreValue > 10) {
      showNotification("Score must be a number between 0 and 10.", "error");
      return;
    }

    const examTypeMap = {
      TestWhenClassBegins: 0,
      FifteenMinutesTest: 1,
      FortyFiveMinutesTest: 2,
      SemesterTest: 3,
    };

    const examTypeValue = examTypeMap[examType];
    if (examTypeValue === undefined) {
      showNotification("Invalid Exam Type selected.", "error");
      return;
    }

    try {
      const scoreEntry = {
        studentId: currentStudent.studentId,
        subjectId: currentStudent.subjectId,
        semesterId: parseInt(semesterId),
        scoreValue: parsedScoreValue,
        examType: examTypeValue,
      };

      console.log("Score Entry being sent to backend:", scoreEntry);

      await addScore(scoreEntry);
      showNotification("Score added successfully", "success");
      resetScoreData();
      handleCloseDialog();
      const classesData = await AssignedClassesStudents();
      setAssignedClasses(classesData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error when adding score";
      showNotification(errorMessage, "error");
    }
  };

  const handleViewScores = async (student) => {
    try {
      // Get the selected subjectId and semesterId from the student's data
      const subjectId = student.subjectId;
      const semesterId = selectedSemester || null;

      // Make the API call with query parameters
      const scores = await getScoresForStudent(student.studentId, subjectId, semesterId);

      // Map backend response to frontend format
      const semesterMap = semesters.reduce((map, semester) => {
        map[semester.semesterId] = semester.semesterType;
        return map;
      }, {});

      // Map exam types
      const examTypeNames = {
        0: "Test When Class Begins",
        1: "Fifteen Minutes Test",
        2: "Forty Five Minutes Test",
        3: "Semester Test"
      };

      const filteredScores = scores.map((score) => ({
        semesterType: semesterMap[score.semesterId] === "Semester1" ? "Semester 1" : "Semester 2",
        scoreValue: score.scoreValue,
        examType: examTypeNames[score.examType] || "Unknown Exam Type",
      }));

      setStudentScores(filteredScores);
      setCurrentStudent(student);
      setOpenScoreDialog(true);
    } catch (error) {
      showNotification(error.message || "An error occurred while fetching scores.", "error");
    }
  };

  const handleCalculateAverage = async () => {
    try {
      const scores = await getScoresForStudent(currentStudent.studentId);
      const scoresForSelectedSemester = scores.filter(
          (score) => score.semesterId === selectedSemester
      );

      const missingExamTypes = [];
      const requiredExamTypes = [0, 1, 2, 3];

      requiredExamTypes.forEach((type) => {
        if (!scoresForSelectedSemester.some((score) => score.examType === type)) {
          missingExamTypes.push(type);
        }
      });

      if (missingExamTypes.length > 0) {
        const missingLabels = missingExamTypes.map(type => {
          switch(type) {
            case 0: return "Test When Class Begins";
            case 1: return "Fifteen Minutes Test";
            case 2: return "Forty Five Minutes Test";
            case 3: return "Semester Test";
            default: return "Unknown";
          }
        });
        setMissingScoresMessage(`Missing exam type(s): ${missingLabels.join(", ")}`);
        setCalculatedAverage(null);
        return;
      }

      const average = await calculateSemesterAverage(
          currentStudent.studentId,
          selectedSemester
      );
      setCalculatedAverage(average);
      showNotification("Semester average calculated successfully", "success");
      setMissingScoresMessage("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewYearAverage = async () => {
    if (!selectedSemesterForView || !currentStudent) {
      showNotification("Please select a semester.", "error");
      return;
    }
    try {
      const average = await getSemesterAverageForStudent(
          currentStudent.studentId,
          selectedSemesterForView
      );

      if (!average) {
        showNotification("No average score found for the specified student, subject, and semester.", "error");
        return;
      }

      setSemesterAverageScore(average);
      showNotification("Semester average retrieved successfully", "success");
    } catch (error) {
      showNotification(error.message || "An error occurred while fetching the average.", "error");
    }
  };

  const handleOpenViewSemesterDialog = async (student) => {
    try {
      // Immediately fetch semester average when dialog opens
      const average = await getSemesterAverageForStudent(
          student.studentId,
          // Default to first semester if multiple exist
          semesters.length > 0 ? semesters[0].semesterId : null
      );

      setCurrentStudent(student);
      setSemesterAverageScore(average);
      setOpenViewSemesterDialog(true);
    } catch (error) {
      showNotification(
          error.message || "An error occurred while fetching semester average.",
          "error"
      );
    }
  };
  const handleCloseViewSemesterDialog = () => {
    setOpenViewSemesterDialog(false);
    setSelectedSemesterForView("");
    setSemesterAverageScore(null);
  };

  const resetScoreData = () => {
    setScoreData({
      semesterId: "",
      scoreValue: "",
      examType: "",
    });
    setSuccessMessage("");
  };

  const handleOpenDialog = (student) => {
    setCurrentStudent(student);
    setOpenDialog(true);
    setSelectedSemester(semesters.length > 0 ? semesters[0].semesterId : "");
    resetScoreData();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetScoreData();
  };

  const handleCloseScoreDialog = () => {
    setOpenScoreDialog(false);
    setStudentScores([]);
  };

  const handleOpenCalculateDialog = (student) => {
    setCurrentStudent(student);
    setCalculatedAverage(null);
    setMissingScoresMessage("");
    setOpenCalculateDialog(true);
  };

  const handleCloseCalculateDialog = () => {
    setOpenCalculateDialog(false);
    setSelectedSemester("");
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

  return (
      <div>
        <Navbar2 />
        <div style={{ padding: "20px" }}>
          <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
          >
            List Students
          </h2>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {successMessage && (
              <div style={{ color: "green", marginBottom: "10px" }}>
                {successMessage}
              </div>
          )}
          {missingScoresMessage && (
              <div style={{ color: "red" }}>{missingScoresMessage}</div>
          )}

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
          ) : (
              <div>
                <h3>Student's Score</h3>
                <table style={tableStyles}>
                  <thead>
                  <tr>
                    <th style={thTdStyles}>Student Full Name</th>
                    <th style={thTdStyles}>Class Name</th>
                    <th style={thTdStyles}>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredClasses.map((classInfo, index) => (
                      <tr key={index}>
                        <td style={thTdStyles}>{classInfo.studentFullName}</td>
                        <td style={thTdStyles}>{classInfo.className}</td>
                        <td style={thTdStyles}>
                          <button onClick={() => handleOpenDialog(classInfo)}>
                            Add Score
                          </button>
                          <button onClick={() => handleViewScores(classInfo)}>
                            View Scores
                          </button>
                          <button
                              onClick={() => handleOpenCalculateDialog(classInfo)}
                          >
                            Calculate Average
                          </button>
                          <button
                              onClick={() => handleOpenViewSemesterDialog(classInfo)}
                          >
                            View Semester Average
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {/* Dialog for Adding Scores */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add Score</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                    label="Score"
                    type="number"
                    value={scoreData.scoreValue}
                    onChange={(e) =>
                        setScoreData({ ...scoreData, scoreValue: e.target.value })
                    }
                    fullWidth
                    error={
                        scoreData.scoreValue !== "" &&
                        (scoreData.scoreValue < 0 || scoreData.scoreValue > 10)
                    }
                    helperText="Score must be between 0 and 10"
                />
                <TextField
                    label="Exam Type"
                    select
                    value={scoreData.examType}
                    onChange={(e) => {
                      setScoreData({ ...scoreData, examType: e.target.value });
                    }}
                    fullWidth
                >
                  {examTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                  ))}
                </TextField>


                <TextField
                    label="Select Semester"
                    select
                    fullWidth
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {semesters.map((semester) => (
                      <MenuItem key={semester.semesterId} value={semester.semesterId}>
                        {semester.semesterType === "Semester1" ? "Semester 1" : "Semester 2"}
                      </MenuItem>
                  ))}
                </TextField>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddScore} color="primary">
                Add/Edit Score
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Viewing Scores */}
          <Dialog open={openScoreDialog} onClose={handleCloseScoreDialog}>
            <DialogTitle>Student Scores</DialogTitle>
            <DialogContent>
              {studentScores.length > 0 ? (
                  <Table style={tableStyles}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={thTdStyles}>Semester Type</TableCell>
                        <TableCell style={thTdStyles}>Score</TableCell>
                        <TableCell style={thTdStyles}>Exam Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentScores.map((score, index) => (
                          <TableRow key={index}>
                            <TableCell style={thTdStyles}>
                              {score.semesterType}
                            </TableCell>
                            <TableCell style={thTdStyles}>
                              {score.scoreValue}
                            </TableCell>
                            <TableCell style={thTdStyles}>{score.examType}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              ) : (
                  <p>No scores available for this student.</p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseScoreDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Calculating Average */}
          <Dialog open={openCalculateDialog} onClose={handleCloseCalculateDialog}>
            <DialogTitle>Calculate Semester Average</DialogTitle>
            <DialogContent>
              <TextField
                  label="Select Semester"
                  select
                  fullWidth
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesters.map((semester) => (
                    <MenuItem key={semester.semesterId} value={semester.semesterId}>
                      {semester.semesterType === "Semester1" ? "Semester 1" : "Semester 2"}
                    </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCalculateDialog} color="secondary">
                Close
              </Button>
              <Button
                  onClick={handleCalculateAverage}
                  color="primary"
                  disabled={!selectedSemester}
              >
                Calculate
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Viewing Semester Average */}
          <Dialog
              open={openViewSemesterDialog}
              onClose={handleCloseViewSemesterDialog}
          >
            <DialogTitle>View Semester Average</DialogTitle>
            <DialogContent>
              {semesterAverageScore ? (
                  <div>
                    <p>
                      Semester Average 1:{" "}
                      {semesterAverageScore.semesterAverage1 || "Not yet available"}
                    </p>
                    <p>
                      Semester Average 2:{" "}
                      {semesterAverageScore.semesterAverage2 || "Not yet available"}
                    </p>
                    {semesterAverageScore.annualAverage && (
                        <p>Annual Average: {semesterAverageScore.annualAverage}</p>
                    )}
                  </div>
              ) : (
                  <p>Loading semester averages...</p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewSemesterDialog} color="secondary">
                Close
              </Button>
              <Button
                  onClick={handleViewYearAverage}
                  color="primary"
                  disabled={!selectedSemesterForView}
              >
              </Button>
            </DialogActions>
          </Dialog>


          <Dialog open={notificationOpen} onClose={() => setNotificationOpen(false)}>
            <DialogTitle>{notificationType === "error" ? "Error" : "Success"}</DialogTitle>

            <DialogContent>
              <p>{notificationMessage}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setNotificationOpen(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
  );
};

export default ViewScore;