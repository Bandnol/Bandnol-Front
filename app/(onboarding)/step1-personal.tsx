import BackIcon from '@/assets/onboarding/Vector.svg';
import Logo from '@/assets/onboarding/logo.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typo';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function Step1Personal() {
  const router = useRouter();
  const [id, setId] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [birth, setBirth] = React.useState('');
  const [selectedGender, setSelectedGender] = React.useState<string | null>(
    null,
  );

  const isFormFilled = id && nickname && birth && selectedGender;

  const formatBirth = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)];
    return parts.filter(Boolean).join('-');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.viewBg}>
        <View style={styles.view}>
          <View style={styles.statusBarLayout}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 35 }} />

          <View style={styles.group}>
            <Logo width={44} height={31} />
            <View>
              <Text
                style={[
                  Typography.subtitle3,
                  { color: Colors.palette.Gray100, textAlign: 'center' },
                ]}
              >
                하루 한 곡, 음악 취향을 공유하고{'\n'}밴놀을 즐겨보세요!
              </Text>
            </View>
          </View>

          <View style={{ height: 35 }} />

          <View style={styles.frameParent}>
            <View style={styles.textfieldParent}>
              <View style={styles.textfield}>
                <Text
                  style={[
                    Typography.subtitle2,
                    { color: Colors.palette.Gray500 },
                  ]}
                >
                  아이디
                </Text>
                <View style={styles.frameGroupFlexBox}>
                  <View style={[{ flex: 1 }, styles.frameShadowBox]}>
                    <TextInput
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
                      value={id}
                      onChangeText={setId}
                      placeholder="아이디 입력"
                      placeholderTextColor={Colors.palette.Gray500}
                      numberOfLines={1}
                    />
                  </View>
                  <View
                    style={[
                      styles.frameView,
                      id
                        ? { backgroundColor: Colors.palette.point }
                        : { backgroundColor: Colors.palette.Gray800 },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.body2,
                        {
                          color: id
                            ? Colors.palette.white
                            : Colors.palette.Gray500,
                        },
                      ]}
                    >
                      중복확인
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.textfield}>
                <Text
                  style={[
                    Typography.subtitle2,
                    { color: Colors.palette.Gray500 },
                  ]}
                >
                  닉네임
                </Text>
                <View style={[styles.frameShadowBox]}>
                  <TextInput
                    style={[styles.inputText, { flex: 1, paddingVertical: 0 }]}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="닉네임 입력"
                    placeholderTextColor={Colors.palette.Gray500}
                    numberOfLines={1}
                  />
                </View>
              </View>
              <View style={styles.textfield}>
                <Text
                  style={[
                    Typography.subtitle2,
                    { color: Colors.palette.Gray500 },
                  ]}
                >
                  생년월일
                </Text>
                <View style={[styles.frameShadowBox]}>
                  <TextInput
                    style={[styles.inputText, { flex: 1, paddingVertical: 0 }]}
                    value={birth}
                    onChangeText={(text) => setBirth(formatBirth(text))}
                    placeholder="생년월일 8자리를 입력하세요"
                    placeholderTextColor={Colors.palette.Gray500}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={[styles.frameGroupFlexBox]}>
                <TouchableOpacity
                  onPress={() => setSelectedGender('여성')}
                  style={[
                    styles.wrapperShadowBox,
                    selectedGender === '여성' && {
                      backgroundColor: Colors.palette.point,
                    },
                  ]}
                >
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color:
                          selectedGender === '여성'
                            ? Colors.palette.white
                            : Colors.palette.Gray500,
                      },
                    ]}
                  >
                    여성
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedGender('남성')}
                  style={[
                    styles.wrapperShadowBox,
                    selectedGender === '남성' && {
                      backgroundColor: Colors.palette.point,
                    },
                  ]}
                >
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color:
                          selectedGender === '남성'
                            ? Colors.palette.white
                            : Colors.palette.Gray500,
                      },
                    ]}
                  >
                    남성
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={[
                styles.btn,
                isFormFilled && { backgroundColor: Colors.palette.point },
              ]}
              onPress={() => router.push('/step2-artist')}
            >
              <Text
                style={[
                  Typography.body2,
                  {
                    color: isFormFilled
                      ? Colors.palette.white
                      : Colors.palette.Gray400,
                  },
                ]}
              >
                다음
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  statusBarLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  frameShadowBox: {
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.palette.Gray700,
    borderStyle: 'solid',
    backgroundColor: Colors.palette.Gray800,
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
    alignItems: 'center',
  },
  textfield: {
    gap: 8,
    alignSelf: 'stretch',
  },
  group: {
    height: 88,
    gap: 17,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  inputText: {
    color: Colors.palette.white,
  },
  frameView: {
    width: 80,
    justifyContent: 'center',
    backgroundColor: Colors.palette.Gray700,
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
  wrapperShadowBox: {
    width: 163,
    justifyContent: 'center',
    backgroundColor: Colors.palette.Gray700,
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
  textfieldParent: {
    gap: 18,
    overflow: 'hidden',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.palette.Gray800,
    padding: 16,
    height: 50,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  frameParent: {
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    position: 'relative',
  },
  view: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
});
