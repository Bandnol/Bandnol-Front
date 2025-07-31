import RecommendCal from '@/app/(tabs)/recommend-tab/RecommendCal';
import RecommendHeader from '@/app/(tabs)/recommend-tab/RecommendHeader';
import RecommendList, {
  RecommendListRef,
} from '@/app/(tabs)/recommend-tab/RecommendList';
import Dropdown from '@/assets/icons/size_m/dropdown.svg';
import { Typography } from '@/constants/typography';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RecommendItem = {
  date: string;
  recommending: {
    title: string;
    artistName: string;
    imageUrl: string;
    comment: string;
  };
  recommended?: {
    title: string;
    artistName: string;
    imageUrl: string;
    comment: string;
  };
};
const fetchRecommendList = async (): Promise<RecommendItem[]> => {
  const token = await SecureStore.getItemAsync('JWTToken');
  if (!token) throw new Error('JWT 토큰 없음');

  const response = await axios.get('https://bandnol.app/api/v1/recoms/lists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
export default function RecommendScreen() {
  useEffect(() => {
    const storeDummyToken = async () => {
      await SecureStore.setItemAsync(
        'JWTToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU2M2JhZTlhLWZjMTQtNDcwZS04YmViLTk3MTNiYmZlZDUyMiIsImlhdCI6MTc1Mzg4NjE4OSwiZXhwIjoxNzU0NDkwOTg5fQ.UnRXUHlpjtaG5q5MQ36zKQAEDYTz_FAGhqg9Mb8ckIs',
      );
    };

    storeDummyToken();
  }, []);
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isTabRecommending, setIsTabRecommending] = useState(true);
  const [isModeCalendar, setIsModeCalendar] = useState(true);
  const listRef = useRef<RecommendListRef>(null);

  const [data, setData] = useState<RecommendItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleTodayPress = () => {
    setSelectedMonth(dayjs());
    setSelectedDate(dayjs().format('YYYY-MM-DD'));
    if (!isModeCalendar) {
      listRef.current?.scrollToToday();
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchRecommendList();
        setData(result);
      } catch (e) {
        console.error('API 호출 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View>
            <RecommendHeader
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
              onTodayPress={handleTodayPress}
              isModeCalendar={isModeCalendar}
              setIsModeCalendar={setIsModeCalendar}
            />
          </View>
        </View>

        {isModeCalendar ? (
          <View style={styles.myrecSection}>
            <Text style={styles.myrecText}>
              {isTabRecommending ? '나의 추천곡' : '추천 받은 곡'}
            </Text>
            <Pressable onPress={() => setIsTabRecommending(!isTabRecommending)}>
              <Dropdown />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.calListSection}>
          {isModeCalendar ? (
            <RecommendCal
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isTabRecommending={isTabRecommending}
            />
          ) : (
            <RecommendList
              ref={listRef}
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              data={data}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  topSection: {},
  myrecSection: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: '#1F1F1F',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 3,
    marginBottom: 17,
  },
  myrecText: {
    color: '#FFF',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 19.6,
    letterSpacing: -0.35,
  },
  calListSection: {
    flex: 1,
  },
  date: {
    alignSelf: 'stretch',
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: -0.3,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 60,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 18,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  iconBox: {
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 60,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  itemPressed: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
  },
  album: {
    width: 48,
    height: 48,
    borderRadius: 5,
  },
  textBox: {
    justifyContent: 'center',
  },
  titleText: {
    ...Typography.body2,
    color: '#fff',
    fontWeight: 'bold',
  },
  artistText: {
    ...Typography.caption1,
    color: '#fff',
  },
});
