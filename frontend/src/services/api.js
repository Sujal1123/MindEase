import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mindease-production-ed22.up.railway.app',
});

API.interceptors.request.use(config => {
  try {
    const userStr = localStorage.getItem('user');

    if (userStr && userStr !== 'undefined') {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.error('Invalid user JSON in localStorage:', err);
    localStorage.removeItem('user');
  }

  return config;
});

export default API;
