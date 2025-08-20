// hooks/useEditProfile.ts
import { Alert } from 'react-native';
import api from '@/store/api';

interface ProfileData {
  nickname: string;
  bio: string;
  photo: string | null; // file://… 또는 CDN URL 또는 null
  backgroundImg: string | null; // file://… 또는 CDN URL 또는 null
  initialPhoto: string | null;
  initialBackgroundImg: string | null;
}

const isLocalFile = (uri?: string | null) =>
  !!uri && (uri.startsWith('file://') || uri.startsWith('content://'));

const guessMime = (uri: string) => {
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
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

    // 1) 텍스트(닉네임/바이오)는 JSON PATCH
    const profilePayload: Record<string, any> = {};
    if (nickname !== undefined) profilePayload.nickname = nickname;
    if (bio !== undefined) profilePayload.bio = bio;

    // 2) 이미지 변경은 FormData PATCH
    const fd = new FormData();
    let hasImageChange = false;

    if (photo !== initialPhoto) {
      hasImageChange = true;
      if (photo === null) {
        fd.append('rmPhoto', 'true'); // 삭제
      } else if (isLocalFile(photo)) {
        fd.append('photo', {
          uri: photo,
          name: 'profile.' + (photo.split('.').pop() || 'jpg'),
          type: guessMime(photo),
        } as any); // 로컬 파일 업로드
      } else {
        // 서버가 URL 교체를 허용하면 사용. 불허하면 제거하거나 주석 처리
        fd.append('photoUrl', photo);
      }
    }

    if (backgroundImg !== initialBackgroundImg) {
      hasImageChange = true;
      if (backgroundImg === null) {
        fd.append('rmBackImg', 'true');
      } else if (isLocalFile(backgroundImg)) {
        fd.append('backgroundImg', {
          uri: backgroundImg,
          name: 'background.' + (backgroundImg.split('.').pop() || 'jpg'),
          type: guessMime(backgroundImg),
        } as any);
      } else {
        fd.append('backgroundImgUrl', backgroundImg);
      }
    }

    try {
      // 텍스트 먼저(있으면)
      if (Object.keys(profilePayload).length > 0) {
        await api.patch('/api/v1/users/me/profiles', profilePayload);
      }

      // 이미지(FormData) 전송(있으면)
      if (hasImageChange) {
        await api.patch('/api/v1/users/me', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }, // 중요
        });
      }

      Alert.alert('성공', '프로필이 성공적으로 저장되었습니다.');
      return { success: true };
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error?.code;
      if (status === 404 && code === 'E1300') {
        Alert.alert('안내', '변경된 내용이 없습니다.');
      } else {
        const msg =
          err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          '프로필 저장 중 오류가 발생했습니다.';
        Alert.alert('저장 실패', msg);
      }
      return { success: false, error: err };
    }
  };

  return { updateProfile };
};
