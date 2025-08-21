import { Typography } from '@/constants/typography';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import * as SecureStore from 'expo-secure-store';
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
  recevierNickname: string;
};

export default function RecommendCal({
  selectedMonth,
  selectedDate,
  setSelectedDate,
  isTabRecommending,
}: RecommendCalProps) {
  const [songDataList, setSongDataList] = useState<CalendarItem[]>([]);
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWTToken');
        if (!token) throw new Error('JWT 토큰 없음');

        const year = selectedMonth.year();
        const month = selectedMonth.month() + 1;
        const status = isTabRecommending ? 'recommending' : 'recommended';

        const response = await axios.get(
          `https://bandnol.app/api/v1/recoms/calendars?year=${year}&month=${month}&status=${status}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const { success, data, error } = response.data;

        if (!success) {
          console.error('[api/v1/recoms/calendars] success=false:', error);
          setSongDataList([]);
          return;
        }

        if (Array.isArray(data) && data.length === 0) {
          console.log(`[api/v1/recoms/calendars] ${year}-${month} 데이터 없음`);
          setSongDataList([]);
          return;
        }

        console.log(
          `[api/v1/recoms/calendars] ${year}-${month} 데이터:`,
          data.length,
          '개',
        );
        setSongDataList(data);
      } catch (e: any) {
        console.error(
          '❌ [api/v1/recoms/calendars] 요청 실패:',
          e.message || e,
        );
        setSongDataList([]);
      }
    };

    fetchCalendarData();
  }, [selectedMonth, isTabRecommending]);

  const dates: CalendarDate[] = useMemo(() => {
    const startOfMonth = selectedMonth.startOf('month');
    const endOfMonth = selectedMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const prevMonth = selectedMonth.subtract(1, 'month');
    const prevMonthEndDate = prevMonth.endOf('month').date();
    const nextMonth = selectedMonth.add(1, 'month');

    const temp: CalendarDate[] = [];

    // 이전 달
    for (let i = startDay - 1; i >= 0; i--) {
      const date = prevMonthEndDate - i;
      temp.push({
        date,
        isCurrentMonth: false,
        fullDate: prevMonth.date(date).format('YYYY-MM-DD'),
      });
    }

    // 이번 달
    for (let i = 1; i <= daysInMonth; i++) {
      temp.push({
        date: i,
        isCurrentMonth: true,
        fullDate: selectedMonth.date(i).format('YYYY-MM-DD'),
      });
    }

    // 다음 달
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

          const CellWrapper: any = isSongData ? ImageBackground : View;
          const wrapperProps = isSongData
            ? {
                source: { uri: isSongData.imageUrl },
                style: styles.thumbnailWrapper,
                imageStyle: styles.thumbnail,
              }
            : { style: styles.thumbnailWrapper };

          const isSelected = selectedDate === item.fullDate;

          return (
            <Pressable
              key={idx}
              onPress={() => setSelectedDate(item.fullDate)}
              disabled={!item.isCurrentMonth}
              style={[
                styles.cell,
                selectedDate === item.fullDate && styles.selectedCell,
                !item.isCurrentMonth && styles.cellDimmed,
              ]}
            >
              {isSelected && (
                <View pointerEvents="none" style={styles.cellBorderOverlay} />
              )}

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
  container: { flex: 1 },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 10,
  },
  weekdayText: {
    ...Typography.caption1,
    width: `14.285%`,
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
    width: `14.285%`,
    height: `16.66%`,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121212',
    position: 'relative',
  },
  selectedCell: {
    backgroundColor: '#333',
    zIndex: 2,
  },

  cellBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 1,
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
  // 배경(이미지/빈 뷰) 래퍼: 항상 셀을 꽉 채우게
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
