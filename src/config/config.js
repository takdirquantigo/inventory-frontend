import axios from 'axios';
export const API_URL = 'https://backend.mohammadenterprise.com';
// export const API_URL = 'http://localhost:8000';
// export const API_URL = 'https://sellerscomp-backend.vercel.app';
export const PRODUCT_API = 'https://backend.mohammadenterprise.com';

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isCustomerApi = url.includes('customer-portal');
    const token = isCustomerApi
      ? localStorage.getItem('customer_token')
      : localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isLoginPage = path === '/login' || path === '/admin/login';
      if (isLoginPage) {
        return Promise.reject(error);
      }
      if (path.startsWith('/customer')) {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer');
        window.location.href = '/login';
      } else if (path.startsWith('/admin')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
