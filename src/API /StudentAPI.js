import axios from "axios";

const baseLink = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle token refresh
userApi.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    // Check for authentication error (401)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (!refreshingTokenPromise) {
            originalRequest._retry = true;
            refreshingTokenPromise = authApi
                .post("/Authenticate/refresh-token", {
                    Token: localStorage.getItem("refreshToken"),
                })
                .then((tokenResponse) => {
                    if (tokenResponse.data && (tokenResponse.data.accessToken || tokenResponse.data.AccessToken)) {
                        localStorage.setItem("accessToken", (tokenResponse.data.accessToken || tokenResponse.data.AccessToken));
                        console.log("Received new access token:", (tokenResponse.data.accessToken || tokenResponse.data.AccessToken));
                        userApi.defaults.headers["Authorization"] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
                        originalRequest.headers["Authorization"] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
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
export const getDailyScores = async (studentName, academicYear) => {
    try {
        const response = await userApi.get('/Student/GetDailyScores', {
            params: {
                studentName: studentName, academicYear: academicYear,
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

        const response = await userApi.get('/Student/GetSubjectsAverageScores', {
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

// Hàm gọi API lấy điểm trung bình của học sinh
export const getAverageScores = async (studentName, academicYear) => {
    try {
        // Make the GET request to the 'GetAverageScores' endpoint
        const response = await userApi.get('/Student/GetAverageScores', {
            params: {
                studentName: studentName, academicYear: academicYear,
            },
        });

        // If the response status is 200 (OK), return the data
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // Log any errors that occur during the request
        console.error('Error fetching average scores:', error);
        throw error;  // Rethrow the error to handle it in the calling function
    }
};
