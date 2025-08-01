import Backarrow from '@/assets/icons/size_m/backarrow.svg';
import { IconType } from '@/components/NotificationIcon';
import NotificationItem from '@/components/NotificationItem';
import { Typography } from '@/constants/typography';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWTToken');
        if (!token) throw new Error('JWT 토큰 없음');

        const response = await axios.get(
          'https://bandnol.app/api/v1/users/me/notification',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.success) {
          setNotifications(response.data.data.data); //?
        } else {
          console.error('서버 응답 오류:', response.data.error);
          setNotifications([]);
        }
      } catch (error) {
        console.error('알림 가져오기 실패:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

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
