import Dropdown from '@/assets/icons/size_m/dropdown.svg';
import List from '@/assets/icons/size_m/list.svg';
import Report from '@/assets/icons/size_m/report.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/tyopography';
import dayjs from 'dayjs';

import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type RecommendHeaderProps = {
  selectedMonth: dayjs.Dayjs;
  onChangeMonth: (newMonth: dayjs.Dayjs) => void;
};
export default function RecommendHeader({
  selectedMonth,
  onChangeMonth,
}: RecommendHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 모달 열기
  const showPicker = () => setIsVisible(true);
  // 모달 닫기
  const hidePicker = () => setIsVisible(false);

  // 날짜 선택 완료
  const handleConfirm = (date: Date) => {
    setIsVisible(false);
    setSelectedDate(date);
    onChangeMonth(dayjs(date));
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGroup}>
        <Text style={styles.monthText}>
          {selectedMonth.format('YYYY년 MM월')}
        </Text>

        <TouchableOpacity onPress={showPicker}>
          <Dropdown />
        </TouchableOpacity>

        <TouchableOpacity>
          <Report />
        </TouchableOpacity>
      </View>

      <View style={styles.rightGroup}>
        <View style={styles.todayContainer}>
          <Text style={styles.todayText}>Today</Text>
        </View>
        <TouchableOpacity>
          <Search />
        </TouchableOpacity>
        <TouchableOpacity>
          <List />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date" // date, time, datetime 등 가능
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        date={selectedDate}
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
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  topSection: {
    marginBottom: 30,
  },
  date: {
    ...Typography.subtitle2,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 60,
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
