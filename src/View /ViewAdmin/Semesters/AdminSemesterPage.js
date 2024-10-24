import React, { useEffect, useState } from 'react';
import {
    addSemester,
    getAllSemesters,
    updatedSemester,
    deleteSemester,
} from '../../../API /CRUDSemesterAPI';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [form, setForm] = useState({
        SemesterType: '',
        StartDate: '',
        EndDate: '',
        AcademicYear: '',
    });
    const [editingSemesterId, setEditingSemesterId] = useState(null);

    useEffect(() => {
        fetchSemesters();
    }, []);
    const fetchSemesters = async () => {
      try {
          const data = await getAllSemesters();
          console.log('Fetched Semesters:', data); // Log fetched data
          setSemesters(data);
      } catch (error) {
          console.error('Error fetching semesters:', error); // Log any errors
      }
  };
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting Semester:', form); // Log submitted data
        try {
            if (editingSemesterId) {
                await updatedSemester(editingSemesterId, form);
            } else {
                await addSemester(form);
            }
            setForm({ SemesterType: '', StartDate: '', EndDate: '', AcademicYear: '' });
            setEditingSemesterId(null);
            fetchSemesters();
        } catch (error) {
            console.error('Error submitting semester:', error);
        }
    };

    const handleEdit = (semester) => {
        setForm({
            SemesterType: semester.semesterType,
            StartDate: semester.startDate, // Để định dạng dd/mm/yyyy, có thể sử dụng hàm formatDate
            EndDate: semester.endDate, // Để định dạng dd/mm/yyyy, có thể sử dụng hàm formatDate
            AcademicYear: semester.academicYear,
        });
        setEditingSemesterId(semester.semesterId);
    };

    const handleDelete = async (id) => {
        console.log('Deleting Semester ID:', id); // Log deletion ID
        try {
            await deleteSemester(id);
            fetchSemesters();
        } catch (error) {
            console.error('Error deleting semester:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <div className="admin-semester-page">
            <h2>Quản Lý Học Kỳ</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Loại Học Kỳ:</label>
                    <select
                        name="SemesterType"
                        value={form.SemesterType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn Học Kỳ</option>
                        <option value="Semester1">Học Kỳ 1</option>
                        <option value="Semester2">Học Kỳ 2</option>
                    </select>
                </div>
                <div>
                    <label>Ngày Bắt Đầu:</label>
                    <input
                        type="text"
                        name="StartDate"
                        value={form.StartDate}
                        onChange={handleChange}
                        placeholder="Ngày Bắt Đầu (dd/mm/yyyy)"
                        required
                    />
                </div>
                <div>
                    <label>Ngày Kết Thúc:</label>
                    <input
                        type="text"
                        name="EndDate"
                        value={form.EndDate}
                        onChange={handleChange}
                        placeholder="Ngày Kết Thúc (dd/mm/yyyy)"
                        required
                    />
                </div>
                <div>
                    <label>Năm Học:</label>
                    <input
                        type="text"
                        name="AcademicYear"
                        value={form.AcademicYear}
                        onChange={handleChange}
                        placeholder="Năm Học"
                        required
                    />
                </div>
                <button type="submit">
                    {editingSemesterId ? 'Cập Nhật' : 'Thêm'}
                </button>
            </form>

            <h3>Danh Sách Học Kỳ</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Loại Học Kỳ</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Ngày Bắt Đầu</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Ngày Kết Thúc</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Năm Học</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters.map((semester) => (
                        <tr key={semester.semesterId}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{semester.semesterType}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{formatDate(semester.startDate)}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{formatDate(semester.endDate)}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{semester.academicYear}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <button onClick={() => handleEdit(semester)}>Sửa</button>
                                <button onClick={() => handleDelete(semester.semesterId)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSemesterPage;
