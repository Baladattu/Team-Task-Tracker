import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any request headers if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                // Unauthorized - redirect to login
                window.location.href = '/login';
            } else if (response.status >= 400) {
                toast.error(response.data.message || 'An error occurred');
            }
        } else {
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default api;