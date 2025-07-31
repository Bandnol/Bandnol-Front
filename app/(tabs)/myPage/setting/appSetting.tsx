import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/typography';

export default function AppSetting() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/* Top Nav Bar */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/myPage/myPage')}
            style={styles.backBtn}
          >
            <BackArrow width={9} height={16} />
          </TouchableOpacity>
          <Text style={styles.title}>설정</Text>
          {/* 자리를 맞추기 위한 더미 View */}
          <View style={{ width: 24, height: 24 }} />
        </View>

        {/* List - 개별 router.push */}
        <View style={styles.listWrapper}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/userInfo')}
          >
            <Text style={styles.itemText}>회원 정보</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/receiveTime')}
          >
            <Text style={styles.itemText}>추천곡 수신 시간</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/notification')}
          >
            <Text style={styles.itemText}>알림</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/termsOfService')}
          >
            <Text style={styles.itemText}>이용약관</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/(auth)/inquiry')}
          >
            <Text style={styles.itemText}>문의하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topNavBar: {
    width: '100%',
    height: 62,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...Typography.subtitle1B,
    color: '#F4F4F4',
  },
  listWrapper: {
    width: '100%',
  },
  listItem: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#555',
  },
  itemText: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    ...Typography.body1,
  },
});
