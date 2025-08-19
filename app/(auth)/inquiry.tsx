import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InquiryButton from '@/assets/auth/inquiry/btn.svg';
import BackIcon from '@/assets/auth/inquiry/Vector.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api'; // axios 인스턴스
const Component = () => {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const goBackSmart = () => {
    if (returnTo && typeof returnTo === 'string') {
      router.replace(returnTo as any);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/myPage' as any);
    }
  };

  const handleSubmit = async () => {
    // 입력값 유효성 검사
    if (!name.trim() || !email.trim() || !content.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(email)) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }

    try {
      const res = await api.post('/api/v1/users/inquiry', {
        name,
        email,
        content,
      });
      alert('문의가 성공적으로 전송되었습니다.');
      goBackSmart();
    } catch (error: any) {
      console.error('문의 전송 실패:', error);
      alert('문의 전송에 실패했어요. 다시 시도해주세요.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.viewBg}>
        <View style={[styles.view, styles.viewBg]}>
          <View style={styles.statusBarLayout}>
            <TouchableOpacity onPress={goBackSmart} style={styles.backIcon}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.text}>문의하기</Text>
            </View>
          </View>

          <View style={styles.frameParent}>
            <Text style={[Typography.body2, { color: Colors.palette.Gray100 }]}>
              {`밴놀 팀에서 문의사항을 확인한 후,
통상 1~3일 내에 이메일로 답변 드립니다.`}
            </Text>
            <View style={styles.textfieldParent}>
              <View style={[styles.textfield, styles.textfieldFlexBox]}>
                <Text style={[styles.text1, styles.textTypo]}>이름</Text>
                <View style={[styles.wrapper, styles.btnSpaceBlock]}>
                  <TextInput
                    placeholder="이름을 입력하세요."
                    placeholderTextColor="#7c7c7c"
                    style={{
                      flex: 1,
                      width: '100%',
                      color: Colors.palette.white,
                    }}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
              <View style={[styles.textfield, styles.textfieldFlexBox]}>
                <Text style={[styles.text1, styles.textTypo]}>이메일</Text>
                <View style={[styles.container, styles.btnSpaceBlock]}>
                  <TextInput
                    placeholder="이메일을 입력하세요."
                    placeholderTextColor="#7c7c7c"
                    style={{
                      flex: 1,
                      width: '100%',
                      color: Colors.palette.white,
                    }}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    multiline={false}
                    numberOfLines={1}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.textfield2, styles.textfieldFlexBox]}>
              <Text style={[styles.text1, styles.textTypo]}>문의내용</Text>
              <View style={[styles.frameView, styles.btnSpaceBlock]}>
                <TextInput
                  placeholder="문의 내용을 입력해주세요."
                  placeholderTextColor="#7c7c7c"
                  style={{
                    flex: 1,
                    width: '100%',
                    color: Colors.palette.white,
                    textAlignVertical: 'top',
                  }}
                  value={content}
                  onChangeText={setContent}
                  multiline
                />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.buttonWrapper}>
            <InquiryButton width={335} height={50} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    ...Typography.subtitle2,
    color: Colors.palette.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  text1: {
    color: Colors.palette.Gray500,
    ...Typography.body2,
  },
  wrapper: {
    borderColor: Colors.palette.Gray600,
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
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
    alignItems: 'center',
  },
  textfield: {
    height: 78,
  },
  container: {
    borderColor: Colors.palette.Gray600,
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
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
    alignItems: 'center',
  },
  textfieldParent: {
    gap: 16,
    alignSelf: 'stretch',
  },
  frameView: {
    borderColor: Colors.palette.Gray600,
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
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  textfield2: {
    height: 250,
  },
  frameParent: {
    top: 100,
    paddingHorizontal: 20,
    gap: 30,
    width: '100%',
    position: 'absolute',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 26,
    paddingHorizontal: 20,
    width: '100%',
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
