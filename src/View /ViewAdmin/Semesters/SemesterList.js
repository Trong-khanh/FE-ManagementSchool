import React from 'react';

const SemesterList = ({ semesters, onEdit, onDelete }) => {
    return (
        <div className="semester-container">
            <table className="semester-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Academic Year</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {semesters.map((semester, index) => (
                        <tr key={index}>
                            <td>{semester.name}</td>
                            <td>{semester.startDate}</td>
                            <td>{semester.endDate}</td>
                            <td>{semester.academicYear}</td>
                            <td>
                                <button onClick={() => onEdit(semester)} className="edit-button">Edit</button>
                                <button onClick={() => onDelete(semester)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SemesterList;
