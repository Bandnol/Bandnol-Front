import Filter from '@/assets/icons/size_m/filter.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
type MockData = {
  id: string;
  comment: string;
  imageUrl: string;
};
const mockdata: MockData[] = [
  {
    id: '1',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '2',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '3',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '4',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '5',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    id: '6',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '7',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '8',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '9',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '10',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    id: '11',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '12',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '13',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '14',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '15',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    id: '16',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '17',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '18',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '19',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '20',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    id: '21',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '22',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '23',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '24',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '25',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
  {
    id: '26',
    comment: '좋은게 좋은거죠',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
  },
  {
    id: '27',
    comment: '좋지 아니한가',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/116/03/345/11603345_20240927114551_500.jpg',
  },
  {
    id: '28',
    comment: '좋아져요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/114/75/749/11475749_20240524105642_500.jpg',
  },
  {
    id: '29',
    comment: '별론데요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
  },
  {
    id: '30',
    comment: '그냥 그래요',
    imageUrl:
      'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
  },
];
export default function ArtistPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockData[]>(mockdata);

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
  const threeGroup = [];
  for (let i = 0; i < results.length; i += 3) {
    threeGroup.push(results.slice(i, i + 3));
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.maxWidthContainer}>
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

          <ScrollView>
            {threeGroup.map((row, rowIndex) =>
              rowIndex % 3 !== 2 ? (
                <View key={rowIndex} style={styles.rowWrapper}>
                  {row.map((item, colIndex) => (
                    <View
                      key={`${item.imageUrl}-${colIndex}`}
                      style={styles.itemWrapper}
                    >
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: '100%', aspectRatio: 1 }}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <View key={rowIndex} style={styles.rowWrapper}>
                  <Image
                    source={{ uri: row[0].imageUrl }}
                    style={{ width: '66.666666%', aspectRatio: 1 }}
                  />

                  <View
                    style={{
                      width: '33.333333%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Image
                      source={{ uri: row[1].imageUrl }}
                      style={{ width: '100%', aspectRatio: 1 }}
                    />
                    <Image
                      source={{ uri: row[2].imageUrl }}
                      style={{ width: '100%', aspectRatio: 1 }}
                    />
                  </View>
                </View>
              ),
            )}
          </ScrollView>
        </View>
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
  maxWidthContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    borderStartColor: '#555',
    borderStartWidth: 0.5,
    borderEndColor: '#555',
    borderEndWidth: 0.5,
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
  itemWrapper: {
    flex: 1,
    //margin: 6,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 12,
  },
});
