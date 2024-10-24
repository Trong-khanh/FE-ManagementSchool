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
// Create Class
export const addClass = async (newClass) => {
    try {
        const response = await userApi.post('Admin/AddClass', newClass);
        return response.data; // Return the created class
    } catch (error) {
        throw error.response.data; // Handle error appropriately
    }
};

// Read All Classes
export const getAllClasses = async () => {
    try {
        const response = await userApi.get('Admin/GetAllClasses');
        return response.data; // Return the list of classes
    } catch (error) {
        throw error.response.data; // Handle error appropriately
    }
};

// Read One Class
export const getClassById = async (id) => {
    try {
        const response = await userApi.get(`Admin/GetClass/${id}`);
        return response.data; // Return the class details
    } catch (error) {
        throw error.response.data; // Handle error appropriately
    }
};

// Update Class
export const updateClass = async (id, updatedClass) => {
    try {
        const response = await userApi.put(`Admin/UpdateClass/${id}`, updatedClass);
        return response.data; // Return the updated class
    } catch (error) {
        throw error.response.data; // Handle error appropriately
    }
};

// Delete Class
export const deleteClass = async (id) => {
    try {
        const response = await userApi.delete(`Admin/DeleteClass/${id}`);
        return response.data; // Return success message
    } catch (error) {
        throw error.response.data; // Handle error appropriately
    }
};