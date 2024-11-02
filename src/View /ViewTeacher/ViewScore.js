import React, { useEffect, useState } from "react";
import { ViewAllSemesters, AssignedClassesStudents, addScore } from "../../API /TeacherAPI"; 
import Navbar2 from "../Navbar2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
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
  const [currentStudent, setCurrentStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [scoreData, setScoreData] = useState({
    semesterId: "",
    scoreValue: "",
    examType: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semestersData = await ViewAllSemesters();
        setSemesters(semestersData);

        // Fetch assigned classes
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
    try {
      const scoreEntry = {
        studentId: currentStudent.studentId,
        subjectId: currentStudent.subjectId, 
        semesterId: scoreData.semesterId,
        scoreValue: parseFloat(scoreData.scoreValue), 
        examType: scoreData.examType,
      };

      await addScore(scoreEntry);
      setSuccessMessage("Điểm đã được thêm thành công!");
      resetScoreData();
      handleCloseDialog();

      // Reload the assigned classes list after adding the score
      const classesData = await AssignedClassesStudents();
      setAssignedClasses(classesData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi khi thêm điểm";
      setError(errorMessage);
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

  const filteredClasses = selectedClass
    ? assignedClasses.filter((classInfo) => classInfo.className === selectedClass)
    : assignedClasses;

  const classOptions = [...new Set(assignedClasses.map((classInfo) => classInfo.className))];

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
      <h2>Danh sách học sinh đã phân công</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {classOptions.length > 0 ? (
        <div>
          <label htmlFor="class-select">Chọn lớp: </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Tất cả các lớp</option>
            {classOptions.map((className, index) => (
              <option key={index} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Không có lớp nào</p>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>Lỗi khi tải dữ liệu: {error}</p>
      ) : (
        <div>
          <h3>Điểm của học sinh</h3>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thTdStyles}>Tên học sinh</th>
                <th style={thTdStyles}>Tên môn</th>
                <th style={thTdStyles}>Loại học kỳ</th>
                <th style={thTdStyles}>Loại bài kiểm tra</th>
                <th style={thTdStyles}>Điểm</th>
                <th style={thTdStyles}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classInfo, index) => (
                <tr key={index}>
                  <td style={thTdStyles}>{classInfo.studentFullName}</td>
                  <td style={thTdStyles}>{classInfo.subjectName || "N/A"}</td>
                  <td style={thTdStyles}>{classInfo.semesterName || "N/A"}</td>
                  <td style={thTdStyles}>{classInfo.examType || "N/A"}</td>
                  <td style={thTdStyles}>{classInfo.scoreValue || "Chưa có điểm"}</td>
                  <td style={thTdStyles}>
                    <button onClick={() => handleOpenDialog(classInfo)}>Thêm/Sửa điểm</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog for Adding Scores */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thêm/Sửa điểm</DialogTitle>
        <DialogContent>
          <TextField
            label="Điểm"
            type="number"
            value={scoreData.scoreValue}
            onChange={(e) => setScoreData({ ...scoreData, scoreValue: e.target.value })}
            fullWidth
          />
          <TextField
            label="Loại bài kiểm tra"
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
          <TextField
            label="Loại học kỳ"
            select
            value={scoreData.semesterId}
            onChange={(e) => setScoreData({ ...scoreData, semesterId: e.target.value })}
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
          <Button onClick={handleCloseDialog} color="secondary">Hủy</Button>
          <Button onClick={handleAddScore} color="primary">Thêm/Sửa điểm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewScore;
