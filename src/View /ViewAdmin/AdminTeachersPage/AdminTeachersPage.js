import NavBar from "../../NavBar";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", subjectName: "Toán" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", subjectName: "Vật Lý" },
  ]); // Dữ liệu giáo viên giả

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    subjectName: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Kiểm tra tên giáo viên không chứa số
  const isValidName = (name) => {
    return !/\d/.test(name);
  };

  // Xử lý nhập dữ liệu
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  // Thêm giáo viên vào danh sách
  const handleAddTeacher = () => {
    const { name } = newTeacher;

    if (!isValidName(name)) {
      setErrorMessage("Tên giáo viên không được chứa số.");
      return;
    }

    const newId = teachers.length + 1;
    setTeachers([...teachers, { ...newTeacher, id: newId }]);
    setNewTeacher({ name: "", email: "", subjectName: "" }); // Reset form
    setErrorMessage(""); // Xóa thông báo lỗi
  };

  // Bắt đầu chỉnh sửa giáo viên
  const handleEditTeacher = (teacher) => {
    setNewTeacher(teacher);
    setEditMode(true);
    setEditTeacherId(teacher.id);
  };

  // Cập nhật giáo viên
  const handleUpdateTeacher = () => {
    const { name } = newTeacher;

    if (!isValidName(name)) {
      setErrorMessage("Tên giáo viên không được chứa số.");
      return;
    }

    setTeachers(
      teachers.map((teacher) =>
        teacher.id === editTeacherId ? { ...newTeacher, id: teacher.id } : teacher
      )
    );
    setNewTeacher({ name: "", email: "", subjectName: "" });
    setEditMode(false);
    setEditTeacherId(null);
    setErrorMessage(""); // Xóa thông báo lỗi
  };

  // Xóa giáo viên khỏi danh sách
  const handleDeleteTeacher = (id) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

  return (
    <div>
      {/* Hiển thị NavBar */}
      <NavBar />
      
      <div style={{ padding: "20px" }}>
        <h2>Quản lý giáo viên</h2>
        <div>
          <TextField
            label="Tên đầy đủ"
            name="name"
            value={newTeacher.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newTeacher.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên môn học"
            name="subjectName"
            value={newTeacher.subjectName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button
            variant="contained"
            color="primary"
            onClick={editMode ? handleUpdateTeacher : handleAddTeacher}
          >
            {editMode ? "Cập nhật giáo viên" : "Thêm giáo viên"}
          </Button>
        </div>

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên đầy đủ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tên môn học</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subjectName}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      Sửa
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AdminTeachersPage;
