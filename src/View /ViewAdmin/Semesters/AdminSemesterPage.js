import React, { useState, useEffect } from 'react';
import SemesterForm from './SemesterForm';
import SemesterList from './SemesterList';
import NavBar from '../../NavBar';
import '../SemestersCSS/AdminSemesterPage.css';
import { addSemester, getAllSemesters, updateSemester, deleteSemester } from '../../../API /CRUDSemesterAPI';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingSemester, setEditingSemester] = useState(null);

    // Fetch all semesters on component mount
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const data = await getAllSemesters();
                setSemesters(data);
            } catch (error) {
                console.error("Error fetching semesters:", error);
            }
        };
        fetchSemesters();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAddOrUpdateSemester = async (semester) => {
        try {
            if (editingSemester) {
                // Update semester
                const updatedSemester = await updateSemester(editingSemester.id, semester);
                setSemesters(semesters.map(s => s.id === editingSemester.id ? updatedSemester : s));
                setEditingSemester(null);  // Clear the form after editing
            } else {
                // Add new semester
                const newSemester = await addSemester(semester);
                setSemesters([...semesters, newSemester]);
            }
        } catch (error) {
            console.error("Error adding/updating semester:", error);
        }
    };

    const handleEdit = (semester) => {
        setEditingSemester(semester);
    };

    const handleDelete = async (semester) => {
        if (window.confirm(`Are you sure you want to delete ${semester.name}?`)) {
            try {
                await deleteSemester(semester.id);
                setSemesters(semesters.filter(s => s.id !== semester.id));
            } catch (error) {
                console.error("Error deleting semester:", error);
            }
        }
    };

    return (
        <div className="admin-semester-page">
            <div className="nav-bar">
                <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            </div>
            <div className="content">
                <div className="form-container">
                    <SemesterForm 
                        onAddSemester={handleAddOrUpdateSemester} 
                        editingSemester={editingSemester} 
                    />
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
