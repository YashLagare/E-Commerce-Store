import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true,
});

// Axios interceptor to handle token refresh
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh the token
                await instance.post('/auth/refresh-token');
                // Retry the original request
                return instance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle logout
                console.error('Token refresh failed:', refreshError);
                // Optionally, clear user state or redirect
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
