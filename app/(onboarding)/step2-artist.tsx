import RoadingIcon from '@/assets/onboarding/roading.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios instance 불러오기
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SecureStore from 'expo-secure-store';

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

  const fetchArtists = async (
    loadMore = false,
    currentSort: 'random' | 'popularity' = sortType,
  ) => {
    if (currentSort === 'popularity' && !hasNext && loadMore) return;
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('JWTToken');
      const params: any = { sort: currentSort };
      if (currentSort === 'popularity') {
        params.size = 20;
        if (loadMore && cursor) {
          params.cursor = cursor;
        }
      }
      console.log('fetch params:', params);
      const response = await api.get('/api/v1/artists/recommended', {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log('추천 아티스트 API 응답:', response.data);
      if (response.data.success) {
        // 데이터 구조가 random/popularity에 따라 다름
        const newData =
          currentSort === 'popularity'
            ? response.data.data?.data || []
            : response.data.data || [];
        console.log('가져온 아티스트 배열:', newData);
        setArtistData((prev) => (loadMore ? [...prev, ...newData] : newData));
        if (currentSort === 'popularity') {
          setHasNext(response.data.data?.hasNext || false);
          setCursor(response.data.data?.nextCursor || null);
        } else {
          setHasNext(true); // random도 무한 스크롤 지원
        }
        setError(null);
      } else {
        console.log('API error object:', response.data.error);
        setError(
          response.data.error?.message || '데이터를 불러올 수 없습니다.',
        );
      }
    } catch (err) {
      setError(
        '아티스트 데이터를 가져올 수 없습니다. (네트워크나 서버 문제일 수 있습니다.)',
      );
      console.error('추천 아티스트 API 호출 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setSortType('popularity');
    fetchArtists(false, 'popularity');
  }, []);

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
          <Text style={styles.text3}>관심 아티스트</Text>
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
          <Text style={styles.text3}>추천 아티스트</Text>
          <RoadingIcon
            width={24}
            height={24}
            onPress={() => {
              setError(null);
              setArtistData([]);
              setCursor(null);
              setSortType('random');
              fetchArtists(false, 'random');
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
        <StatusBarHeader />
        {loading && artistData.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={Colors.palette.Gray100} />
          </View>
        ) : error ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: Colors.palette.Gray100 }}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={artistData}
            keyExtractor={(item) => item.id}
            numColumns={4}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  marginBottom: 16,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    overflow: 'hidden',
                    backgroundColor: Colors.palette.Gray700,
                  }}
                >
                  <Image
                    source={{ uri: item.imgUrl }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </View>
                <Text
                  style={[
                    Typography.body2,
                    {
                      color: Colors.palette.Gray100,
                      marginTop: 8,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            )}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            onEndReached={() => fetchArtists(true, sortType)}
            onMomentumScrollBegin={() => setError(null)}
          />
        )}
        <BottomNextButton onPress={() => router.push('/step3-timesetting')} />
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
});

export default Component;
