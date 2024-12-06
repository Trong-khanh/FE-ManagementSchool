import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../API /ParentAPI"; // Add the function to fetch order details
import NavBarParent from "../NavBarParent";

const OrderDetail = () => {
    const { orderId } = useParams(); // Retrieve orderId from URL
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await getOrderDetails(orderId); // API to get order details
                console.log(data);
                setOrderDetails(data);
            } catch (err) {
                setError(err.message || "Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrderDetails();
    }, [orderId]);

    return (
        <div>
            <NavBarParent />
            <div className="order-detail-container">
                <h2>Order Details</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {orderDetails && (
                    <div className="order-details">
                        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                        <p><strong>Amount:</strong> {orderDetails.amount}</p>
                        <p><strong>Semester:</strong> {orderDetails.semesterName}</p>
                        <p><strong>Academic Year:</strong> {orderDetails.academicYear}</p>
                        <p><strong>Notification Content:</strong> {orderDetails.notificationContent}</p>
                        <p><strong>Payment Status:</strong> {orderDetails.paymentStatus}</p>
                        <p><strong>Created Date:</strong> {new Date(orderDetails.createdDate).toLocaleDateString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;
