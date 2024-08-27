import React, { useState } from 'react';
import SemesterForm from './SemesterForm';
import SemesterList from './SemesterList';
import NavBar from '../../NavBar';
import '../SemestersCSS/AdminSemesterPage.css';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingSemester, setEditingSemester] = useState(null);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const addSemester = (semester) => {
        if (editingSemester) {
            // Update existing semester
            setSemesters(semesters.map(s =>
                s.id === editingSemester.id ? { ...editingSemester, ...semester } : s
            ));
            setEditingSemester(null); 
        } else {
            // Add new semester
            setSemesters([...semesters, { ...semester, id: Date.now() }]);
        }
    };

    const handleEdit = (semester) => {
        setEditingSemester(semester);
    };

    const handleDelete = (semester) => {
        if (window.confirm(`Are you sure you want to delete ${semester.name}?`)) {
            setSemesters(semesters.filter(s => s.id !== semester.id));
        }
    };

    return (
        <div className="admin-semester-page">
            <div className="nav-bar">
                <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            </div>
            <div className="content">
                <div className="form-container">
                    <SemesterForm onAddSemester={addSemester} editingSemester={editingSemester} />
                </div>
                <div className="list-container">
                    <SemesterList 
                        semesters={semesters.filter(semester => 
                            semester.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminSemesterPage;
