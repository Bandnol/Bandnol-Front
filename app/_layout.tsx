import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AuthSessionProvider, useAuthSession } from '@/hooks/useAuthSession';
import { AuthProvider } from '@/hooks/useAuthContext';
import { setAxiosSignOutCallback } from '@/hooks/useAxios';


export const unstable_settings = {
  devtools: false,
  initialRouteName: 'splash', // 선택사항 (첫 화면 지정)
};

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
  });

  const { isAuthenticated, signOut } = useAuthSession();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setAxiosSignOutCallback(signOut);
  }, [signOut]);

  if (!loaded || isAuthenticated === null) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="artist/[artistId]" />

      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthSessionProvider>
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
    </AuthSessionProvider>
  );
}
