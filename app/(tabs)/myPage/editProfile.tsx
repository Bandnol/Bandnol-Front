import api from '@/store/api';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Linking,
  useWindowDimensions,
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import EditIcon from '@/assets/icons/edit.svg';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/Colors';

import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerOptions } from 'expo-image-picker';

import { useEditProfile } from '@/hooks/useEditProfile';

export default function EditProfile() {
  const { width: screenWidth } = useWindowDimensions();
  
  // 수정될 현재 값
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [backgroundUri, setBackgroundUri] = useState<string | null>(null);

  // 변경 여부 비교를 위한 초기 값
  const [initialProfileUri, setInitialProfileUri] = useState<string | null>(
    null,
  );
  const [initialBackgroundUri, setInitialBackgroundUri] = useState<
    string | null
  >(null);

  const [focusedField, setFocusedField] = useState<'nickname' | 'intro' | null>(
    null,
  );

  const { updateProfile } = useEditProfile();

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        const nickname = u?.nickname ?? u?.name ?? '';
        const intro = u?.bio ?? u?.introduction ?? u?.intro ?? '';
        const photo = u?.photo ?? null;
        const backgroundImg = u?.backgroundImg ?? null;

        // 현재 값과 초기 값 모두 설정
        setNickname(nickname);
        setIntro(intro);
        setProfileUri(photo);
        setInitialProfileUri(photo);
        setBackgroundUri(backgroundImg);
        setInitialBackgroundUri(backgroundImg);
      } catch (e) {
        console.warn('[EditProfile] load user from SecureStore failed', e);
      }
    })();
  }, []);

  const ensureMediaPermission = async (): Promise<boolean> => {
    try {
      const current = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (current.granted) return true;
      const ask = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (ask.granted) return true;
      Alert.alert(
        '권한 필요',
        '사진 라이브러리 접근 권한이 필요합니다. 설정에서 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정 열기',
            onPress: () => Linking.openSettings && Linking.openSettings(),
          },
        ],
      );
      return false;
    } catch (e) {
      console.warn('[EditProfile] ensureMediaPermission error', e);
      return false;
    }
  };

  const pickImage = async (options?: Partial<ImagePickerOptions>) => {
    const ok = await ensureMediaPermission();
    if (!ok) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
        // 호출측에서 넘긴 옵션을 덮어쓰기
        ...(options ?? {}),
      });

      if (result.canceled) {
        console.log('[EditProfile] picker canceled');
        return null;
      }
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert(
          '선택 실패',
          '이미지 선택에 실패했습니다. 다시 시도해 주세요.',
        );
        return null;
      }
      return asset.uri;
    } catch (e) {
      console.warn('[EditProfile] pickImage error', e);
      Alert.alert('오류', '이미지 선택 중 문제가 발생했습니다.');
      return null;
    }
  };

  const onPickProfile = async () => {
    const uri = await pickImage({ aspect: [1, 1] });
    if (uri) setProfileUri(uri);
  };

  const onPickBackground = async () => {
    const uri = await pickImage({ aspect: [16, 9] });
    if (uri) setBackgroundUri(uri);
  };

  const handleGoBack = () => {
    router.push('/(tabs)/myPage/myPage');
  };

  const handleSave = async () => {
    try {
      const payload = {
        nickname: nickname?.trim(),
        bio: intro?.trim(),
        photo: profileUri,
        backgroundImg: backgroundUri,
        initialPhoto: initialProfileUri,
        initialBackgroundImg: initialBackgroundUri,
      };

      await updateProfile(payload);
    } catch (e: any) {
      console.error(
        '[EditProfile] An error occurred during the save process:',
        e,
      );
      Alert.alert('저장 오류', '프로필을 저장하는 중 문제가 발생했습니다.');
    } finally {
      try {
        const raw = await SecureStore.getItemAsync('user');
        const prev = raw ? JSON.parse(raw) : {};
        await SecureStore.setItemAsync(
          'user',
          JSON.stringify({
            ...prev,
            nickname: nickname?.trim() || prev?.nickname || prev?.name || '',
            bio: intro?.trim() || prev?.bio || prev?.introduction || '',
            photo: profileUri ?? prev?.photo ?? null,
            backgroundImg: backgroundUri ?? prev?.backgroundImg ?? null,
          }),
        );
      } catch (storeError) {
        console.error(
          '[EditProfile] Failed to save to SecureStore',
          storeError,
        );
      }
      router.push('/(tabs)/myPage/myPage');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        <View style={styles.container}>
          <TouchableOpacity onPress={handleGoBack}>
            <BackArrowIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.title}>프로필 편집</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.bgWrapper, { width: screenWidth }]}>
          {backgroundUri ? (
            <Image
              source={{ uri: backgroundUri }}
              style={[styles.backgroundImage, { width: screenWidth }]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.backgroundImage,
                { backgroundColor: Colors.palette.Gray900, width: screenWidth },
              ]}
            />
          )}
          <TouchableOpacity
            style={[styles.editIcon, { right: 23 }]}
            onPress={onPickBackground}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.editIconCircle}>
              <EditIcon width={18} height={18} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.profileImageWrapper}>
          <TouchableOpacity
            onPress={onPickProfile}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={profileUri ? { uri: profileUri } : ProfileImage}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textFieldWrapper}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[
                styles.input,
                { color: Colors.palette.Gray100 },
                focusedField === 'nickname'
                  ? styles.inputFocused
                  : styles.inputBlurred,
              ]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="텍스트"
              placeholderTextColor={Colors.palette.Gray500}
              onFocus={() => setFocusedField('nickname')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.label}>소개</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: intro.trim() ? Colors.palette.Gray100 : Colors.palette.Gray500 
                },
                focusedField === 'intro'
                  ? styles.inputFocused
                  : styles.inputBlurred,
              ]}
              value={intro}
              onChangeText={setIntro}
              placeholder="텍스트"
              placeholderTextColor={Colors.palette.Gray500}
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
    width: '100%',
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
  },
  bgWrapper: {
    position: 'relative',
    height: 146,
  },
  backgroundImage: {
    height: '100%',
    borderRadius: 0,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    zIndex: 10,
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
    zIndex: 5,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 0.34,
    borderColor: '#7C7C7C',
  },
  textFieldWrapper: {
    marginTop: 22,
    paddingHorizontal: 20,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
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
    ...Typography.body2,
  },
  inputFocused: {
    borderColor: '#FFF',
  },
  inputBlurred: {
    borderColor: '#7C7C7C',
  },
});
