import React, { useEffect, useState } from 'react';
import { ViewAllSemesters, AssignedClassesStudents } from '../../API /TeacherAPI'; 
import Navbar2 from '../Navbar2';

const ViewClass = () => {
    const [semesters, setSemesters] = useState([]);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState(''); 
    const teacherEmail = localStorage.getItem('teacherEmail');

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const data = await ViewAllSemesters();
                setSemesters(data);
            } catch (err) {
                console.error('Error fetching semesters:', err);
                setError(err.message || 'Error fetching semesters'); 
            }
        };

        const fetchAssignedClasses = async () => {
            setLoading(true);
            try {
                const data = await AssignedClassesStudents(teacherEmail);
                console.log('Assigned Classes Data:', data);
                setAssignedClasses(data);
            } catch (err) {
                console.error('Error fetching assigned classes:', err);
                setError(err.message || 'Error fetching assigned classes');
            } finally {
                setLoading(false);
            }
        };

        console.log('Teacher Email:', teacherEmail); 

        fetchSemesters();
        fetchAssignedClasses();
    }, [teacherEmail]);

    // Filter students by the selected class
    const filteredClasses = selectedClass
        ? assignedClasses.filter(classInfo => classInfo.className === selectedClass)
        : assignedClasses;

    // Get unique list of classes
    const classOptions = assignedClasses.length > 0
        ? [...new Set(assignedClasses.map(classInfo => classInfo.className))]
        : []; 

    // Inline CSS styles
    const containerStyles = {
        margin: '20px', 
    };

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '25px 0',
        fontSize: '18px',
        textAlign: 'left',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const thTdStyles = {
        padding: '12px 15px',
        color: '#000000', 
    };

    const theadStyles = {
        backgroundColor: '#ffffff',
        color: '#000000',
        textAlign: 'left',
        fontWeight: 'bold',
    };

    const rowStyles = {
        borderBottom: '1px solid #dddddd',
    };

    const evenRowStyles = {
        backgroundColor: '#f3f3f3',
    };

    const hoverStyles = {
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
    };

    const dropdownContainerStyles = {
        marginLeft: '20px', // Indent label
    };

    const labelStyles = {
        fontSize: '20px', // Increased font size for the label
        marginRight: '10px', // Space between label and dropdown
    };

    const dropdownStyles = {
        padding: '10px', 
        fontSize: '16px', 
        margin: '20px 0',  
    };

    return (
        <div>
            <Navbar2 />
            <h2>Assigned Students List</h2>

            {/* Dropdown to select class */}
            {classOptions.length > 0 ? (
                <div style={dropdownContainerStyles}>
                    <label htmlFor="class-select" style={labelStyles}>Select Class: </label>
                    <select
                        id="class-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        style={dropdownStyles}
                    >
                        <option value="">All Classes</option>
                        {classOptions.map((className, index) => (
                            <option key={index} value={className}>{className}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>No classes available</p>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading data: {error}</p> // Show detailed error message
            ) : (
                <div style={containerStyles}> {/* Apply margin to the table container */}
                    <table style={tableStyles}>
                        <thead>
                            <tr style={theadStyles}>
                                <th style={thTdStyles}>Student Name</th>
                                <th style={thTdStyles}>Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.length > 0 ? (
                                filteredClasses.map((classInfo, index) => (
                                    <tr
                                        key={index}
                                        style={
                                            index % 2 === 0
                                                ? { ...rowStyles, ...evenRowStyles }
                                                : rowStyles
                                        }
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor)}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? evenRowStyles.backgroundColor : '')}
                                    >
                                        <td style={thTdStyles}>{classInfo.studentFullName }</td>
                                        <td style={thTdStyles}>{classInfo.className }</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="2">No student data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewClass;
