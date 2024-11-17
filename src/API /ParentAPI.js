import axios from "axios";

const baseLink = "https://localhost:7201/api";

// Create an instance for authentication API
const authApi = axios.create({
    baseURL: baseLink, headers: {
        "Content-Type": "application/json",
    },
});

// Create an instance for user-related API
const userApi = axios.create({
    baseURL: baseLink, headers: {
        "Content-Type": "application/json",
    },
});

let refreshingTokenPromise = null;

// Interceptor to handle token refresh
userApi.interceptors.response.use((response) => response, async (error) => {
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
});

// Hàm gọi API lấy điểm hàng ngày của học sinh
export const getDailyScores = async (studentName, className, academicYear) => {
    try {
        const response = await userApi.get('/Parent/GetDailyScores', {
            params: {
                studentName: studentName,
                className: className,  // Pass the className here
                academicYear: academicYear,
            },
        });

        // If data exists, return the data
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error;
    }
};


export const getSubjectsAverageScores = async (studentName, academicYear) => {
    try {

        const response = await userApi.get('/Parent/GetSubjectsAverageScores', {
            params: {
                studentName: studentName, academicYear: academicYear,
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching average scores:', error);
        throw error;
    }
};


