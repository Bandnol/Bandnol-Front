import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/typography';

export default function TermsOfService() {
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
            onPress={() => router.push('/myPage/setting/appSetting')}
            style={styles.backBtn}
          >
            <BackArrow width={9} height={16} />
          </TouchableOpacity>
          <Text style={styles.title}>이용약관</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              밴놀 이용 약관 {'\n'}
              {'\n'}1. 서비스 소개{'\n'}
              ·밴놀은 사용자의 음악 취향에 따라 추천곡을 제공하고, 감상 기록을
              공유할 수 있는 음악 기반 SNS입니다.{'\n'}
              {'\n'} 2. 계정 및 개인정보{'\n'} ·사용자는 본인의 정보를 정확히
              입력해야 하며, 타인의 정보를 도용할 수 없습니다.{'\n'} ·밴놀은
              서비스 제공을 위해 최소한의 개인정보를 수집하며, 관련 법령에 따라
              보호합니다.{'\n'}
              {'\n'} 3. 콘텐츠 이용 및 소유권 {'\n'}·사용자가 올린 글, 댓글,
              감상 기록 등의 콘텐츠는 사용자에게 소유권이 있습니다. {'\n'}·다만,
              밴놀은 서비스 운영 및 홍보 목적으로 콘텐츠를 비상업적 범위에서
              활용할 수 있습니다. {'\n'}
              {'\n'}4. 금지 행위 {'\n'}·타인을 비방하거나 혐오/음란/불법
              콘텐츠를 게시하는 행위는 금지됩니다. {'\n'}·반복적 신고 또는 악성
              이용자의 경우 사전 경고 없이 계정이 제한될 수 있습니다. {'\n'}
              {'\n'}5. 서비스 변경 및 종료{'\n'} ·밴놀은 더 나은 서비스를 위해
              기능을 수정하거나 종료할 수 있습니다. {'\n'}·이 경우, 사전에
              공지를 통해 사용자에게 안내드립니다. {'\n'}
              {'\n'}6. 약관 변경{'\n'}·본 약관은 변경될 수 있으며, 변경 시 사전
              고지를 통해 사용자에게 안내합니다.
            </Text>
          </View>
        </ScrollView>
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
    display: 'flex',
    width: 375,
    height: 62,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
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
    color: '#FFFFFF',
    ...Typography.subtitle1B,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textContainer: {
    width: '100%',
    height: 640,
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
});
