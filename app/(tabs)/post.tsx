import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, FlatList } from 'react-native';

import { Image } from 'expo-image';

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

function useDebouncedCallback<T extends any[]>(
  fn: (...args: T) => void,
  delay = 200,
) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: T) => {
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
}

const Row = memo(function Row({
  row,
  rowIndex,
}: {
  row: MockData[];
  rowIndex: number;
}) {
  if (row.length === 3 && rowIndex % 3 === 2) {
    // 큰 1, 작은 2 배치
    return (
      <View style={styles.rowWrapper}>
        <View style={{ width: '66.666666%', aspectRatio: 1 }}>
          <Image
            source={row[0].image as any}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={`big-${(row[0] as any).id ?? rowIndex}-0`}
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
              source={row[1].image as any}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`small-${(row[1] as any).id ?? rowIndex}-1`}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Image
              source={row[2].image as any}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`small-${(row[2] as any).id ?? rowIndex}-2`}
            />
          </View>
        </View>
      </View>
    );
  }

  // 일반 1:1 배치
  else
    return (
      <View style={styles.rowWrapper}>
        {row.map((item, colIndex) => (
          <View
            key={`${(item as any).id ?? (item as any).image}-${colIndex}`}
            style={styles.itemWrapper}
          >
            <Image
              source={item.image as any}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={`grid-${(item as any).id ?? colIndex}`}
            />
          </View>
        ))}
      </View>
    );
});

export default function postPage() {
  const indexed = useMemo(
    () =>
      mockPostApi.map((m) => ({
        ...m,
        _lc: (m.comment ?? '').toLowerCase(),
        _id: (m as any).id ?? String((m as any).image ?? Math.random()),
      })),
    [],
  );

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockData[]>(indexed);
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [mediaPostOnly, setMediaPostOnly] = useState(true);
  const [sortOrder, setSortOrder] = useState<'popular' | 'latest'>('latest');
  const [range, setRange] = useState<'all' | 'following' | 'mutualFollowing'>(
    'all',
  );

  const runFilter = useCallback(
    (text: string) => {
      const q = text.trim().toLowerCase();
      if (!q) {
        setResults(indexed);
        return;
      }
      const filtered = indexed.filter((item) => item._lc.includes(q));
      setResults(filtered);
    },
    [indexed],
  );
  const debouncedRunFilter = useDebouncedCallback(runFilter, 220);

  const handleSearchChange = useCallback(
    (text: string) => {
      setQuery(text);
      debouncedRunFilter(text);
    },
    [debouncedRunFilter],
  );

  const handleSubmit = useCallback(() => runFilter(query), [runFilter, query]);

  const threeGroup: MockData[][] = useMemo(() => {
    const out: MockData[][] = [];
    for (let i = 0; i < results.length; i += 3)
      out.push(results.slice(i, i + 3));
    return out;
  }, [results]);

  const renderRow = useCallback(
    ({ item, index }: { item: MockData[]; index: number }) => (
      <Row row={item} rowIndex={index} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (_item: MockData[], idx: number) => `row-${idx}`,
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.maxWidthContainer}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search style={{ width: 24, height: 24 }} />
            <View style={styles.searchBox}>
              <TextInput
                value={query}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSubmit}
                style={styles.searchInput}
                placeholder="검색어를 입력하세요"
                placeholderTextColor="#888"
                clearButtonMode="while-editing"
                returnKeyType="search"
              />
            </View>
          </View>

          <Pressable onPress={() => setFilterVisible(true)}>
            <Filter />
          </Pressable>
        </View>

        <FlatList
          data={threeGroup}
          keyExtractor={keyExtractor}
          renderItem={renderRow}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={9}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
      </View>

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
    paddingVertical: 0,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  searchBox: { flex: 1, justifyContent: 'center' },
  searchInput: {
    ...Typography.body1,
    color: '#F4F4F4',
    textAlignVertical: 'center',
    paddingVertical: 2,
  },
  rowWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  itemWrapper: { flex: 1, aspectRatio: 1 },
  image: { width: '100%', height: '100%', aspectRatio: 1 },
});
