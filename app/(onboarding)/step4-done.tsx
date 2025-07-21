import Logo from '@/assets/auth/splash/logo.svg';
import BackIcon from '@/assets/onboarding/Vector.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typo';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Step4DoneScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <View style={styles.statusBarLayout}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 200 }} />

        <View style={styles.logo}>
          <Logo />
        </View>
        <Text
          style={[Typography.body2, styles.text]}
        >{`마이밴놀 세팅이 완료되었어요!
이제 내 취향을 공유하러 가볼까요?`}</Text>

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors.palette.point }]}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={[Typography.body2, { color: Colors.palette.white }]}>
              시작하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  view: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  statusBarLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  bottomView: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    marginBottom: 24,
  },
  text: {
    width: 193,
    color: '#f4f4f4',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: Colors.palette.Gray800,
    padding: 16,
    height: 50,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
