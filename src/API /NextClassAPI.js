import axios from 'axios';

const baseLink = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
// Tạo hàm để gọi API cập nhật lớp học và reset điểm
const updateClassAndResetScores = async (request) => {
    try {
        const response = await userApi.post('/Admin/UpdateClassAndResetScores', request);
        console.log('Upgrade Success:', response.data);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data || 'An error occurred while updating class.';
        console.error('Error when sent request', error);
        throw new Error(message);
    }
};

export { updateClassAndResetScores };
