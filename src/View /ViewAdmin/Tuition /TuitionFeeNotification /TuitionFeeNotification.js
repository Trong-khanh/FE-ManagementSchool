import React, { useState } from "react";
import { createFeeNotification } from "../../../../API /TuitionFeeNontificationAPI";
import "./TuitionFeeNotification.css";
import NavBar from "../../../NavBar"; // Đường dẫn đã import sẵn NavBar

const TuitionFeeNotification = () => {
    const [semesterType, setSemesterType] = useState("Semester1");
    const [academicYear, setAcademicYear] = useState("");
    const [amount, setAmount] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage("");

        const notificationData = {
            semesterType,
            academicYear,
            amount: parseFloat(amount),
            content,
        };

        try {
            const response = await createFeeNotification(notificationData);
            setSuccessMessage("Notification created successfully!");
            console.log("Server response:", response);
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tuition-fee-notification-container">
            <NavBar />
            <div className="tuition-fee-notification">
                <h2>Create Tuition Fee Notification</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Semester Type:</label>
                        <select
                            value={semesterType}
                            onChange={(e) => setSemesterType(e.target.value)}
                        >
                            <option value="Semester1">Semester 1</option>
                            <option value="Semester2">Semester 2</option>
                        </select>
                    </div>
                    <div>
                        <label>Academic Year:</label>
                        <input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            placeholder="e.g., 2023-2024"
                            required
                        />
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 1500000"
                            required
                        />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter notification content here"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Notification"}
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default TuitionFeeNotification;
