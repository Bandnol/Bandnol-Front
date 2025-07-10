import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import RoadingIcon from '@/assets/onboarding/roading.svg';
import { FlatList } from 'react-native';
import Ellipse from '@/assets/onboarding/Ellipse 1.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '@/assets/onboarding/Vector.svg';
import { useRouter } from 'expo-router';

const Component = () => {
  const router = useRouter();
  const artistData = Array.from({ length: 12 }, (_, index) => ({
    id: index.toString(),
    name: `가수 ${index + 1}`,
  }));
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.view}>
        <View style={styles.iconWrapper}>
          <View style={{ paddingLeft: 20 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={24} height={24} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </View>
        </View>
        <View style={styles.frameParent}>
          <View style={styles.frameParent}>
            <View style={styles.frameGroup}>
              <View style={styles.frameContainer}>
                <View style={styles.groupSpaceBlock}>
                  <Text
                    style={[
                      styles.text1,
                      styles.textTypo,
                      styles.textTitleMargin,
                    ]}
                  >
                    관심 아티스트 설정
                  </Text>
                  <Text
                    style={[styles.text2, styles.textTypo]}
                  >{`관심 있는 아티스트의 팬이 되어주세요!
팬이 되면 커뮤니티를 이용할 수 있어요.`}</Text>
                </View>
                <View style={[styles.wrapper, styles.groupSpaceBlock]}>
                  <Text style={[styles.text3, styles.textTypo]}>
                    관심 아티스트
                  </Text>
                </View>
              </View>
              <View style={[styles.frameView, styles.frameViewFlexStart]}>
                <View style={[styles.group, styles.groupSpaceBlock]}>
                  <Text style={[styles.text3, styles.textTypo]}>
                    추천 아티스트
                  </Text>
                  <RoadingIcon width={24} height={24} />
                </View>
                <FlatList
                  data={artistData}
                  horizontal={false}
                  contentContainerStyle={{
                    rowGap: 16,
                  }}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        alignItems: 'center',
                        width: '22%',
                        marginHorizontal: '1.5%',
                      }}
                    >
                      <Ellipse width={68} height={68} />
                      <Text
                        style={{ color: '#fff', fontSize: 12, marginTop: 8 }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  )}
                  numColumns={4}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/step3-timesetting')}
          >
            <Text style={[styles.text21, styles.textTypo]}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  groupSpaceBlock: {
    paddingVertical: 0,
    alignSelf: 'stretch',
  },
  textTypo: {
    textAlign: 'left',
    fontFamily: 'Pretendard',
  },
  icon: {
    overflow: 'hidden',
  },
  text1: {
    fontSize: 22,
    letterSpacing: -0.5,
    lineHeight: 31,
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    alignSelf: 'stretch',
  },
  text2: {
    color: '#f4f4f4',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
  },
  text3: {
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 25,
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  frameContainer: {
    gap: 27,
    alignSelf: 'stretch',
  },
  group: {
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameView: {
    alignSelf: 'stretch',
    gap: 22,
  },
  frameViewFlexStart: {
    alignItems: 'flex-start',
  },
  frameGroup: {
    gap: 42,
    alignSelf: 'stretch',
  },
  frameParent: {
    width: 335,
    gap: 123,
    flex: 1,
    position: 'relative',
  },
  text21: {
    color: '#b3b3b3',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    height: 50,
    width: 335,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  view: {
    width: '100%',
    gap: 35,
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
  },
  skipText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  textTitleMargin: {
    marginTop: 22,
  },
});

export default Component;
