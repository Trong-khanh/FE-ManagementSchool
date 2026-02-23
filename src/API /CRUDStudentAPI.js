import axios from 'axios';

const baseLink = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
    baseURL: baseLink,
    headers: {
        'Content-Type': 'application/json'
    }
});

const userApi = axios.create({
    baseURL: baseLink,
    headers: {
        'Content-Type': 'application/json'
    }
});

let refreshingTokenPromise = null;

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (!refreshingTokenPromise) {
                originalRequest._retry = true;
                refreshingTokenPromise = authApi.post('/Authenticate/refresh-token', { Token: localStorage.getItem('refreshToken') })
                    .then(tokenResponse => {
                        if (tokenResponse.data && (tokenResponse.data.accessToken || tokenResponse.data.AccessToken)) {
                            localStorage.setItem('accessToken', (tokenResponse.data.accessToken || tokenResponse.data.AccessToken));
                            console.log('New access token received: ', (tokenResponse.data.accessToken || tokenResponse.data.AccessToken));
                            userApi.defaults.headers['Authorization'] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
                            originalRequest.headers['Authorization'] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
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

const addStudent = async (studentData) => {
    try {
        const response = await userApi.post(`/Admin/AddStudent`, studentData);
        console.log("User data: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const GetAllStudent = async() =>{
    try {
        const response = await userApi.get(`/Admin/GetAllStudents`);
        return response.data
    }catch (error){
        if (error.response?.status === 404) {
            const fallback = await userApi.get(`/Admin/getaAllStudents`);
            return fallback.data;
        }
        console.error('Error', error);
        throw error;
    }
}

const UpdateStudent = async (studentId, updatedStudentData) => {
    try {
        const response = await userApi.put(`/Admin/UpdateStudent/${studentId}`, updatedStudentData);
        console.log("Student updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

const DeleteStudent = async (studentId, DeleteStudentData) => {
    try {
        const config = DeleteStudentData ? { data: DeleteStudentData } : undefined;
        const response = await userApi.delete(`/Admin/DeleteStudent/${studentId}`, config);
        console.log("Student delete successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error delete student:', error);
        throw error;
    }
};

export { addStudent,GetAllStudent,UpdateStudent,DeleteStudent };
