import Share from '@/assets/icons/size_m/share.svg';
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

export default function RecommendCal({
  selectedMonth,
  selectedDate,
  setSelectedDate,
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

        <Modal
          isVisible={
            !!selectedDate &&
            !!mockCalendarData.recommending.find(
              (rec) => rec.date === selectedDate
            )
          }
          onBackdropPress={() => setSelectedDate(null)}
          style={styles.bottomModal}
          hasBackdrop={false}
          coverScreen={false}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalDateText}>
                {dayjs(selectedDate).format('MM월 DD일')}
              </Text>
              <Pressable onPress={() => setSelectedDate(null)}>
                <Share />
              </Pressable>
            </View>
            <View style={styles.modalRecInfo}>
              <Text style={styles.myrecText}>나의 추천곡</Text>

              <View style={styles.myrecInfo}>
                <Image
                  source={{ uri: selectedMusic?.imageUrl }}
                  style={{ width: 36, height: 36, padding: 4 }}
                />

                <View style={styles.myrecSong}>
                  <Text style={styles.myrecTitle}>{selectedMusic?.title}</Text>
                  <Text style={styles.myrecArtist}>
                    {selectedMusic?.artistName}
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
                  {selectedMusic?.comment}
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
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  modalDateText: {
    ...Typography.subtitle1,
    color: '#fff',
    fontWeight: '700',
  },
  modalRecInfo: {
    flexDirection: 'column', // flex-direction: column
    paddingVertical: 10, // padding: 10px 20px
    paddingHorizontal: 20,
    alignItems: 'flex-start', // align-items: flex-start
    gap: 6, // gap: 6px → RN 0.71+ 또는 View 내에서 marginBottom으로 처리
    alignSelf: 'stretch', // align-self: stretch
    borderBottomWidth: 0.5, // border-bottom
    borderBottomColor: '#7C7C7C', // var(--Gray-500)
    backgroundColor: '#333', // var(--Gray-700)
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
});
