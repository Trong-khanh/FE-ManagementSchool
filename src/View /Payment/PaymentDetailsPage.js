import React from "react";
// import { useParams } from "react-router-dom";
// import { getPaymentDetails } from "../../API /ParentAPI"; // Adjust the API method accordingly

const PaymentDetailsPage = () => {
    // const { orderId } = useParams(); // Get the orderId from the URL
    // const [paymentDetails, setPaymentDetails] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    // useEffect(() => {
    //     const fetchPaymentDetails = async () => {
    //         try {
    //             const response = await getPaymentDetails(orderId); // Call the API to get payment details
    //             setPaymentDetails(response.data);
    //         } catch (err) {
    //             setError("Failed to fetch payment details");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchPaymentDetails();
    // }, [orderId]);

    // if (loading) {
    //     return <p>Loading payment details...</p>;
    // }

    // if (error) {
    //     return <p style={{ color: "red" }}>{error}</p>;
    // }

    return (
        <div className="payment-details-page">
            <h1>Payment successfully!</h1>


            {/*<h2>Payment Details</h2>*/}
            {/*<div>*/}
            {/*    <p><strong>Order ID:</strong> {paymentDetails.OrderId}</p>*/}
            {/*    <p><strong>Full Name:</strong> {paymentDetails.FullName}</p>*/}
            {/*    <p><strong>Amount:</strong> {paymentDetails.Amount}</p>*/}
            {/*    <p><strong>Order Info:</strong> {paymentDetails.OrderInfo}</p>*/}
            {/*    <p><strong>Payment Status:</strong> {paymentDetails.PaymentStatus}</p>*/}
            {/*    <p><strong>Semester:</strong> {paymentDetails.SemesterName}</p>*/}
            {/*    <p><strong>Academic Year:</strong> {paymentDetails.AcademicYear}</p>*/}
            {/*    <p><strong>Created Date:</strong> {new Date(paymentDetails.CreatedDate).toLocaleDateString()}</p>*/}
            {/*</div>*/}
        </div>
    );
};

export default PaymentDetailsPage;
