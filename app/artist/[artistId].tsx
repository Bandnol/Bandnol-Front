// app/artist/[artistId].tsx
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import ConfirmModal from '@/components/common/ConfirmModal';
import BackIcon from '@/assets/auth/inquiry/Vector.svg';

// API 응답 타입(필요 속성만 정의)
interface ArtistDetail {
  id: string;
  name: string;
  bannerUrl?: string | null;
  profileUrl?: string | null;
  fanCount?: number;
  isInterested?: boolean; // 관심 등록 여부
  stats?: {
    sentCount?: number; // 추천한 횟수
    receivedCount?: number; // 추천받은 횟수
  };
}

export default function ArtistPage() {
  const router = useRouter();
  const { artistId, artistName, name } = useLocalSearchParams<{
    artistId: string;
    artistName?: string;
    name?: string;
  }>();
  console.log('[ArtistPage] params →', { artistId, artistName, name });
  const [artistNameState, setArtistName] = React.useState('');
  const normalizedId = React.useMemo(() => {
    const raw = Array.isArray(artistId) ? artistId[0] : artistId;
    return (raw ?? '').toString().trim();
  }, [artistId]);
  const [apiData, setApiData] = React.useState<ArtistDetail | null>(null);
  const displayName =
    apiData?.name ||
    (Array.isArray(name) ? name[0] : name) ||
    (Array.isArray(artistName) ? artistName[0] : artistName) ||
    'Unknown Artist';
  console.log(
    '[ArtistPage] mounted with artistId:',
    artistId,
    '→ normalized:',
    normalizedId,
  );

  const [artist, setArtist] = React.useState<ArtistDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!normalizedId) {
      console.log('[ArtistPage] no artistId, abort load');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('[ArtistPage] start load, artistId:', normalizedId);

      // JWT 토큰 가져오기 (인증이 필요한 경우를 위해)
      const token = await SecureStore.getItemAsync('JWTToken');

      // GET /api/v1/artists/{artistId}
      const res = await api.get<{
        success: boolean;
        data: any;
        error: any;
        name?: string;
      }>(`/api/v1/artists/${encodeURIComponent(normalizedId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('[ArtistPage] API raw response:', res.data);
      // API success=false 처리 (예: A1300)
      if (
        (res.data as any)?.success === false &&
        (res.data as any)?.error?.code
      ) {
        const code = (res.data as any)?.error?.code;
        if (code === 'A1300') {
          // Alert.alert('안내', '해당 아티스트가 존재하지 않습니다.', [
          //   { text: '확인', onPress: () => router.back() },
          // ]);
          return;
        }
      }
      if (res.data.name) setArtistName(res.data.name);
      // 백엔드 스키마에 맞춰 매핑
      const d = (res.data?.data ?? res.data) as any;
      const payload = d?.data ?? d; // 백엔드가 { success, data } 형태로 줄 수 있음
      console.log('[ArtistPage] mapped source object:', payload);
      const mapped: ArtistDetail = {
        id: String(normalizedId),
        name: payload?.artistName ?? payload?.name ?? 'Unknown Artist',
        bannerUrl: payload?.bannerUrl ?? payload?.imgUrl ?? null,
        profileUrl: payload?.profileUrl ?? payload?.imgUrl ?? null,
        fanCount: payload?.likedCount ?? payload?.fanCount ?? 0,
        isInterested: payload?.isLiked ?? payload?.isInterested ?? false,
        stats: {
          sentCount:
            payload?.recommends?.sentCnt ?? payload?.stats?.sentCount ?? 0,
          receivedCount:
            payload?.recommends?.receivedCnt ??
            payload?.stats?.receivedCount ??
            0,
        },
      };

      console.log('[ArtistPage] Image URLs:', {
        bannerUrl: mapped.bannerUrl,
        profileUrl: mapped.profileUrl,
        rawPayload: {
          bannerUrl: payload?.bannerUrl,
          profileUrl: payload?.profileUrl,
          imgUrl: payload?.imgUrl,
        },
      });
      setArtist(mapped);
      setApiData(mapped);
    } catch (e: any) {
      console.log('[ArtistPage] load error:', e);
      try {
        const msg = e?.message ?? '';
        const parsed = typeof msg === 'string' ? JSON.parse(msg) : null;
        const code = parsed?.error?.code ?? parsed?.code;
        if (code === 'A1300') {
          // Alert.alert('안내', '해당 아티스트가 존재하지 않습니다.', [
          //   { text: '확인', onPress: () => router.back() },
          // ]);
          return;
        }
      } catch (_) {}
      setError(
        typeof e?.message === 'string' ? e.message : '불러오기에 실패했습니다.',
      );
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  }, [normalizedId, refreshing, router]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onBack = () => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const onToggleInterest = async () => {
    if (!artist) return;

    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        // Alert.alert(
        //   '로그인이 필요해요',
        //   '관심 아티스트 기능을 사용하려면 로그인이 필요합니다.',
        // );
        return;
      }

      // POST API로 관심 아티스트 추가/제거 (inactive 필드로 제어)
      const inactiveValue = artist.isInterested; // 현재 관심 아티스트면 inactive: true (해제)

      console.log('[ArtistPage] 토글 전 상태:', {
        artistName: artist.name,
        isInterested: artist.isInterested,
        inactiveValue,
      });

      await api.post(
        '/api/v1/artists/liked',
        {
          id: artist.id,
          name: artist.name,
          imgUrl: artist.profileUrl,
          inactive: inactiveValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 요청 성공 시 로컬 상태 업데이트
      if (inactiveValue) {
        // inactive: true = 관심 아티스트 제거
        console.log('[ArtistPage] 관심 아티스트 제거 완료:', artist.name);
        setArtist((prev) => {
          const updated = prev ? { ...prev, isInterested: false } : prev;
          console.log('[ArtistPage] 상태 업데이트 후:', {
            isInterested: updated?.isInterested,
          });
          return updated;
        });
      } else {
        // inactive: false = 관심 아티스트 추가
        console.log('[ArtistPage] 관심 아티스트 추가 완료:', artist.name);
        setArtist((prev) => {
          const updated = prev ? { ...prev, isInterested: true } : prev;
          console.log('[ArtistPage] 상태 업데이트 후:', {
            isInterested: updated?.isInterested,
          });
          return updated;
        });
      }
    } catch (e: any) {
      console.error('[ArtistPage] 관심 아티스트 토글 실패:', e);
      // Alert.alert('실패', '관심 아티스트 설정 중 문제가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color={Colors.palette.Gray100} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerWrap}>
        <Text style={{ color: Colors.palette.Gray100 }}>{error}</Text>
      </View>
    );
  }

  if (!artist) return null;

  const fansLabel = `${artist.fanCount?.toLocaleString?.() ?? 0} 명의 팬`;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={{ position: 'relative' }}>
          <ImageBackground
            source={artist.bannerUrl ? { uri: artist.bannerUrl } : undefined}
            style={styles.headerBg}
            imageStyle={{ resizeMode: 'cover' }}
            onLoad={() =>
              console.log(
                '[ArtistPage] Banner image loaded successfully:',
                artist.bannerUrl,
              )
            }
            onError={(error) =>
              console.log(
                '[ArtistPage] Banner image failed to load:',
                error.nativeEvent.error,
                'URL:',
                artist.bannerUrl,
              )
            }
          >
            <Pressable onPress={onBack} style={styles.backBtn}>
              <BackIcon width={24} height={24} />
            </Pressable>
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
          {artist.profileUrl && (
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: artist.profileUrl }}
                style={styles.avatar}
                onLoad={() =>
                  console.log(
                    '[ArtistPage] Profile image loaded successfully:',
                    artist.profileUrl,
                  )
                }
                onError={(error) =>
                  console.log(
                    '[ArtistPage] Profile image failed to load:',
                    error.nativeEvent.error,
                    'URL:',
                    artist.profileUrl,
                  )
                }
              />
            </View>
          )}
          <Text style={styles.artistName}>{displayName}</Text>
          <View style={styles.fanRow}>
            <Text style={styles.fanText}>{fansLabel}</Text>
            <Text style={styles.redStar}>★</Text>
          </View>

          {/* 관심 버튼 */}
          <Pressable
            onPress={() => {
              if (artist.isInterested) {
                setIsConfirmVisible(true);
              } else {
                onToggleInterest();
              }
            }}
            style={[
              styles.interestBtn,
              artist.isInterested
                ? styles.interestBtnOutline
                : styles.interestBtnFill,
            ]}
          >
            <Text
              style={
                artist.isInterested
                  ? styles.interestTextOutline
                  : styles.interestTextOutline
              }
            >
              {artist.isInterested
                ? '나의 관심 아티스트'
                : '관심 아티스트에 추가'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          refreshControl={
            // Pull-to-Refresh
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={Colors.palette.Gray100}
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* 프로필 라인 */}
          <View style={styles.profileRow}>
            {!artist.profileUrl && (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: Colors.palette.Gray700 },
                ]}
              />
            )}
            <Text style={styles.artistName}>{displayName}</Text>
            <View style={styles.fanRow}>
              <Text style={styles.fanText}>{fansLabel}</Text>
              <Text style={styles.redStar}>★</Text>
            </View>

            {/* 관심 버튼 */}
            <Pressable
              onPress={() => {
                if (artist.isInterested) {
                  setIsConfirmVisible(true);
                } else {
                  onToggleInterest();
                }
              }}
              style={[
                styles.interestBtn,
                artist.isInterested
                  ? styles.interestBtnOutline
                  : styles.interestBtnFill,
              ]}
            >
              <Text
                style={
                  artist.isInterested
                    ? styles.interestTextOutline
                    : styles.interestTextOutline
                }
              >
                {artist.isInterested
                  ? '나의 관심 아티스트'
                  : '관심 아티스트에 추가'}
              </Text>
            </Pressable>
          </View>
          <View style={{ height: 30 }} />

          {/* 추천기록 카드 */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>추천기록</Text>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>추천한 횟수</Text>
                <Text style={styles.cardValue}>
                  {artist.stats?.sentCount ?? 0}회
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>추천받은 횟수</Text>
                <Text style={styles.cardValue}>
                  {artist.stats?.receivedCount ?? 0}회
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {isConfirmVisible && (
        <View style={styles.modalOverlay}>
          <ConfirmModal
            visible={isConfirmVisible}
            variant="logout"
            headerText={'관심아티스트에서 삭제할까요?'}
            onConfirm={async () => {
              try {
                await onToggleInterest();
              } catch (e: any) {
                console.warn(
                  '[관심아티스트 삭제] 과정에서 문제가 발생했습니다.',
                  e?.message || String(e),
                );
              } finally {
                setIsConfirmVisible(false);
              }
            }}
            onCancel={() => setIsConfirmVisible(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const HEADER_H = 220;
const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
  },
  statusBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.palette.Gray900,
  },
  headerBg: {
    height: HEADER_H,
    width: '100%',
    backgroundColor: Colors.palette.Gray800,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  profileRow: {
    marginTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    elevation: 4,
  },
  avatarWrap: {
    position: 'absolute',
    bottom: -AVATAR_SIZE / 2,
    left: '50%',
    transform: [{ translateX: -AVATAR_SIZE / 2 }],
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 6,
    backgroundColor: Colors.palette.Gray700,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  artistName: {
    ...Typography.h1,
    color: Colors.palette.Gray100,
    marginTop: 12,
  },
  fanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  fanText: {
    ...Typography.sub2,
    color: Colors.palette.Gray200,
  },
  redStar: {
    marginLeft: 4,
    color: '#FB4932',
    fontSize: 14,
  },
  interestBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestBtnFill: {
    backgroundColor: '#FB4932',
  },
  interestBtnOutline: {
    borderWidth: 1,
    borderColor: Colors.palette.Gray200,
  },
  interestTextFill: {
    ...Typography.button,
    color: Colors.palette.Gray900,
  },
  interestTextOutline: {
    ...Typography.button,
    color: Colors.palette.Gray100,
  },
  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  sectionTitle: {
    ...Typography.sub3,
    paddingHorizontal: 10,
    color: Colors.palette.Gray100,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.palette.Gray800,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cardLabel: {
    ...Typography.body2,
    color: Colors.palette.Gray400,
  },
  cardValue: {
    ...Typography.sub,
    color: Colors.palette.Gray400,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.palette.Gray700,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
