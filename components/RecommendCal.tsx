import Share from '@/assets/icons/size_m/share.svg';
import {
  mockCalendarData,
  RecommendedItem,
  RecommendingItem,
} from '@/components/testdata';
import { Typography } from '@/constants/tyopography';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

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

export default function RecommendCal({
  selectedMonth,
  selectedDate,
  setSelectedDate,
  isTabRecommending,
}: RecommendCalProps) {
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

  const selectedSongData = (
    mockCalendarData[isTabRecommending ? 'recommending' : 'recommended'] as (
      | RecommendingItem
      | RecommendedItem
    )[]
  ).find((rec) => rec.date === selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {dates.map((item, idx) => {
          const isSongData = mockCalendarData[
            isTabRecommending ? 'recommending' : 'recommended'
          ].find((rec) => rec.date === item.fullDate);

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

        <Modal
          isVisible={
            !!selectedDate &&
            !!mockCalendarData[
              isTabRecommending ? 'recommending' : 'recommended'
            ].find((rec) => rec.date === selectedDate)
          }
          onBackdropPress={() => setSelectedDate(null)}
          style={styles.bottomModal}
          hasBackdrop={false}
          coverScreen={false}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View
                style={{
                  ...styles.modalHeader,
                  justifyContent: 'flex-start',
                  paddingHorizontal: 0,
                }}
              >
                <View style={styles.todayContainer}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
                <Text style={styles.modalDateText}>
                  {dayjs(selectedDate).format('MM월 DD일')}
                </Text>
              </View>
              <Pressable onPress={() => setSelectedDate(null)}>
                <Share />
              </Pressable>
            </View>
            <View style={styles.modalRecInfo}>
              <Text style={styles.myrecText}>
                {isTabRecommending
                  ? '나의 추천곡'
                  : `${(selectedSongData as RecommendedItem)?.senderNickname}의 추천곡`}
              </Text>

              <View style={styles.myrecInfo}>
                <Image
                  source={{ uri: selectedSongData?.imageUrl }}
                  style={{ width: 36, height: 36, padding: 4 }}
                />

                <View style={styles.myrecSong}>
                  <Text style={styles.myrecTitle}>
                    {selectedSongData?.title}
                  </Text>
                  <Text style={styles.myrecArtist}>
                    {selectedSongData?.artistName}
                  </Text>
                </View>

                <View
                  style={{
                    width: 1.955,
                    height: 27.37,
                    backgroundColor: '#FB4932',
                  }}
                ></View>

                <Text style={styles.myrecComment}>
                  {selectedSongData?.comment}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
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
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    display: 'flex',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  modalDateText: {
    ...Typography.subtitle1,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'left',
  },
  modalRecInfo: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 6,
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: '#7C7C7C',
    backgroundColor: '#333',
  },
  myrecText: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecInfo: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 3.91,
    alignItems: 'center',
    gap: 6.843,
  },
  myrecSong: {
    flexDirection: 'column',
    width: 100,
    gap: 2,
  },
  myrecTitle: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecArtist: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '400',
  },
  myrecComment: {
    ...Typography.caption2,
    color: '#fff',
    fontWeight: '400',
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
