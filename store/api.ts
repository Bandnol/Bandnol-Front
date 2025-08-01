import { useAuthStore } from '@/store/auth';
import { API_URL } from '@env';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('인증 오류: 토큰이 만료되었거나 유효하지 않습니다.');
      // 로그아웃 처리 또는 리다이렉트 등의 로직 삽입 가능
      // 예: useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
