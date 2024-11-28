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

authApi.interceptors.response.use(
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
                            authApi.defaults.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            userApi.defaults.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
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
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', response.data.user);
        localStorage.setItem('role', response.data.role);

        authApi.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        userApi.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

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
        // Correct API endpoint
        const response = await authApi.post('/Authenticate/Regsiter', userData, {
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
