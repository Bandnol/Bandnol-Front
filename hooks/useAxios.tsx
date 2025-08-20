import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/auth';

// InternalAxiosRequestConfig 타입에 _retry 속성 추가
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Define a type for the signOut callback
type SignOutCallback = () => Promise<void>;

// Use a mutable variable to hold the signOut callback
let signOutCallback: SignOutCallback | null = null;

export const setAxiosSignOutCallback = (callback: SignOutCallback) => {
  signOutCallback = callback;
};

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = await SecureStore.getItemAsync('JWTToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomInternalAxiosRequestConfig;

      // 401 에러이고, 재시도한 요청이 아닐 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 재시도 플래그 설정 (무한 루프 방지)

        const refreshToken = await SecureStore.getItemAsync('JWTRefreshToken');

        if (refreshToken) {
          try {
            // 새 Axios 인스턴스로 토큰 재발급 요청 (인터셉터 무한 루프 방지)
            const response = await axios.post(
              `${process.env.EXPO_PUBLIC_API_URL}/api/v2/oauth2/refreshToken`,
              { refreshToken },
              { headers: { 'Content-Type': 'application/json' } },
            );

            // 요청하신대로 응답 바디 전체를 콘솔에 출력합니다.
            console.log('Refresh Token Response Body:', response.data);

            // v2 엔드포인트 응답 구조에 맞게 수정
            if (!response.data?.success) {
              throw new Error('Refresh token response indicates failure');
            }

            const newAccessToken = response.data.data?.token;
            const newRefreshToken = response.data.data?.refreshToken; // 서버가 새 리프레시 토큰을 줄 수도 있음

            if (newAccessToken) {
              // 새로운 토큰 저장 (SecureStore + Zustand 동기화)
              await SecureStore.setItemAsync('JWTToken', newAccessToken);
              useAuthStore.getState().setJWTToken(newAccessToken);
              if (newRefreshToken) {
                await SecureStore.setItemAsync(
                  'JWTRefreshToken',
                  newRefreshToken,
                );
              }

              // 원래 요청의 헤더에 새로운 토큰을 설정하여 재요청
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              return instance(originalRequest);
            }
          } catch (refreshError) {
            // 리프레시 토큰마저 만료되거나 유효하지 않은 경우
            console.error('Unable to refresh token:', refreshError);
            // Call the signOut callback if available
            if (signOutCallback) {
              await signOutCallback();
            }
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token found, sign out
          if (signOutCallback) {
            await signOutCallback();
          }
        }
      } else {
        // 401 and not a retry, and no refresh token was found or refresh failed
        // This case might happen if the initial token was invalid and no refresh token was present
        if (signOutCallback) {
          await signOutCallback();
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
