// utils/authCleanup.ts (새 파일 또는 기존 util 파일에)
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 관심 아티스트 로컬 저장 키
export const IA_STORAGE_KEY = '@interested_artists_v1';

/**
 * 로그아웃 시: 관심 아티스트 스토리지만 제거
 *  - 재로그인 시 SecureStore의 JWTToken/user가 남아있다면 온보딩을 건너뛰기 위함
 */
export async function clearOnLogout() {
  try {
    await Promise.allSettled([AsyncStorage.removeItem(IA_STORAGE_KEY)]);
  } catch (e) {
    console.warn('[authCleanup] clearOnLogout error', e);
  }
}

/**
 * 회원 탈퇴 시: 모든 로컬 인증/프로필 관련 정보 제거
 *  - JWTToken, user (SecureStore)
 *  - 관심 아티스트 (AsyncStorage)
 */
export async function clearOnWithdraw() {
  try {
    await Promise.allSettled([
      SecureStore.deleteItemAsync('JWTToken'),
      SecureStore.deleteItemAsync('user'),
      AsyncStorage.removeItem(IA_STORAGE_KEY),
    ]);
  } catch (e) {
    console.warn('[authCleanup] clearOnWithdraw error', e);
  }
}

/**
 * 온보딩 스킵 여부 판단: SecureStore에 토큰과 user가 있으면 true
 */
export async function shouldSkipOnboarding(): Promise<boolean> {
  try {
    const [token, user] = await Promise.all([
      SecureStore.getItemAsync('JWTToken'),
      SecureStore.getItemAsync('user'),
    ]);
    return Boolean(token && user);
  } catch (e) {
    return false;
  }
}
