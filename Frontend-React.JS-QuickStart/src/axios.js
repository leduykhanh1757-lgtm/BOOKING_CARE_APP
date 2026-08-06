import axios from 'axios';
import _ from 'lodash';

let backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    backendUrl = `https://${backendUrl}`;
}

const instance = axios.create({
    baseURL: backendUrl,
});

instance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            console.warn('Phiên đăng nhập hết hạn hoặc chưa xác thực.');
        } else if (status === 403) {
            console.warn('Không có quyền truy cập tài nguyên này.');
        } else if (status === 500) {
            console.error('Lỗi máy chủ nội bộ (500).');
        }
        return Promise.reject(error);
    }
);

export default instance;
