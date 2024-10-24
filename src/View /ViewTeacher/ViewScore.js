import React, { useEffect, useState } from 'react';
import { ViewAllSemesters, AssignedClassesStudents, addScore } from '../../API /TeacherAPI'; 
import Navbar2 from '../Navbar2'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select } from '@mui/material';

const ViewScore = () => {
    const [semesters, setSemesters] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState('');

    const [scoreData, setScoreData] = useState({
        value: '',
        semesterId: '',
        academicYear: '',
        examType: '',
        classId: '',
        testType: '' // New field for test type
    });

    const teacherEmail = localStorage.getItem('teacherEmail');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const semestersData = await ViewAllSemesters();
                console.log('Semesters Data:', semestersData);
                setSemesters(semestersData);
                setAcademicYears([...new Set(semestersData.map(sem => sem.academicYear))]); 

                const classesData = await AssignedClassesStudents(teacherEmail);
                setAssignedClasses(classesData);
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [teacherEmail]);

    const handleAddScore = async () => {
        try {
            const response = await addScore({ ...scoreData, studentId: currentStudentId }, teacherEmail);
            alert(response.data); 
            resetScoreData();
            handleCloseDialog();
        } catch (err) {
            alert('Error adding score: ' + (err.response ? err.response.data : err.message));
        }
    };

    const resetScoreData = () => {
        setScoreData({
            value: '',
            semesterId: '',
            academicYear: '',
            examType: '',
            classId: '',
            testType: '' // Reset test type
        });
    };

    const handleOpenDialog = (studentId) => {
        const classInfo = assignedClasses.find(c => c.studentId === studentId);
        
        setCurrentStudentId(studentId);
        setScoreData({
            value: '',
            semesterId: classInfo.semesterId || '',
            academicYear: classInfo.academicYear || '',
            examType: '',
            classId: classInfo.classId || '', // Lấy ID lớp từ thông tin lớp
            testType: '' // Set initial value for test type
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetScoreData();
    };

    const filteredClasses = selectedClass
        ? assignedClasses.filter(classInfo => classInfo.className === selectedClass)
        : assignedClasses;

    const classOptions = [...new Set(assignedClasses.map(classInfo => classInfo.className))];

    return (
        <div>
            <Navbar2 />
            <h2>Danh sách sinh viên được giao</h2>

            {classOptions.length > 0 ? (
                <div>
                    <label htmlFor="class-select">Chọn lớp: </label>
                    <select
                        id="class-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">Tất cả lớp</option>
                        {classOptions.map((className, index) => (
                            <option key={index} value={className}>{className}</option>
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
                    <h3>Điểm sinh viên</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sinh viên</th>
                                <th>Lớp</th>
                                <th>Điểm</th>
                                <th>Học kỳ</th>
                                <th>Năm học</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((classInfo, index) => {
                                const semester = semesters.find(sem => sem.semesterId === classInfo.semesterId);
                                return (
                                    <tr key={index}>
                                        <td>{classInfo.studentFullName}</td>
                                        <td>{classInfo.className}</td>
                                        <td>{classInfo.scoreValue || 'Chưa có điểm'}</td>
                                        <td>{semester ? semester.name : 'N/A'}</td>
                                        <td>{semester ? semester.academicYear : 'N/A'}</td>
                                        <td>
                                            <Button variant="contained" onClick={() => handleOpenDialog(classInfo.studentId)}>Thêm điểm</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialog for adding score */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Thêm Điểm</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Giá trị điểm"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={scoreData.value}
                        onChange={(e) => setScoreData({ ...scoreData, value: e.target.value })}
                    />
                    <Select
                        margin="dense"
                        fullWidth
                        variant="outlined"
                        value={scoreData.semesterId}
                        onChange={(e) => setScoreData({ ...scoreData, semesterId: e.target.value })}
                    >
                        <MenuItem value="">Chọn học kỳ</MenuItem>
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
                        onChange={(e) => setScoreData({ ...scoreData, academicYear: e.target.value })}
                    >
                        <MenuItem value="">Chọn năm học</MenuItem>
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
                        onChange={(e) => setScoreData({ ...scoreData, testType: e.target.value })}
                    >
                        <MenuItem value="">Chọn loại bài kiểm tra</MenuItem>
                        <MenuItem value="Test when class begins">Test when class begins</MenuItem>
                        <MenuItem value="15 minutes test">15 minutes test</MenuItem>
                        <MenuItem value="45 minutes test">45 minutes test</MenuItem>
                        <MenuItem value="semester test">semester test</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="ID lớp"
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
                        Hủy
                    </Button>
                    <Button onClick={handleAddScore} color="primary">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewScore;
