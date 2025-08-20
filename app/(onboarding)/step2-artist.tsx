import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import RoadingIcon from '@/assets/onboarding/roading.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import InterestedArtistList from '@/components/common/InterestedArtistList';
import RecommendedArtistList from '@/components/common/RecommendedArtistList';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios instance 불러오기

const log = (...args: any[]) => console.log('[관심 아티스트]', ...args);

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IA_STORAGE_KEY = '@interested_artists_v1';

const Component = () => {
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

  React.useEffect(() => {
    (async () => {
      try {
        if (selectedArtists.length > 0) return; // 이미 선택이 있으면 패스
        const raw = await AsyncStorage.getItem(IA_STORAGE_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          setSelectedArtists(arr);
          selectedRef.current = arr;
          log('스토리지에서 선택 불러옴 →', arr.length, '명');
        }
      } catch (e) {
        console.warn('[관심 아티스트] hydrate 실패', e);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!selectedArtists.length) return;
    AsyncStorage.setItem(IA_STORAGE_KEY, JSON.stringify(selectedArtists)).catch(
      () => {},
    );
  }, [selectedArtists]);

  // 관심 아티스트 즐겨찾기 저장 API 호출
  // 선택된 아티스트들을 `/api/v1/artists/liked` 엔드포인트로 각각 저장합니다.
  const saveLikedArtists = async () => {
    const list = selectedRef.current ?? [];
    log('저장 시도 시 선택된 수:', list.length);
    if (list.length === 0) {
      console.log('[관심 아티스트] 선택된 아티스트가 없어 저장을 건너뜁니다.');
      return true; // 아무것도 없으면 성공으로 간주하고 다음 단계로 이동
    }

    try {
      setSaving(true);
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.log('[관심 아티스트] 토큰이 없어 저장할 수 없습니다.');
        Alert.alert(
          '로그인이 필요해요',
          '토큰이 없어 관심 아티스트를 저장할 수 없어요. 다시 로그인 해주세요.',
        );
        return false;
      }

      // 각 아티스트를 개별 저장 (백엔드 스펙이 단건 저장이라 가정)
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
        console.log('[관심 아티스트] 일부 저장 실패:', rejected);
        Alert.alert(
          '일부 저장 실패',
          '선택한 아티스트 중 일부가 저장되지 않았어요. 잠시 후 다시 시도해 주세요.',
        );
        return false;
      }

      console.log('[관심 아티스트] 저장 완료. 총', list.length, '명 저장됨');
      return true;
    } catch (e) {
      console.log('[관심 아티스트] 저장 중 오류 발생:', e);
      Alert.alert('저장 오류', '네트워크나 서버 문제로 저장하지 못했어요.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectArtist = useCallback(
    (artist: any) => {
      setSelectedArtists((prev) => {
        const norm = {
          id:
            artist?.id ??
            artist?.artistId ??
            artist?.spotifyId ??
            String(artist?.id ?? ''),
          name: artist?.name ?? artist?.displayName ?? artist?.title ?? '',
          imgUrl:
            artist?.imgUrl ?? artist?.imageUrl ?? artist?.profileUrl ?? '',
        };
        const exists = prev.some((a) => a.id === norm.id && norm.id);
        let next = prev;
        if (exists) {
          next = prev.filter((a) => a.id !== norm.id);
          log('제거:', norm.id, norm.name, '→ 총', next.length);
        } else {
          if (prev.length >= 6) {
            log('최대 6명 제한, 추가 무시');
            return prev;
          }
          next = [...prev, norm];
          log('추가:', norm.id, norm.name, '→ 총', next.length);
        }
        return next;
      });
    },
    [setSelectedArtists],
  );

  const fetchMoreArtists = async (
    nextCursor: string | null = cursor,
    currentSort: 'random' | 'popularity' = sortType,
    loadMore = true,
  ) => {
    // 인기순에서 추가 데이터가 없으면 더 이상 요청하지 않음
    if (currentSort === 'popularity' && !hasNext && loadMore) return;
    try {
      if (!loadMore) setLoading(true);
      const token = await SecureStore.getItemAsync('JWTToken');
      const params: any = { sort: currentSort };
      if (currentSort === 'popularity') {
        params.size = 20;
        //커서 기반 페이지네이션. 데이터 20개씩 불러옴
        if (loadMore && nextCursor) params.cursor = nextCursor;
      }
      // API 호출
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
          // 랜덤 모드는 항상 새로고침, hasNext를 true로 유지
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
    //상태값 초기화 -> 새로운 추천 목록 불러옴
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
      <View>
        <View>
          <Text style={[styles.text1, styles.textTitleMargin]}>
            관심 아티스트 설정
          </Text>
          <View style={{ height: 7 }} />
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
              {selectedArtists.length}/6
            </Text>
          </Text>
          <View style={styles.selectedWrap}>
            <InterestedArtistList selectedArtists={selectedArtists} />
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

  const renderFooter = () => <View style={{ height: 120 }} />;

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <ScrollView
          style={styles.view}
          contentContainerStyle={{ paddingBottom: 120 }}
          onScroll={handleOuterScroll}
          scrollEventThrottle={16}
        >
          <StatusBarHeader />
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
                selected={selectedArtists}
              />
            </View>
          )}
        </ScrollView>
        <BottomNextButton
          onPress={async () => {
            if (saving) return; // 저장 중 중복 클릭 방지
            // 한글 콘솔로그로 흐름 확인
            console.log('[관심 아티스트] 다음 단계로 이동 전, 저장 시도');
            const ok = await saveLikedArtists();
            if (ok) {
              router.push('/step3-timesetting');
            }
          }}
        />
        <LinearGradient
          colors={['transparent', Colors.palette.Gray900]}
          style={styles.fadeOverlay}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },

  text1: {
    ...Typography.h1,
    color: Colors.palette.Gray100,
    alignSelf: 'stretch',
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

  view: {
    width: '100%',

    flex: 1,
  },

  skipText: {
    color: Colors.palette.Gray400,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  textTitleMargin: {
    marginTop: 22,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 0,
  },
  fixedNextWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  selectedWrap: {
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
});

export default Component;
