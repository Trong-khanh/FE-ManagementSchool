import React from "react";

const SemesterList = ({ semesters, onEdit, onDelete }) => {
  return (
    <div className="semester-list-container">
      <h2>Semester List</h2>
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
          {semesters.map(
            (semester, index) =>
              semester && (
                <tr key={index}>
                  <td>{semester.name}</td>
                  <td>{semester.startDate}</td>
                  <td>{semester.endDate}</td>
                  <td>{semester.academicYear}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(semester)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(semester)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterList;
