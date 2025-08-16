import { initializeKakaoSDK } from '@react-native-kakao/core';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';

import { AuthProvider } from '@/hooks/useAuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
//import { usePushNotifications } from '@/hooks/usePushNotification';  //애플 팀계정 필요

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || '';

  const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
  const router = useRouter();

  const [loaded] = useFonts({
    Pretendard: require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
  });

  //usePushNotifications(); 애플 팀계정 필요

  useEffect(() => {
    if (kakaoNativeAppKey) {
      initializeKakaoSDK(kakaoNativeAppKey);
    } else {
      console.warn('Kakao Native App Key가 설정되지 않았습니다.');
    }
  }, [kakaoNativeAppKey]);

  // 앱 최초 진입 시 자동 로그인/온보딩 스킵 라우팅 (한 번만 실행)
  const didRouteOnce = useRef(false);
  useEffect(() => {
    if (!loaded) return; // 폰트 로딩 이후 실행 (스플래시 깜빡임 방지)
    if (didRouteOnce.current) return;
    didRouteOnce.current = true;

    (async () => {
      try {
        const token = await SecureStore.getItemAsync('JWTToken');
        if (token) {
          // 로그인 유지: 바로 홈으로
          router.replace('/(tabs)/home');
        } else {
          // 비로그인: 스플래시/로그인 진입
          router.replace('/(auth)/splash');
        }
      } catch (e) {
        // 오류 시 안전하게 인증 플로우로 보냄
        router.replace('/(auth)/splash');
      }
    })();
  }, [loaded, router]);

  useEffect(() => {
    let authAlertShown = false;
    let refreshing: Promise<string | null> | null = null;

    const refreshAccessToken = async (): Promise<string | null> => {
      if (!refreshing) {
        refreshing = (async () => {
          try {
            const refresh = await SecureStore.getItemAsync('JWTRefreshToken');
            if (!refresh) return null;
            const r = await axios.request({
              url: `${API_URL}/api/v1/oauth2/refresh/token`,
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refresh}`,
                'X-Skip-Auth-Interceptor': '1',
              },
              data: { refreshToken: refresh },
              validateStatus: () => true,
            });
            if (r.status !== 200 || !r.data?.success) return null;
            const newAccess =
              r.data?.data?.token ?? r.data?.data?.accessToken ?? null;
            const newRefresh = r.data?.data?.refreshToken ?? null;
            if (!newAccess) return null;
            await SecureStore.setItemAsync('JWTToken', String(newAccess));
            if (newRefresh)
              await SecureStore.setItemAsync(
                'JWTRefreshToken',
                String(newRefresh),
              );
            return String(newAccess);
          } catch (e) {
            return null;
          } finally {
            refreshing = null;
          }
        })();
      }
      return refreshing;
    };

    const reqId = axios.interceptors.request.use(async (config) => {
      config.headers = config.headers ?? {};
      // 이 헤더가 있으면 전역 인증 부착 스킵 (리프레시 호출 등)
      if ((config.headers as any)['X-Skip-Auth-Interceptor'] === '1')
        return config;
      const t = await SecureStore.getItemAsync('JWTToken');
      if (t) (config.headers as any).Authorization = `Bearer ${t}`;
      if (
        !config.baseURL &&
        API_URL &&
        typeof config.url === 'string' &&
        !/^https?:\/\//.test(config.url)
      ) {
        config.baseURL = API_URL;
      }
      return config;
    });

    const resId = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;
        if (status !== 401) return Promise.reject(error);

        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          if (!authAlertShown) {
            authAlertShown = true;
            Alert.alert(
              '로그인 후 사용할 수 있습니다.',
              '',
              [
                {
                  text: '확인',
                  onPress: () => {
                    authAlertShown = false;
                    SecureStore.deleteItemAsync('JWTToken');
                    SecureStore.deleteItemAsync('JWTRefreshToken');
                    router.push('/(auth)/splash');
                  },
                },
              ],
              { cancelable: false },
            );
          }
          return Promise.reject(error);
        }

        // 토큰 갱신 성공 → 원요청 재시도
        const cfg = error.config;
        cfg.headers = cfg.headers ?? {};
        cfg.headers.Authorization = `Bearer ${newAccess}`;
        return axios(cfg);
      },
    );

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, [API_URL, router]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
