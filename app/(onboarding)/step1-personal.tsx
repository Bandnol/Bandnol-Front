import Logo from '@/assets/onboarding/logo.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios 인스턴스
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
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
  const [isChecking, setIsChecking] = React.useState(false);
  // Add isDuplicate state
  const [isDuplicate, setIsDuplicate] = React.useState<boolean | null>(null);
  const [isIdValid, setIsIdValid] = React.useState(true);
  const [hasCheckedId, setHasCheckedId] = React.useState(false);

  const isFormFilled = id && nickname && birth && selectedGender;

  const validateId = (id: string) => {
    return /^[a-zA-Z0-9._]{1,20}$/.test(id);
  };

  const formatBirth = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)];
    return parts.filter(Boolean).join('-');
  };

  const handleCheckId = async () => {
    if (!id) return;
    const valid = validateId(id);
    setIsIdValid(valid);
    setHasCheckedId(false);
    setIsDuplicate(null);
    if (!valid) return;
    try {
      setIsChecking(true);
      const res = await api.get('/api/v1/users/check-ownId', {
        params: { ownId: id },
      });
      console.log('중복확인 응답:', res.data);
      // Update isDuplicate based on API response
      setIsDuplicate(!res.data.success);
      setHasCheckedId(true);
    } catch (err) {
      console.error('중복확인 오류:', err);
      setIsDuplicate(true);
      setHasCheckedId(true);
    } finally {
      setIsChecking(false);
    }
  };

  const onNextPress = () => {
    /* api 연동 후
    if (!isFormFilled || !hasCheckedId || !isIdValid || isDuplicate) {
      return;
    }
      */
    router.push('/step2-artist');
  };

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            horizontal={false}
          >
            <StatusBarHeader />

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
                    이름
                  </Text>
                  <View style={[styles.frameShadowBox]}>
                    <TextInput
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
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
                    이메일
                  </Text>
                  <View style={[styles.frameShadowBox]}>
                    <TextInput
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
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
                        onChangeText={(text) => {
                          setId(text);
                          const valid = validateId(text);
                          setIsIdValid(valid);
                          setHasCheckedId(false);
                          setIsDuplicate(null);
                        }}
                        placeholder="아이디 입력"
                        placeholderTextColor={Colors.palette.Gray500}
                        numberOfLines={1}
                      />
                    </View>
                    <TouchableOpacity onPress={handleCheckId} disabled={!id}>
                      <View
                        style={[
                          styles.frameView,
                          id && validateId(id)
                            ? { backgroundColor: Colors.palette.point }
                            : { backgroundColor: Colors.palette.Gray800 },
                        ]}
                      >
                        <Text
                          style={[
                            Typography.body2,
                            {
                              color:
                                id && validateId(id)
                                  ? Colors.palette.white
                                  : Colors.palette.Gray500,
                            },
                          ]}
                        >
                          중복확인
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* 아이디 중복/형식 메시지 */}
                {!isIdValid && !!id && (
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color: Colors.palette.point,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    아이디는 영문, 숫자, 점(.), 밑줄(_)만 가능하며 최대
                    20자입니다.
                  </Text>
                )}
                {/* 중복확인 필요 메시지는 형식이 맞고, 중복확인 전일 때만 */}
                {isIdValid && !!id && !hasCheckedId && (
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color: Colors.palette.Gray500,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    아이디 중복 확인이 필요합니다.
                  </Text>
                )}
                {/* 중복확인 결과 메시지: 형식이 맞을 때만 표시 */}
                {isIdValid && hasCheckedId && isDuplicate === true && (
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color: Colors.palette.point,
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    이미 사용중인 아이디입니다.
                  </Text>
                )}
                {isIdValid && hasCheckedId && isDuplicate === false && (
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color: '#2C64FF',
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    사용 가능한 아이디입니다.
                  </Text>
                )}
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
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
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
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
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
          </ScrollView>
        </TouchableWithoutFeedback>
        <BottomNextButton
          onPress={onNextPress}
          /*enabled={Boolean(
            isFormFilled && isIdValid && !isDuplicate && hasCheckedId,
          )}*/
          enabled={true}
        />
        <LinearGradient
          colors={['transparent', Colors.palette.Gray900]}
          style={styles.fadeOverlay}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 150,
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
  frameParent: {
    paddingHorizontal: 20,
    flex: 1,
    position: 'relative',
  },
  view: {
    width: '100%',
    flex: 1,
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
