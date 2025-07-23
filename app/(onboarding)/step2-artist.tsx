import Ellipse from '@/assets/onboarding/Ellipse 1.svg';
import RoadingIcon from '@/assets/onboarding/roading.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Component = () => {
  const router = useRouter();
  const artistData = Array.from({ length: 36 }, (_, index) => ({
    id: index.toString(),
    name: `가수 ${index + 1}`,
  }));

  const renderHeader = () => (
    <View>
      <View>
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
            }}
          >
            <Text style={styles.text3}>추천 아티스트</Text>
            <RoadingIcon width={24} height={24} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => <View style={{ height: 120 }} />;

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <StatusBarHeader />
        <FlatList
          data={artistData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                alignItems: 'center',
                width: '22%',
                marginHorizontal: '1.5%',
                marginBottom: 16,
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
    alignItems: 'center',
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
