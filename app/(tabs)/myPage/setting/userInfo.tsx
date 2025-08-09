import api from '@/store/api'; // <-- import your axios instance
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/typography';

export default function UserInfo() {
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  // State variables for email and name
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ownId, setOwnId] = useState('');
  const [editOwnIdVisible, setEditOwnIdVisible] = useState(false);
  const [ownIdInput, setOwnIdInput] = useState('');
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1) 로그인 시 저장해 둔 프로필 먼저 시도 (oauth 콜백 응답 그대로 저장했다고 가정)
        const saved = await SecureStore.getItemAsync('UserProfile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // 저장 형태가 { user: { name, email } } 또는 { name, email } 둘 다 대응
            const userObj = parsed?.user ?? parsed;
            if (userObj?.email) setEmail(userObj.email);
            if (userObj?.name) setName(userObj.name);
            if (userObj?.ownId) setOwnId(userObj.ownId);
            console.log('[회원정보] SecureStore(UserProfile)에서 로드 완료');
            return; // 저장된 프로필을 우선 사용
          } catch (e) {
            console.log(
              '[회원정보] 저장된 UserProfile 파싱 실패, 다음 단계로 진행',
            );
          }
        }

        // 2) JWT에서 가능한 정보만 추출 (현재 토큰에는 id/iat/exp만 있는 상태)
        const token = await SecureStore.getItemAsync('JWTToken');
        console.log('토큰:', token);
        if (token) {
          const decoded: any = jwtDecode(token);
          console.log('디코딩된 토큰:', decoded);
          // 토큰에 email/name이 없다면 빈 값 유지
          if (decoded?.email) setEmail(decoded.email);
          if (decoded?.name) setName(decoded.name);
        }

        // 3) 마지막 시도로 서버에서 me 정보 조회 (GET 지원 시)
        //    서버가 GET /api/v1/users/me/profiles 를 제공하지 않으면 이 호출은 실패해도 무시합니다.
        if (token) {
          try {
            const res = await api.get('/api/v1/users/me/profiles', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const payload = res?.data?.data ?? res?.data; // 백엔드 응답 형태 유연 대응
            const userObj = payload?.user ?? payload;
            if (userObj?.email) setEmail(userObj.email);
            if (userObj?.name) setName(userObj.name);
            if (userObj?.ownId) setOwnId(userObj.ownId);
            if (userObj?.email || userObj?.name) {
              console.log('[회원정보] 서버에서 me 프로필 불러오기 성공');
            }
          } catch (e) {
            const status = (e as any)?.response?.status;
            if (status !== 404) {
              const msg = e instanceof Error ? e.message : String(e);
              console.log(
                '[회원정보] 서버 me 프로필 조회 실패(무시 가능):',
                msg,
              );
            }
          }
        }
      } catch (error) {
        console.error('회원 정보 조회 에러:', error);
      }
    };
    fetchUserProfile();
  }, []);

  // 회원 정보 수정 API 호출 (명세 기반 에러 코드 + SecureStore 프로필 동기화)
  const updateUserInfo = async (overrides?: {
    ownId?: string;
    name?: string;
  }) => {
    const nextOwnId = (overrides?.ownId ?? ownId).trim();
    const nextName = (overrides?.name ?? name).trim();
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.error('토큰이 없습니다.');
        Alert.alert(
          '로그인이 필요해요',
          '세션이 만료되었거나 로그인 정보가 없어요. 다시 로그인해 주세요.',
        );
        return;
      }

      const response = await api.patch(
        '/api/v1/users/me/profiles',
        {
          // ⚠️ 서버 스펙에 맞춰 필드 전송
          nickname: nextName,
          ownId: nextOwnId,
          gender: 'WOMAN',
          birth: '2004-03-08',
          recomsTime: '09:00',
          bio: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response?.data;
      console.log('회원 정보 수정 결과:', data);

      if (data?.success) {
        // 로컬 상태 업데이트
        setOwnId(nextOwnId);
        setName(nextName);

        // SecureStore(UserProfile) 동기화: 저장된 프로필이 있다면 ownId/name 갱신
        try {
          const saved = await SecureStore.getItemAsync('UserProfile');
          if (saved) {
            const parsed = JSON.parse(saved);
            const userObj = parsed?.user ?? parsed ?? {};
            const updated = {
              ...parsed,
              user: {
                ...userObj,
                ownId: nextOwnId,
                name: nextName,
              },
            };
            await SecureStore.setItemAsync(
              'UserProfile',
              JSON.stringify(updated),
            );
          }
        } catch (e) {
          console.log('[회원정보] UserProfile 동기화 실패(무시 가능)');
        }

        Alert.alert('완료', '회원 정보가 수정되었습니다!');
        return;
      }

      // success=false 인 경우 서버의 에러코드를 점검
      const code = data?.error?.code;
      const message = data?.error?.message;

      if (
        typeof code === 'string' &&
        (code.includes('U1000') || code.includes('R1000'))
      ) {
        // 날짜/시간 형식 오류
        const parts: string[] = [];
        if (code.includes('U1000'))
          parts.push('생년월일 형식(YYYY-MM-DD)을 확인해 주세요.');
        if (code.includes('R1000'))
          parts.push('추천 시간 형식(HH:mm)을 확인해 주세요.');
        Alert.alert('형식 오류', parts.join('\n'));
        return;
      }

      if (code === 'T1201') {
        Alert.alert('세션 만료', '토큰을 확인해 주세요. 다시 로그인해 주세요.');
        return;
      }

      if (code === 'E1300') {
        Alert.alert(
          '수정할 데이터 없음',
          '변경된 내용이 없어요. 값을 수정한 뒤 다시 시도해 주세요.',
        );
        return;
      }

      // 그 외 서버 에러 메시지 처리
      Alert.alert('수정 실패', message || '알 수 없는 오류가 발생했어요.');
    } catch (error: any) {
      console.error('회원 정보 수정 에러:', error);
      // Axios 에러 응답 분기 (HTTP 상태코드 기반)
      const status = error?.response?.status;
      const code = error?.response?.data?.error?.code;
      const message = error?.response?.data?.error?.message;

      if (
        status === 400 ||
        (typeof code === 'string' &&
          (code.includes('U1000') || code.includes('R1000')))
      ) {
        const parts: string[] = [];
        if (typeof code === 'string' && code.includes('U1000'))
          parts.push('생년월일 형식(YYYY-MM-DD)을 확인해 주세요.');
        if (typeof code === 'string' && code.includes('R1000'))
          parts.push('추천 시간 형식(HH:mm)을 확인해 주세요.');
        Alert.alert(
          '형식 오류',
          parts.join('\n') || message || '날짜/시간 형식을 확인해 주세요.',
        );
        return;
      }

      if (status === 401 || code === 'T1201') {
        Alert.alert('세션 만료', '토큰을 확인해 주세요. 다시 로그인해 주세요.');
        return;
      }

      if (status === 404 || code === 'E1300') {
        Alert.alert(
          '수정할 데이터 없음',
          '변경된 내용이 없어요. 값을 수정한 뒤 다시 시도해 주세요.',
        );
        return;
      }

      Alert.alert(
        '네트워크 오류',
        '일시적인 문제일 수 있어요. 잠시 후 다시 시도해 주세요.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/* Top Nav Bar */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/myPage/setting/appSetting')}
            style={styles.backBtn}
          >
            <BackArrow width={9} height={16} />
          </TouchableOpacity>
          <Text style={styles.title}>회원 정보</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={styles.content}>
          {/* 연결된 소셜 로그인 계정 */}
          <Text style={styles.label}>연결된 소셜 로그인 계정</Text>
          <View style={styles.textBox}>
            <Image
              source={{ uri: 'https://placehold.co/24x24' }} // 임시 이미지
              style={styles.icon}
            />
            <Text style={styles.textValue}>{email}</Text>
          </View>

          {/* 이름 */}
          <View style={styles.marginBlock}>
            <Text style={styles.label}>이름</Text>
            <View style={styles.textBox}>
              <Text style={styles.textValue}>{name}</Text>
            </View>
          </View>

          {/* 아이디 */}
          <View style={styles.marginBlock}>
            <Text style={styles.label}>아이디</Text>
            <View style={styles.textBoxRow}>
              <Text style={styles.idtextValue}>{ownId || '-'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setOwnIdInput(ownId);
                  setEditOwnIdVisible(true);
                }}
              >
                <Text style={styles.linkText}>변경</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 로그아웃 */}
          <TouchableOpacity
            style={styles.marginBlock}
            onPress={() => setLogoutVisible(true)}
          >
            <Text style={styles.signout}>로그아웃</Text>
          </TouchableOpacity>

          {/* 회원탈퇴 */}
          <TouchableOpacity onPress={() => setWithdrawVisible(true)}>
            <Text style={styles.withdrawal}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
        {/* 아이디 수정 모달 */}
        <Modal
          transparent
          animationType="fade"
          visible={editOwnIdVisible}
          onRequestClose={() => setEditOwnIdVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.withdrawWrapper}>
              <View style={styles.withdrawHeaderBox}>
                <Text style={styles.withdrawHeaderText}>
                  아이디를 입력해 주세요
                </Text>
              </View>
              <View
                style={{
                  width: 324,
                  backgroundColor: '#333',
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                }}
              >
                <TextInput
                  value={ownIdInput}
                  onChangeText={setOwnIdInput}
                  placeholder="아이디"
                  placeholderTextColor="#888"
                  style={{
                    height: 44,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#555',
                    paddingHorizontal: 12,
                    color: '#F4F4F4',
                    backgroundColor: '#121212',
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={async () => {
                  const trimmed = ownIdInput.trim();
                  if (!trimmed) {
                    Alert.alert('입력 필요', '아이디를 입력해 주세요.');
                    return;
                  }
                  setEditOwnIdVisible(false);
                  await updateUserInfo({ ownId: trimmed });
                }}
              >
                <Text style={styles.logoutConfirmText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutCancelWrapper}
                onPress={() => setEditOwnIdVisible(false)}
              >
                <Text style={styles.logoutCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* 로그아웃 모달 */}
        <Modal
          transparent
          animationType="fade"
          visible={logoutVisible}
          onRequestClose={() => setLogoutVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.logoutWrapper}>
              {/* 1. 상단 텍스트 박스 */}
              <View style={styles.logoutHeaderBox}>
                <Text style={styles.logoutHeaderText}>
                  로그아웃하시겠습니까?
                </Text>
              </View>

              {/* 2. 확인 버튼 */}
              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={() => {
                  setLogoutVisible(false);
                  router.push('/(auth)/splash');
                }}
              >
                <Text style={styles.logoutConfirmText}>확인</Text>
              </TouchableOpacity>

              {/* 3. 밑줄 텍스트 (취소) */}
              <TouchableOpacity
                style={styles.logoutCancelWrapper}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.logoutCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* 회원탈퇴 모달 */}
        <Modal
          transparent
          animationType="fade"
          visible={withdrawVisible}
          onRequestClose={() => setWithdrawVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.withdrawWrapper}>
              {/* 1. 상단 텍스트 박스 */}
              <View style={styles.withdrawHeaderBox}>
                <Text style={styles.withdrawHeaderText}>
                  <Text>회원 탈퇴를 진행하게 되면{'\n'}</Text>
                  <Text style={styles.boldText}>
                    지금까지의 모든 밴놀 기록이 삭제되며,{'\n'}
                    이는 복구할 수 없습니다.{'\n'}
                  </Text>
                  정말 탈퇴하시겠습니까?
                </Text>
              </View>

              {/* 2. 확인 버튼 */}
              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={() => {
                  setWithdrawVisible(false);
                  router.push('/(auth)/splash');
                }}
              >
                <Text style={styles.logoutConfirmText}>확인</Text>
              </TouchableOpacity>

              {/* 3. 취소 텍스트 */}
              <TouchableOpacity
                style={styles.logoutCancelWrapper}
                onPress={() => setWithdrawVisible(false)}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topNavBar: {
    width: '100%',
    height: 62,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...Typography.subtitle1B,
    color: '#F4F4F4',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    color: '#7C7C7C',
    marginBottom: 8,
    ...Typography.body1,
  },
  textBox: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  textBoxRow: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  textValue: {
    color: '#555',
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 140,
    letterSpacing: -0.21,
  },
  idtextValue: {
    color: '#F4F4F4',
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 140,
    letterSpacing: -0.21,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  linkText: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 19.6,
    letterSpacing: -0.21,
    color: '#555',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  marginBlock: {
    marginTop: 10,
  },
  signout: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 19.6,
    letterSpacing: -0.21,
    color: '#555',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    paddingTop: 20,
    textAlign: 'center',
  },
  withdrawal: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 19.6,
    letterSpacing: -0.21,
    color: '#555',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    paddingTop: 30,
    textAlign: 'center',
  }, // ----로그아웃 모달 ------
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutWrapper: {
    width: 324,
    height: 194,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoutHeaderBox: {
    width: 324,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutHeaderText: {
    color: '#FFF',
    fontFamily: 'Pretendard',
    fontSize: 16,
    letterSpacing: -0.48,
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
  // ----회원탈퇴 모달 ------
  withdrawWrapper: {
    width: 324,
    height: 251,
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
    fontWeight: 400,
    letterSpacing: -0.48,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
  },
  boldText: {
    color: '#F4F4F4',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 700,
    letterSpacing: -0.48,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
  },
});
