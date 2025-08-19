import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AuthSessionProvider, useAuthSession } from '@/hooks/useAuthSession';
import { AuthProvider } from '@/hooks/useAuthContext';
import { setAxiosSignOutCallback } from '@/hooks/useAxios';

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
    return null; // Still loading fonts or checking auth session
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
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
