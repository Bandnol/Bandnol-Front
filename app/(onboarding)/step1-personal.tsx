import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Logo from '@/assets/onboarding/logo.svg';
import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios instance 불러오기
import { useAuth as useAuthContext } from '@/hooks/useAuthContext';
import { useAuth as useAuthApi, SignupBody } from '@/hooks/useAuth';

export default function Step1Personal() {
  const router = useRouter();
  const { name: authName, email: authEmail } = useAuthContext();
  // params are not used for name/email anymore
  // const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const [email, setEmail] = React.useState(authEmail || '');
  const [id, setId] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [birth, setBirth] = React.useState('');
  const [selectedGender, setSelectedGender] = React.useState<string | null>(
    null,
  );
  const genderValue = selectedGender === '여성' ? 'WOMAN' : 'MAN';
  const [isChecking, setIsChecking] = React.useState(false);
  const [isDuplicate, setIsDuplicate] = React.useState<boolean | null>(null);
  const [isIdValid, setIsIdValid] = React.useState(true);
  const [hasCheckedId, setHasCheckedId] = React.useState(false);
  const [isBackModalVisible, setIsBackModalVisible] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const isFormFilled = Boolean(
    id &&
      password &&
      confirmPassword &&
      nickname &&
      email &&
      birth &&
      selectedGender,
  );

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

    setIsChecking(true);
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      const response = await api.get('/api/v1/users/check-ownId', {
        params: { ownId: id },
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.data.success) {
        setIsDuplicate(false); // 사용 가능
      } else {
        setIsDuplicate(true); // 중복
      }
      setHasCheckedId(true);
    } catch (error) {
      console.error('아이디 중복확인 실패:', error);
      setIsDuplicate(true);
      setHasCheckedId(true);
    } finally {
      setIsChecking(false);
    }
  };
  const { signup, login } = useAuthApi();

  const onSubmit = async () => {
    // Basic validations
    if (!isFormFilled) return;
    if (!hasCheckedId || !isIdValid || isDuplicate) return;
    if (password !== confirmPassword) return;

    const body: SignupBody = {
      ownId: id,
      password,
      nickname,
      email,
      gender: genderValue,
      birth, // already formatted as YYYY-MM-DD
    };

    try {
      // 1. 회원가입 먼저 진행
      const userId = await signup(body);
      console.log('회원가입 성공, userId:', userId);
      
      try {
        // 2. 회원가입 성공 후 자동 로그인
        await login({ ownId: id, password });
        console.log('자동 로그인 성공');
        
        // 3. 다음 온보딩 단계로 이동 (아티스트 선택)
        router.push('/step2-artist');
      } catch (loginError: any) {
        console.error('자동 로그인 실패:', loginError?.message || loginError);
        // 회원가입은 성공했지만 로그인 실패 - 로그인 화면으로 이동하거나 재시도
        Alert.alert('로그인 실패', '회원가입은 완료되었지만 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (signupError: any) {
      console.error('회원가입 실패:', signupError?.message || signupError);
      Alert.alert('회원가입 실패', '회원가입에 실패했습니다: ' + (signupError?.message || '알 수 없는 오류'));
    }
  };

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        {/* Fixed header at the top */}
        <StatusBarHeader onBackPress={() => setIsBackModalVisible(true)} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            horizontal={false}
          >
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
                {/* 아이디 */}
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
                {/* 비밀번호 */}
                <View style={styles.textfield}>
                  <Text
                    style={[
                      Typography.subtitle2,
                      { color: Colors.palette.Gray500 },
                    ]}
                  >
                    비밀번호
                  </Text>
                  <View style={[styles.frameShadowBox]}>
                    <TextInput
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="비밀번호 입력"
                      placeholderTextColor={Colors.palette.Gray500}
                      secureTextEntry
                    />
                  </View>
                </View>
                {/* 비밀번호 확인 */}
                <View style={styles.textfield}>
                  <Text
                    style={[
                      Typography.subtitle2,
                      { color: Colors.palette.Gray500 },
                    ]}
                  >
                    비밀번호 확인
                  </Text>
                  <View style={[styles.frameShadowBox]}>
                    <TextInput
                      style={[
                        styles.inputText,
                        { flex: 1, paddingVertical: 0 },
                      ]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="비밀번호 확인 입력"
                      placeholderTextColor={Colors.palette.Gray500}
                      secureTextEntry
                    />
                  </View>
                </View>
                {/* 비밀번호 불일치 에러 메시지 */}
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <Text
                      style={[
                        Typography.body2,
                        {
                          color: Colors.palette.point,
                          alignSelf: 'flex-start',
                        },
                      ]}
                    >
                      비밀번호가 일치하지 않습니다.
                    </Text>
                  )}
                {/* 닉네임 */}
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
                {/* 이메일 */}
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
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      placeholder="이메일"
                      placeholderTextColor={Colors.palette.Gray500}
                      numberOfLines={1}
                    />
                  </View>
                </View>
                {/* 생년월일 */}
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
                {/* 젠더 선택 */}
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
          onPress={onSubmit}
          enabled={Boolean(
            isFormFilled &&
              hasCheckedId &&
              isIdValid &&
              isDuplicate === false &&
              password === confirmPassword,
          )}
        />
        <LinearGradient
          colors={['transparent', Colors.palette.Gray900]}
          style={styles.fadeOverlay}
        />
        {/* 뒤로가기 확인 모달 */}
        <Modal
          transparent
          animationType="fade"
          visible={isBackModalVisible}
          onRequestClose={() => setIsBackModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.withdrawWrapper}>
              {/* 상단 텍스트 박스 */}
              <View style={styles.withdrawHeaderBox}>
                <Text style={styles.withdrawHeaderText}>
                  <Text>현재까지 작성한 내용이 초기화되고{'\n'}</Text>
                  <Text>처음 화면으로 돌아갑니다.</Text>
                  정말 나가시겠습니까?
                </Text>
              </View>

              {/* 확인 버튼: splash로 이동 */}
              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={() => {
                  setIsBackModalVisible(false);
                  router.push('/(auth)/splash');
                }}
              >
                <Text style={styles.logoutConfirmText}>확인</Text>
              </TouchableOpacity>

              {/* 취소 */}
              <TouchableOpacity
                style={styles.logoutCancelWrapper}
                onPress={() => setIsBackModalVisible(false)}
              >
                <Text style={styles.logoutCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 16,
    minHeight: 50,
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
  }, // 모달 css
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawWrapper: {
    width: 324,
    height: 213,
    alignItems: 'center',
  },
  withdrawHeaderBox: {
    width: 324,
    paddingHorizontal: 16,
    paddingVertical: 40,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  withdrawHeaderText: {
    color: '#F4F4F4',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: -0.48,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
  },
  logoutConfirmBtn: {
    width: 324,
    height: 50,
    backgroundColor: '#FB4932',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutConfirmText: {
    color: '#FFF',
    ...Typography.subtitle3,
  },
  logoutCancelWrapper: {
    marginTop: 25,
  },
  logoutCancelText: {
    ...Typography.subtitle3,
    color: '#FFF',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
