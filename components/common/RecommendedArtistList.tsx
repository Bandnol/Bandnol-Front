import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';

interface Artist {
  id: string;
  name: string;
  imgUrl: string | null;
}

interface Props {
  artistData: Artist[];
  onSelectArtist: (artist: Artist) => void;
  fetchMore: (
    cursor?: string | null,
  ) => Promise<{ nextCursor?: string | null } | void>;
  sortType: 'random' | 'popularity';
  setError: (error: string | null) => void;
}

const RecommendedArtistList = ({
  artistData,
  onSelectArtist,
  fetchMore,
  sortType,
  setError,
}: Props) => {
  // 다음 데이터 조회를 위한 커서 상태
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  // 추가 데이터 로딩 중인지 여부 상태
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 무한 스크롤 시 추가 데이터 불러오는 함수
  const handleEndReached = async () => {
    if (isLoadingMore) return;
    if (sortType === 'popularity') {
      if (!nextCursor && artistData.length > 0) return;
      try {
        setIsLoadingMore(true);
        const res = await fetchMore(nextCursor);
        if (res?.nextCursor !== undefined) {
          setNextCursor(res.nextCursor ?? null);
        }
      } catch (e) {
        setError('Failed to load more artists');
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      fetchMore();
    }
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      // 아티스트 데이터 배열
      data={artistData}
      keyExtractor={(item) => item.id}
      numColumns={4}
      columnWrapperStyle={{ justifyContent: 'flex-start' }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      // 각 아이템 렌더링 (이미지 없으면 배경색으로 대체)
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.artistContainer}
          onPress={() => onSelectArtist(item)}
        >
          <View style={styles.artistImageWrapper}>
            {item.imgUrl ? (
              <Image source={{ uri: item.imgUrl }} style={styles.artistImage} />
            ) : (
              // 이미지 없을 때 회색 배경 표시
              <View
                style={[
                  styles.artistImage,
                  { backgroundColor: Colors.palette.Gray600 },
                ]}
              />
            )}
          </View>
          <Text style={styles.artistName}>{item.name}</Text>
        </TouchableOpacity>
      )}
      // 리스트 하단 여백 추가
      ListFooterComponent={<View style={{ height: 120 }} />}
      showsVerticalScrollIndicator={false}
      // 리스트 끝에 도달했을 때 추가 데이터 요청
      onEndReached={handleEndReached}
      // 스크롤 시작 시 에러 상태 초기화
      onMomentumScrollBegin={() => setError(null)}
    />
  );
};

const styles = StyleSheet.create({
  artistContainer: {
    flex: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  artistImageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: Colors.palette.Gray700,
  },
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artistName: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RecommendedArtistList;
