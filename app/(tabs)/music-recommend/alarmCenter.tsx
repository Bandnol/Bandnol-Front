import Backarrow from '@/assets/icons/size_m/backarrow.svg';
import { IconType } from '@/components/NotificationIcon';
import NotificationItem from '@/components/NotificationItem';
import { Typography } from '@/constants/typography';
import { useAuthFetch } from '@/hooks/useAxios';
import { useRouter, useFocusEffect } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
type Notification = {
  id: string;
  createdAt: string;
  type: string;
  isConfirmed: boolean;
  link: string;
  sender: {
    id: string;
    nickname: string;
  } | null;
  content: string | null;
};
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AlarmCenterPage() {
  const router = useRouter();
  const authFetch = useAuthFetch();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authFetch.json<any>('/api/v1/users/me/notification', {
        method: 'GET',
      });
      // 백엔드 응답 모양 다양성 대응: data.data || data || 직접 배열
      const items = (res?.data?.data ?? res?.data ?? res) as any[];
      setNotifications(Array.isArray(items) ? items : []);
      console.log(
        '[알림함] 목록 로드:',
        Array.isArray(items) ? items.length : 0,
      );
    } catch (e) {
      console.log('[알림함] 목록 로드 실패:', e);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authFetch]);

  // [자동 새로고침 1] 화면 포커스 시 목록 새로고침
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // [자동 새로고침 2] 푸시 탭 후 읽음 처리 완료 이벤트 수신 시 목록 새로고침
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('NOTI_REFRESH', () => {
      console.log('[알림함] NOTI_REFRESH 수신 → 새로고침');
      load();
    });
    return () => sub.remove();
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.back();
            console.log('Back pressed');
          }}
          style={styles.backArrow}
        >
          <Backarrow width={22} height={18} />
        </Pressable>
        <Text style={styles.title}>알림</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            id={item.id}
            createdAt={item.createdAt}
            type={item.type as IconType} // 타입 명시적 변환 필요
            isConfirmed={item.isConfirmed}
            link={item.link}
            sender={item.sender}
            content={item.content}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          load();
        }}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>
              아직 알림이 없어요.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
    //paddingBottom: 10,
  },
  header: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },

  title: {
    ...Typography.subtitle1B,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
  },

  backArrow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },

  list: {
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
});
