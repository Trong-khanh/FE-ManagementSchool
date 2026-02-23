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

const attachAuthToken = (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

authApi.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
userApi.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));

authApi.interceptors.response.use(
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
                            authApi.defaults.headers['Authorization'] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
                            userApi.defaults.headers['Authorization'] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
                            originalRequest.headers['Authorization'] = `Bearer ${(tokenResponse.data.accessToken || tokenResponse.data.AccessToken)}`;
                            return authApi(originalRequest);
                        }
                    })
                    .catch(refreshError => {
                        if (refreshError.response?.status === 403) {
                            console.error('Refresh token expired, logging out.');
                            localStorage.clear();
                            window.location.href = '/login';
                        }
                        return Promise.reject(refreshError);
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

const login = async (credentials) => {
    try {
        const response = await authApi.post('/Authenticate/Login', credentials);
        const loginAccessToken = response.data.accessToken || response.data.AccessToken;
        const userValue = typeof response.data.user === 'string'
            ? response.data.user
            : JSON.stringify(response.data.user ?? {});

        localStorage.setItem('accessToken', loginAccessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', userValue);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userName', credentials.userName || credentials.username || '');

        const emailFromUser = response.data?.user?.email || response.data?.email;
        if (emailFromUser) {
            localStorage.setItem('teacherEmail', emailFromUser);
            localStorage.setItem('parentEmail', emailFromUser);
        }

        authApi.defaults.headers['Authorization'] = `Bearer ${loginAccessToken}`;
        userApi.defaults.headers['Authorization'] = `Bearer ${loginAccessToken}`;

        console.log('User logged in successfully.');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            throw new Error(error.response?.data?.message || "An error occurred during the login process.");
        } else {
            throw new Error("A network or unknown error occurred during the login process.");
        }
    }
};

const register = async (userData, role) => {
    try {
        const response = await authApi.post('/Authenticate/Register', userData, {
            params: { role }
        });
        console.log('User registered successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error.response || error.message || error);

        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            throw new Error(error.response?.data?.message || "An error occurred during the registration process.");
        } else {
            throw new Error("A network or unknown error occurred during the registration process.");
        }
    }
};

export { login, register, userApi };
