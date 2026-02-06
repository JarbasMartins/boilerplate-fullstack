import axios from 'axios';
import type { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL;

export const http = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
        }

        return Promise.reject(error);
    },
);
