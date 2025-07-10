import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import BackIcon from '@/assets/onboarding/Vector.svg';
import Logo from '@/assets/onboarding/logo.svg';
import { useRouter } from 'expo-router';

export default function Step1Personal() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [birth, setBirth] = React.useState('');
  const [selectedGender, setSelectedGender] = React.useState<string | null>(
    null,
  );

  const formatBirth = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)];
    return parts.filter(Boolean).join('-');
  };

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.view}>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={24} height={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.group}>
          <Logo width={44} height={31} style={styles.icon1} />
          <View style={styles.wrapper}>
            <Text style={styles.text}>
              하루 한 곡, 음악 취향을 공유하고{'\n'}밴놀을 즐겨보세요!
            </Text>
          </View>
        </View>
        <View style={styles.frameParent}>
          <View style={styles.textfieldParent}>
            <View style={styles.textfield}>
              <Text style={[styles.text1, styles.textTypo]}>이름</Text>
              <View style={[styles.container, styles.frameShadowBox]}>
                <TextInput
                  style={[styles.inputText, styles.textTypo, { flex: 1 }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="이름 입력"
                  placeholderTextColor="#7c7c7c"
                />
              </View>
            </View>
            <View style={styles.textfield}>
              <Text style={[styles.text1, styles.textTypo]}>닉네임</Text>
              <View style={styles.frameGroupFlexBox}>
                <View style={[styles.frame, styles.frameShadowBox]}>
                  <TextInput
                    style={[styles.inputText, styles.textTypo, { flex: 1 }]}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="닉네임 입력"
                    placeholderTextColor="#7c7c7c"
                  />
                </View>
                <View
                  style={[
                    styles.frameView,
                    nickname ? { backgroundColor: '#fb4932' } : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.text4,
                      styles.textTypo,
                      nickname ? { color: '#fff' } : {},
                    ]}
                  >
                    중복확인
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.textfield}>
              <Text style={[styles.text1, styles.textTypo]}>생년월일</Text>
              <View style={[styles.wrapper1, styles.frameShadowBox]}>
                <TextInput
                  style={[styles.inputText, styles.textTypo, { flex: 1 }]}
                  value={birth}
                  onChangeText={(text) => setBirth(formatBirth(text))}
                  placeholder="생년월일 8자리를 입력하세요"
                  placeholderTextColor="#7c7c7c"
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View style={[styles.component2, styles.frameGroupFlexBox]}>
              <TouchableOpacity
                onPress={() => setSelectedGender('여성')}
                style={[
                  styles.wrapperShadowBox,
                  selectedGender === '여성' && { backgroundColor: '#fb4932' },
                ]}
              >
                <Text
                  style={[
                    styles.text4,
                    styles.textTypo,
                    selectedGender === '여성' && { color: '#fff' },
                  ]}
                >
                  여성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedGender('남성')}
                style={[
                  styles.wrapperShadowBox,
                  selectedGender === '남성' && { backgroundColor: '#fb4932' },
                ]}
              >
                <Text
                  style={[
                    styles.text4,
                    styles.textTypo,
                    selectedGender === '남성' && { color: '#fff' },
                  ]}
                >
                  남성
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/step2-artist')}
          >
            <Text style={[styles.text10, styles.textTypo]}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  textTypo: {
    textAlign: 'left',
    fontFamily: 'Pretendard',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
  },
  frameShadowBox: {
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#555',
    borderStyle: 'solid',
    backgroundColor: '#121212',
    borderRadius: 10,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameGroupFlexBox: {
    gap: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  icon: {
    overflow: 'hidden',
  },
  iconWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  text: {
    color: '#f4f4f4',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'stretch',
  },
  wrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  group: {
    height: 88,
    gap: 17,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  text1: {
    color: '#7c7c7c',
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  container: {
    alignSelf: 'stretch',
  },
  textfield: {
    gap: 8,
    alignSelf: 'stretch',
  },
  text4: {
    color: '#7c7c7c',
    textAlign: 'left',
  },
  frame: {
    flex: 1,
  },
  frameView: {
    width: 80,
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper1: {
    alignSelf: 'stretch',
  },
  wrapperShadowBox: {
    width: 163,
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    shadowOpacity: 1,
    elevation: 1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  component2: {
    alignItems: 'center',
  },
  textfieldParent: {
    gap: 18,
    overflow: 'hidden',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  text10: {
    color: '#b3b3b3',
    fontWeight: '600',
    textAlign: 'left',
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
  frameParent: {
    width: 335,
    gap: 123,
    flex: 1,
    position: 'relative',
  },
  view: {
    width: '100%',
    gap: 35,
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    color: '#fff',
  },
});
