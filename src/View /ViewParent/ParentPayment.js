import React, { useState } from "react";
import {getTuitionFeeNotification} from "../../API /ParentAPI";
import "./ParentPayment.css";
import NavBarParent from "../NavBarParent"; // Import NavBarParent

const GetParentTuitionFeeNotification = () => {
    const [fetchSemesterType, setFetchSemesterType] = useState("Semester1");
    const [fetchAcademicYear, setFetchAcademicYear] = useState("");
    const [tuitionFeeNotification, setTuitionFeeNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [noDataMessage, setNoDataMessage] = useState("");

    const handleGetNotification = async () => {
        setLoading(true);
        setError(""); // Reset error mỗi khi gửi lại yêu cầu
        setNoDataMessage(""); // Reset thông báo không có dữ liệu
        setTuitionFeeNotification(null); // Reset dữ liệu thông báo

        try {
            // Gọi API lấy dữ liệu thông báo học phí
            const data = await getTuitionFeeNotification(fetchSemesterType, fetchAcademicYear);

            // Kiểm tra nếu không có dữ liệu trả về
            if (data && Object.keys(data).length === 0) {
                setNoDataMessage("No tuition fee notifications found for the selected semester and academic year.");
            } else {
                // Nếu có dữ liệu, lưu vào state
                setTuitionFeeNotification(data);
            }
        } catch (err) {
            // Nếu có lỗi trong quá trình gọi API, set lỗi vào state
            setError(err.message || "Failed to fetch tuition fee notification.");
        } finally {
            // Cuối cùng tắt loading
            setLoading(false);
        }
    };

    // Hàm chuyển đổi học kỳ từ "Semester1" sang "Semester 1"
    const formatSemester = (semester) => {
        if (semester === "Semester1") return "Semester 1";
        if (semester === "Semester2") return "Semester 2";
        return semester;
    };

    return (
        <div className="parent-get-tuition-fee-notification">
            <h2>Parent Tuition Fee Notification</h2>
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

            {noDataMessage && <p style={{ color: "orange" }}>{noDataMessage}</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};


const ParentPayment = () => {
    return (
        <div>
            <NavBarParent /> {/* Include the NavBarParent component */}
            <GetParentTuitionFeeNotification />
        </div>
    );
};

export default ParentPayment;
