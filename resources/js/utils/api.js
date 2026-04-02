import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    const data = response.data;
    const method = (response.config?.method || 'get').toLowerCase();
    const url = response.config?.url || '';

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/auth');

    const isMutationMethod = ['post', 'put', 'patch', 'delete'].includes(method);
    const isMutatingGet =
      method === 'get' &&
      (url.includes('/users/switch-status/') || url.includes('/users/switch-role/'));

    if (isAdminArea && data?.message && (isMutationMethod || isMutatingGet)) {
      window.dispatchEvent(
        new CustomEvent('app-toast', {
          detail: { type: 'success', message: data.message },
        })
      );
    }

    return data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const errors = error.response?.data?.errors || error.response?.data?.error || {};

    const method = (error.config?.method || 'get').toLowerCase();
    const url = error.config?.url || '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/auth');

    const isMutationMethod = ['post', 'put', 'patch', 'delete'].includes(method);
    const isMutatingGet =
      method === 'get' &&
      (url.includes('/users/switch-status/') || url.includes('/users/switch-role/'));

    if (isAdminArea && message && (isMutationMethod || isMutatingGet)) {
      window.dispatchEvent(
        new CustomEvent('app-toast', {
          detail: { type: 'error', message },
        })
      );
    }

    console.error('API Error:', message, errors);
    
    return Promise.reject({ message, errors, original: error });
  }
);

export default api;
