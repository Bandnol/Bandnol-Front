import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BackArrow from '@/assets/icons/back-arrow.svg';
import RoadingIcon from '@/assets/onboarding/roading.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import InterestedArtistList from '@/components/common/InterestedArtistList';
import RecommendedArtistList from '@/components/common/RecommendedArtistList';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api';

const log = (...args: any[]) => console.log('[관심 아티스트 설정]', ...args);

const IA_STORAGE_KEY = '@interested_artists_v1';

export default function InterestedArtists() {
  const router = useRouter();
  const [artistData, setArtistData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [hasNext, setHasNext] = React.useState(true);
  const [sortType, setSortType] = React.useState<'random' | 'popularity'>(
    'popularity',
  );
  const [selectedArtists, setSelectedArtists] = React.useState<any[]>([]);
  const [likedArtists, setLikedArtists] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);

  const selectedRef = React.useRef<any[]>([]);
  React.useEffect(() => {
    selectedRef.current = selectedArtists;
    log(
      '선택 변경 →',
      selectedArtists.length,
      '명',
      selectedArtists.map((a: any) => a.id),
    );
  }, [selectedArtists]);

  // 현재 관심 아티스트 목록 로드 (API에서)
  const loadLikedArtists = async () => {
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) return;

      const response = await api.get('/api/v1/artists/liked/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const artists = response.data.data?.artists || response.data.data || [];
        setLikedArtists(artists);
        log('현재 관심 아티스트 불러옴 →', artists.length, '명');
        log('API 응답 구조 확인:', response.data.data);
      }
    } catch (e) {
      console.warn('[관심 아티스트 설정] 관심 아티스트 불러오기 실패', e);
    }
  };

  // 기존 관심 아티스트 로드
  React.useEffect(() => {
    loadLikedArtists();

    (async () => {
      try {
        if (selectedArtists.length > 0) return;
        const raw = await AsyncStorage.getItem(IA_STORAGE_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          setSelectedArtists(arr);
          selectedRef.current = arr;
          log('스토리지에서 선택 불러옴 →', arr.length, '명');
        }
      } catch (e) {
        console.warn('[관심 아티스트 설정] hydrate 실패', e);
      }
    })();
  }, []);

  // 화면이 포커스될 때마다 관심 아티스트 목록 새로고침
  useFocusEffect(
    useCallback(() => {
      loadLikedArtists();
    }, []),
  );

  React.useEffect(() => {
    if (!selectedArtists.length) return;
    AsyncStorage.setItem(IA_STORAGE_KEY, JSON.stringify(selectedArtists)).catch(
      () => {},
    );
  }, [selectedArtists]);

  // 관심 아티스트 저장 API 호출
  const saveLikedArtists = async () => {
    const list = selectedRef.current ?? [];
    log('저장 시도 시 선택된 수:', list.length);

    if (list.length === 0) {
      Alert.alert('알림', '관심 아티스트를 선택해주세요.');
      return false;
    }

    try {
      setSaving(true);
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        Alert.alert(
          '로그인이 필요해요',
          '토큰이 없어 관심 아티스트를 저장할 수 없어요. 다시 로그인 해주세요.',
        );
        return false;
      }

      // 각 아티스트를 개별 저장
      const results = await Promise.allSettled(
        list.map((artist) =>
          api.post(
            '/api/v1/artists/liked',
            {
              id: artist.id,
              name: artist.name,
              imgUrl: artist.imgUrl,
              inactive: false, // 관심 아티스트 등록
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ),
      );

      const rejected = results.filter((r) => r.status === 'rejected');
      if (rejected.length > 0) {
        console.log('[관심 아티스트 설정] 일부 저장 실패:', rejected);
        Alert.alert(
          '일부 저장 실패',
          '선택한 아티스트 중 일부가 저장되지 않았어요. 잠시 후 다시 시도해 주세요.',
        );
        return false;
      }

      console.log(
        '[관심 아티스트 설정] 저장 완료. 총',
        list.length,
        '명 저장됨',
      );
      Alert.alert('완료', '관심 아티스트가 저장되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
      return true;
    } catch (e) {
      console.log('[관심 아티스트 설정] 저장 중 오류 발생:', e);
      Alert.alert('저장 오류', '네트워크나 서버 문제로 저장하지 못했어요.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // 관심 아티스트 제거 API 호출
  const removeLikedArtist = async (artist: any) => {
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        Alert.alert('로그인이 필요해요', '토큰이 없어 제거할 수 없어요.');
        return;
      }

      // POST API로 관심 아티스트 제거 (inactive: true로 설정)
      await api.post(
        '/api/v1/artists/liked',
        {
          id: artist.id,
          name: artist.name,
          imgUrl: artist.imgUrl,
          inactive: true, // 관심 아티스트 제거
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 요청 성공 시 로컬 상태에서도 제거
      setLikedArtists((prev) => prev.filter((a) => a.id !== artist.id));
      log('관심 아티스트 제거 완료:', artist.name);
      Alert.alert(
        '완료',
        `${artist.name}을(를) 관심 아티스트에서 제거했습니다.`,
      );
    } catch (e) {
      console.error('[관심 아티스트 설정] 제거 중 오류:', e);
      Alert.alert('제거 실패', '관심 아티스트 제거 중 문제가 발생했습니다.');
    }
  };

  const toggleSelectArtist = useCallback(
    async (artist: any) => {
      const norm = {
        id:
          artist?.id ??
          artist?.artistId ??
          artist?.spotifyId ??
          String(artist?.id ?? ''),
        name: artist?.name ?? artist?.displayName ?? artist?.title ?? '',
        imgUrl: artist?.imgUrl ?? artist?.imageUrl ?? artist?.profileUrl ?? '',
      };

      // 이미 관심 아티스트에 있는지 확인
      const isAlreadyLiked = likedArtists.some((a) => a.id === norm.id);

      if (isAlreadyLiked) {
        // 이미 관심 아티스트면 제거
        await removeLikedArtist(norm);
      } else {
        // 관심 아티스트가 아니면 추가
        try {
          const token = await SecureStore.getItemAsync('JWTToken');
          if (!token) {
            Alert.alert(
              '로그인이 필요해요',
              '토큰이 없어 관심 아티스트를 저장할 수 없어요.',
            );
            return;
          }

          // 즉시 API 호출로 관심 아티스트 추가
          await api.post(
            '/api/v1/artists/liked',
            {
              id: norm.id,
              name: norm.name,
              imgUrl: norm.imgUrl,
              inactive: false, // 관심 아티스트 등록
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // 로컬 상태에도 추가
          setLikedArtists((prev) => [...prev, norm]);

          log('관심 아티스트 추가 완료:', norm.name);
        } catch (e) {
          console.error('[관심 아티스트 설정] 추가 중 오류:', e);
          Alert.alert(
            '추가 실패',
            '관심 아티스트 추가 중 문제가 발생했습니다.',
          );
        }
      }
    },
    [likedArtists, removeLikedArtist],
  );

  const fetchMoreArtists = async (
    nextCursor: string | null = cursor,
    currentSort: 'random' | 'popularity' = sortType,
    loadMore = true,
  ) => {
    if (currentSort === 'popularity' && !hasNext && loadMore) return;
    try {
      if (!loadMore) setLoading(true);
      const token = await SecureStore.getItemAsync('JWTToken');
      const params: any = { sort: currentSort };
      if (currentSort === 'popularity') {
        params.size = 20;
        if (loadMore && nextCursor) params.cursor = nextCursor;
      }

      const response = await api.get('/api/v1/artists/recommended', {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.data.success) {
        const newData =
          currentSort === 'popularity'
            ? response.data.data?.data || []
            : response.data.data || [];
        setArtistData((prev) => (loadMore ? [...prev, ...newData] : newData));
        if (currentSort === 'popularity') {
          setHasNext(response.data.data?.hasNext || false);
          setCursor(response.data.data?.nextCursor || null);
        } else {
          setHasNext(true);
        }
        setError(null);
      } else {
        setError(
          response.data.error?.message || '데이터를 불러올 수 없습니다.',
        );
      }
    } catch (err) {
      setError('네트워크나 서버 문제일 수 있습니다');
      console.error('추천 아티스트 API 호출 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const initialFetch = async (sort: 'random' | 'popularity') => {
    setSortType(sort);
    setCursor(null);
    setHasNext(true);
    setArtistData([]);
    await fetchMoreArtists(null, sort, false);
  };

  React.useEffect(() => {
    initialFetch('popularity');
  }, []);

  const isFetchingMoreRef = React.useRef(false);
  const handleOuterScroll = (e: any) => {
    const { contentSize, layoutMeasurement, contentOffset } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distanceFromBottom < 80) {
      if (sortType === 'popularity' && hasNext && !isFetchingMoreRef.current) {
        isFetchingMoreRef.current = true;
        fetchMoreArtists(cursor, sortType, true).finally(() => {
          isFetchingMoreRef.current = false;
        });
      }
    }
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 20, alignItems: 'flex-start' }}>
      {/* Top Nav Bar */}
      <View style={styles.topNavBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackArrow width={9} height={16} />
        </TouchableOpacity>
        <Text style={styles.title}>관심 아티스트 설정</Text>
        <View style={{ width: 24, height: 24 }} />
      </View>

      <View style={{ paddingTop: 20 }}>
        <View>
          <Text style={styles.text2}>
            {`관심 있는 아티스트의 팬이 되어주세요!
팬이 되면 커뮤니티를 이용할 수 있어요.`}
          </Text>
        </View>
        <View style={{ height: 27 }} />
        <View>
          <Text style={styles.text3}>
            관심 아티스트{'  '}
            <Text style={{ color: Colors.palette.Gray400 }}>
              {likedArtists.length}/6명
            </Text>
          </Text>
          <View style={styles.selectedWrap}>
            <InterestedArtistList
              selectedArtists={likedArtists}
              showRemoveButton={false}
              onRemoveArtist={removeLikedArtist}
            />
          </View>
        </View>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={[styles.text3, { marginTop: 20 }]}>추천 아티스트</Text>
          <RoadingIcon
            width={24}
            height={24}
            onPress={() => {
              setError(null);
              initialFetch('random');
            }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <ScrollView
          style={styles.view}
          contentContainerStyle={{ paddingBottom: 120 }}
          onScroll={handleOuterScroll}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          {loading && artistData.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color={Colors.palette.Gray100} />
            </View>
          ) : error ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: Colors.palette.Gray100 }}>{error}</Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
              <RecommendedArtistList
                artistData={artistData}
                onSelectArtist={toggleSelectArtist}
                fetchMore={(nextCursor) =>
                  fetchMoreArtists(nextCursor, sortType, true)
                }
                sortType={sortType}
                setError={setError}
                selected={likedArtists}
              />
            </View>
          )}
        </ScrollView>

        <LinearGradient
          colors={['transparent', Colors.palette.Gray900]}
          style={styles.fadeOverlay}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  view: {
    width: '100%',
    flex: 1,
  },
  topNavBar: {
    width: '100%',
    height: 62,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...Typography.subtitle1B,
    color: Colors.palette.Gray100,
  },
  text2: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
  },
  text3: {
    ...Typography.subtitle1B,
    color: Colors.palette.Gray100,
    paddingBottom: 22,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 0,
  },
  selectedWrap: {
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
});
