import KakaoIcon from '@/assets/auth/splash/kakao.svg';
import Logo from '@/assets/auth/splash/logo.svg';
import GuestIcon from '@/assets/auth/splash/nonlogin.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  const { loginWithKakao } = useSocialAuth();

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

      {/* 카카오 로그인 */}
      <TouchableOpacity
        style={[styles.Button, { marginTop: 66 }]}
        onPress={loginWithKakao}
      >
        <KakaoIcon />
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
    width: '100%',
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
