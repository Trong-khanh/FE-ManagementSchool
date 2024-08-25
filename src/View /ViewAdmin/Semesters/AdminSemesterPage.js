import React, { useState } from 'react';
import SemesterForm from './SemesterForm';
import SemesterList from './SemesterList';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);

    const addSemester = (semester) => {
        setSemesters([...semesters, semester]);
    };

    return (
        <div>
            <h1>Semester Management</h1>
            <SemesterForm onAddSemester={addSemester} />
            <SemesterList semesters={semesters} />
        </div>
    );
};

export default AdminSemesterPage;
