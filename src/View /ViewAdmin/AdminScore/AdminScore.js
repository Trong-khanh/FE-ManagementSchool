import React, { useEffect, useState } from 'react';
import { calculateAverageScores, getStudentAverageScores } from '../../../API /CalculateAvenrageScoreAPI';
import { getAllClasses } from '../../../API /CRUDClassAPI';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import NavBar from "../../NavBar"; // Import NavBar component

const AdminScore = () => {
    const [classes, setClasses] = useState([]);
    const [classId, setClassId] = useState('');
    const [className, setClassName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [averageScores, setAverageScores] = useState([]);
    const [calculatedScores, setCalculatedScores] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isCalculated, setIsCalculated] = useState(false); // New state for checking which table to show

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const result = await getAllClasses();
                setClasses(result);
            } catch (error) {
                console.error("Unable to load class list:", error);
            }
        };
        fetchClasses();
    }, []);

    // Handle Calculate button click
    const handleCalculateClick = async () => {
        if (!className || !academicYear) {
            setDialogMessage("Please select a class and enter an academic year.");
            setDialogOpen(true);
            return;
        }

        try {
            const result = await calculateAverageScores(className, academicYear);
            if (result && result.length > 0) {
                setCalculatedScores(result);
                setIsCalculated(true); // Show calculated scores table
                setDialogMessage("Scores calculated successfully!");
                setDialogOpen(true);
            } else {
                // Khi không có điểm để tính, hiển thị thông báo "Không thể tính điểm"
                setDialogMessage("Cannot calculate scores because no data is available.");
                setDialogOpen(true);
            }
        } catch (error) {
            console.error("Error calculating scores:", error);
            setDialogMessage("An error occurred while calculating the scores.");
            setDialogOpen(true);
        }
    };

    // Handle Get Average Scores button click
    const handleGetAverageScoresClick = async () => {
        if (!classId || !academicYear) {
            setDialogMessage("Please select a class and enter an academic year.");
            setDialogOpen(true);
            return;
        }

        try {
            const result = await getStudentAverageScores(classId, academicYear);
            if (result) {
                setAverageScores(result);
                setIsCalculated(false); // Show average scores table
                setDialogMessage("Average scores retrieved successfully!");
                setDialogOpen(true);
            } else {
                setDialogMessage("No average scores available for this class.");
                setDialogOpen(true);
            }
        } catch (error) {
            console.error("Error retrieving average scores:", error);
            setDialogMessage("An error occurred while retrieving the average scores.");
            setDialogOpen(true);
        }
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh',
            display: 'flex', flexDirection: 'column',
        }}>
            <NavBar />
            <div style={{
                maxWidth: '800px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                marginTop: '50px' // Add margin-top here
            }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Calculate Average Scores</h1>

                <div style={{
                    display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'
                }}>
                    <select
                        value={classId}
                        onChange={(e) => {
                            const selectedClassId = e.target.value;
                            const selectedClassName = e.target.options[e.target.selectedIndex].text;
                            setClassId(selectedClassId);
                            setClassName(selectedClassName);
                        }}
                        style={{
                            padding: '10px',
                            width: '200px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    >
                        <option value="" disabled>Select Class</option>
                        {classes.map((classItem) => (
                            <option key={classItem.classId} value={classItem.classId}>
                                {classItem.className}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Enter Academic Year"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        style={{
                            padding: '10px',
                            width: '200px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    />

                    <button
                        onClick={handleCalculateClick}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        Calculate Grade
                    </button>

                    <button
                        onClick={handleGetAverageScoresClick}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1E88E5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
                    >
                        Get Average Score
                    </button>
                </div>

                {/* Only show the table based on isCalculated state */}
                {isCalculated ? (
                    <div style={{ marginTop: '20px' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}>
                            <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Student Full Name
                                </th>
                                <th style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Score Semester 2
                                </th>
                                <th style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Score Semester 1
                                </th>
                                <th style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Grade Academic Year
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {calculatedScores.map((score, index) => (
                                <tr key={index} style={{
                                    backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #ddd'
                                }}>
                                    <td style={{padding: '8px', border: '1px solid #ddd'}}>{score.fullName}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.averageSemester1 ?? 'No score available'}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.averageSemester2 ?? 'No score available'}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.averageAcademicYear ?? 'No score available'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ marginTop: '20px' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        }}>
                            <thead>
                            <tr>
                                <th style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Student Full Name
                                </th>
                                <th style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Score Semester 2
                                </th>
                                <th style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Score Semester 1
                                </th>
                                <th style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    padding: '8px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd', // Detailed border
                                }}>Average Grade Academic Year
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {averageScores.map((score, index) => (
                                <tr key={index} style={{
                                    backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #ddd'
                                }}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.studentFullName}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.semesterAverage1 ?? 'No score available'}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.semesterAverage2 ?? 'No score available'}</td>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #ddd'
                                    }}>{score.annualAverage ?? 'No score available'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Notification</DialogTitle>
                    <DialogContent>
                        <p>{dialogMessage}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminScore;
