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
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import EditIcon from '@/assets/icons/edit.svg';
import ProfileImage from '@/assets/images/profile.png';
import DummyImage from '@/assets/images/dummy1.png';
import { Typography } from '@/constants/typography';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function EditProfile() {
  // 닉네임/소개는 SecureStore('user')에서 초기화
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [focusedField, setFocusedField] = useState<'nickname' | 'intro' | null>(
    null,
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [backgroundUri, setBackgroundUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        setNickname(u?.nickname ?? u?.name ?? '');
        setIntro(u?.bio ?? u?.introduction ?? u?.intro ?? '');
        setProfileUri(u?.photo ?? null);
        setBackgroundUri(u?.backgroundImg ?? null);
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

  const pickImage = async (options?: ImagePicker.ImageLibraryOptions) => {
    const ok = await ensureMediaPermission();
    if (!ok) return null;
    try {
      const mediaTypesCompat: any = (ImagePicker as any).MediaType
        ? [(ImagePicker as any).MediaType.Images]
        : (ImagePicker as any).MediaTypeOptions?.Images;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypesCompat,
        quality: 0.9,
        allowsEditing: true,
        aspect: options?.aspect ?? undefined,
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

  // --- 업로드 헬퍼: presigned URL 요청 → 파일 PUT 업로드 → 공개 URL 반환 ---
  const guessContentType = (uri: string) => {
    const lower = uri.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    return 'application/octet-stream';
  };

  const basename = (uri: string) => {
    try {
      const parts = uri.split('?')[0].split('#')[0].split('/');
      return parts[parts.length - 1] || 'image';
    } catch {
      return 'image';
    }
  };

  /**
   * 백엔드에서 Presigned URL을 발급받고(예: S3 PUT), 해당 URL로 바이너리 업로드한 뒤
   * 최종 공개 URL(publicUrl)을 반환한다.
   * ※ 엔드포인트/응답 스키마는 서버에 맞춰 조정 필요
   */
  const uploadViaPresign = async (
    localUri: string,
    kind: 'photo' | 'backgroundImg',
  ): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.warn('[uploadViaPresign] no JWT');
        return null;
      }
      const fileName = basename(localUri);
      const contentType = guessContentType(localUri);

      // 1) 사전서명 URL 발급 (서버 스펙에 맞게 경로/바디 수정)
      // 기대 응답: { uploadUrl: string, publicUrl: string }
      // ※ 실제 백엔드 엔드포인트 및 응답 스키마에 맞게 조정 필요
      const presignRes = await api.post(
        '/api/v1/uploads/presign',
        { fileName, contentType, type: kind },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const uploadUrl: string | undefined =
        presignRes?.data?.uploadUrl || presignRes?.data?.data?.uploadUrl;
      const publicUrl: string | undefined =
        presignRes?.data?.publicUrl || presignRes?.data?.data?.publicUrl;
      if (!uploadUrl) {
        console.warn(
          '[uploadViaPresign] presign missing uploadUrl',
          presignRes?.data,
        );
        return null;
      }

      // 2) PUT 바이너리 업로드
      const putResult = await FileSystem.uploadAsync(uploadUrl, localUri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: { 'Content-Type': contentType },
      });
      if (putResult.status < 200 || putResult.status >= 300) {
        console.warn(
          '[uploadViaPresign] PUT failed',
          putResult.status,
          putResult.body,
        );
        return null;
      }

      // 3) 공개 URL 반환 (응답에 없으면 쿼리 제거한 업로드 URL로 폴백)
      const finalUrl = publicUrl || uploadUrl.split('?')[0];
      console.log(`[uploadViaPresign] ${kind} uploaded →`, finalUrl);
      return finalUrl;
    } catch (e) {
      console.warn('[uploadViaPresign] error', e);
      return null;
    }
  };

  const handleGoBack = () => {
    router.push('/(tabs)/myPage/myPage');
  };

  const handleSave = async () => {
    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      let photoUrl = profileUri;
      let bgUrl = backgroundUri;
      // 서버에 프로필 수정 PATCH
      try {
        // 로컬 파일 URI면 presigned 업로드 수행 후 https URL로 교체
        if (photoUrl && photoUrl.startsWith('file:')) {
          const uploaded = await uploadViaPresign(photoUrl, 'photo');
          if (uploaded) {
            photoUrl = uploaded;
          } else {
            console.warn(
              '[EditProfile] photo presign/upload failed → excluding photo from payload',
            );
            photoUrl = null; // 서버가 http(s) URL만 허용하는 경우를 대비
          }
        }
        if (bgUrl && bgUrl.startsWith('file:')) {
          const uploaded = await uploadViaPresign(bgUrl, 'backgroundImg');
          if (uploaded) {
            bgUrl = uploaded;
          } else {
            console.warn(
              '[EditProfile] background presign/upload failed → excluding backgroundImg from payload',
            );
            bgUrl = null;
          }
        }

        // 최소 페이로드: null 필드는 제거 (서버 스키마 검증 회피)
        const basePayload: Record<string, any> = {};
        const nextNickname = nickname?.trim();
        const nextBio = intro?.trim();
        if (nextNickname) basePayload.nickname = nextNickname;
        if (nextBio) basePayload.bio = nextBio;
        if (photoUrl) basePayload.photo = photoUrl; // 업로드 성공시에만 포함
        if (bgUrl) basePayload.backgroundImg = bgUrl; // 업로드 성공시에만 포함

        // 디버그: 서버로 보낼 데이터 확인 (스웨거 테스트용)
        console.log(
          '[EditProfile] PATCH /api/v1/users/me payload =\n',
          JSON.stringify(basePayload, null, 2),
        );

        const headers = {
          Authorization: token ? `Bearer ${token}` : undefined,
        } as const;

        // 1) 우선 /me 엔드포인트에 최소 페이로드 전송
        let patched = false;
        try {
          const res = await api.patch('/api/v1/users/me', basePayload, {
            headers,
          });
          console.log(
            '[EditProfile] PATCH success -> /api/v1/users/me',
            res.status,
          );
          patched = true;
        } catch (errMe: any) {
          const statusMe = errMe?.response?.status;
          console.warn('[EditProfile] PATCH failed /api/v1/users/me', statusMe);
          // 2) /me/profiles로 폴백: 백엔드가 날짜/추천시간을 요구할 수 있으므로 기존 값을 함께 보냄
          const rawUser = await SecureStore.getItemAsync('user');
          const u = rawUser ? JSON.parse(rawUser) : {};
          const profilePayload: Record<string, any> = { ...basePayload };
          if (u?.birth) profilePayload.birth = u.birth; // YYYY-MM-DD
          if (u?.gender) profilePayload.gender = u.gender; // MAN/WOMAN
          if (u?.recommendTime) profilePayload.recommendTime = u.recommendTime; // 예: "21:30"

          // 디버그: profiles 페이로드 출력
          console.log(
            '[EditProfile] PATCH /api/v1/users/me/profiles payload =\n',
            JSON.stringify(profilePayload, null, 2),
          );

          try {
            const resProf = await api.patch(
              '/api/v1/users/me/profiles',
              profilePayload,
              { headers },
            );
            console.log(
              '[EditProfile] PATCH success -> /api/v1/users/me/profiles',
              resProf.status,
            );
            patched = true;
          } catch (errProf: any) {
            const statusProf = errProf?.response?.status;
            console.warn(
              '[EditProfile] PATCH failed /api/v1/users/me/profiles',
              statusProf,
            );
            if (statusProf === 405) {
              try {
                const resPut = await api.put(
                  '/api/v1/users/me/profiles',
                  profilePayload,
                  { headers },
                );
                console.log(
                  '[EditProfile] PUT fallback success -> /api/v1/users/me/profiles',
                  resPut.status,
                );
                patched = true;
              } catch (errPut: any) {
                console.warn(
                  '[EditProfile] PUT fallback failed /api/v1/users/me/profiles',
                  errPut?.response?.status,
                );
              }
            }
          }
        }

        if (!patched) {
          throw new Error(
            'No matching endpoint or payload requirements not met.',
          );
        }
      } catch (e) {
        console.warn('[EditProfile] PATCH /api/v1/users/me failed', e);
        // 실패해도 로컬 병합은 시도 (오프라인/회선 이슈 고려)
      }

      // 로컬 SecureStore 병합 저장
      const raw = await SecureStore.getItemAsync('user');
      const prev = raw ? JSON.parse(raw) : {};
      await SecureStore.setItemAsync(
        'user',
        JSON.stringify({
          ...prev,
          nickname: nickname?.trim() || prev?.nickname || prev?.name || '',
          bio: intro?.trim() || prev?.bio || prev?.introduction || '',
          photo: photoUrl ?? profileUri ?? prev?.photo ?? null,
          backgroundImg: bgUrl ?? backgroundUri ?? prev?.backgroundImg ?? null,
        }),
      );
    } catch (e) {
      console.warn('[EditProfile] save to SecureStore failed', e);
    } finally {
      router.push('/(tabs)/myPage/myPage');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
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
            source={
              backgroundUri
                ? { uri: backgroundUri }
                : require('@/assets/images/profile-background.jpg')
            }
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={onPickBackground}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.editIconCircle}>
              <EditIcon width={18} height={18} />
            </View>
          </TouchableOpacity>
        </View>
        {/* {프로필 사진 수정} */}
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
              ]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="텍스트"
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
              ]}
              value={intro}
              onChangeText={setIntro}
              placeholder="텍스트"
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
