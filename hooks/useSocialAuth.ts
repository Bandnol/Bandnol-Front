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

      if (res.idToken) {
        // 백엔드로 id_token 보내기
        const response = await fetch(
          `${API_URL}/api/v1/oauth2/callback/kakao`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token: res.idToken }),
          },
        );

        const data = await response.json();
        console.log('서버 응답:', data);

        if (data.success) {
          // accessToken 등 저장 후 다음 화면 이동 (문자열만 저장)
          await SecureStore.setItemAsync('accessToken', data.data.token);
          await SecureStore.setItemAsync(
            'user',
            JSON.stringify(data.data.user),
          );
          // user 정보 가져오기
          const { name, email } = data.data.user;
          router.push({
            pathname: '/(onboarding)/step1-personal',
            params: { name, email },
          });
        } else {
          console.error('카카오 로그인 실패:', data.error);
        }
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
