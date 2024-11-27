import React, { useState } from "react";
import { createFeeNotification, getTuitionFeeNotification } from "../../../../API /TuitionFeeNontificationAPI";  // Đảm bảo đường dẫn chính xác
import "./TuitionFeeNotification.css";
import NavBar from "../../../NavBar";

// Component tạo thông báo học phí
const CreateTuitionFeeNotification = () => {
    const [createSemesterType, setCreateSemesterType] = useState("Semester1");
    const [createAcademicYear, setCreateAcademicYear] = useState("");
    const [amount, setAmount] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error mỗi khi gửi lại yêu cầu
        setSuccessMessage("");

        const notificationData = {
            semesterType: createSemesterType,
            academicYear: createAcademicYear,
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
        <div className="create-tuition-fee-notification">
            <h2>Create Tuition Fee Notification</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Semester Type:</label>
                    <select
                        value={createSemesterType}
                        onChange={(e) => setCreateSemesterType(e.target.value)}
                    >
                        <option value="Semester1">Semester 1</option>
                        <option value="Semester2">Semester 2</option>
                    </select>
                </div>
                <div>
                    <label>Academic Year:</label>
                    <input
                        type="text"
                        value={createAcademicYear}
                        onChange={(e) => setCreateAcademicYear(e.target.value)}
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
            {error && <p style={{ color: "red" }}>Error: {error}</p>}  {/* Hiển thị lỗi nếu có */}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
};

// Component lấy thông báo học phí
const GetTuitionFeeNotification = () => {
    const [fetchSemesterType, setFetchSemesterType] = useState("Semester1");
    const [fetchAcademicYear, setFetchAcademicYear] = useState("");
    const [tuitionFeeNotification, setTuitionFeeNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");  // Đảm bảo error là một chuỗi
    const [noDataMessage, setNoDataMessage] = useState("");  // State để hiển thị thông báo nếu không có dữ liệu

    const handleGetNotification = async () => {
        setLoading(true);
        setError(""); // Reset error mỗi khi gửi lại yêu cầu
        setNoDataMessage(""); // Reset thông báo không có dữ liệu
        setTuitionFeeNotification(null);

        try {
            const data = await getTuitionFeeNotification(fetchSemesterType, fetchAcademicYear);
            if (data && Object.keys(data).length === 0) {
                setNoDataMessage("No tuition fee notifications found for the selected semester and academic year.");
            } else {
                setTuitionFeeNotification(data);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch tuition fee notification.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm chuyển đổi học kỳ từ "Semester1" sang "Semester 1"
    const formatSemester = (semester) => {
        if (semester === "Semester1") return "Semester 1";
        if (semester === "Semester2") return "Semester 2";
        return semester;  // Nếu không phải "Semester1" hoặc "Semester2"
    };

    return (
        <div className="get-tuition-fee-notification">
            <h2>Get Tuition Fee Notification</h2>
            <div>
                <label>Semester Type:</label>
                <select
                    value={fetchSemesterType}
                    onChange={(e) => setFetchSemesterType(e.target.value)}
                >
                    <option value="Semester1">Semester 1</option>
                    <option value="Semester2">Semester 2</option>
                </select>
            </div>

            <div>
                <label>Academic Year:</label>
                <input
                    type="text"
                    value={fetchAcademicYear}
                    onChange={(e) => setFetchAcademicYear(e.target.value)}
                    placeholder="e.g., 2023-2024"
                />
            </div>
            <button onClick={handleGetNotification} disabled={loading}>
                {loading ? "Fetching..." : "Get Notification"}
            </button>

            {/* Hiển thị thông báo học phí */}
            {tuitionFeeNotification && (
                <div className="notification-display">
                    <h3>Notification Details</h3>
                    <p><strong>Semester:</strong> {formatSemester(tuitionFeeNotification.semesterName)}</p>
                    <p><strong>Academic Year:</strong> {tuitionFeeNotification.academicYear}</p>
                    <p><strong>Amount:</strong> {tuitionFeeNotification.amount}</p>
                    <p><strong>Created Date:</strong> {new Date(tuitionFeeNotification.createdDate).toLocaleDateString()}</p>
                    <p><strong>Notification Content:</strong> {tuitionFeeNotification.notificationContent}</p>
                </div>
            )}

            {/* Hiển thị thông báo nếu không có dữ liệu */}
            {noDataMessage && <p style={{ color: "orange" }}>{noDataMessage}</p>}
            {/* Hiển thị lỗi nếu có */}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

const TuitionFeeNotification = () => {
    return (
        <div>
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                <CreateTuitionFeeNotification />
                <GetTuitionFeeNotification />
            </div>
        </div>
    );
};

export default TuitionFeeNotification;
