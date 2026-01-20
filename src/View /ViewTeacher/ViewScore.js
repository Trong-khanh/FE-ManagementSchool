import React, { useEffect, useState } from "react";
import {
  ViewAllSemesters,
  AssignedClassesStudents,
  addScore,
  getScoresForStudent,
  calculateSemesterAverage,
  getSemesterAverageForStudent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalculateIcon from '@mui/icons-material/Calculate';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
    const { scoreValue, examType } = scoreData;
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
      const subjectId = student.subjectId;
      const semesterId = selectedSemester || null;
      const scores = await getScoresForStudent(student.studentId, subjectId, semesterId);

      const semesterMap = semesters.reduce((map, semester) => {
        map[semester.semesterId] = semester.semesterType;
        return map;
      }, {});

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
        return;
      }

      await calculateSemesterAverage(
          currentStudent.studentId,
          selectedSemester
      );
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
      const average = await getSemesterAverageForStudent(
          student.studentId,
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

  return (
    <div>
      <Navbar2 />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
                  Student List
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                {missingScoresMessage && <Alert severity="warning" sx={{ mb: 2 }}>{missingScoresMessage}</Alert>}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      select
                      label="Select Class"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>All Classes</em>
                      </MenuItem>
                      {classOptions.map((className, index) => (
                        <MenuItem key={index} value={className}>
                          {className}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="student table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Student Name</TableCell>
                          <TableCell>Class</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredClasses.map((classInfo, index) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {classInfo.studentFullName}
                            </TableCell>
                            <TableCell>{classInfo.className}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Add Score">
                                <IconButton color="primary" onClick={() => handleOpenDialog(classInfo)}>
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Scores">
                                <IconButton color="info" onClick={() => handleViewScores(classInfo)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Calculate Average">
                                <IconButton color="secondary" onClick={() => handleOpenCalculateDialog(classInfo)}>
                                  <CalculateIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Semester Average">
                                <IconButton color="success" onClick={() => handleOpenViewSemesterDialog(classInfo)}>
                                  <AssessmentIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog for Adding Scores */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Add Score</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Score"
                  type="number"
                  value={scoreData.scoreValue}
                  onChange={(e) => setScoreData({ ...scoreData, scoreValue: e.target.value })}
                  fullWidth
                  error={scoreData.scoreValue !== "" && (scoreData.scoreValue < 0 || scoreData.scoreValue > 10)}
                  helperText="Score must be between 0 and 10"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Exam Type"
                  select
                  value={scoreData.examType}
                  onChange={(e) => setScoreData({ ...scoreData, examType: e.target.value })}
                  fullWidth
                >
                  {examTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
            <Button onClick={handleAddScore} variant="contained" color="primary">Add Score</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Viewing Scores */}
        <Dialog open={openScoreDialog} onClose={handleCloseScoreDialog} fullWidth maxWidth="md">
          <DialogTitle>Student Scores</DialogTitle>
          <DialogContent>
            {studentScores.length > 0 ? (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Semester</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Exam Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentScores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.semesterType}</TableCell>
                        <TableCell>{score.scoreValue}</TableCell>
                        <TableCell>{score.examType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ mt: 2 }}>No scores available for this student.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseScoreDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Calculating Average */}
        <Dialog open={openCalculateDialog} onClose={handleCloseCalculateDialog} fullWidth maxWidth="sm">
          <DialogTitle>Calculate Semester Average</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
               <Grid item xs={12}>
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
               </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCalculateDialog} color="inherit">Close</Button>
            <Button onClick={handleCalculateAverage} variant="contained" color="primary" disabled={!selectedSemester}>
              Calculate
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Viewing Semester Average */}
        <Dialog open={openViewSemesterDialog} onClose={handleCloseViewSemesterDialog} fullWidth maxWidth="sm">
          <DialogTitle>View Semester Average</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                 {semesterAverageScore ? (
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Semester 1:</strong> {semesterAverageScore.semesterAverage1 || "Not yet available"}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Semester 2:</strong> {semesterAverageScore.semesterAverage2 || "Not yet available"}
                    </Typography>
                    {semesterAverageScore.annualAverage && (
                      <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                        Annual Average: {semesterAverageScore.annualAverage}
                      </Typography>
                    )}
                  </Paper>
                ) : (
                  <Typography>Loading semester averages...</Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewSemesterDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={notificationOpen} onClose={() => setNotificationOpen(false)}>
          <DialogTitle sx={{ color: notificationType === "error" ? "error.main" : "success.main" }}>
            {notificationType === "error" ? "Error" : "Success"}
          </DialogTitle>
          <DialogContent>
            <Typography>{notificationMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotificationOpen(false)} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ViewScore;
