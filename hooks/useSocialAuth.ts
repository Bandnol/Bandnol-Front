import { API_URL } from '@env';
import { login } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export function useSocialAuth() {
  const router = useRouter();

  const loginWithKakao = async () => {
    try {
      console.log('[KAKAO] login() 호출');
      const res = await login();
      console.log('[KAKAO] login() 성공, 결과:', res);

      if (res.idToken) {
        const response = await fetch(
          `${API_URL}/api/v1/oauth2/callback/kakao`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_token: res.idToken, // id_token만 전송
            }),
          },
        );
        console.log('서버 응답 status:', response.status);

        const data = await response.json();
        console.log('서버 응답:', data);

        if (data.success) {
          // 액세스 토큰 저장 (필수)
          await SecureStore.setItemAsync('JWTToken', data.data.token);

          // 리프레시 토큰이 응답에 있을 때만 저장 (백엔드 캐시 전환 대응)
          if (data?.data?.refreshToken) {
            await SecureStore.setItemAsync(
              'JWTRefreshToken',
              data.data.refreshToken,
            );
            console.log('리프레시 토큰 저장 완료');
          } else {
            // 서버가 쿠키/캐시로만 관리하는 경우 대비
            await SecureStore.deleteItemAsync('JWTRefreshToken');
            console.log(
              '리프레시 토큰 미수신: 서버에서 캐시/쿠키로 관리하는 것으로 판단',
            );
          }

          // 사용자 정보 저장
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
          const errCode = data?.error?.code ?? 'UNKNOWN';
          const errMsg =
            data?.error?.message ?? data?.message ?? '알 수 없는 오류';
          console.error(`카카오 로그인 실패 [${errCode}] : ${errMsg}`, data);
        }
      } else {
        console.warn(
          '[KAKAO] idToken 없음: 로그인 취소 또는 토큰 발급 실패',
          res,
        );
      }
    } catch (error) {
      console.error('[KAKAO] login() 예외 발생:', error);
    }
  };

  return { loginWithKakao };
}
