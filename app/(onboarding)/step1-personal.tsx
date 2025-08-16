import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import {
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
import { useAuth } from '@/hooks/useAuthContext';
import api from '@/store/api'; // axios instance 불러오기

export default function Step1Personal() {
  const router = useRouter();
  const { name: authName, email: authEmail } = useAuth();
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const name = params.name || authName;
  const email = params.email || authEmail;
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

  const onNextPress = async () => {
    if (!isFormFilled || !hasCheckedId || !isIdValid || isDuplicate) return;

    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      console.log('PATCH 요청 데이터:', {
        ownId: id,
        nickname,
        gender: genderValue,
        birth,
      });
      console.log('Authorization:', token);

      await api.patch(
        '/api/v1/users/me/profiles',
        {
          ownId: id,
          nickname,
          gender: genderValue,
          birth,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        },
      );

      // SecureStore에 user 정보 업데이트
      const userStr = await SecureStore.getItemAsync('user');
      const user = userStr ? JSON.parse(userStr) : {};
      await SecureStore.setItemAsync(
        'user',
        JSON.stringify({
          ...user,
          ownId: id,
          nickname,
          gender: genderValue,
          birth,
        }),
      );

      router.push('/step2-artist');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    }
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
            <StatusBarHeader onBackPress={() => setIsBackModalVisible(true)} />

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
                      value={name}
                      editable={false}
                      placeholder="이름"
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
                      value={email}
                      editable={false}
                      placeholder="이메일"
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
        <BottomNextButton onPress={onNextPress} enabled={true} />
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
