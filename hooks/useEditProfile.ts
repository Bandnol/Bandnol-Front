import { Alert } from 'react-native';
import api from '@/store/api';
import * as FileSystem from 'expo-file-system';
// import * as ImageManipulator from 'expo-image-manipulator';

interface ProfileData {
  nickname: string;
  bio: string;
  photo: string | null;
  backgroundImg: string | null;
  initialPhoto: string | null;
  initialBackgroundImg: string | null;
}

const MAX_UPLOAD_BYTES = 950 * 1024; // 950KB (서버 1MB 제한 대비 안전 마진)

async function getFileSize(uri: string): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && 'size' in info) {
      return info.size ?? 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

async function compressUnderLimit(
  uri: string,
  limitBytes = MAX_UPLOAD_BYTES,
): Promise<string> {
  // 원본이 이미 작은 경우 바로 반환
  const originalSize = await getFileSize(uri);
  if (originalSize > 0 && originalSize <= limitBytes) return uri;

  // 1) 해상도 축소(너비 기준) → 2) 품질 단계 하향
  // 너비: 1600 → 1200 → 1000 → 800 → 700 → 600
  const widthSteps = [1600, 1200, 1000, 800, 700, 600];
  const qualitySteps = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35];

  let currentUri = uri;

  for (const w of widthSteps) {
    const resized = await ImageManipulator.manipulateAsync(
      currentUri,
      [{ resize: { width: w } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
    );
    currentUri = resized.uri;

    // 크기 체크
    let size = await getFileSize(currentUri);
    if (size > 0 && size <= limitBytes) return currentUri;

    // 그래도 크면 quality 단계 하향
    for (const q of qualitySteps) {
      const qResult = await ImageManipulator.manipulateAsync(
        currentUri,
        [], // 추가 리사이즈 없이 품질만
        { compress: q, format: ImageManipulator.SaveFormat.JPEG },
      );
      currentUri = qResult.uri;

      size = await getFileSize(currentUri);
      if (size > 0 && size <= limitBytes) return currentUri;
    }
  }

  // 여기까지 와도 넘치면 마지막 결과를 반환(가장 작은 상태)
  return currentUri;
}

const isLocalFile = (uri?: string | null) =>
  !!uri && (uri.startsWith('file://') || uri.startsWith('content://'));

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
    if (nickname !== undefined) profilePayload.nickname = nickname; // 빈문자 허용하려면 !== undefined 체크
    if (bio !== undefined) profilePayload.bio = bio;

    if (Object.keys(profilePayload).length > 0) {
      console.log(
        '[useEditProfile] Queuing PATCH /api/v1/users/me/profiles with',
        profilePayload,
      );
      apiCalls.push(api.patch('/api/v1/users/me/profiles', profilePayload));
    }

    // 2) 이미지 변경은 FormData PATCH
    const fd = new FormData();

    const photoChanged = photo !== initialPhoto;
    const bgChanged = backgroundImg !== initialBackgroundImg;
    const hasImageChange = bgChanged || photoChanged;

    if (photoChanged) {
      if (photo === null) {
        // 삭제
        fd.append('rmPhoto', 'true');
      } else {
        // 교체
        let uploadUri = photo;
        if (isLocalFile(photo)) {
          uploadUri = await compressUnderLimit(photo);
        }
        fd.append('photo', {
          uri: uploadUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
        fd.append('rmPhoto', 'false');
      }
    } else {
      fd.append('rmPhoto', 'false');
    }

    if (bgChanged) {
      if (backgroundImg === null) {
        // 삭제
        fd.append('rmBackgroundImg', 'true');
      } else {
        // 교체
        let uploadUri = backgroundImg;
        if (isLocalFile(backgroundImg)) {
          uploadUri = await compressUnderLimit(backgroundImg);
        }
        fd.append('backgroundImg', {
          uri: uploadUri,
          name: 'background.jpg',
          type: 'image/jpeg',
        } as any);
        fd.append('rmBackgroundImg', 'false');
      }
    } else {
      fd.append('rmBackgroundImg', 'false');
    }

    if (hasImageChange) {
      console.log(
        '[useEditProfile] Queuing PATCH /api/v1/users/me with FormData',
      );
      apiCalls.push(api.patch('/api/v1/users/me', fd));
    }

    if (apiCalls.length === 0) {
      console.log('[useEditProfile] No changes to update.');
      return { success: true, results: [] };
    }

    try {
      const results = await Promise.allSettled(apiCalls);
      const failedCalls = results.filter((r) => r.status === 'rejected');

      if (failedCalls.length > 0) {
        console.error('[useEditProfile] Some updates failed:', failedCalls);
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
