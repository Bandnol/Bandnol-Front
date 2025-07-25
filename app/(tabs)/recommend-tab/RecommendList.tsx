import { Typography } from '@/constants/typography';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Image, SectionList, StyleSheet, Text, View } from 'react-native';
dayjs.locale('ko');
type Song = {
  title: string;
  artistName: string;
  imageUrl: string;
  comment: string;
};

type RawData = {
  date: string;
  recommending?: Song;
  recommended?: Song;
};

type RecommendListProps = {
  selectedMonth: dayjs.Dayjs;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  data: RawData[];
};

type SubItem = {
  type: 'recommending' | 'recommended';
  song: Song;
};

export default function RecommendList({
  selectedMonth,
  data,
}: RecommendListProps) {
  const today = dayjs().format('YYYY-MM-DD');

  const sectionData = data
    //.filter((item) => dayjs(item.date).isSame(selectedMonth, 'month'))
    .map((item) => {
      const sectionItems: SubItem[] = [];

      if (item.recommending) {
        sectionItems.push({ type: 'recommending', song: item.recommending });
      }
      if (item.recommended) {
        sectionItems.push({ type: 'recommended', song: item.recommended });
      }

      return {
        title: item.date,
        data: sectionItems,
      };
    })
    .sort((a, b) => dayjs(a.title).diff(dayjs(b.title)));

  return (
    <SectionList
      sections={sectionData}
      keyExtractor={(_, index) => index.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>
            {dayjs(title).format('YYYY년 M월 D일 (dd)')}
          </Text>
          {title === today && (
            <View style={styles.todayContainer}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.songBox}>
          <Text style={styles.songTypeText}>
            {item.type === 'recommending' ? '나의 추천곡' : '추천 받은 곡'}
          </Text>
          <View style={styles.myrecInfo}>
            <Image
              source={{ uri: item.song.imageUrl }}
              style={{
                width: 28,
                height: 28,
                padding: 4,
                borderRadius: 2,
                marginRight: 4,
              }}
            />

            <View style={styles.myrecSong}>
              <Text style={styles.myrecTitle}>{item.song.title}</Text>
              <Text style={styles.myrecArtist}>{item.song.artistName}</Text>
            </View>

            <View
              style={{
                width: 2,
                height: 27,
                backgroundColor: '#FB4932',
                marginHorizontal: 6,
              }}
            />

            <Text style={styles.myrecComment}>{item.song.comment}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //padding: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  dateText: {
    ...Typography.body1,
    color: '#F4F4F4',
    paddingHorizontal: 20,
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
    backgroundColor: '#FB4932',
    gap: 10,
  },
  songBox: {
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 20,
  },
  songTypeText: {
    ...Typography.subtitle4,
    color: '#F4F4F4',
    //marginBottom: 8,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  myrecInfo: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
    alignItems: 'center',
    gap: 6.843,
  },
  myrecSong: {
    flexDirection: 'column',
    width: '35%',
    gap: 2,
  },
  myrecTitle: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecArtist: {
    ...Typography.caption1,
    color: '#fff',
    fontWeight: '400',
  },
  myrecComment: {
    ...Typography.caption2,
    color: '#fff',
    fontWeight: '400',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  artistName: {
    fontSize: 12,
    color: '#ccc',
  },
  commentBar: {
    width: 1,
    height: 40,
    backgroundColor: 'red',
    marginHorizontal: 8,
  },
  commentText: {
    flexShrink: 1,
    fontSize: 12,
    color: '#fff',
  },
});
