import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
        // Handle different error types
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 429:
                    // Rate limited
                    console.error('Too many requests. Please try again later.');
                    break;
                case 500:
                    // Server error
                    console.error('Server error occurred');
                    break;
                default:
                    console.error('API Error:', data?.message || 'Unknown error');
            }
        } else if (error.request) {
            // Network error
            console.error('Network error. Please check your connection.');
        } else {
            // Other error
            console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// API methods
export const emailAPI = {
    sendEmail: (data) => api.post('/email/send', data),
};

export const healthAPI = {
    check: () => api.get('/health'),
};

export default api; 