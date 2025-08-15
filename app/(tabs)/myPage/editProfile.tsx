import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import EditIcon from '@/assets/icons/edit.svg';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';
import { useAuthFetch } from '@/hooks/useAuthFetch';

export default function EditProfile() {
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [focusedField, setFocusedField] = useState<'nickname' | 'intro' | null>(
    null,
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        const initialNickname = u?.nickname ?? u?.nickName ?? u?.name ?? '';
        const initialIntro = u?.bio ?? u?.introduction ?? '';
        setNickname(String(initialNickname));
        setIntro(String(initialIntro));
      } catch (e) {
        console.log('[EditProfile] 로컬 프로필 로드 실패', e);
      }
    })();
  }, []);

  const authFetch = useAuthFetch();

  // YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD -> YYYY-MM-DD
  const normalizeBirth = (raw?: string | null): string | null => {
    if (!raw) return null;
    const s = String(raw).trim();
    const digits = s.replace(/[^0-9]/g, '');
    if (digits.length !== 8) return null;
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    return `${y}-${m}-${d}`;
  };

  // HH:mm 또는 HHmm 그대로 유지 (서버 스펙 차이를 고려해 보존)
  const pickRecomsTime = (t?: string | null) => {
    if (!t) return null;
    const s = String(t).trim();
    if (/^\d{2}:\d{2}$/.test(s)) return s; // HH:mm
    if (/^\d{4}$/.test(s)) return s; // HHmm
    return null;
  };

  const handleGoBack = () => {
    router.push('/(tabs)/myPage/myPage');
  };

  const handleSave = () => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('user');
        const u = raw ? JSON.parse(raw) : {};

        const ownId = u?.ownId ?? u?.userId ?? u?.username ?? null;
        const gender = u?.gender ?? null;
        const birth = normalizeBirth(u?.birth ?? u?.birthday ?? null);
        const recomsTime = pickRecomsTime(
          u?.recomsTime ?? u?.recommendTime ?? null,
        );

        const payload: any = { nickname, bio: intro };
        if (ownId) payload.ownId = ownId;
        if (gender) payload.gender = gender;
        if (birth) payload.birth = birth;
        if (recomsTime) payload.recomsTime = recomsTime;

        const res = await authFetch.json<any>('/api/v1/users/me/profiles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // API가 success=false 형태로도 200을 줄 수 있으니 체크
        if (res?.success === false) {
          const code = res?.error?.code;
          const msg = res?.error?.message || '저장에 실패했습니다.';
          Alert.alert(
            '프로필 저장 실패',
            `${msg}${code ? `\n(code: ${code})` : ''}`,
          );
          return;
        }

        // 로컬 동기화
        const next = { ...u, ...payload };
        await SecureStore.setItemAsync('user', JSON.stringify(next));
        router.push('/(tabs)/myPage/myPage');
      } catch (e: any) {
        const raw = e?.message ?? e;
        const msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
        Alert.alert('프로필 저장 실패', msg);
      }
    })();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView>
        <StatusBar
          translucent={false}
          backgroundColor="#121212"
          barStyle="light-content"
        />
        <View style={styles.container}>
          {/* 왼쪽: 뒤로가기 아이콘 */}
          <TouchableOpacity onPress={handleGoBack}>
            <BackArrowIcon width={24} height={24} />
          </TouchableOpacity>

          {/* 중앙: 텍스트 */}
          <Text style={styles.title}>프로필 편집</Text>

          {/* 오른쪽: 저장 텍스트 버튼 */}
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>
        {/* {배경 사진} */}
        <View style={styles.bgWrapper}>
          <Image
            source={require('@/assets/images/background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => setShowBackgroundModal(true)}
          >
            <View style={styles.editIconCircle}>
              <EditIcon width={18} height={18} />
            </View>
          </TouchableOpacity>
        </View>
        {/* {프로필 사진 수정} */}
        <View style={styles.profileImageWrapper}>
          <TouchableOpacity onPress={() => setShowProfileModal(true)}>
            <Image source={ProfileImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        {/* 텍스트 필드 영역 */}
        <View style={styles.textFieldWrapper}>
          {/* 첫 번째 필드 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'nickname'
                  ? styles.inputFocused
                  : styles.inputBlurred,
                { color: nickname.trim() ? '#FFF' : styles.input.color },
              ]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#F4F4F4"
              onFocus={() => setFocusedField('nickname')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* 두 번째 필드 */}
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.label}>소개</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'intro'
                  ? styles.inputFocused
                  : styles.inputBlurred,
                { color: intro.trim() ? '#FFF' : styles.input.color },
              ]}
              value={intro}
              onChangeText={setIntro}
              placeholder="소개를 입력해주세요"
              placeholderTextColor="#F4F4F4"
              onFocus={() => setFocusedField('intro')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 375,
    height: 64,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
  },
  title: {
    ...Typography.subtitle1B,
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
  },
  saveText: {
    ...Typography.subtitle1,
    color: '#FFF',
  }, //배경 만들기
  bgWrapper: {
    position: 'relative',
    width: 375,
    height: 146,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  editIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageWrapper: {
    alignItems: 'center',
    marginTop: -25,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 36,
    borderWidth: 0.34,
    borderColor: '#7C7C7C',
  },
  textFieldWrapper: {
    marginTop: 22, // background image 아래 마진
    paddingHorizontal: 20,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  }, // 텍스트 필드
  label: {
    color: '#7C7C7C',
    ...Typography.body2,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#7C7C7C',
    ...Typography.body2,
  },
  inputFocused: {
    borderColor: '#FFF',
  },
  inputBlurred: {
    borderColor: '#7C7C7C',
  },
});
