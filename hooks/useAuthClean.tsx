// utils/authCleanup.ts (새 파일 또는 기존 util 파일에)
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 관심 아티스트 로컬 저장 키
export const IA_STORAGE_KEY = '@interested_artists_v1';

/**
 * 공통 정리 함수: 모든 로컬 인증/프로필 관련 정보 제거
 *  - JWTToken, user (SecureStore)
 *  - 관심 아티스트 (AsyncStorage)
 */
async function clearAllAuthLocal() {
  await Promise.allSettled([
    SecureStore.deleteItemAsync('JWTToken'),
    SecureStore.deleteItemAsync('user'),
    AsyncStorage.removeItem(IA_STORAGE_KEY),
  ]);
}

/**
 * 로그아웃 시에도 로컬 인증 정보는 전부 제거합니다.
 * (서버 세션 종료 후 기기 내 토큰/캐시를 남기지 않도록 일원화)
 */
export async function clearOnLogout() {
  try {
    await clearAllAuthLocal();
  } catch (e) {
    console.warn('[authCleanup] clearOnLogout error', e);
  }
}

/**
 * 회원탈퇴 시: 로컬 인증/프로필 관련 정보 전부 제거
 */
export async function clearOnWithdraw() {
  try {
    await clearAllAuthLocal();
  } catch (e) {
    console.warn('[authCleanup] clearOnWithdraw error', e);
  }
}
