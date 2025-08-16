import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Backarrow from '@/assets/icons/size_m/backarrow.svg';
import { IconType } from '@/components/NotificationIcon';
import type { NotificationItemProps } from '@/components/NotificationItem';
import NotificationItem from '@/components/NotificationItem';
import { Typography } from '@/constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AlarmCenterPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItemProps[]>(
    [],
  );
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (isFetching || !hasNextPage) return;
    setIsFetching(true);

    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) throw new Error('JWT 토큰 없음');

      const apiUrl = `https://bandnol.app/api/v1/users/me/notification`;
      const queryParams = cursor ? { cursor } : {};

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      });

      if (response.data.success) {
        const newNoti = response.data.data.data;
        const NextCursor = response.data.data.nextCursor;

        setNotifications((prev) => [...prev, ...newNoti]);
        setCursor(NextCursor);
        setHasNextPage(response.data.data.hasNext);
      } else {
        console.error('서버 오류:', response.data.error);
      }
    } catch (error: any) {
      console.error(
        '알림 가져오기 실패:',
        error?.response || error?.message || error,
      );
    } finally {
      setIsFetching(false);
    }
  }, [cursor, isFetching, hasNextPage]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleEndReached = () => {
    if (!isFetching && hasNextPage) {
      fetchNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
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
            type={item.type as IconType}
            isConfirmed={item.isConfirmed}
            link={item.link}
            sender={item.sender}
            content={item.content}
          />
        )}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching ? <ActivityIndicator size="small" color="#fff" /> : null
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
