import React, { useEffect, useState } from "react";
import {
  ViewAllSemesters,
  AssignedClassesStudents,
  addScore,
  getScoresForStudent,
  calculateSemesterAverage,
} from "../../API /TeacherAPI"; // Ensure path is correct
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
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [scoreData, setScoreData] = useState({
    semesterId: "",
    scoreValue: "",
    examType: "",
  });
  const [selectedSemester, setSelectedSemester] = useState("");
  const [calculatedAverage, setCalculatedAverage] = useState(null);
  const [missingScoresMessage, setMissingScoresMessage] = useState("");

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

  const handleAddScore = async () => {
    const { semesterId, scoreValue, examType } = scoreData;

    if (!semesterId || !scoreValue || !examType) {
      setError("All fields (Semester, Score, and Exam Type) are required.");
      return;
    }

    const parsedScoreValue = parseFloat(scoreValue);
    if (isNaN(parsedScoreValue) || parsedScoreValue < 0 || parsedScoreValue > 10) {
      setError("Score must be a number between 0 and 10.");
      return;
    }

    try {
      const scoreEntry = {
        studentId: currentStudent.studentId,
        subjectId: currentStudent.subjectId,
        semesterId,
        scoreValue: parsedScoreValue,
        examType,
      };

      await addScore(scoreEntry);
      setError(null);
      setSuccessMessage("Score added successfully");
      resetScoreData();
      handleCloseDialog();

      const classesData = await AssignedClassesStudents();
      setAssignedClasses(classesData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error when adding score";
      setError(errorMessage);
    }
  };

  const handleViewScores = async (student) => {
    try {
      const scores = await getScoresForStudent(student.studentId);
      const semesterMap = semesters.reduce((map, semester) => {
        map[semester.semesterId] = semester.semesterType;
        return map;
      }, {});

      const filteredScores = scores.map((score) => ({
        semesterType: semesterMap[score.semesterId] || "Unknown",
        scoreValue: score.scoreValue,
        examType: score.examType,
      }));

      setStudentScores(filteredScores);
      setCurrentStudent(student);
      setOpenScoreDialog(true);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleCalculateAverage = async () => {
    try {
      // Lấy tất cả điểm của sinh viên cho học kỳ được chọn
      const scores = await getScoresForStudent(currentStudent.studentId);
      const scoresForSelectedSemester = scores.filter(
        (score) => score.semesterId === selectedSemester
      );
  
      // Kiểm tra từng loại bài kiểm tra
      const hasTestWhenClassBegins = scoresForSelectedSemester.some(
        (score) => score.examType === "TestWhenClassBegins"
      );
      const hasFifteenMinutesTest = scoresForSelectedSemester.some(
        (score) => score.examType === "FifteenMinutesTest"
      );
      const hasFortyFiveMinutesTest = scoresForSelectedSemester.some(
        (score) => score.examType === "FortyFiveMinutesTest"
      );
      const hasSemesterTest = scoresForSelectedSemester.some(
        (score) => score.examType === "SemesterTest"
      );
  
      // Tạo danh sách các loại bài kiểm tra bị thiếu
      const missingExamTypes = [];
      if (!hasTestWhenClassBegins) missingExamTypes.push("Test When Class Begins");
      if (!hasFifteenMinutesTest) missingExamTypes.push("Fifteen Minutes Test");
      if (!hasFortyFiveMinutesTest) missingExamTypes.push("Forty Five Minutes Test");
      if (!hasSemesterTest) missingExamTypes.push("Semester Test");
  
      // Nếu thiếu bất kỳ loại nào, hiển thị thông báo lỗi
      if (missingExamTypes.length > 0) {
        const missingTypesMessage = `Missing exam type: ${missingExamTypes.join(", ")}. You need enough to calculate semester average.`;
        setMissingScoresMessage(missingTypesMessage);
        setCalculatedAverage(null);
        return;
      }
  
      // Tính toán điểm trung bình nếu đủ điều kiện
      const average = await calculateSemesterAverage(
        currentStudent.studentId,
        selectedSemester
      );
      setCalculatedAverage(average);
      setSuccessMessage("Tính điểm trung bình thành công");
      setMissingScoresMessage("");
    } catch (error) {
      setError(error.message);
    }
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
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}>
          List Students
        </h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMessage && (
          <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>
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
              onChange={(e) =>
                setScoreData({ ...scoreData, examType: e.target.value })
              }
              fullWidth
            >
              {examTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Semester Type"
              select
              value={scoreData.semesterId}
              onChange={(e) =>
                setScoreData({ ...scoreData, semesterId: e.target.value })
              }
              fullWidth
            >
              {semesters.map((semester) => (
                <MenuItem key={semester.semesterId} value={semester.semesterId}>
                  {semester.semesterType}
                </MenuItem>
              ))}
            </TextField>
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
                  {semester.semesterType}
                </MenuItem>
              ))}
            </TextField>
            {calculatedAverage !== null && (
              <p>Calculated Average: {calculatedAverage}</p>
            )}
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
      </div>
    </div>
  );
};

export default ViewScore;
