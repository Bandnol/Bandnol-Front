import GoogleIcon from '@/assets/auth/splash/google.svg';
import KakaoIcon from '@/assets/auth/splash/kakao.svg';
import Logo from '@/assets/auth/splash/logo.svg';
import NaverIcon from '@/assets/auth/splash/naver.svg';
import GuestIcon from '@/assets/auth/splash/nonlogin.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios 인스턴스
import { API_URL } from '@env'; // baseURL 확인용
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const handleGoogleLogin = async () => {
  try {
    const res = await api.get('/api/v1/oauth2/login/google');
    // 서버가 바로 redirect 응답(302)을 하므로, URL은 우리가 직접 열어야 함
    const loginUrl = `${API_URL}/api/v1/oauth2/login/google`;
    await Linking.openURL(loginUrl);
  } catch (err) {
    console.error('구글 로그인 실패:', err);
  }
};

export default function SplashScreen() {
  const router = useRouter();

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 로직
    router.push('/(onboarding)/step1-personal');
  };

  const handleNaverLogin = () => {
    // TODO: 네이버 로그인 로직
    router.push('/(onboarding)/step1-personal');
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 로직
    router.push('/(onboarding)/step1-personal');
  };

  const handleGuest = () => {
    router.replace('/(tabs)/home'); // 로그인 없이 바로 홈으로
  };

  const handleInquiry = () => {
    router.push('/(auth)/inquiry');
  };

  return (
    <View style={styles.container}>
      {/* 앱 로고 */}
      <View style={{ height: 80 }} />
      <View style={styles.logo}>
        <Logo width={100} height={125} />
      </View>
      <Text style={styles.text}>{`하루 한 곡, 음악 취향을 공유하고 
밴놀을 즐겨보세요!`}</Text>

      {/* 구글 로그인 */}
      <TouchableOpacity
        style={[styles.Button, { marginTop: 66 }]}
        onPress={handleGoogleLogin}
      >
        <GoogleIcon />
      </TouchableOpacity>

      {/* 카카오 로그인 */}
      <TouchableOpacity style={styles.Button} onPress={handleKakaoLogin}>
        <KakaoIcon />
      </TouchableOpacity>

      {/* 네이버 로그인 */}
      <TouchableOpacity style={styles.Button} onPress={handleNaverLogin}>
        <NaverIcon />
      </TouchableOpacity>

      {/* 로그인 없이 둘러보기 */}
      <TouchableOpacity onPress={handleGuest} style={styles.Button}>
        <GuestIcon />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleInquiry}>
        <Text style={[styles.inquiry, { marginTop: 20 }]}>문의하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.palette.Gray900,
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 24,
  },
  text: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
    textAlign: 'center',
    width: 193,
  },
  Button: {
    width: 335,
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  inquiry: {
    ...Typography.caption1,
    textDecorationLine: 'underline',
    color: Colors.palette.Gray500,
    textAlign: 'center',
    width: '100%',
  },
});
