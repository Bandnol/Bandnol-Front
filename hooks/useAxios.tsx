import { API_URL } from '@env';
import type { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { Alert } from 'react-native';

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

/** 동시요청 401 시 리프레시 중복 방지용 공유 프로미스 */
let refreshPromise: Promise<string | null> | null = null;

let authAlertShown = false;

export function useAuthFetch() {
  const router = useRouter();

  const promptReLogin = useCallback(async () => {
    if (authAlertShown) return;
    authAlertShown = true;
    Alert.alert(
      '로그인 후 사용할 수 있습니다.',
      '',
      [
        {
          text: '확인',
          onPress: () => {
            clearTokens();
            authAlertShown = false;
            router.push('/(auth)/splash');
          },
        },
      ],
      { cancelable: false },
    );
  }, [router]);

  /** 실제 리프레시. 이미 진행 중이면 공유 프로미스를 기다림 */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise; // 중복 방지

    refreshPromise = (async () => {
      const attempt = async (endpoint: string, method: 'PATCH' | 'POST') => {
        const { access, refresh } = await readTokens();
        const mask = (t?: string | null) =>
          t ? `${t.slice(0, 6)}...${t.slice(-6)} (len:${t.length})` : 'null';
        console.log('[인증][디버그] access:', mask(access));
        console.log('[인증][디버그] refresh:', mask(refresh));
        if (access && refresh && access === refresh) {
          console.warn(
            '[인증][의심] access와 refresh 값이 동일합니다. 저장 로직을 점검하세요.',
          );
        }
        if (!refresh) {
          console.warn('[인증] 리프레시 토큰 없음');
          return null;
        }
        console.log(`[인증] 토큰 리프레시 시도 → ${method} ${endpoint}`);
        try {
          const r = await axios.request<RefreshResponse>({
            url: endpoint,
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refresh}`, // 리프레시 토큰을 헤더에도 명시
              'X-Skip-Auth-Interceptor': '1', // 전역 인터셉터 토큰 부착 방지
            },
            data: { refreshToken: refresh }, // 문서대로 바디도 함께 전달
            validateStatus: () => true,
          });
          console.log('[인증] 리프레시 응답 상태:', r.status);
          const payload = r.data as any;
          if (!payload?.success) {
            console.warn('[인증] 리프레시 실패 본문:', JSON.stringify(payload));
            return null;
          }
          const newAccess =
            payload?.data?.token ?? payload?.data?.accessToken ?? null;
          const newRefresh = payload?.data?.refreshToken ?? null;
          if (!newAccess) {
            console.warn('[인증] 리프레시 응답에 access token 없음');
            return null;
          }
          await saveTokens(newAccess, newRefresh);
          console.log('[인증] 리프레시 성공');
          return String(newAccess);
        } catch (e: any) {
          console.warn(
            '[인증] 리프레시 예외:',
            e?.response?.status,
            e?.message,
          );
          try {
            console.warn(
              '[인증] 리프레시 에러 본문:',
              JSON.stringify(e?.response?.data),
            );
          } catch (_) {}
          return null;
        }
      };

      try {
        // 1차: 문서에 명시된 엔드포인트
        const primary = await attempt(
          `${API_URL}/api/v1/oauth2/refresh/token`,
          'PATCH',
        );
        if (primary) return primary;

        // 2차: 레거시/대체 엔드포인트 (프로젝트 초기에 사용)
        const fallback = await attempt(
          `${API_URL}/api/v1/auth/refresh`,
          'POST',
        );
        if (fallback) return fallback;

        return null;
      } finally {
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  }, []);

  const doAxios = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      // URL, 메서드, 데이터 변환
      const url = typeof input === 'string' ? input : input.toString();
      const isAbsolute = /^https?:\/\//.test(url);
      const method = (init.method || 'GET').toUpperCase() as any;
      let data: any = undefined;
      if (init.body !== undefined) {
        if (typeof init.body === 'string') {
          try {
            data = JSON.parse(init.body);
          } catch {
            data = init.body;
          }
        } else {
          data = init.body as any;
        }
      }

      // 현재 액세스 토큰
      let { access } = await readTokens();

      // 요청 설정 합성 (fetch 스타일 headers → axios 스타일로 정규화)
      const makeConfig = (t?: string | null): AxiosRequestConfig => {
        const hdrs: Record<string, any> = {};
        const h = init.headers as any;
        if (h) {
          if (typeof Headers !== 'undefined' && h instanceof Headers) {
            h.forEach((v: string, k: string) => {
              hdrs[k] = v;
            });
          } else if (Array.isArray(h)) {
            for (const [k, v] of h) hdrs[k] = v;
          } else if (typeof h === 'object') {
            Object.assign(hdrs, h);
          }
        }
        if (t) hdrs['Authorization'] = `Bearer ${t}`;
        return {
          url,
          method: method as Method,
          baseURL: isAbsolute ? undefined : API_URL,
          headers: hdrs as AxiosRequestHeaders,
          data,
        };
      };

      try {
        const first = await axios.request(makeConfig(access));
        return first;
      } catch (error: any) {
        const status = error?.response?.status;
        if (status !== 401) throw error;

        console.warn('[인증] 401 감지 → 리프레시 진행');
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          console.warn('[인증] 리프레시 실패 → 재인증 유도');
          await promptReLogin();
          return Promise.reject(error);
        }

        try {
          const second = await axios.request(makeConfig(refreshed));
          return second;
        } catch (e2: any) {
          if (e2?.response?.status === 401) {
            console.warn('[인증] 재시도도 401 → 재인증 유도');
            await promptReLogin();
          }
          throw e2;
        }
      }
    },
    [refreshAccessToken, promptReLogin],
  );

  /** JSON 헬퍼 */
  const json = useCallback(
    async <T = unknown,>(input: RequestInfo | URL, init: RequestInit = {}) => {
      try {
        const res = await doAxios(input, init);
        return res.data as T;
      } catch (err: any) {
        // 서버에서 에러 본문을 내려줄 경우 메시지 보존
        const raw = err?.response?.data ?? err?.message ?? String(err);
        throw new Error(typeof raw === 'string' ? raw : JSON.stringify(raw));
      }
    },
    [doAxios],
  );

  // 원본 fetch + JSON 반환
  return Object.assign(doAxios as any, { json });
}
