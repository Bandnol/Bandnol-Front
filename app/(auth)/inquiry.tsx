import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BackIcon from '@/assets/inquiry/Vector.svg';
import InquiryButton from '@/assets/inquiry/btn.svg';
const Component = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={[styles.view, styles.viewBg]}>
        <View style={styles.statusBarLayout}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.text}>문의하기</Text>
          </View>
        </View>
        <View style={styles.frameParent}>
          <View style={styles.textfieldParent}>
            <View style={[styles.textfield, styles.textfieldFlexBox]}>
              <Text style={[styles.text1, styles.textTypo]}>이메일</Text>
              <View style={[styles.wrapper, styles.btnSpaceBlock]}>
                <Text style={[styles.text2, styles.textTypo]}>
                  이메일을 입력하세요.
                </Text>
              </View>
            </View>
            <View style={[styles.textfield, styles.textfieldFlexBox]}>
              <Text style={[styles.text1, styles.textTypo]}>연락처</Text>
              <View style={[styles.container, styles.btnSpaceBlock]}>
                <Text style={[styles.text2, styles.textTypo]}>
                  휴대폰 번호를 입력하세요.
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.textfield2, styles.textfieldFlexBox]}>
            <Text style={[styles.text1, styles.textTypo]}>문의내용</Text>
            <View style={[styles.frameView, styles.btnSpaceBlock]}>
              <Text style={[styles.text2, styles.textTypo]}>
                문의 내용을 입력해주세요.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <InquiryButton width={335} height={50} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: '#121212',
    flex: 1,
  },
  statusBarLayout: {
    width: 375,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backIcon: {
    position: 'absolute',
    left: 20,
  },
  textfieldFlexBox: {
    gap: 8,
    alignSelf: 'stretch',
  },
  textTypo: {
    textAlign: 'left',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    fontFamily: 'Pretendard',
  },
  btnSpaceBlock: {
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 22,
    fontFamily: 'Pretendard',
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  text1: {
    color: '#7c7c7c',
    textAlign: 'left',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    alignSelf: 'stretch',
  },
  text2: {
    color: '#7c7c7c',
    textAlign: 'left',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
  },
  wrapper: {
    borderColor: '#555',
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'stretch',
    backgroundColor: '#121212',
    flex: 1,
    alignItems: 'center',
  },
  textfield: {
    height: 78,
  },
  container: {
    borderColor: '#555',
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'stretch',
    backgroundColor: '#121212',
    flex: 1,
    alignItems: 'center',
  },
  textfieldParent: {
    gap: 16,
    alignSelf: 'stretch',
  },
  frameView: {
    borderColor: '#555',
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'stretch',
    backgroundColor: '#121212',
    flex: 1,
  },
  textfield2: {
    height: 300,
  },
  frameParent: {
    top: 100,
    left: 20,
    gap: 42,
    width: 335,
    position: 'absolute',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    width: 335,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    width: '100%',
    height: 812,
    overflow: 'hidden',
  },
});

export default Component;
