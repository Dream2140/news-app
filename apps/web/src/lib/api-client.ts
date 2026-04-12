import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 15000,
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .get(`${API_URL}/api/user/refresh`, { withCredentials: true })
          .then(() => {})
          .catch(() => {})
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
