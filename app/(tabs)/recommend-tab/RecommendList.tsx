import { Typography } from '@/constants/typography';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

dayjs.locale('ko');

type Song = {
  title: string;
  artistName: string;
  imageUrl: string;
  comment: string;
};

type RawData = {
  date: string;
  recommending?: Song;
  recommended?: Song;
};

export type RecommendListRef = {
  scrollToToday: () => void;
};

type RecommendListProps = {
  selectedMonth: dayjs.Dayjs;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  data: RawData[];
};

const RecommendList = forwardRef<RecommendListRef, RecommendListProps>(
  ({ selectedMonth, selectedDate, setSelectedDate, data }, ref) => {
    const today = dayjs().format('YYYY-MM-DD');
    const scrollViewRef = useRef<ScrollView>(null);
    const [sectionLayouts, setSectionLayouts] = useState<
      Record<string, number>
    >({});

    // 오름차순 정렬
    const sortedData = [...data].sort((a, b) =>
      dayjs(a.date).diff(dayjs(b.date)),
    );

    const targetDate = useMemo(() => {
      // 1. 정확히 선택한 날짜가 있으면 그걸 우선
      const exactMatch = sortedData.find((item) =>
        dayjs(item.date).isSame(selectedDate, 'day'),
      )?.date;

      if (exactMatch) return exactMatch;

      // 2. 선택된 월에서 오늘 이후인 것 중 가장 가까운 날짜
      const afterTodayInMonth = sortedData.find(
        (item) =>
          dayjs(item.date).isAfter(dayjs()) &&
          dayjs(item.date).isSame(selectedMonth, 'month'),
      )?.date;

      if (afterTodayInMonth) return afterTodayInMonth;

      // 3. 월을 넘어서 오늘 이후 중 가장 가까운 날짜
      const afterTodayAny = sortedData.find((item) =>
        dayjs(item.date).isAfter(dayjs()),
      )?.date;

      if (afterTodayAny) return afterTodayAny;

      // 4. 마지막 fallback - 그냥 마지막 항목
      return sortedData.length > 0
        ? sortedData[sortedData.length - 1].date
        : undefined;
    }, [sortedData, selectedDate, selectedMonth]);

    // 월 선택 시 해당 날짜로 스크롤
    useEffect(() => {
      if (targetDate && sectionLayouts[targetDate] !== undefined) {
        scrollViewRef.current?.scrollTo({
          y: sectionLayouts[targetDate],
          animated: true,
        });
      }
    }, [targetDate, sectionLayouts]);

    // 오늘 날짜로 스크롤 함수
    const scrollToToday = () => {
      if (sectionLayouts[today] !== undefined) {
        scrollViewRef.current?.scrollTo({
          y: sectionLayouts[today],
          animated: true,
        });
      }
    };

    // 외부에서 scrollToToday 사용할 수 있도록 ref 노출
    useImperativeHandle(ref, () => ({
      scrollToToday,
    }));

    return (
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        {sortedData.map((item) => {
          const subItems = [];
          if (item.recommending) {
            subItems.push({ type: 'recommending', song: item.recommending });
          }
          if (item.recommended) {
            subItems.push({ type: 'recommended', song: item.recommended });
          }

          return (
            <View
              key={item.date}
              onLayout={(e) => {
                setSectionLayouts((prev) => ({
                  ...prev,
                  [item.date]: e.nativeEvent.layout.y,
                }));
              }}
            >
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>
                  {dayjs(item.date).format('YYYY년 M월 D일 (dd)')}
                </Text>
                {item.date === today && (
                  <View style={styles.todayContainer}>
                    <Text style={styles.todayText}>Today</Text>
                  </View>
                )}
              </View>

              {subItems.map((sub, idx) => (
                <View key={idx} style={styles.songBox}>
                  <Text style={styles.songTypeText}>
                    {sub.type === 'recommending'
                      ? '나의 추천곡'
                      : '추천 받은 곡'}
                  </Text>
                  <View style={styles.myrecInfo}>
                    <Image
                      source={{ uri: sub.song.imageUrl }}
                      style={{
                        width: 28,
                        height: 28,
                        padding: 4,
                        borderRadius: 2,
                        marginRight: 4,
                      }}
                    />
                    <View style={styles.myrecSong}>
                      <Text style={styles.myrecTitle}>{sub.song.title}</Text>
                      <Text style={styles.myrecArtist}>
                        {sub.song.artistName}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 2,
                        height: 27,
                        backgroundColor: '#FB4932',
                        marginHorizontal: 6,
                      }}
                    />
                    <Text style={styles.myrecComment}>{sub.song.comment}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  },
);

export default RecommendList;

const styles = StyleSheet.create({
  container: {},
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  dateText: {
    ...Typography.body1,
    color: '#F4F4F4',
    paddingHorizontal: 20,
  },
  todayText: {
    color: '#D9D9D9',
    fontSize: 12,
    fontWeight: '600',
  },
  todayContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FB4932',
    marginLeft: 8,
  },
  songBox: {
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 20,
  },
  songTypeText: {
    ...Typography.subtitle4,
    color: '#F4F4F4',
  },
  myrecInfo: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
    alignItems: 'center',
    gap: 6.843,
  },
  myrecSong: {
    flexDirection: 'column',
    width: '35%',
    gap: 2,
  },
  myrecTitle: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecArtist: {
    ...Typography.caption1,
    color: '#fff',
    fontWeight: '400',
  },
  myrecComment: {
    ...Typography.caption2,
    color: '#fff',
    fontWeight: '400',
  },
});
