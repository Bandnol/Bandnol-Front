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

import Filter from '@/assets/icons/size_m/filter.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { MockData, mockPostApi } from '@/components/mockPostApi';
import { Typography } from '@/constants/typography';

import PostFilterModal from './post-tab/PostFilterModal';

export type FilterProps = {
  visible: boolean;
  onClose: () => void;
  mediaPostOnly: boolean;
  setMediaPostOnly: (value: boolean) => void;
  sortOrder: 'popular' | 'latest';
  setSortOrder: (value: 'popular' | 'latest') => void;
  range: 'all' | 'following' | 'mutualFollowing';
  setRange: (value: 'all' | 'following' | 'mutualFollowing') => void;
};

export default function postPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockData[]>(mockPostApi);
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [mediaPostOnly, setMediaPostOnly] = useState(true);
  const [sortOrder, setSortOrder] = useState<'popular' | 'latest'>('latest');
  const [range, setRange] = useState<'all' | 'following' | 'mutualFollowing'>(
    'all',
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(mockPostApi);
      return;
    }

    const lowerQuery = text.toLowerCase();
    const searched = mockPostApi.filter((item) => {
      const target = `${item.comment}`.toLowerCase();
      return target.includes(lowerQuery);
    });

    setResults(searched);
  };

  const handleSubmit = () => handleSearch(query);

  const threeGroup = [];
  for (let i = 0; i < results.length; i += 3) {
    threeGroup.push(results.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      <View style={styles.maxWidthContainer}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search style={{ width: 24, height: 24 }} />
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

          <Pressable onPress={() => setFilterVisible(true)}>
            <Filter />
          </Pressable>
        </View>

        <ScrollView>
          {threeGroup.map((row, rowIndex) =>
            row.length === 3 && rowIndex % 3 === 2 ? (
              // ✅ 특수 배치: 3개일 때 마지막 줄마다 한 번
              <View key={rowIndex} style={styles.rowWrapper}>
                <View style={{ width: '66.666666%', aspectRatio: 1 }}>
                  <Image
                    source={row[0].image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: '33.333333%',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Image
                      source={row[1].image}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image
                      source={row[2].image}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            ) : (
              // ✅ 일반 1:1 배치
              <View key={rowIndex} style={styles.rowWrapper}>
                {row.map((item, colIndex) => (
                  <View
                    key={`${item.image}-${colIndex}`}
                    style={styles.itemWrapper}
                  >
                    <Image
                      source={item.image}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            ),
          )}
        </ScrollView>
      </View>
      <Pressable //임시로 추가해 둠!!
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FF5C5C',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 100,
        }}
        onPress={() => router.push('/postWrite')}
      >
        <Filter />
      </Pressable>

      <PostFilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        mediaPostOnly={mediaPostOnly}
        setMediaPostOnly={setMediaPostOnly}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        range={range}
        setRange={setRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingVertical: 20,
    backgroundColor: '#000',
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  searchBox: {
    flex: 1,
    justifyContent: 'center',
  },
  searchInput: {
    ...Typography.body1,
    color: '#F4F4F4',
    textAlignVertical: 'center',
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
});
