import NotificationItem from '@/components/NotificationItem';
import { notifications } from '@/constants/notifications';
import { Typography } from '@/constants/typography';

import Backarrow from '@/assets/icons/size_m/backarrow.svg';

import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AlarmCenterPage() {
  const router = useRouter();

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
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },

  list: {
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
});
