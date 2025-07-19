import Dropdown from '@/assets/icons/size_m/dropdown.svg';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import RecommendCal from '@/components/RecommendCal';
import RecommendHeader from '@/components/RecommendHeader';

import { Typography } from '@/constants/tyopography';

export default function RecommendScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View>
            <RecommendHeader
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
            />
          </View>
        </View>

        <View style={styles.myrecSection}>
          <Text style={styles.myrecText}>나의 추천곡</Text>
          <TouchableOpacity>
            <Dropdown />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarSection}>
          <RecommendCal selectedMonth={selectedMonth} />
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
    paddingBottom: 52,
  },
  topSection: {
    //marginBottom: 30,
  },
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
  calendarSection: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 10,
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
