import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import SongIcon from '@/assets/icons/song.svg';
import { Typography } from '@/constants/tyopography';

const notifications = [
  {
    id: 1,
    icon: '',
    title: '띵동~ 오늘의 추천곡이 도착했어요!',
    description: '지금 바로 확인해보세요.',
    time: '지금',
  },
];

export default function AlarmCenterPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
          <BackArrowIcon width={9.05} height={16.19} />
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.headerTitle}>알림</Text>
        </View>
      </View>

      {/* 알림 리스트 */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardIcon}>
              <SongIcon width={36} height={36} />
            </Text>
            <View style={styles.cardTextBox}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        )}
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
