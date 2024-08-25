import React, { useState } from 'react';
import SemesterForm from './SemesterForm';
import SemesterList from './SemesterList';
import NavBar from '../../NavBar';

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
        <div>
            <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <SemesterForm onAddSemester={addSemester} />
            <SemesterList semesters={semesters} />
        </div>
    );
};

export default AdminSemesterPage;