import React, { useState, useEffect } from 'react';
import { calculateAverageScores } from '../../../API /CalculateAvenrageScoreAPI';
import { getAllClasses } from '../../../API /CRUDClassAPI';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const AdminScore = () => {
    const [classes, setClasses] = useState([]);
    const [classId, setClassId] = useState('');
    const [className, setClassName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [averageScores, setAverageScores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // Hàm gọi API để lấy tất cả các lớp
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const result = await getAllClasses();
                setClasses(result);
            } catch (error) {
                console.error("Không thể tải danh sách lớp:", error);
            }
        };
        fetchClasses();
    }, []);

    const handleCalculateClick = async () => {
        if (!className || !academicYear) {
            setDialogMessage("Vui lòng chọn lớp và nhập năm học.");
            setDialogOpen(true);
            return;
        }

        try {
            // Gửi className và academicYear vào API
            const result = await calculateAverageScores(className, academicYear);
            if (result) {
                setAverageScores(result);
                setDialogMessage("Tính điểm thành công!");
                setDialogOpen(true);
            } else {
                setDialogMessage("Không thể tính điểm cho lớp này.");
                setDialogOpen(true);
            }
        } catch (error) {
            console.error("Lỗi khi tính điểm:", error);
            setDialogMessage("Có lỗi xảy ra khi tính điểm.");
            setDialogOpen(true);
        }
    };

    // Hàm đóng dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{
                textAlign: 'center',
                color: '#333',
                marginBottom: '20px'
            }}>Tính Điểm Trung Bình</h1>

            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <select
                    value={classId}
                    onChange={(e) => {
                        const selectedClassId = e.target.value;
                        const selectedClassName = e.target.options[e.target.selectedIndex].text; // Lấy className từ option
                        setClassId(selectedClassId);
                        setClassName(selectedClassName); // Cập nhật className
                    }}
                    style={{
                        padding: '10px',
                        width: '200px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                >
                    <option value="" disabled>Chọn lớp</option>
                    {classes.map((classItem) => (
                        <option key={classItem.classId} value={classItem.classId}>
                            {classItem.className}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Nhập năm học"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '200px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />

                <button
                    onClick={handleCalculateClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Tính Điểm
                </button>
            </div>

            {averageScores.length > 0 && (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}>
                    <thead>
                    <tr>
                        <th style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '2px solid #ddd',
                        }}>Mã Học Sinh</th>
                        <th style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '2px solid #ddd',
                        }}>Điểm HK1</th>
                        <th style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '2px solid #ddd',
                        }}>Điểm HK2</th>
                        <th style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            borderBottom: '2px solid #ddd',
                        }}>Điểm Năm Học</th>
                    </tr>
                    </thead>
                    <tbody>
                    {averageScores.map((score, index) => (
                        <tr key={index} style={{
                            backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff',
                            textAlign: 'center',
                            borderBottom: '1px solid #ddd'
                        }}>
                            <td style={{ padding: '8px' }}>{score.studentId}</td>
                            <td style={{ padding: '8px' }}>{score.averageSemester1 ?? 'Chưa có điểm'}</td>
                            <td style={{ padding: '8px' }}>{score.averageSemester2 ?? 'Chưa có điểm'}</td>
                            <td style={{ padding: '8px' }}>{score.averageAcademicYear ?? 'Chưa có điểm'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Dialog thông báo */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle>Thông Báo</DialogTitle>
                <DialogContent>
                    {dialogMessage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminScore;