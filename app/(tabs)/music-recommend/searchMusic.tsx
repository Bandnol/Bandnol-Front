import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { searchSpotifySong } from '@/api/spotifySearch';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/typography';

export default function SearchMusicPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        searchSpotifySong(text.trim());
        return;
      }

      try {
        const res = await searchSpotifySong(text);
        console.log('🔍 최종 받아온 노래 목록:', res.data);
        if (res.success) {
          setResults(res.data || []);
        } else {
          setResults([]);
        }
      } catch (e) {
        console.error('API 오류:', e);
        setResults([]);
      }
    }, 500),
    [],
  );

  const handleChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleSelect = (item: any) => {
    router.push({
      pathname: '/(tabs)/music-recommend/sendRecommend',
      params: {
        title: item.title,
        artist: item.artist,
        image: item.albumImg,
        recomsId: item.id,
      },
    });
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.topSection}>
        {/* 날짜 */}
        <Text style={styles.date}>
          <DateHeader />
        </Text>

        <Text style={styles.title}>
          오늘 날씨에{'\n'}어울리는 곡을 추천해볼까요?
        </Text>
        {/* 검색창 */}
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={handleChangeText}
            style={styles.input}
            placeholder="노래 제목 또는 가수명 검색"
            placeholderTextColor="#888"
          />
          <Pressable
            onPress={() => debouncedSearch(query)}
            style={styles.iconBox}
          >
            <Image
              source={require('@/assets/images/search.png')}
              style={{ width: 17, height: 17 }}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, idx) => `${item.title}-${idx}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelect(item)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Image source={{ uri: item.albumImg }} style={styles.album} />
            <View style={styles.textBox}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.artistText}>{item.artist}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  topSection: {
    marginBottom: 30,
  },
  date: {
    ...Typography.subtitle2,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 60,
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
