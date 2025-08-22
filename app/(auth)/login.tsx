import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setRecomsAuthToken } from '@/api/recoms';
import * as SecureStore from 'expo-secure-store';

import Logo from '@/assets/auth/splash/logo.svg';
import LoginIcon from '@/assets/auth/splash/loginIcon.svg';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';

export const options = {
  headerShown: false,
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [ownId, setOwnId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBackModalVisible, setIsBackModalVisible] = useState(false);

  const onSubmit = async () => {
    console.log('[Login] submit', ownId);
    if (!ownId || !password) {
      Alert.alert('로그인', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const loginResult = await login({ ownId, password });
      console.log('[Login] success → /(tabs)/home');

      // 토큰 추출 (반환 형태에 따라 유연하게)
      const accessToken =
        (loginResult as any)?.accessToken ??
        (loginResult as any)?.data?.accessToken ??
        (loginResult as any)?.token ??
        (await SecureStore.getItemAsync('access_token')); // 훅 내부에서 이미 저장했다면 복원

      if (accessToken) {
        // recoms API에 토큰 주입 + (선택) 저장
        setRecomsAuthToken(accessToken);
        await SecureStore.setItemAsync('access_token', accessToken);
      } else {
        console.warn('[Login] accessToken not found from login()');
      }

      router.replace('/(tabs)/home');
    } catch (e: any) {
      console.log('[Login] error', e?.message || e);
      Alert.alert(
        '로그인 실패',
        e?.message || '아이디/비밀번호를 확인해주세요.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <StatusBarHeader onBackPress={() => router.back()} />
          <View style={styles.content}>
            <View style={styles.logo}>
              <Logo width={100} height={125} />
            </View>
            <Text
              style={styles.text}
            >{`하루 한 곡, 음악 취향을 공유하고\n밴놀을 즐겨보세요!`}</Text>
            {/* 입력 폼 */}
            <View style={styles.form}>
              <TextInput
                placeholder="아이디"
                placeholderTextColor={Colors.palette.Gray400}
                style={styles.input}
                autoCapitalize="none"
                value={ownId}
                onChangeText={setOwnId}
                returnKeyType="next"
              />
              <TextInput
                placeholder="비밀번호"
                placeholderTextColor={Colors.palette.Gray400}
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit}>
                <LoginIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginVertical: 44 }}></View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 24,
  },
  text: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
    textAlign: 'center',
    width: 193,
  },
  form: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#1F1F1F',
    color: Colors.palette.Gray100,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    ...Typography.button1,
    color: '#FFFFFF',
  },
});
