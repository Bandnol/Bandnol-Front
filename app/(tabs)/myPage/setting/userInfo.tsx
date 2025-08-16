import {
  logout as kakaoLogout,
  unlink as kakaoUnlink,
} from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import KaKao from '@/assets/icons/size_s/kakao.svg';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { useUpdateOwnId } from '@/hooks/useUpdateOwnId';
import api from '@/store/api';

export default function UserInfo() {
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ownId, setOwnId] = useState('');
  const [id, setId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [isIdValid, setIsIdValid] = useState(true);
  const [hasCheckedId, setHasCheckedId] = useState(false);
  const [idDirty, setIdDirty] = useState(false);

  const validateId = (value: string) => /^[a-zA-Z0-9._]{1,20}$/.test(value);

  const updateOwnId = useUpdateOwnId();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1) 로그인 시 SecureStore('user')에 저장해둔 사용자 정보 사용
        const saved = await SecureStore.getItemAsync('user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // 저장 형태가 { user: {...} } 와 { ... }가 섞여 있을 수 있어 머지 처리
            const root = parsed && typeof parsed === 'object' ? parsed : {};
            const inner =
              root && typeof (root as any).user === 'object'
                ? (root as any).user
                : {};
            const userObj = { ...root, ...inner } as any; // inner가 우선, 없으면 root 값 사용

            if (userObj?.email) setEmail(userObj.email);
            if (userObj?.name) setName(userObj.name);
            if (userObj?.ownId) setOwnId(userObj.ownId);
            if (userObj?.ownId) setId(userObj.ownId);

            console.log('[회원정보] SecureStore(user)에서 로드 완료');
            console.log('[회원정보] SecureStore raw:', saved);
            console.log('[회원정보] parsed:', parsed);
            console.log('[회원정보] merged userObj:', userObj);
            console.log(
              '[회원정보] email:',
              userObj?.email,
              'name:',
              userObj?.name,
              'ownId:',
              userObj?.ownId,
            );
            return; // 저장된 프로필을 우선 사용
          } catch (e) {
            console.log('[회원정보] 저장된 user 파싱 실패, 다음 단계로 진행');
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
        // (step 3: 서버 me 조회는 제거됨)
      } catch (error) {
        console.error('회원 정보 조회 에러:', error);
      }
    };
    fetchUserProfile();
  }, []);

  // 아이디 변경: 검증 → 중복체크 → 업데이트
  const handleChangeId = async () => {
    if (!id) return; // 공란이면 반응 없음 요구사항

    // 형식 검증
    const valid = validateId(id);
    setIsIdValid(valid);
    setIsDuplicate(null);
    setHasCheckedId(false);
    if (!valid) return; // 메시지는 상태에 따라 이미 표시됨

    // 중복 체크
    setIsChecking(true);
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      const res = await api.get('/api/v1/users/check-ownId', {
        params: { ownId: id },
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      const ok = !!res?.data?.success;
      setIsDuplicate(!ok); // success=true → 사용 가능 → duplicate=false
      setHasCheckedId(true);
      if (!ok) return; // 중복이면 여기서 끝, 메시지 표시

      // 사용 가능하면 실제 업데이트
      await updateOwnId(id, {
        onSuccess: (serverOwnId: string) => {
          setOwnId(serverOwnId);
        },
      });
    } catch (e) {
      console.error('아이디 중복확인 실패:', e);
      setIsDuplicate(true);
      setHasCheckedId(true);
    } finally {
      setIsChecking(false);
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
            <KaKao width={20} height={20} style={{ marginRight: 10 }} />
            <Text
              style={[styles.textValue, { flex: 1 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {email}
            </Text>
          </View>

          {/* 이름 */}
          <View style={styles.marginBlock}>
            <Text style={styles.label}>이름</Text>
            <View style={styles.textBox}>
              <Text
                style={[styles.textValue, { flex: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
          </View>

          {/* 아이디 */}
          <View style={styles.marginBlock}>
            <Text style={styles.label}>아이디</Text>
            <View style={styles.frameGroupFlexBox}>
              <View style={[{ flex: 1 }, styles.frameShadowBox]}>
                <TextInput
                  style={[styles.inputText, { flex: 1, paddingVertical: 0 }]}
                  value={id}
                  onChangeText={(text) => {
                    setIdDirty(true);
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
              <TouchableOpacity
                onPress={handleChangeId}
                disabled={!id || id === ownId || isChecking}
              >
                <View
                  style={[
                    styles.frameView,
                    !id || id === ownId || isChecking
                      ? { backgroundColor: Colors.palette.Gray800 }
                      : { backgroundColor: Colors.palette.point },
                  ]}
                >
                  <Text
                    style={[
                      Typography.body2,
                      {
                        color:
                          !id || id === ownId || isChecking
                            ? Colors.palette.Gray500
                            : Colors.palette.white,
                      },
                    ]}
                  >
                    변경
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 메시지 영역: 처음엔 표시하지 않고, 수정 이후에만 표시. 높이를 고정해 레이아웃 흔들림 방지 */}
            <View style={styles.messagePlaceholder}>
              {idDirty &&
                (!isIdValid && !!id ? (
                  <Text
                    style={[
                      Typography.body2,
                      { color: Colors.palette.point, alignSelf: 'flex-start' },
                    ]}
                  >
                    형식에 맞지 않는 아이디입니다.
                  </Text>
                ) : isIdValid && hasCheckedId && isDuplicate === true ? (
                  <Text
                    style={[
                      Typography.body2,
                      { color: Colors.palette.point, alignSelf: 'flex-start' },
                    ]}
                  >
                    이미 사용 중인 아이디입니다.
                  </Text>
                ) : isIdValid && hasCheckedId && isDuplicate === false ? (
                  <Text
                    style={[
                      Typography.body2,
                      { color: '#2C64FF', alignSelf: 'flex-start' },
                    ]}
                  >
                    사용 가능한 아이디입니다.
                  </Text>
                ) : null)}
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
        {/* 로그아웃 모달 */}
        <ConfirmModal
          visible={logoutVisible}
          variant="logout"
          headerText={'로그아웃하시겠습니까?'}
          onConfirm={async () => {
            try {
              try {
                await kakaoLogout();
              } catch {}
            } finally {
              try {
                await SecureStore.deleteItemAsync('JWTToken');
                await SecureStore.deleteItemAsync('JWTRefreshToken');
                await SecureStore.deleteItemAsync('user');
              } catch {}
              setLogoutVisible(false);
              router.push('/(auth)/splash');
            }
          }}
          onCancel={() => setLogoutVisible(false)}
        />
        {/* 회원탈퇴 모달 */}
        <ConfirmModal
          visible={withdrawVisible}
          variant="withdraw"
          headerText={
            '회원 탈퇴를 진행하게 되면\n지금까지의 모든 밴놀 기록이 삭제되며, 이는 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?'
          }
          onConfirm={async () => {
            try {
              try {
                await kakaoUnlink();
              } catch {}
            } finally {
              try {
                await SecureStore.deleteItemAsync('JWTToken');
                await SecureStore.deleteItemAsync('JWTRefreshToken');
                await SecureStore.deleteItemAsync('user');
              } catch {}
              setWithdrawVisible(false);
              router.push('/(auth)/splash');
            }
          }}
          onCancel={() => setWithdrawVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
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
    color: Colors.palette.Gray100,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    color: Colors.palette.Gray500,
    marginBottom: 8,
    ...Typography.body1,
  },
  textBox: {
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: Colors.palette.Gray900,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.palette.Gray600,
  },
  textBoxRow: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.palette.Gray900,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.palette.Gray600,
  },
  textValue: {
    color: Colors.palette.Gray400,
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.21,
  },
  idtextValue: {
    color: Colors.palette.Gray100,
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 20,
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
    color: Colors.palette.Gray600,
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
    color: Colors.palette.Gray600,
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
    color: Colors.palette.Gray600,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    paddingTop: 30,
    textAlign: 'center',
  },
  frameGroupFlexBox: {
    gap: 10,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
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
  messagePlaceholder: {
    minHeight: 20,
    // Ensures space is reserved even when no message is shown
  },
});
