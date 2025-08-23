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

// 리스트 API에서 캘린더 데이터 가져오기 (임시 해결책)
async function fetchRecommendListForCalendar(): Promise<any[]> {
  const token = await SecureStore.getItemAsync('JWTToken');
  if (!token) throw new Error('JWT 토큰 없음');

  const response = await axios.get(`https://bandnol.app/api/v1/recoms/lists`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data || [];
}

type RecommendCalProps = {
  selectedMonth: dayjs.Dayjs;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  isTabRecommending?: boolean;
  refreshKey?: number;
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
  refreshKey,
}: RecommendCalProps) {
  const [songDataList, setSongDataList] = useState<CalendarItem[]>([]);
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const year = selectedMonth.year();
        const month = selectedMonth.month() + 1;

        // 리스트 API에서 데이터 가져오기 (캘린더 API 대신 사용)
        const listData = await fetchRecommendListForCalendar();
        console.log(
          `[캘린더] 리스트 API 데이터 사용 중:`,
          JSON.stringify(listData, null, 2),
        );

        // 선택된 월의 데이터만 필터링하고 변환
        const calendarData: CalendarItem[] = [];

        listData.forEach((item: any) => {
          const itemDate = dayjs(item.date);
          if (itemDate.year() === year && itemDate.month() + 1 === month) {
            // 나의 추천곡 (recommending)
            if (isTabRecommending && item.recommending) {
              calendarData.push({
                id: `recommending-${item.date}`,
                date: item.date,
                title: item.recommending.title,
                artistName: item.recommending.artistName,
                imageUrl: item.recommending.imageUrl,
                comment: item.recommending.comment,
                senderNickname: '나', // 내가 보낸 것이므로
                recevierNickname: '상대방', // 임시값
              });
            }
            // 추천받은 곡 (recommended)
            else if (!isTabRecommending && item.recommended) {
              calendarData.push({
                id: `recommended-${item.date}`,
                date: item.date,
                title: item.recommended.title,
                artistName: item.recommended.artistName,
                imageUrl: item.recommended.imageUrl,
                comment: item.recommended.comment,
                senderNickname: '상대방', // 상대방이 보낸 것이므로
                recevierNickname: '나', // 임시값
              });
            }
          }
        });

        console.log(
          `[캘린더] ${year}-${month} 변환된 데이터:`,
          calendarData.length,
          '개',
        );
        console.log(
          `[캘린더] 변환된 데이터 상세:`,
          JSON.stringify(calendarData, null, 2),
        );
        console.log(`[캘린더] isTabRecommending: ${isTabRecommending}`);
        setSongDataList(calendarData);
      } catch (e: any) {
        console.error('❌ [캘린더] 데이터 로딩 실패:', e.message || e);
        setSongDataList([]);
      }
    };

    fetchCalendarData();
  }, [selectedMonth, isTabRecommending, refreshKey]);

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
