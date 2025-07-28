import Filter from '@/assets/icons/size_m/filter.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
type MockData = {
  comment: string;
  imageUrl: string;
};
const mockdata: MockData[] = [
  {
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
];
export default function ArtistPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockData[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(mockdata);
      return;
    }

    const lowerQuery = text.toLowerCase();
    const filtered = mockdata.filter((item) => {
      const target = `${item.comment}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    setResults(filtered);
  };

  const handleSubmit = () => handleSearch(query);

  return (
    <>
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
              <Filter />
            </View>
          </Pressable>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.imageUrl}-${index}`}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              {/* <Text style={{ color: '#fff' }}>{item.comment}</Text> */}
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 100, height: 100 }}
              />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>
    </>
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
    gap: 7,
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 40,
    paddingVertical: 3,
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
    height: '100%',
    justifyContent: 'center',
  },
  searchInput: {
    ...Typography.body1,
    color: '#F4F4F4',
    textAlignVertical: 'center',
  },
});
