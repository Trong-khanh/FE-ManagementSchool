import React, { useState } from 'react';
import SemesterForm from './SemesterForm';
import SemesterList from './SemesterList';
import NavBar from '../../NavBar';
import '../SemestersCSS/AdminSemesterPage.css';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const addSemester = (semester) => {
        setSemesters([...semesters, semester]);
    };

    return (
        <div className="admin-semester-page">
            <div className="nav-bar">
                <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            </div>
            <div className="content">
                <div className="form-container">
                    <SemesterForm onAddSemester={addSemester} />
                </div>
                <div className="list-container">
                    <SemesterList semesters={semesters} />
                </div>
            </div>
        </div>
    );
};

export default AdminSemesterPage;
