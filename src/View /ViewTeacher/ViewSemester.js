import React, { useEffect, useState } from 'react';
import { ViewAllSemesters } from '../../API /TeacherAPI'; 
import Navbar2 from '../Navbar2'; 

const ViewSemester = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handler to fetch the data
    const fetchSemesters = async () => {
        try {
            const data = await ViewAllSemesters();
            setSemesters(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch semesters');
            setLoading(false);
        }
    };

    // Call the handler on component mount
    useEffect(() => {
        fetchSemesters();
    }, []);

    // If loading, show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there's an error, show the error message
    if (error) {
        return <div>{error}</div>;
    }

    // UI to display the table of semesters
    return (
        <div>
            {/* Include the Navbar2 component */}
            <Navbar2 />

            <h2>Semesters</h2>
            {semesters.length > 0 ? (
                <table border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Semester ID</th>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.map((semester) => (
                            <tr key={semester.semesterId}>
                                <td>{semester.semesterId}</td>
                                <td>{semester.name}</td>
                                <td>{new Date(semester.startDate).toLocaleDateString()}</td>
                                <td>{new Date(semester.endDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No semesters found.</p>
            )}
        </div>
    );
};

export default ViewSemester;
