import React, { useEffect, useState } from 'react';
import NavBar from '../../NavBar'; 
import {
    addClass,
    getAllClasses,
    updateClass,
    deleteClass
} from '../../../API /CRUDClassAPI'; 

const AdminClass = () => {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({ className: '', description: '' });
    const [editClass, setEditClass] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllClasses();
                console.log('Fetched classes:', data);
                setClasses(data);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError("Error fetching classes: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchClasses();
    }, []);

    const handleAddClass = async () => {
        setLoading(true);
        setError(null);
        try {
            // Validation: Check if the class already exists
            const existingClass = classes.find(c => c.className.toLowerCase() === newClass.className.toLowerCase());
            if (existingClass) {
                throw new Error("Class already exists!");
            }

            const addedClass = await addClass(newClass);
            setClasses([...classes, addedClass]);
            setNewClass({ className: '', description: '' }); // Reset the form
        } catch (err) {
            setError("Error adding class: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClass = async () => {
        if (editClass) {
            setLoading(true);
            setError(null);
            try {
                const updated = await updateClass(editClass.classId, editClass);
                setClasses(classes.map(c => (c.classId === updated.classId ? updated : c)));
                setEditClass(null);
            } catch (err) {
                setError("Error updating class: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteClass = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteClass(id);
            setClasses(classes.filter(c => c.classId !== id));
        } catch (err) {
            setError("Error deleting class: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredClasses = classes.filter((classItem) =>
        classItem.className.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: '0', margin: '0', width: '100%' }}>
            <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            <h1>Class Management</h1>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {loading && <div>Loading...</div>}

            {/* Add Class Form */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newClass.className}
                    onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                    placeholder="Class Name"
                    style={{ marginRight: '10px', flex: 1 }}
                />
                <button onClick={handleAddClass} disabled={loading}>Add Class</button>
            </div>

            {/* Edit Class Form */}
            {editClass && (
                <div style={{ marginBottom: '20px' }}>
                    <h2>Edit Class</h2>
                    <input
                        type="text"
                        value={editClass.className}
                        onChange={(e) => setEditClass({ ...editClass, className: e.target.value })}
                        placeholder="Class Name"
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleEditClass} disabled={loading}>Update Class</button>
                </div>
            )}

            {/* Class List Table */}
            <h2>Class List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Class Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map((classItem) => (
                            <tr key={classItem.classId}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{classItem.className}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <button onClick={() => setEditClass(classItem)}>Edit</button>
                                    <button onClick={() => handleDeleteClass(classItem.classId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center', padding: '8px' }}>
                                No classes found matching your search criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminClass;
