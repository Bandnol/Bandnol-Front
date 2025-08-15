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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { useAuthFetch } from '@/hooks/useAuthFetch';

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
  const { artistId } = useLocalSearchParams<{ artistId: string }>();
  const authFetch = useAuthFetch();

  const [artist, setArtist] = React.useState<ArtistDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!artistId) return;
    setLoading(true);
    setError(null);
    try {
      // GET /api/v1/artists/{artistId}
      const res = await authFetch.json<{
        success: boolean;
        data: any;
        error: any;
      }>(`/api/v1/artists/${artistId}`, { method: 'GET' });
      // API success=false 처리 (예: A1300)
      if ((res as any)?.success === false && (res as any)?.error?.code) {
        const code = (res as any)?.error?.code;
        if (code === 'A1300') {
          Alert.alert('안내', '해당 아티스트가 존재하지 않습니다.', [
            { text: '확인', onPress: () => router.back() },
          ]);
          return;
        }
      }
      // 백엔드 스키마에 맞춰 매핑
      const d = (res?.data ?? res) as any;
      const mapped: ArtistDetail = {
        id: d?.id ?? String(artistId),
        name: d?.name ?? d?.artistName ?? '아티스트',
        bannerUrl: d?.bannerUrl ?? d?.coverImageUrl ?? null,
        profileUrl: d?.profileUrl ?? d?.profileImageUrl ?? null,
        fanCount: d?.fanCount ?? d?.fans ?? 0,
        isInterested: d?.isInterested ?? d?.liked ?? false,
        stats: {
          sentCount: d?.stats?.sentCount ?? d?.recommendedCount ?? 0,
          receivedCount: d?.stats?.receivedCount ?? d?.receivedCount ?? 0,
        },
      };
      setArtist(mapped);
    } catch (e: any) {
      try {
        const msg = e?.message ?? '';
        const parsed = typeof msg === 'string' ? JSON.parse(msg) : null;
        const code = parsed?.error?.code ?? parsed?.code;
        if (code === 'A1300') {
          Alert.alert('안내', '해당 아티스트가 존재하지 않습니다.', [
            { text: '확인', onPress: () => router.back() },
          ]);
          return;
        }
      } catch (_) {}
      setError(
        typeof e?.message === 'string' ? e.message : '불러오기에 실패했습니다.',
      );
    } finally {
      setLoading(false);
    }
  }, [artistId, authFetch]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onBack = () => router.back();

  const onToggleInterest = async () => {
    // TODO: 관심 아티스트 추가/해제 API 연결 (요청 스펙 확정 시 교체)
    setArtist((prev) =>
      prev ? { ...prev, isInterested: !prev.isInterested } : prev,
    );
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
    <View style={styles.screen}>
      {/* 헤더 배경 */}
      <ImageBackground
        source={artist.bannerUrl ? { uri: artist.bannerUrl } : undefined}
        style={styles.headerBg}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFill}
        />
        <Pressable style={styles.backBtn} onPress={onBack} hitSlop={8}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </Pressable>
      </ImageBackground>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 프로필 라인 */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            {artist.profileUrl ? (
              <Image
                source={{ uri: artist.profileUrl }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: Colors.palette.Gray700 },
                ]}
              />
            )}
          </View>
          <Text style={styles.artistName}>{artist.name}</Text>
          <View style={styles.fanRow}>
            <Text style={styles.fanText}>{fansLabel}</Text>
            <Text style={styles.redStar}>★</Text>
          </View>

          {/* 관심 버튼 */}
          <Pressable
            onPress={onToggleInterest}
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
                  : styles.interestTextFill
              }
            >
              {artist.isInterested
                ? '나의 관심 아티스트'
                : '관심 아티스트에 추가'}
            </Text>
          </Pressable>
        </View>

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
  );
}

const HEADER_H = 220;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
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
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  profileRow: {
    marginTop: -48,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.palette.Gray900,
    backgroundColor: Colors.palette.Gray700,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artistName: {
    ...Typography.h3,
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
    ...Typography.body2,
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
    ...Typography.caption,
    color: Colors.palette.Gray300,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.palette.Gray800,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cardLabel: {
    ...Typography.body2,
    color: Colors.palette.Gray200,
  },
  cardValue: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.palette.Gray700,
  },
});
