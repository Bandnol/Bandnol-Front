import NotificationItem from '@/components/NotificationItem';
import { notifications } from '@/constants/notifications';
import { Typography } from '@/constants/tyopography';

import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AlarmCenterPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
          <Image
            source={require('@/assets/images/backarrow.png')} //svg로 바꾸삼
            style={{ width: 24, height: 24 }}
          />
        </Pressable>
        <Text style={styles.title}>알림</Text>
      </View>

      {/* 알림 리스트 */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationItem {...item} />}
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
    transform: [{ translateY: -12 }],
  },

  list: {
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
});
