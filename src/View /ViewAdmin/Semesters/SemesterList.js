import React from 'react';

const SemesterList = ({ semesters }) => {
    return (
        <div className="semester-container">
            <h2>Semester List</h2>
            <table className="semester-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Academic Year</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters.map((semester, index) => (
                        <tr key={index}>
                            <td>{semester.name}</td>
                            <td>{semester.startDate}</td>
                            <td>{semester.endDate}</td>
                            <td>{semester.academicYear}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SemesterList;
