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

    // console.log('error :::::::', error);
    console.log('error :::::::', error.response?.status);
    console.log('original request :::::::', originalRequest.url);
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest.url !== '/auth/refresh'
    ) {
      try {
        
        const refreshToken = await getRefreshToken();
        console.log('refresh token value error 401 or 403:::::::', refreshToken);
        const response = await api.post('/auth/refresh', {
          refreshToken,
        });

        console.log("response from backend:::::", response.data)
        const { authenticationToken: authenticationToken, refreshToken: newRefresh } = response.data;

        await saveTokens(authenticationToken, newRefresh);

        originalRequest.headers.Authorization = `Bearer ${authenticationToken}`;

        return api(originalRequest);
      } catch (err) {
        //await clearTokens();
        console.log('error when retrying :::::::', err);
        // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;

