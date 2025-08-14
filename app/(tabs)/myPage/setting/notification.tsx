import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/typography';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ToggleProps = {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
};

function CustomToggle({ value, onChange, disabled }: ToggleProps) {
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

type NotiKey =
  | 'all'
  | 'dailyRecommendation'
  | 'myRecommendationSent'
  | 'commentReceived'
  | 'recommendationMissed'
  | 'serviceAnnouncement';

// 백엔드 페이로드(그대로)
type BackendPayload = {
  recomsSent: boolean;
  recomsReceived: boolean;
  commentArrived: boolean;
  notRecoms: boolean;
  announcement: boolean;
};

type NotiState = Record<NotiKey, boolean>;

function fromApi(data: BackendPayload): NotiState {
  const s: NotiState = {
    all: false,
    dailyRecommendation: data.recomsReceived ?? false,
    myRecommendationSent: data.recomsSent ?? false,
    commentReceived: data.commentArrived ?? false,
    recommendationMissed: data.notRecoms ?? false,
    serviceAnnouncement: data.announcement ?? false,
  };
  s.all =
    s.dailyRecommendation &&
    s.myRecommendationSent &&
    s.commentReceived &&
    s.recommendationMissed &&
    s.serviceAnnouncement;
  return s;
}

function toApi(state: NotiState): BackendPayload {
  return {
    recomsSent: state.myRecommendationSent,
    recomsReceived: state.dailyRecommendation,
    commentArrived: state.commentReceived,
    notRecoms: state.recommendationMissed,
    announcement: state.serviceAnnouncement,
  };
}

// !💣💣💣💣💣💣💣💣 API 설정 💣💣💣💣💣💣💣💣!
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

const ENDPOINT = '/api/v1/users/notification-settings';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((cfg) => {
  if (API_TOKEN) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${API_TOKEN}`;
  } else {
    console.log('⚠️ EXPO_PUBLIC_API_TOKEN이 비어 있습니다. 요청이 401 날 수 있어요.');
  }
  console.log('➡️', cfg.method?.toUpperCase(), (cfg.baseURL || '') + (cfg.url || ''), cfg.data ?? '');
  return cfg;
});
api.interceptors.response.use(
  (res) => { console.log('✅', res.status, res.config.url, res.data); return res; },
  (err) => { console.log('❌', err.response?.status ?? 'NO_STATUS', err.config?.url, err.response?.data ?? err.message); return Promise.reject(err); }
);

// ! 💣💣💣💣💣💣💣💣 화면 💣💣💣💣💣💣💣💣 !
export default function Notification() {
  const router = useRouter();

  const [noti, setNoti] = useState<NotiState>({
    all: false,
    dailyRecommendation: false,
    myRecommendationSent: false,
    commentReceived: false,
    recommendationMissed: false,
    serviceAnnouncement: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const items: { key: NotiKey; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'dailyRecommendation', label: '오늘의 추천곡 도착' },
    { key: 'myRecommendationSent', label: '나의 추천곡 전달 완료' },
    { key: 'commentReceived', label: '코멘트 도착' },
    { key: 'recommendationMissed', label: '추천 미실행' },
    { key: 'serviceAnnouncement', label: '서비스 공지사항' },
  ];

  const recomputeAll = (s: NotiState) =>
    s.dailyRecommendation &&
    s.myRecommendationSent &&
    s.commentReceived &&
    s.recommendationMissed &&
    s.serviceAnnouncement;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<BackendPayload>(ENDPOINT);
        setNoti(fromApi(res.data));
      } catch {
        Alert.alert('알림 설정', '설정 조회에 실패했어요. 로그인/네트워크를 확인해주세요.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 저장 (optimistic + 실패 시 롤백)
  const save = async (next: NotiState, prev: NotiState) => {
    setNoti(next);
    setSaving(true);
    try {
      await api.patch(ENDPOINT, toApi(next));
    } catch (e: any) {
      if (e?.response?.status === 401) {
        Alert.alert('로그인 필요', '권한이 없어요. EXPO_PUBLIC_API_TOKEN을 확인해주세요.');
      } else {
        Alert.alert('알림 설정', '저장에 실패했어요. 다시 시도해주세요.');
      }
      setNoti(prev);
    } finally {
      setSaving(false);
    }
  };

  const onToggle = (key: NotiKey, value: boolean) => {
    if (loading || saving) return;
    const prev = noti;
    let next: NotiState = { ...noti };

    if (key === 'all') {
      next = {
        ...next,
        all: value,
        dailyRecommendation: value,
        myRecommendationSent: value,
        commentReceived: value,
        recommendationMissed: value,
        serviceAnnouncement: value,
      };
    } else {
      next[key] = value;
      next.all = recomputeAll(next);
    }
    save(next, prev);
  };

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
