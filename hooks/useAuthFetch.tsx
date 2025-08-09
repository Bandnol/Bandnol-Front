import { API_URL } from '@env';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';

const ACCESS_KEY = 'JWTToken';
const REFRESH_KEY = 'JWTRefreshToken';

/** 리프레시 응답 형태 */
type RefreshResponse = {
  success: boolean;
  data?: {
    token?: string; // 새 AccessToken
    refreshToken?: string; // 새 RefreshToken(선택)
    [k: string]: unknown;
  } | null;
  error?: null | { code: string; message: string };
};

/** 토큰 저장/삭제 유틸 */
async function saveTokens(access?: string | null, refresh?: string | null) {
  if (access) await SecureStore.setItemAsync(ACCESS_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}
async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
async function readTokens() {
  const access = await SecureStore.getItemAsync(ACCESS_KEY);
  const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
  return { access, refresh } as const;
}

/** 입력이 상대경로면 API_URL을 붙임 */
function toAbsUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (typeof input !== 'string') return input; // Request/URL 객체면 그대로
  if (input.startsWith('http')) return input; // 절대 URL이면 그대로
  return `${API_URL}${input}`; // 상대경로 → API_URL 접두
}

/** 동시요청 401 시 리프레시 중복 방지용 공유 프로미스 */
let refreshPromise: Promise<string | null> | null = null;

export function useAuthFetch() {
  const router = useRouter();

  /** 실제 리프레시. 이미 진행 중이면 공유 프로미스를 기다림 */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise; // 중복 방지

    refreshPromise = (async () => {
      try {
        const { refresh } = await readTokens();
        if (!refresh) {
          console.warn('[인증] 리프레시 토큰 없음');
          return null;
        }
        console.log('[인증] 토큰 리프레시 시도');
        const r = await fetch(`${API_URL}/api/v1/oauth2/refresh/token`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refresh }),
        });
        if (!r.ok) {
          console.warn('[인증] 리프레시 실패 상태코드:', r.status);
          return null;
        }
        const payload = (await r.json()) as RefreshResponse;
        if (!payload?.success || !payload?.data?.token) {
          console.warn('[인증] 리프레시 응답에 token 없음');
          return null;
        }
        const newAccess = payload.data.token ?? null;
        const newRefresh = payload.data.refreshToken ?? null;
        await saveTokens(newAccess, newRefresh);
        console.log('[인증] 리프레시 성공');
        return newAccess;
      } catch (e) {
        console.log('[인증] 리프레시 예외:', e);
        return null;
      } finally {
        // 다음 요청을 위해 공유 프로미스 해제
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }, []);

  /** 인증 포함 fetch */
  const doFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      // 현재 액세스 토큰
      let { access } = await readTokens();

      // 인증 헤더 합성 도우미
      const withAuth = (t?: string | null): RequestInit => ({
        ...init,
        headers: {
          ...(init.headers || {}),
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
      });

      // 1) 최초 요청
      const first = await fetch(toAbsUrl(input), withAuth(access));
      if (first.status !== 401) return first;

      // 2) 401 → 리프레시 시도
      console.warn('[인증] 401 감지 → 리프레시 진행');
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        console.warn('[인증] 리프레시 실패 → 로그아웃');
        await clearTokens();
        router.replace('/(auth)/login');
        return first; // 혹은 throw new Error('Unauthorized')
      }

      // 3) 새 토큰으로 재시도 (1회)
      const second = await fetch(toAbsUrl(input), withAuth(refreshed));
      if (second.status === 401) {
        console.warn('[인증] 재시도도 401 → 로그아웃');
        await clearTokens();
        router.replace('/(auth)/login');
      }
      return second;
    },
    [refreshAccessToken, router],
  );

  /** JSON 헬퍼 */
  const json = useCallback(
    async <T = unknown,>(input: RequestInfo | URL, init: RequestInit = {}) => {
      const res = await doFetch(input, init);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }
      return (await res.json()) as T;
    },
    [doFetch],
  );

  // 원본 fetch + JSON 반환
  return Object.assign(doFetch, { json });
}
