import { Alert } from 'react-native';
import api from '@/store/api';

// 프로필 수정을 위한 데이터 타입 정의
interface ProfileData {
  nickname?: string;
  bio?: string;
  photo?: string | null;
  backgroundImg?: string | null;
  initialPhoto?: string | null;
  initialBackgroundImg?: string | null;
}

export const useEditProfile = () => {
  const updateProfile = async (data: ProfileData) => {
    const { nickname, bio, photo, backgroundImg, initialPhoto, initialBackgroundImg } = data;

    // API 호출들을 저장할 배열
    const apiCalls: Promise<any>[] = [];

    // 1. 프로필 정보 (닉네임, 바이오) 업데이트
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

    // 2. 이미지 업데이트 (별도 API 호출)
    const imagePayload: { [key: string]: any } = {};
    
    // 이미지 변경 여부 확인
    const photoChanged = photo !== initialPhoto;
    const bgChanged = backgroundImg !== initialBackgroundImg;
    
    if (photoChanged || bgChanged) {
      if (photoChanged) {
        imagePayload.photo = photo;
        imagePayload.rmPhoto = photo === null ? "true" : "false";
      }
      if (bgChanged) {
        imagePayload.backgroundImg = backgroundImg;
        imagePayload.rmBackImg = backgroundImg === null ? "true" : "false";
      }

      console.log(
        '[useEditProfile] Queuing PATCH /api/v1/users/me (images) with',
        imagePayload,
      );
      apiCalls.push(api.patch('/api/v1/users/me', imagePayload));
    }

    if (apiCalls.length === 0) {
      console.log('[useEditProfile] No changes to update.');
      return { success: true, results: [] };
    }

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
