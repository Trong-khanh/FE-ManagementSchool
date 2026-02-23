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


