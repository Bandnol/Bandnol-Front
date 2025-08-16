import { Typography } from '@/constants/typography';
import { useAuthFetch } from '@/hooks/useAxios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RecBottomModal from './RecBottomModal';

dayjs.locale('ko');

type RecommendCalProps = {
  selectedMonth: dayjs.Dayjs;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  isTabRecommending?: boolean;
};

type CalendarDate = {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string; // YYYY-MM-DD
};

export type CalendarItem = {
  id: string;
  date: string;
  title: string;
  artistName: string;
  imageUrl: string;
  comment: string;
  senderNickname: string;
  recevierNickname: string; //오타 수정??
};

export default function RecommendCal({
  selectedMonth,
  selectedDate,
  setSelectedDate,
  isTabRecommending,
}: RecommendCalProps) {
  const { json } = useAuthFetch();
  const [songDataList, setSongDataList] = useState<CalendarItem[]>([]); // ✅ API 데이터 상태
  const today = dayjs().format('YYYY-MM-DD');

  // API 호출
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const year = selectedMonth.year();
        const month = selectedMonth.month() + 1;
        const status = isTabRecommending ? 'recommending' : 'recommended';

        const res = await json(
          `/api/v1/recoms/calendars?year=${year}&month=${month}&status=${status}`,
          { method: 'GET' },
        );

        const data = res?.data ?? [];
        setSongDataList(Array.isArray(data) ? data : []);
      } catch (e) {
        setSongDataList([]);
      }
    };

    fetchCalendarData();
  }, [selectedMonth, isTabRecommending, json]); // ✅ 연동 조건

  const dates: CalendarDate[] = useMemo(() => {
    const startOfMonth = selectedMonth.startOf('month');
    const endOfMonth = selectedMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const prevMonth = selectedMonth.subtract(1, 'month');
    const prevMonthEndDate = prevMonth.endOf('month').date();

    const nextMonth = selectedMonth.add(1, 'month');

    const temp: CalendarDate[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      const date = prevMonthEndDate - i;
      temp.push({
        date,
        isCurrentMonth: false,
        fullDate: prevMonth.date(date).format('YYYY-MM-DD'),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      temp.push({
        date: i,
        isCurrentMonth: true,
        fullDate: selectedMonth.date(i).format('YYYY-MM-DD'),
      });
    }

    const remaining = 42 - temp.length;
    for (let i = 1; i <= remaining; i++) {
      temp.push({
        date: i,
        isCurrentMonth: false,
        fullDate: nextMonth.date(i).format('YYYY-MM-DD'),
      });
    }

    return temp;
  }, [selectedMonth]);

  const selectedSongData = songDataList.find(
    (rec) => rec.date === selectedDate,
  );

  return (
    <View style={styles.container}>
      <View style={styles.weekHeader}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <Text key={index} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {dates.map((item, idx) => {
          const isSongData = songDataList.find(
            (rec) => rec.date === item.fullDate,
          );

          const CellWrapper = isSongData ? ImageBackground : View;
          const wrapperProps = isSongData
            ? {
                source: { uri: isSongData.imageUrl },
                style: styles.thumbnailWrapper,
                imageStyle: styles.thumbnail,
              }
            : {};

          return (
            <Pressable
              key={idx}
              onPress={() => setSelectedDate(item.fullDate)}
              style={[
                styles.cell,
                selectedDate === item.fullDate && styles.selectedCell,
                !item.isCurrentMonth && styles.cellDimmed,
              ]}
            >
              <CellWrapper {...wrapperProps}>
                <Text
                  style={[
                    styles.dateText,
                    isSongData && styles.songDateText,
                    item.fullDate === today && styles.todayDateText,
                  ]}
                >
                  {item.date}
                </Text>
              </CellWrapper>
            </Pressable>
          );
        })}
      </View>

      <RecBottomModal
        visible={!!selectedDate && !!selectedSongData}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate}
        isTabRecommending={isTabRecommending}
        songData={selectedSongData}
        isToday={selectedDate === today}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayText: {
    ...Typography.caption1,
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
  },
  cell: {
    width: `${100 / 7}%`,
    height: `${100 / 6}%`,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'Gray900',
  },
  selectedCell: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cellDimmed: {
    backgroundColor: 'Gray900',
    opacity: 0.3,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: -0.3,
    marginTop: 6.09,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  thumbnailWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumbnail: {
    resizeMode: 'cover',
  },
  songDateText: {
    backgroundColor: 'white',
    color: '#000',
    borderRadius: 10,
    width: 40,
    alignSelf: 'center',
  },
  todayDateText: {
    backgroundColor: '#FF3B30',
    color: '#fff',
    borderRadius: 10,
    width: 40,
    alignSelf: 'center',
  },
});
