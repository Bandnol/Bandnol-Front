import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type RecommendCalProps = {
  selectedMonth: dayjs.Dayjs;
};

type CalendarDate = {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string; // YYYY-MM-DD
};

const mockCalendarData = {
  recommending: [
    {
      date: '2025-07-03',
      comment: '들으니까 행복해졌어요!!',
      title: 'Blueming',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
    },
    {
      date: '2025-07-13',
      comment: '오늘도 좋은 하루 보내세요~',
      title: 'Good Day',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    },
  ],
};

export default function RecommendCal({ selectedMonth }: RecommendCalProps) {
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
  const today = dayjs().format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedMusic = mockCalendarData.recommending.find(
    (rec) => rec.date === selectedDate
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {dates.map((item, idx) => {
          const song = mockCalendarData.recommending.find(
            (rec) => rec.date === item.fullDate
          );

          const CellWrapper = song ? ImageBackground : View;
          const wrapperProps = song
            ? {
                source: { uri: song.imageUrl },
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
                    song && styles.songDateText,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  },
  selectedCell: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cellDimmed: {
    backgroundColor: '#121212',
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
