import Logo from '@/assets/auth/splash/logo.svg';
import KakaoIcon from '@/assets/auth/splash/kakao.svg';
import NaverIcon from '@/assets/auth/splash/naver.svg';
import GoogleIcon from '@/assets/auth/splash/google.svg';
import GuestIcon from '@/assets/auth/splash/nonlogin.svg';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

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
      <View style={styles.logo}>
        <Logo width={160} height={160} />
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
    backgroundColor: '#121212',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  text: {
    width: 193,
    fontSize: 14,
    letterSpacing: -0.3,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    color: '#f4f4f4',
    textAlign: 'center',
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
    width: '100%',
    fontSize: 12,
    textDecorationLine: 'underline',
    letterSpacing: -0.3,
    lineHeight: 17,
    fontFamily: 'Pretendard',
    color: '#7c7c7c',
    textAlign: 'center',
  },
});
