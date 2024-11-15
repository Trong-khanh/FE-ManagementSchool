import React, {useState} from 'react';
import {updateClassAndResetScores} from '../../../API /NextClassAPI';
import NavBar from "../../NavBar"; // Correct the import path

const NextClass = () => {
    // State management
    const [currentAcademicYear, setCurrentAcademicYear] = useState('');
    const [currentClassName, setCurrentClassName] = useState('');
    const [newAcademicYear, setNewAcademicYear] = useState('');
    const [newClassName, setNewClassName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Handle search functionality for the NavBar
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsDialogOpen(false);

        const requestPayload = {
            CurrentAcademicYear: currentAcademicYear,
            CurrentClassName: currentClassName,
            NewAcademicYear: newAcademicYear,
            NewClassName: newClassName
        };

        try {
            const response = await updateClassAndResetScores(requestPayload);
            setMessage(response ? response : 'Class updated successfully!');
            setIsDialogOpen(true);
        } catch (error) {
            setMessage(error?.response?.data || 'An error occurred, please try again!');
            setIsDialogOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            <div style={styles.container}>
                <h2 style={styles.heading}>Update Class and Reset Scores</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="currentAcademicYear" style={styles.label}>Current Academic Year:</label>
                        <input
                            type="text"
                            id="currentAcademicYear"
                            value={currentAcademicYear}
                            onChange={(e) => setCurrentAcademicYear(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="currentClassName" style={styles.label}>Current Class:</label>
                        <input
                            type="text"
                            id="currentClassName"
                            value={currentClassName}
                            onChange={(e) => setCurrentClassName(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="newAcademicYear" style={styles.label}>New Academic Year:</label>
                        <input
                            type="text"
                            id="newAcademicYear"
                            value={newAcademicYear}
                            onChange={(e) => setNewAcademicYear(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="newClassName" style={styles.label}>New Class:</label>
                        <input
                            type="text"
                            id="newClassName"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <button type="submit" disabled={isLoading} style={styles.button}>
                            {isLoading ? 'Processing...' : 'Update Class'}
                        </button>
                    </div>
                </form>

                {isDialogOpen && (<div style={styles.dialog}>
                        <div style={styles.dialogContent}>
                            <p>{message}</p>
                            <button onClick={() => setIsDialogOpen(false)} style={styles.dialogButton}>Close</button>
                        </div>
                    </div>)}
            </div>
        </div>

    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        marginTop: '40px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }, heading: {
        textAlign: 'center', marginBottom: '20px',
    }, form: {
        display: 'flex', flexDirection: 'column',
    }, formGroup: {
        marginBottom: '15px',
    }, label: {
        fontWeight: 'bold', marginBottom: '5px', display: 'inline-block',
    }, input: {
        padding: '8px',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px',
    }, button: {
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    }, buttonDisabled: {
        backgroundColor: '#ccc', cursor: 'not-allowed',
    }, dialog: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }, dialogContent: {
        backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '400px', textAlign: 'center',
    }, dialogButton: {
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        border: 'none',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default NextClass;
