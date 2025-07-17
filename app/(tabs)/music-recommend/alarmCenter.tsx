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
} from 'react-native';

export default function AlarmCenterPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
          <Image
            source={require('@/assets/images/backarrow.png')}
            style={{ width: 24, height: 24 }}
          />
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.headerTitle}>알림</Text>
        </View>
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
  },
  backArrow: {
    padding: 8,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    width: 24,
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Typography.subtitle1B,
    textAlign: 'center',
    color: '#fff',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTextBox: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.caption1,
    color: '#fff',
  },
  cardDescription: {
    ...Typography.caption1,
    color: '#fff',
    marginTop: 2,
  },
  cardTime: {
    ...Typography.caption1,
    color: '#7C7C7C',
  },
});
