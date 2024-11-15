import React, { useEffect, useState } from "react";
import NavBar from "../../NavBar";
import {
  addClass,
  getAllClasses,
  updateClass,
  deleteClass,
} from "../../../API /CRUDClassAPI";

const AdminClass = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ className: "", description: "" });
  const [editClass, setEditClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllClasses();
        setClasses(data);
      } catch (err) {
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
      const existingClass = classes.find(
        (c) => c.className.toLowerCase() === newClass.className.toLowerCase()
      );
      if (existingClass) {
        throw new Error("Class already exists!");
      }

      const addedClass = await addClass(newClass);
      setClasses([...classes, addedClass]);
      setNewClass({ className: "", description: "" });
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
        setClasses(
          classes.map((c) => (c.classId === updated.classId ? updated : c))
        );
        setEditClass(null);
      } catch (err) {
        setError("Error updating class: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setLoading(true);
      setError(null);
      try {
        await deleteClass(id);
        setClasses(classes.filter((c) => c.classId !== id));
      } catch (err) {
        setError("Error deleting class: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredClasses = classes.filter((classItem) =>
    classItem.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <NavBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <h1 style={{ textAlign: "center" }}>Class Management</h1>

      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      {loading && <div style={{ textAlign: "center" }}>Loading...</div>}

      {/* Add Class Form */}
      <div
        style={{
          marginBottom: "20px",
          width: "300px",
          margin: "0 auto",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Add New Class</h3>
          <input
              type="text"
              value={newClass.className}
              onChange={(e) => setNewClass({...newClass, className: e.target.value})}
              placeholder="Class Name"
              style={{
                  width: "calc(100% - 35px)",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginLeft: "8px",
                  marginRight: "8px",
              }}
          />

          <button
              onClick={handleAddClass}
              disabled={loading}
              style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
              }}
          >
              Add Class
          </button>
      </div>

        {/* Edit Class Form */}
        {editClass && (
            <div
                style={{
            marginBottom: "20px",
            width: "300px",
            margin: "0 auto",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Edit Class</h3>
          <input
            type="text"
            value={editClass.className}
            onChange={(e) => setEditClass({ ...editClass, className: e.target.value })}
            placeholder="Class Name"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
          <button
            onClick={handleEditClass}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#2196F3",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Update Class
          </button>
        </div>
      )}

      {/* Class List Table */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
          marginTop: "20px"  // khoảng cách giữa form và bảng danh sách
        }}
      >
        <h2 style={{ textAlign: "center" }}>Class List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Class Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <tr key={classItem.classId}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {classItem.className}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => setEditClass(classItem)}
                      style={{
                        marginRight: "5px",
                        padding: "5px",
                        backgroundColor: "#FFC107",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.classId)}
                      style={{
                        padding: "5px",
                        backgroundColor: "#F44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "8px" }}>
                  No classes found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClass;
