import axios from "axios";

const baseLink = "https://localhost:7201/api";

// Create an instance for authentication API
const authApi = axios.create({
    baseURL: baseLink,
    headers: {
        "Content-Type": "application/json",
    },
});

// Create an instance for user-related API
const userApi = axios.create({
    baseURL: baseLink,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshingTokenPromise = null;

// Interceptor to handle token refresh
userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for authentication error (401)
        if (error.response.status === 401 && !originalRequest._retry) {
            if (!refreshingTokenPromise) {
                originalRequest._retry = true;
                refreshingTokenPromise = authApi
                    .post("/Authenticate/refresh-token", {
                        Token: localStorage.getItem("refreshToken"),
                    })
                    .then((tokenResponse) => {
                        if (tokenResponse.data && tokenResponse.data.accessToken) {
                            localStorage.setItem("accessToken", tokenResponse.data.accessToken);
                            console.log("Received new access token:", tokenResponse.data.accessToken);
                            userApi.defaults.headers["Authorization"] = `Bearer ${tokenResponse.data.accessToken}`;
                            originalRequest.headers["Authorization"] = `Bearer ${tokenResponse.data.accessToken}`;
                            return userApi(originalRequest);
                        }
                    })
                    .finally(() => {
                        refreshingTokenPromise = null;
                    });
            }
            return refreshingTokenPromise;
        }
        return Promise.reject(error);
    }
);

// Function to create fee notification
export const createFeeNotification = async (notificationData) => {
    try {
        const response = await userApi.post('/Admin/CreateFeeNotification', notificationData);
        console.log('Notification created successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw error.response.data; // Trả về lỗi cho frontend
        } else {
            console.error('Error message:', error.message);
            throw new Error("Unable to connect to the server.");
        }
    }
};

// Function to get tuition fee notification
export const getTuitionFeeNotification = async (semesterType, academicYear) => {
    try {
        const response = await userApi.get('/Admin/GetTuitionFeeNotification', {
            params: {
                semesterType: semesterType,
                academicYear: academicYear,
            },
        });
        console.log('Fetched tuition fee notification:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Error message:', error.message);
            throw new Error("Failed to fetch tuition fee notification.");
        }
    }
};
