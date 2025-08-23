import { API_URL } from '@/constants/env';
import * as SecureStore from 'expo-secure-store';
import { clearOnLogout, clearOnWithdraw } from '@/hooks/useAuthClean';
import { useAuthStore } from '@/store/auth';
import { useUserActions } from '@/store/userStore';
import { useAuthSession } from './useAuthSession';

// 응답 바디 타입 정의
export type LoginBody = {
  ownId: string;
  password: string;
};

export type SignupBody = {
  ownId: string;
  password: string;
  nickname: string;
  email: string;
  gender: 'MAN' | 'WOMAN' | string;
  birth: string; // e.g. '2004-03-08'
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

export type ApiError = {
  success: false;
  data: null;
  error: { code?: string; message?: string } | null;
};

const jsonFetch = async <T>(url: string, init: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (_) {
    // ignore JSON parse errors;
  }

  if (!res.ok || (data && data.success === false)) {
    const msg = data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
};

export function useAuth() {
  const { signIn, signOut } = useAuthSession();
  const { setNickname, setOwnId, setPhoto, clearUser } = useUserActions();

  /**
   * 로그인: POST /api/v2/oauth2/login
   * body: { ownId, password }
   * 성공 시 accessToken, refreshToken, user 저장
   */
  const login = async ({ ownId, password }: LoginBody) => {
    const result = await jsonFetch<
      | ApiSuccess<{
          user: any;
          token: string;
          refreshToken?: string | null;
          isActive?: boolean;
        }>
      | ApiError
    >(`${API_URL}/api/v2/oauth2/login`, {
      method: 'POST',
      body: JSON.stringify({ ownId, password }),
    });

    if ('success' in result && result.success) {
      console.log('[useAuth] Login API response:', result.data);
      const { user, token, refreshToken } = result.data;
      console.log(
        '[useAuth] Extracted tokens - access:',
        !!token,
        'refresh:',
        !!refreshToken,
      );

      // Use AuthSession to handle token storage and state update
      await signIn(token, refreshToken ?? undefined);

      // 유저 정보 저장
      if (user) {
        await SecureStore.setItemAsync('user', JSON.stringify(user));

        // userStore에도 유저 정보 저장
        if (user.nickname) setNickname(user.nickname);
        if (user.ownId) setOwnId(user.ownId);
        if (user.photo) setPhoto(user.photo);
      }

      return result.data;
    }

    throw new Error('로그인 실패');
  };

  /**
   * 회원가입: POST /api/v2/oauth2/signup
   * body: { ownId, password, nickname, email, gender, birth }
   * 성공 시 userId(string) 반환
   */
  const signup = async (body: SignupBody) => {
    const result = await jsonFetch<ApiSuccess<string> | ApiError>(
      `${API_URL}/api/v2/oauth2/signup`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );

    if ('success' in result && result.success) {
      return result.data; // userId
    }
    throw new Error('회원가입 실패');
  };

  /**
   * 로그아웃: GET /api/v1/oauth2/logout
   * body: { accessToken }
   * 성공 시 로컬 스토리지 정리
   */
  const logout = async () => {
    const accessToken = await SecureStore.getItemAsync('JWTToken');
    await jsonFetch<ApiSuccess<{ message: string }> | ApiError>(
      `${API_URL}/api/v2/oauth2/logout`,
      {
        method: 'POST',
        body: JSON.stringify({ accessToken }),
      },
    );
    await SecureStore.deleteItemAsync('JWTToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');

    useAuthStore.getState().clearJWTToken();
    await signOut(); // Use AuthSession to clear tokens and state
    clearUser(); // Clear user store as well
  };

  /**
   * 회원탈퇴: GET /api/v1/oauth2/withdraw
   * body: { accessToken }
   * 성공 시 로컬 스토리지 정리
   */
  const withdraw = async () => {
    const accessToken = await SecureStore.getItemAsync('JWTToken');
    const result = await jsonFetch<
      | ApiSuccess<{ id: string; inactiveAt: string; inactiveStatus: boolean }>
      | ApiError
    >(`${API_URL}/api/v2/oauth2/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
    await SecureStore.deleteItemAsync('JWTToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');

    useAuthStore.getState().clearJWTToken();

    await signOut(); // Use AuthSession to clear tokens and state
    clearUser(); // Clear user store as well
    return 'success' in result && result.success ? result.data : null;
  };

  return { login, signup, logout, withdraw };
}
