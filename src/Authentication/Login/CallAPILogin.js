import axios from 'axios';

const baseLink = 'https://localhost:7201/api';

const authApi = axios.create({
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
                            console.log('New access token received: ', tokenResponse.data.accessToken);
                            authApi.defaults.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.accessToken}`;
                            return authApi(originalRequest);
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

const login = async (credentials) => {
    try {
        const response = await authApi.post('/Authenticate/Login', credentials);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user',response.data.user)
        localStorage.setItem('role',response.data.role)
        console.log('User logged in successfully.');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        // Check if the error has a response property
        if (error.response) {
            // Handle HTTP errors
            throw new Error(error.response.data?.message || "An error occurred during the login process.");
        } else {
            // Handle network or other errors
            throw new Error("A network or unknown error occurred during the login process.");
        }
    }

};
const register = async (userData) => {
    try {
        console.log("Register data", userData);
        const response = await authApi.post('/Account/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};



export{login, register };