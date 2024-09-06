import Delete from '@mui/icons-material/Delete';
import axios from 'axios';

const baseLink = 'https://localhost:7201/api';

// Tạo authApi để gọi các API liên quan đến xác thực
const authApi = axios.create({
    baseURL: baseLink,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Tạo userApi để gọi các API có yêu cầu xác thực
const userApi = axios.create({
    baseURL: baseLink,
    headers: {
        'Content-Type': 'application/json'
    }
});

let refreshingTokenPromise = null;

// Interceptor để thêm Authorization token vào tất cả các request
userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor để xử lý refresh token khi token hết hạn
userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (!refreshingTokenPromise) {
                originalRequest._retry = true;
                refreshingTokenPromise = authApi.post('/Authenticate/refresh-token', { Token: localStorage.getItem('refreshToken') })
                    .then(tokenResponse => {
                        if (tokenResponse.data && tokenResponse.data.accessToken) {
                            localStorage.setItem('accessToken', tokenResponse.data.accessToken);
                            console.log('New access token received: ', tokenResponse.data.accessToken);
                            userApi.defaults.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            return userApi(originalRequest);
                        }
                    }).finally(() => {
                        refreshingTokenPromise = null;
                    });
            }
            return refreshingTokenPromise;
        }
        return Promise.reject(error);
    }
);

const addSemester = async (semesterData) => {
    try {
        const response = await userApi.post(`/Admin/AddSemester`, semesterData);
        console.log("User data: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } 
};

const getAllSemesters = async () => {
    try {
        const response = await userApi.get(`/Admin/GetAllSemesters`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const updatedSemester = async (semesterId, updatedSemesterData) => {
    try {
        const response = await userApi.put(`/Admin/UpdateSemester/${semesterId}`, updatedSemesterData);
        console.log("Semester updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating semester:', error);
        throw error;
    }
};

const deleteSemester = async (semesterId, deleteSemesterData) => {
    try {
        const response = await userApi.delete(`/Admin/DeleteSemester/${semesterId}`, deleteSemesterData);
        console.log("Semester deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting semester:', error);
        throw error;
    }
}
export {addSemester, getAllSemesters, updatedSemester, deleteSemester}

