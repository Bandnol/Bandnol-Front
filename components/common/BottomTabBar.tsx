import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import HomeActive from '@/components/common/icons/Home-active.svg';
import HomeInactive from '@/components/common/icons/Home-inactive.svg';
import MyPageActive from '@/components/common/icons/MyPage-active.svg';
import MyPageInactive from '@/components/common/icons/MyPage-inactive.svg';
import PostActive from '@/components/common/icons/Post-active.svg';
import PostInactive from '@/components/common/icons/Post-inactive.svg';
import RecommendActive from '@/components/common/icons/Recommend-active.svg';
import RecommendInactive from '@/components/common/icons/Recommend-inactive.svg';
import { Typography } from '@/constants/tyopography';

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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: 90,
    paddingTop: 28,
    backgroundColor: '#1F1F1F',
    flexShrink: 0,
  },
  tabItem: {
    width: 50,
    height: 52,
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    marginHorizontal: 10.5, // 아이템 간 가로 간격.. native에서는 gap이 안 됨
  },
  icon: {
    width: 28,
    height: 28,
    flexShrink: 0,
    aspectRatio: 1,
    marginBottom: 10, // 아이콘 <-> 텍스트
    marginTop: 12,
  },
  label: {
    alignSelf: 'stretch',
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    ...Typography.caption2,
  },
  activeLabel: {
    color: '#FFFFFF',
  },
});
