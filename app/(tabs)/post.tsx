import Filter from '@/assets/icons/size_m/filter.svg';
import Search from '@/assets/icons/size_m/search.svg';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Pressable, StyleSheet, TextInput, View } from 'react-native';
export default function ArtistPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (text: string) => {
    setQuery(text);
    //setResults(mock);
    return;
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
