import Ellipse from '@/assets/onboarding/Ellipse 1.svg';
import RoadingIcon from '@/assets/onboarding/roading.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
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

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        console.log('토큰만 확인:', token);
        if (!isMounted) return;
        setArtistData([]);
      } catch (err) {
        if (!isMounted) return;
        setError('아티스트 데이터를 가져올 수 없습니다.');
        console.error('추천 아티스트 API 미구현:', err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
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
          <RoadingIcon width={24} height={24} />
        </View>
      </View>
    </View>
  );

  const renderFooter = () => <View style={{ height: 120 }} />;

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <StatusBarHeader />
        {loading ? (
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
            contentContainerStyle={{ paddingTop: 20 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1 / 4,
                  marginBottom: 16,
                  alignItems: 'center',
                }}
              >
                <Ellipse width={68} height={68} />
                <Text
                  style={[
                    Typography.body2,
                    { color: Colors.palette.Gray100, marginTop: 8 },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            )}
            numColumns={4}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
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
