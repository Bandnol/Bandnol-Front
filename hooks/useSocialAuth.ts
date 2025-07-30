import { API_URL } from '@env';
import { login } from '@react-native-kakao/user';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export function useSocialAuth() {
  const router = useRouter();

  const loginWithKakao = async () => {
    try {
      const res = await login();
      console.log('카카오 로그인 결과:', res);
      // accessToken, userId 등 res에서 받아와서 서버로 넘기기
      if (res.idToken) {
        await SecureStore.setItemAsync('kakaoIdToken', res.idToken);
        router.push('/(auth)/callback/KaKaoCallback');
      }
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const loginUrl = `${API_URL}/api/v1/oauth2/login/google`;
      await Linking.openURL(loginUrl);
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  const loginWithNaver = async () => {
    router.push('/(onboarding)/step1-personal');
  };

  return { loginWithKakao, loginWithGoogle, loginWithNaver };
}
