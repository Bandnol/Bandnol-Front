import { useAuth } from '@/hooks/useAuthContext';
import { API_URL } from '@env';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function KakaoCallback() {
  const router = useRouter();

  const { setName, setEmail } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const idToken = await SecureStore.getItemAsync('kakaoIdToken');
        if (!idToken) {
          console.error('idToken이 없습니다.');
          return;
        }

        //id_token 전송
        const res = await axios.post(
          `${API_URL}/api/v1/oauth2/callback/kakao`,
          { idToken },
        );

        const { accessToken, refreshToken, name, email } = res.data.data;

        if (!accessToken) {
          console.error('AccessToken이 없습니다.');
          return;
        }

        setName(name);
        setEmail(email ?? '');
        await SecureStore.setItemAsync('accessToken', accessToken);
        if (refreshToken) {
          await SecureStore.setItemAsync('refreshToken', refreshToken);
        }

        router.replace('/(onboarding)/step1-personal');
      } catch (err) {
        console.error('콜백 처리 중 오류:', err);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>로그인 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});
