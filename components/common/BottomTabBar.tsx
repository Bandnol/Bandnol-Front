import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import HomeActive from '@/components/common/icons/Home-active.svg';
import HomeInactive from '@/components/common/icons/Home-inactive.svg';
import MyPageActive from '@/components/common/icons/MyPage-active.svg';
import MyPageInactive from '@/components/common/icons/MyPage-inactive.svg';
import PostActive from '@/components/common/icons/Post-active.svg';
import PostInactive from '@/components/common/icons/Post-inactive.svg';
import RecommendActive from '@/components/common/icons/Recommend-active.svg';
import RecommendInactive from '@/components/common/icons/Recommend-inactive.svg';
import { Typography } from '@/constants/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';

const TAB_CONFIG = [
  {
    key: 'home',
    label: '홈',
    activeIcon: HomeActive,
    inactiveIcon: HomeInactive,
  },
  {
    key: 'recommend',
    label: '추천기록',
    activeIcon: RecommendActive,
    inactiveIcon: RecommendInactive,
  },
  {
    key: 'post',
    label: '포스트',
    activeIcon: PostActive,
    inactiveIcon: PostInactive,
  },
  {
    key: 'setting',
    label: '마이밴놀',
    activeIcon: MyPageActive,
    inactiveIcon: MyPageInactive,
  },
];

export default function BottomTabBar({ currentTab, onTabPress }) {
  const isLoggedIn = useAuthStore((state) => !!state.JWTToken);
  console.log('[탭바] isLoggedIn:', isLoggedIn);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const router = useRouter();

  const handlePress = (key: string) => {
    const lockedTabs = ['home', 'recommend', 'setting'];
    const isLocked = !isLoggedIn && lockedTabs.includes(key);

    if (isLocked) {
      setLoginModalVisible(true);
    } else {
      onTabPress(key); // 정상 이동
    }
  };

  return (
    <>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.container}>
          {TAB_CONFIG.map(
            ({
              key,
              label,
              activeIcon: ActiveIcon,
              inactiveIcon: InactiveIcon,
            }) => {
              const isActive = currentTab === key;
              const Icon = isActive ? ActiveIcon : InactiveIcon;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handlePress(key)}
                  style={styles.tabItem}
                >
                  <Icon width={28} height={28} />
                  <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </SafeAreaView>

      {/* 로그인 유도 모달  */}
      <Modal
        transparent
        visible={loginModalVisible}
        animationType="fade"
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>로그인이 필요한 기능입니다.</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setLoginModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setLoginModalVisible(false);
                  router.push('/splash');
                }}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>로그인하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1F1F1F',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: 12,
    backgroundColor: '#1F1F1F',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    flexShrink: 0,
    marginTop: 12,
  },
  label: {
    color: '#555555',
    textAlign: 'center',
    ...Typography.caption2,
    marginTop: 10,
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    padding: 24,
    backgroundColor: '#333',
    borderRadius: 12,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#555',
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FB4932',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#F4F4F4',
    ...Typography.subtitle3,
  },
  loginText: {
    color: '#F4F4F4',
    ...Typography.subtitle3,
  },
});