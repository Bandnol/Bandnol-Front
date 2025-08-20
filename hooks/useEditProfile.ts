import { Alert } from 'react-native';
import api from '@/store/api';
import { initialWindowMetrics } from 'react-native-safe-area-context';

interface ProfileData {
  nickname: string;
  bio: string;
  photo: string | null; // file://… 또는 CDN URL 또는 null
  backgroundImg: string | null; // file://… 또는 CDN URL 또는 null
  initialPhoto: string | null;
  initialBackgroundImg: string | null;
}

const guessType = (uri: string | null) => {
  if (!uri) return null;
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'jpeg') return 'image/jpeg';
  if (ext === 'jpg') return 'image/jpeg';
  console.log('[EditProfile] guessType: 잘못된 형식입니다.', ext);
};

export const useEditProfile = () => {
  const updateProfile = async (data: ProfileData) => {
    const {
      nickname,
      bio,
      photo,
      backgroundImg,
      initialPhoto,
      initialBackgroundImg,
    } = data;

    const apiCalls: Promise<any>[] = [];

    // 1) 텍스트(닉네임/바이오)는 JSON PATCH
    const profilePayload: { [key: string]: any } = {};
    if (nickname) profilePayload.nickname = nickname;
    if (bio) profilePayload.bio = bio;

    if (Object.keys(profilePayload).length > 0) {
      console.log(
        '[useEditProfile] Queuing PATCH /api/v1/users/me/profiles with',
        profilePayload,
      );
      apiCalls.push(api.patch('/api/v1/users/me/profiles', profilePayload));
    }

    // 2) 이미지 변경은 FormData PATCH
    const fd = new FormData();

    // 이미지 변경 여부 확인
    const photoChanged = photo !== initialPhoto;
    const bgChanged = backgroundImg !== initialBackgroundImg;
    const hasImageChange = bgChanged || photoChanged;

    if (photoChanged) {
      if (photo === null) {
        //삭제
        fd.append('photo', {
          uri: '',
          name: 'profile.jpg',
          type: null, //가능한가?
        } as any);
        fd.append('rmPhoto', 'true');
      } else {
        //바꾼거
        fd.append('photo', {
          uri: photo,
          name: 'profile.' + (photo.split('.').pop() || 'jpg'),
          type: guessType(photo),
        } as any);
        fd.append('rmPhoto', 'false');
      }
    } else {
      //안건드림
      fd.append('photo', {
        uri: initialPhoto || '',
        name: 'profile.jpg',
        type: guessType(initialPhoto),
      } as any);
      fd.append('rmPhoto', 'false');
    }

    if (bgChanged) {
      if (backgroundImg === null) {
        fd.append('backgroundImg', {
          uri: '',
          name: 'background.jpg',
          type: null, //가능한가?
        } as any);
        fd.append('rmBackgroundImg', 'true');
      } else {
        fd.append('backgroundImg', {
          uri: backgroundImg,
          name: 'background.' + (backgroundImg.split('.').pop() || 'jpg'),
          type: guessType(backgroundImg),
        } as any);
        fd.append('rmBackgroundImg', 'false');
      }
    } else {
      fd.append('backgroundImg', {
        uri: initialBackgroundImg || '',
        name: 'background.jpg',
        type: guessType(initialBackgroundImg),
      } as any);
      fd.append('rmBackgroundImg', 'false');
    }

    if (hasImageChange) {
      console.log(
        '[useEditProfile] Queuing PATCH /api/v1/users/me with FormData',
        fd,
      );
      apiCalls.push(
        api.patch('/api/v1/users/me', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      );
    }
    if (apiCalls.length === 0) {
      console.log('[useEditProfile] No changes to update.');
      return { success: true, results: [] };
    }

    console.log('[useEditProfile] fd:', fd);
    try {
      // 3. 준비된 모든 API 호출을 동시에 실행
      const results = await Promise.allSettled(apiCalls);

      // 4. 결과 처리
      const failedCalls = results.filter((r) => r.status === 'rejected');

      if (failedCalls.length > 0) {
        console.error('[useEditProfile] Some updates failed:', failedCalls);
        // 첫 번째 실패한 호출의 에러를 표시
        const firstError = (failedCalls[0] as PromiseRejectedResult).reason;
        const errorMessage =
          firstError?.response?.data?.error?.message ||
          firstError?.response?.data?.message ||
          '프로필 저장 중 일부 항목에 문제가 발생했습니다.';
        Alert.alert('저장 실패', errorMessage);
        return { success: false, results };
      }

      console.log('[useEditProfile] All updates successful');
      Alert.alert('성공', '프로필이 성공적으로 저장되었습니다.');
      return { success: true, results };
    } catch (error) {
      console.error('[useEditProfile] An unexpected error occurred:', error);
      Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
      return { success: false, error };
    }
  };

  return { updateProfile };
};
