import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const mockData = [
  {
    date: '2025-04-18',
    recommending: {
      title: 'Blueming',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',

      comment: '들으니까 행복해졌어요!!',
    },
    recommended: {
      title: '좋은날',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
      comment: '들으니까 행복해졌어요!!',
    },
  },
  {
    date: '2025-04-17',
    recommending: {
      title: '소격동',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
      comment: '소격동을 기억하나요~~',
    },
    recommended: {
      title: '빨간 운동화',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
      comment: '선물입니당~~',
    },
  },
  {
    date: '2025-04-29',
    recommending: {
      title: '홀씨',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/114/04/142/11404142_20240220141548_500.jpg',

      comment: '나폴나폴',
    },
    // recommended: {
    //   title: '러브레터',
    //   artistName: 'IU',
    //   imageUrl:
    //     'https://cdnimg.melon.co.kr/cm2/album/images/108/27/816/10827816_20211229143632_500.jpg',
    //   comment: '편지왔어욤~',
    // },
  },
];

export default function RecSearch() {
  const [query, setQuery] = useState('');
  const [recommendingResults, setRecommendingResults] = useState<
    typeof mockData
  >([]);
  const [recommendedResults, setRecommendedResults] = useState<typeof mockData>(
    [],
  );
  const router = useRouter();

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setRecommendingResults([]);
      setRecommendedResults([]);
      return;
    }

    const lowerQuery = text.toLowerCase();

    const recommendingFiltered = mockData.filter((item) => {
      const target =
        `${item.recommending.title} ${item.recommending.artistName}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    const recommendedFiltered = mockData.filter((item) => {
      const target =
        `${item.recommended?.title} ${item.recommended?.artistName}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    setRecommendingResults(recommendingFiltered);
    setRecommendedResults(recommendedFiltered);
  };

  const handleSubmit = () => handleSearch(query);

  const renderItem = (
    item: (typeof mockData)[number],
    type: 'recommending' | 'recommended',
  ) => {
    const song = item[type];
    if (!song) return null;

    return (
      <View style={styles.textBox}>
        <Text style={styles.titleText}>{song.title}</Text>
        <Text style={styles.artistText}>{song.artistName}</Text>
        <Text style={styles.artistText}>{item.date}</Text>
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

      <FlatList
        data={recommendingResults}
        keyExtractor={(item, idx) => `rec-${item.date}-${idx}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          recommendingResults.length > 0 ? (
            <Text style={styles.sectionTitle}>내가 추천한 곡</Text>
          ) : null
        }
        renderItem={({ item }) => renderItem(item, 'recommending')}
      />

      <FlatList
        data={recommendedResults}
        keyExtractor={(item, idx) => `d-${item.date}-${idx}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          recommendedResults.length > 0 ? (
            <Text style={styles.sectionTitle}>내가 추천 받은 곡</Text>
          ) : null
        }
        renderItem={({ item }) => renderItem(item, 'recommended')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  sectionTitle: {
    ...Typography.subtitle2,
    color: '#aaa',
    marginTop: 10,
    marginBottom: 6,
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
  cancelText: {
    ...Typography.subtitle2,
    color: '#F4F4F4',
    fontWeight: '600',
    paddingLeft: 20,
  },
});
