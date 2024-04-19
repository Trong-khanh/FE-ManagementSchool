import axios from 'axios';

const baseLink = 'https://localhost:7201/api';

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
        const response = await userApi.get(`/Admin/getaAllStudents`);
        return response.data
    }catch (error){
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

export { addStudent,GetAllStudent,UpdateStudent };
