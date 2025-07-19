import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RecommendCalProps = {
  selectedMonth: dayjs.Dayjs;
};

type CalendarDate = {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string; // YYYY-MM-DD
};

export default function RecommendCal({ selectedMonth }: RecommendCalProps) {
  const dates: CalendarDate[] = useMemo(() => {
    const startOfMonth = selectedMonth.startOf('month');
    const endOfMonth = selectedMonth.endOf('month');
    const startDay = startOfMonth.day(); // 요일 (0~6)
    const daysInMonth = endOfMonth.date();

    const prevMonth = selectedMonth.subtract(1, 'month');
    const prevMonthEndDate = prevMonth.endOf('month').date();

    const nextMonth = selectedMonth.add(1, 'month');

    const temp: CalendarDate[] = [];

    // 전달의 말일
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

    // 다음 달 (42개 칸 맞추기)
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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {dates.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedDate(item.fullDate)}
            style={[
              styles.cell,
              selectedDate === item.fullDate && styles.selectedCell,
              !item.isCurrentMonth && styles.cellDimmed,
            ]}
          >
            <Text style={styles.dateText}>{item.date}</Text>
          </TouchableOpacity>
        ))}
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
    marginVertical: 4,
    padding: 6,
  },
  selectedCell: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
  },
  cellDimmed: {
    backgroundColor: '#121212',
    opacity: 0.3,
    borderRadius: 3,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: -0.3,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
});
