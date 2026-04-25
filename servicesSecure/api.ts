import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./authStorage"

const api = axios.create({
  baseURL: 'http://localhost:8080', // change for device testing
  timeout: 10000,
});

// Attach token
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/refresh'
    ) {
      try {
        console.log('error 401:::::::');
        const refreshToken = await getRefreshToken();

        const response = await api.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = response.data;

        await saveTokens(accessToken, newRefresh);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        await clearTokens();
        // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;

