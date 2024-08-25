import React from 'react';

const SemesterList = ({ semesters }) => {
    return (
        <div>
            <h2>Semester List</h2>
            <ul>
                {semesters.map((semester, index) => (
                    <li key={index}>
                        <p>Name: {semester.name}</p>
                        <p>Start Date: {semester.startDate}</p>
                        <p>End Date: {semester.endDate}</p>
                        <p>Academic Year: {semester.academicYear}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SemesterList;
