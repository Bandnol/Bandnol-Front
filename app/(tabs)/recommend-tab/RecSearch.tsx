import Dropdown from '@/assets/icons/size_m/dropdown.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/typography';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type SendSong = {
  date: string;
  comment: string;
  title: string;
  artistName: string;
  imageUrl: string;
};

type ReceiveSong = {
  date: string;
  comment: string;
  title: string;
  artistName: string;
  imageUrl: string;
  senderNickname: string;
};

const sendMock: SendSong[] = [
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    date: '2025-04-18',
    comment: '들으니까 행복해졌어요!!',
    title: 'Blueming',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
];

const receiveMock: ReceiveSong[] = [
  {
    date: '2025-04-20',
    comment: '이 노래는 꼭 들어봐!',
    title: '좋은날',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    senderNickname: 'sunnyday',
  },
  {
    date: '2025-04-20',
    comment: '이 노래는 꼭 들어봐!',
    title: '좋은날',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    senderNickname: 'sunnyday',
  },
  {
    date: '2025-04-20',
    comment: '이 노래는 꼭 들어봐!',
    title: '좋은날',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    senderNickname: 'sunnyday',
  },
  {
    date: '2025-04-20',
    comment: '이 노래는 꼭 들어봐!',
    title: '좋은날',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    senderNickname: 'sunnyday',
  },
  {
    date: '2025-04-20',
    comment: '이 노래는 꼭 들어봐!',
    title: '좋은날',
    artistName: 'IU',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    senderNickname: 'sunnyday',
  },
];

export default function RecSearch() {
  const [query, setQuery] = useState('');
  const [sendResults, setSendResults] = useState<SendSong[]>(sendMock);
  const [receiveResults, setReceiveResults] =
    useState<ReceiveSong[]>(receiveMock);

  const router = useRouter();

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setSendResults(sendMock);
      setReceiveResults(receiveMock);
      return;
    }

    const lowerQuery = text.toLowerCase();

    const sendFiltered = sendMock.filter((item) => {
      const target = `${item.title} ${item.artistName}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    const receiveFiltered = receiveMock.filter((item) => {
      const target =
        `${item.title} ${item.artistName} ${item.senderNickname}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    setSendResults(sendFiltered);
    setReceiveResults(receiveFiltered);
  };

  const handleSubmit = () => handleSearch(query);

  const [isTopOpen, setIsTopOpen] = useState(true);
  const [isBottomOpen, setIsBottomOpen] = useState(true);

  const renderItem = (
    item: SendSong | ReceiveSong,
    type: 'send' | 'receive',
  ) => {
    return (
      <View style={styles.myRecBox}>
        <Text style={styles.dateText}>
          {dayjs(item.date).format('YYYY년 M월 D일 (dd)')}
        </Text>
        {type === 'send' ? null : (
          <Text style={styles.fromText}>
            {`From. ${'senderNickname' in item ? item.senderNickname : ''}`}
          </Text>
        )}
        <View style={styles.myrecInfo}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: 28,
              height: 28,
              padding: 4,
              borderRadius: 2,
              marginRight: 4,
            }}
          />

          <View style={styles.myrecSong}>
            <Text style={styles.myrecTitle}>{item.title}</Text>
            <Text style={styles.myrecArtist}>{item.artistName}</Text>
          </View>

          <View
            style={{
              width: 2,
              height: 27,
              backgroundColor: '#FB4932',
              marginHorizontal: 6,
            }}
          />

          <Text style={styles.myrecComment}>{item.comment}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View>
            <Search style={{ width: 24, height: 24 }} />
          </View>
          <View style={styles.searchBox}>
            <TextInput
              value={query}
              onChangeText={handleSearch}
              onSubmitEditing={handleSubmit}
              style={styles.searchInput}
              placeholder="검색어를 입력하세요"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <Pressable onPress={() => router.back()}>
          <View>
            <Text style={styles.cancelText}>취소</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 나의 추천곡 */}
        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitleText}>나의 추천곡</Text>
          <Dropdown
            onPress={() => setIsTopOpen(!isTopOpen)}
            style={{
              width: 24,
              height: 24,
              transform: [{ rotate: isTopOpen ? '180deg' : '0deg' }],
            }}
          />
        </View>
        {isTopOpen &&
          sendResults.map((item, idx) => (
            <View key={`rec-${item.date}-${idx}`}>
              {renderItem(item, 'send')}
            </View>
          ))}

        {/* 추천 받은 곡 */}
        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitleText}>추천 받은 곡</Text>
          <Dropdown
            onPress={() => setIsBottomOpen(!isBottomOpen)}
            style={{
              width: 24,
              height: 24,
              transform: [{ rotate: isBottomOpen ? '180deg' : '0deg' }],
            }}
          />
        </View>
        {isBottomOpen &&
          receiveResults.map((item, idx) => (
            <View key={`rec-${item.date}-${idx}`}>
              {renderItem(item, 'receive')}
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    //paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000',
    paddingTop: 60,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    //justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    height: 40,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  searchBox: {
    flex: 1,
  },
  searchInput: {
    ...Typography.body1,
    color: '#F4F4F4',
    paddingVertical: 2,
  },
  listbox: {
    //flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
  },
  textBox: {
    justifyContent: 'center',
    borderColor: '#2C2C2C',
    borderWidth: 1,
    borderRadius: 8,
  },

  scrollContent: {
    paddingBottom: 60,
    paddingTop: 10,
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
  sectionTitleBox: {
    gap: 10,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },

  sectionTitleText: {
    ...Typography.subtitle2,
    color: '#aaa',
  },
  listContent: {
    paddingBottom: 60,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    //paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  itemPressed: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
  },
  cancelText: {
    ...Typography.subtitle2,
    color: '#F4F4F4',
    fontWeight: '600',
    paddingLeft: 20,
  },
  myRecBox: {
    flexDirection: 'column',
    paddingVertical: 4,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    //gap: 6,
    alignSelf: 'stretch',
  },
  fromText: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
    paddingBottom: 10,
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
  dateText: {
    ...Typography.subtitle4,
    color: '#F4F4F4',
    fontWeight: '600',
    paddingBottom: 10,
  },
});
