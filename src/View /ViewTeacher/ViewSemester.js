import React, { useEffect, useState } from "react";
import { ViewAllSemesters } from "../../API /TeacherAPI";
import Navbar2 from "../Navbar2";

const ViewSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSemesters = async () => {
    try {
      const data = await ViewAllSemesters();
      console.log("Fetched semesters:", data);
      setSemesters(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch semesters:", err);
      setError("Failed to fetch semesters");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Function to format semester type
  const formatSemesterType = (semesterType) => {
    if (semesterType === "Semester1") return "Semester 1";
    if (semesterType === "Semester2") return "Semester 2";
    return semesterType;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const containerStyles = {
    margin: "20px",
  };

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "25px 0",
    fontSize: "18px",
    textAlign: "left",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const thTdStyles = {
    padding: "12px 15px",
    color: "#000000",
    border: "1px solid #dddddd",
  };

  const theadStyles = {
    backgroundColor: "#ffffff",
    color: "#000000",
    textAlign: "left",
    fontWeight: "bold",
    border: "1px solid #dddddd",
  };

  const evenRowStyles = {
    backgroundColor: "#f3f3f3",
  };

  const hoverStyles = {
    backgroundColor: "#f1f1f1",
    cursor: "pointer",
  };

  return (
      <div>
        <Navbar2 />

        <h2>Semesters</h2>
        {semesters.length > 0 ? (
            <div style={containerStyles}>
              <table style={tableStyles}>
                <thead>
                <tr style={theadStyles}>
                  <th style={thTdStyles}>Name</th>
                  <th style={thTdStyles}>Start Date</th>
                  <th style={thTdStyles}>End Date</th>
                  <th style={thTdStyles}>Academic Year</th>
                </tr>
                </thead>
                <tbody>
                {semesters.map((semester, index) => (
                    <tr
                        key={semester.semesterId}
                        style={index % 2 === 0 ? evenRowStyles : {}}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                hoverStyles.backgroundColor)
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                index % 2 === 0 ? evenRowStyles.backgroundColor : "")
                        }
                    >
                      <td style={thTdStyles}>
                        {formatSemesterType(semester.semesterType)}
                      </td>
                      <td style={thTdStyles}>
                        {new Date(semester.startDate).toLocaleDateString('en-GB')}
                      </td>
                      <td style={thTdStyles}>
                        {new Date(semester.endDate).toLocaleDateString('en-GB')}
                      </td>
                      <td style={thTdStyles}>{semester.academicYear}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        ) : (
            <p>No semesters found.</p>
        )}
      </div>
  );
};

export default ViewSemester;