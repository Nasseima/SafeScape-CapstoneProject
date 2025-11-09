import axios from 'axios';

// use VITE_API_URL in production, fallback to local when developing
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default instance;
