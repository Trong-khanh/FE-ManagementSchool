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
        // Kiểm tra lỗi xác thực
        if (error.response.status === 401 && !originalRequest._retry) {
            if (!refreshingTokenPromise) {
                originalRequest._retry = true;
                refreshingTokenPromise = authApi.post('/Authenticate/refresh-token', { Token: localStorage.getItem('refreshToken') })
                    .then(tokenResponse => {
                        if (tokenResponse.data && tokenResponse.data.accessToken) {
                            localStorage.setItem('accessToken', tokenResponse.data.accessToken);
                            console.log('Nhận được mã thông báo truy cập mới: ', tokenResponse.data.accessToken);
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

// Hàm lấy tất cả các học kỳ
const ViewAllSemesters = async () => {
    try {
        const response = await userApi.get(`/Teacher/ViewAllSemesters`);
        return response.data; // Trả về dữ liệu học kỳ
    } catch (error) {
        console.error('Lỗi', error);
        throw error; // Quăng lỗi để xử lý nếu cần
    }
};

// Hàm lấy học sinh trong các lớp được phân công
const AssignedClassesStudents = async (teacherEmail) => {
    try {
        console.log('Email giáo viên:', teacherEmail); // Ghi log email giáo viên
        const response = await userApi.get(`/Teacher/GetStudentsInAssignedClasses`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            params: {
                email: teacherEmail 
            }
        });
        console.log('Nhận được học sinh:', response.data); // Ghi log danh sách học sinh nhận được
        return response.data; // Trả về danh sách học sinh
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học sinh:', error);
        throw error; // Quăng lỗi để xử lý nếu cần
    }
};

// Hàm thêm điểm
const addScore = async (scoreData, teacherEmail) => {
    try {
        console.log('Dữ liệu điểm:','teacheremail' ,teacherEmail, scoreData); 
        const response = await userApi.post('/Teacher/AddScore', scoreData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            params: { teacherEmail } // Gửi email giáo viên như tham số query
        });
        console.log('Điểm đã được thêm thành công:', response.data); // Ghi log kết quả từ server
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Lỗi khi thêm điểm:', error);
        throw error; // Quăng lỗi để xử lý nếu cần
    }
};

export { ViewAllSemesters, AssignedClassesStudents, addScore };
