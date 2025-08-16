import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  return (
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
                onPress={() => onTabPress(key)}
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
});
