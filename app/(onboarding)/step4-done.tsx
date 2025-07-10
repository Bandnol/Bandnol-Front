import Logo from '@/assets/auth/splash/logo.svg';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {/* 앱 로고 */}
        <View style={styles.logo}>
          <Logo width={160} height={160} />
        </View>
        <Text style={styles.text}>{`마이밴놀 세팅 완료!
이제 내 취향을 공유하러가볼까요?`}</Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, { marginBottom: 30 }]}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={[styles.text21, styles.textTypo]}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  btn: {
    backgroundColor: '#FB4932',
    padding: 16,
    height: 50,
    width: 335,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text21: {
    color: '#FFFFFF',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    fontWeight: '600',
  },
  textTypo: {
    textAlign: 'left',
    fontFamily: 'Pretendard',
  },
});
