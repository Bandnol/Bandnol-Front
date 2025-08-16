import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Calendar from '@/assets/icons/size_m/calendar.svg';
import Dropdown from '@/assets/icons/size_m/dropdown.svg';
import List from '@/assets/icons/size_m/list.svg';
import Report from '@/assets/icons/size_m/report.svg';
import Search from '@/assets/icons/size_m/search.svg';
import MonthPicker from '@/components/MonthPicker';

type RecommendHeaderProps = {
  selectedMonth: dayjs.Dayjs;
  onChangeMonth: (newMonth: dayjs.Dayjs) => void;
  onTodayPress: () => void;
  isModeCalendar: boolean;
  setIsModeCalendar: (isCalendar: boolean) => void;
};
export default function RecommendHeader({
  selectedMonth,
  onChangeMonth,
  onTodayPress,
  isModeCalendar,
  setIsModeCalendar,
}: RecommendHeaderProps) {
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const isThisMonth = selectedMonth.isSame(dayjs(), 'month');

  const openPicker = () => setMonthPickerVisible(true);
  const closePicker = () => setMonthPickerVisible(false);

  const handleSelectMonth = (date: dayjs.Dayjs) => {
    onChangeMonth(date);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGroup}>
        <Text style={styles.monthText}>
          {selectedMonth.format('YYYY년 MM월')}
        </Text>

        <TouchableOpacity onPress={openPicker}>
          <Dropdown />
        </TouchableOpacity>

        <TouchableOpacity>{isThisMonth ? <Report /> : null}</TouchableOpacity>
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity onPress={onTodayPress}>
          <View style={styles.todayContainer}>
            <Text style={styles.todayText}>Today</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/recommend-tab/RecSearch')}
        >
          <Search />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsModeCalendar(!isModeCalendar)}>
          {isModeCalendar ? <List /> : <Calendar />}
        </TouchableOpacity>
      </View>

      <MonthPicker
        visible={isMonthPickerVisible}
        onClose={closePicker}
        onSelect={handleSelectMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 71,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25.2,
    letterSpacing: -0.45,
  },
  todayText: {
    color: '#D9D9D9',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16.8,
    letterSpacing: -0.3,
  },
  todayContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    gap: 10,
  },
});
