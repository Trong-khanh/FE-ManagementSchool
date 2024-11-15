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

// Gọi API để tính điểm trung bình
export const calculateAverageScores = async (className, academicYear) => {
    try {
        const response = await userApi.post('/Admin/calculate-class-average', null, {
            params: { className, academicYear }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tính điểm trung bình:", error);
        return null;
    }
};

// Hàm gọi API để lấy điểm trung bình của học sinh trong một lớp

export const getStudentAverageScores = async (classId, academicYear) => {
    try {
        const response = await userApi.get('/Admin/getAverage-scores', { // Đổi thành userApi
            params: { classId, academicYear },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy điểm trung bình:", error);
        return null;
    }
};



