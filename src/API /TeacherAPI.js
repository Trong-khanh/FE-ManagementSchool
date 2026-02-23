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

const attachAuthToken = (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

userApi.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));

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

// Function to get all semesters
const ViewAllSemesters = async () => {
    try {
        const response = await userApi.get("/Teacher/ViewAllSemesters");

        return response.data; // Trả về dữ liệu kỳ học
    } catch (error) {
        console.error("Error fetching semesters:", error);
        throw error; // Truyền lỗi để xử lý tiếp
    }
};

// Function to get students in assigned classes
const AssignedClassesStudents = async (teacherEmail) => {
    let resolvedTeacherEmail = teacherEmail || localStorage.getItem("teacherEmail");
    if (!resolvedTeacherEmail) {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                resolvedTeacherEmail = parsed.email || parsed.userName || "";
            }
        } catch (_error) {
            resolvedTeacherEmail = "";
        }
    }

    try {
        const response = await userApi.get("/Teacher/GetStudentsInAssignedClasses", {
            params: {
                email: resolvedTeacherEmail,
            },
        });
        console.log("Assigned students data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching assigned students:", error);
        throw error;
    }
};

const addScore = async (scoreData) => {
    try {
        console.log("Adding score with data:", scoreData);
        const response = await userApi.post("/Teacher/AddScore", {
            studentId: scoreData.studentId,
            subjectId: scoreData.subjectId,
            semesterId: scoreData.semesterId,
            examType: scoreData.examType,
            scoreValue: scoreData.scoreValue
        });
        console.log("Score added response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding score:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data : "Error adding score");
    }
};

// Function to get scores for a specific student
const getScoresForStudent = async (studentId, subjectId = null, semesterId = null) => {
    try {
        const response = await userApi.get(`/Teacher/GetScoreStudent/${studentId}`, {
            params: {
                subjectId, semesterId,
            },
        });
        console.log("Student scores data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching student scores:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data : "Error fetching student scores");
    }
};

const calculateSemesterAverage = async (studentId, semesterId) => {
    try {
        const response = await userApi.get("/Teacher/CalculateSemesterAverage", {
            params: {
                studentId, semesterId,
            },
        });
        return response.data.SemesterAverage;
    } catch (error) {
        console.error("Error calculating semester average:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const getSemesterAverageForStudent = async (studentId, semesterId) => {
    try {
        const response = await userApi.get(`/Teacher/GetSemesterAverage/${studentId}/semester/${semesterId}`);
        console.log("Semester average score for student:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching semester average:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data : "Error fetching semester average");
    }
};

export {
    ViewAllSemesters,
    AssignedClassesStudents,
    addScore,
    getScoresForStudent,
    calculateSemesterAverage,
    getSemesterAverageForStudent
};
  
