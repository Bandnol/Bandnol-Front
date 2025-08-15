import 'react-native-reanimated';

import { initializeKakaoSDK } from '@react-native-kakao/core';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import React, { useEffect } from 'react';

import { AuthProvider } from '@/hooks/useAuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || '';

  const [loaded] = useFonts({
    Pretendard: require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
  });

  useEffect(() => {
    if (kakaoNativeAppKey) {
      initializeKakaoSDK(kakaoNativeAppKey);
    } else {
      console.warn('Kakao Native App Key가 설정되지 않았습니다.');
    }
  }, [kakaoNativeAppKey]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
