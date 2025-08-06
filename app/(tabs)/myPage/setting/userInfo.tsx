import api from '@/store/api'; // <-- import your axios instance
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
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
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWTToken');
        console.log('토큰:', token);
        if (token) {
          const decoded: any = jwtDecode(token);
          console.log('디코딩된 토큰:', decoded);
          setEmail(decoded.email || '');
          setName(decoded.name || '');
        }
      } catch (error) {
        console.error('회원 정보 조회 에러:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const updateUserInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.error('토큰이 없습니다.');
        return;
      }
      const response = await api.patch(
        '/api/v1/users/me/profiles',
        {
          nickname: name,
          ownId: email,
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
      const data = response.data;
      console.log('회원 정보 수정 결과:', data);
      if (data.success) {
        alert('회원 정보가 수정되었습니다!');
      } else {
        alert(`수정 실패: ${data.error.message}`);
      }
    } catch (error) {
      console.error('회원 정보 수정 에러:', error);
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
              <Text style={styles.idtextValue}>sayoxx</Text>
              <TouchableOpacity onPress={updateUserInfo}>
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
