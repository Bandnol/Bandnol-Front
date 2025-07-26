import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/tyopography';

type ToggleProps = {
  value: boolean;
  onChange: (v: boolean) => void;
};

function CustomToggle({ value, onChange }: ToggleProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 2 + (44 - (24 - 2 * 2) - 2 * 2)],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onChange(!value)}
      style={styles.toggleTouchable}
    >
      <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
        <Animated.View
          style={[styles.toggleThumb, { transform: [{ translateX }] }]}
        />
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------

type NotiKey =
  | 'all'
  | 'dailyRecommendation'
  | 'myRecommendationSent'
  | 'commentReceived'
  | 'recommendationMissed'
  | 'serviceAnnouncement';

export default function Notification() {
  const router = useRouter();

  const [noti, setNoti] = useState<Record<NotiKey, boolean>>({
    all: true,
    dailyRecommendation: true,
    myRecommendationSent: false,
    commentReceived: false,
    recommendationMissed: false,
    serviceAnnouncement: false,
  });

  const items: { key: NotiKey; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'dailyRecommendation', label: '오늘의 추천곡 도착' },
    { key: 'myRecommendationSent', label: '나의 추천곡 전달 완료' },
    { key: 'commentReceived', label: '코멘트 도착' },
    { key: 'recommendationMissed', label: '추천 미실행' },
    { key: 'serviceAnnouncement', label: '서비스 공지사항' },
  ];

  const onToggle = (key: NotiKey, value: boolean) => {
    setNoti((prev) => ({ ...prev, [key]: value }));
    // TODO: API 연동
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Top Nav Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/myPage/setting/appSetting')}
          style={styles.backBtn}
        >
          <BackArrow width={9} height={16} />
        </TouchableOpacity>
        <Text style={styles.title}>알림</Text>
        <View style={{ width: 24, height: 24 }} />
      </View>

      {/* List */}
      <View style={styles.listWrapper}>
        {items.map(({ key, label }) => (
          <View style={styles.row} key={key}>
            <Text style={styles.rowText}>{label}</Text>
            <CustomToggle
              value={noti[key]}
              onChange={(v) => onToggle(key, v)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  row: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
  },
  rowText: {
    color: '#FFFFFF',
    ...Typography.body1,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C7C7C',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#FB4932',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
  },
});
