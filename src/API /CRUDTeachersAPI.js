import axios from "axios";

const baseLink = "https://localhost:7201/api";

const authApi = axios.create({
  baseURL: baseLink,
  headers: {
    "Content-Type": "application/json",
  },
});

const adminApi = axios.create({
  baseURL: baseLink,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshingTokenPromise = null;

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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
              adminApi.defaults.headers[
                "Authorization"
              ] = `Bearer ${tokenResponse.data.accessToken}`;
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${tokenResponse.data.accessToken}`;
              return adminApi(originalRequest);
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

// Teacher API Functions
export const addTeacher = async (teacher) => {
  try {
    const response = await adminApi.post("/Admin/AddTeacher", teacher);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to add teacher");
  }
};

export const getTeachers = async () => {
  try {
    const response = await adminApi.get("/Admin/GetAllTeachers");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch teachers");
  }
};

export const getTeachersBySubject = async (subjectName) => {
  try {
    const response = await adminApi.get(`/Admin/GetTeachersBySubject/${subjectName}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch teachers by subject");
  }
};

export const assignTeacherToClass = async (assignmentDto) => {
  try {
    const response = await adminApi.post("/Admin/AssignTeacherToClass", assignmentDto);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to assign teacher to class");
  }
};

export const updateTeacher = async (teacherId, updatedTeacher) => {
  try {
    const response = await adminApi.put(`/Admin/UpdateTeacher/${teacherId}`, updatedTeacher);
    return response.data;
  } catch (error) {
    console.error("Error in updateTeacher:", error);
    throw new Error(error.response?.data?.message || "Failed to update teacher");
  }
};

export const deleteTeacherById = async (teacherId) => {
  try {
    const response = await adminApi.delete(`/Admin/DeleteTeacher/${teacherId}`);
    console.log("Teacher deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in deleteTeacherById:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete teacher");
  }
};

export const getAssignedTeachers = async () => {
  try {
    const response = await adminApi.get("/Admin/GetTeacherClassAssigned");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch assigned teachers");
  }
};
