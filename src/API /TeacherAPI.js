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
              localStorage.setItem(
                "accessToken",
                tokenResponse.data.accessToken
              );
              console.log(
                "Received new access token:",
                tokenResponse.data.accessToken
              );
              userApi.defaults.headers[
                "Authorization"
              ] = `Bearer ${tokenResponse.data.accessToken}`;
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${tokenResponse.data.accessToken}`;
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
  try {
    const response = await userApi.get(
      "/Teacher/GetStudentsInAssignedClasses",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: {
          email: teacherEmail,
        },
      }
    );
    console.log("Assigned students data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching assigned students:", error);
    throw error;
  }
};

const addScore = async (scoreData, teacherEmail) => {
  try {
    console.log(
      "Adding score with data:",
      scoreData,
      "for teacher:",
      teacherEmail
    ); 
    const response = await userApi.post("/Teacher/AddScore", {
      ...scoreData,
      teacherEmail,
    });
    console.log("Score added response:", response.data); 
    return response.data;
  } catch (error) {
    console.error(
      "Error adding score:",
      error.response ? error.response.data : error.message
    ); // In ra chi tiết lỗi nếu có
    throw new Error(
      error.response ? error.response.data : "Error adding score"
    );
  }
};
// Function to get scores for a specific student

const getScoresForStudent = async (studentId, subjectId = null, semesterId = null) => {
    try {
      const response = await userApi.get(`/Teacher/ GetScoreStudent/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: {
          subjectId,
          semesterId,
        },
      });
      console.log("Student scores data:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error fetching student scores:", error.response ? error.response.data : error.message);
      throw new Error(
        error.response ? error.response.data : "Error fetching student scores"
      );
    }
  };

  const calculateSemesterAverage = async (studentId, semesterId) => {
    try {
      const response = await userApi.get("/Teacher/CalculateSemesterAverage", {
        params: {
          studentId,
          semesterId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.SemesterAverage;
    } catch (error) {
      console.error(
        "Error calculating semester average:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  

  export {
    ViewAllSemesters,
    AssignedClassesStudents,
    addScore,
    getScoresForStudent,
    calculateSemesterAverage
  };
  
