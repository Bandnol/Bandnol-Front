import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/env';

//Axios Instance (+ Timeout)
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s
  headers: { 'Content-Type': 'application/json' },
});

//Auth Token Handling
let AUTH_TOKEN: string | null = null;

// 로그인/복원 시점에 호출해서 메모리에 토큰을 보관
export function setRecomsAuthToken(token: string | null) {
  AUTH_TOKEN = token;
  console.log('[recoms] auth token set?', !!token);
}

// 모든 요청 전에 Authorization 헤더를 보장 주입 메모리에 없으면 SecureStore에서 복원 시도
api.interceptors.request.use(async (cfg) => {
  const token =
    AUTH_TOKEN ??
    (await SecureStore.getItemAsync('access_token').catch(() => null));

  const hasToken = !!token;
  console.log(
    '[recoms:req] →',
    cfg.method?.toUpperCase(),
    cfg.url,
    'token?',
    hasToken,
  );

  if (token) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Types
export type SentData = {
  id: string;
  createdAt: string; // "YYYY-MM-DD"
  recomsSong?: {
    id: string;
    title: string;
    artistName: string;
    imgUrl?: string;
  };
  receiver?: { id: string; nickname: string };
  replyId?: string;
};

type SentResponse = {
  success: boolean;
  data?: SentData | null;
  error?: unknown;
};

// “오늘 보냄” 캐시(세션/로컬)
let sentTodayMemory = false; // 앱 살아있는 동안 유지

const todayKey = () => 'sent:' + new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD

// 전송 성공/409 직후 세션 동안 확정
export function markSentToday(v = true) {
  sentTodayMemory = v;
  console.log('[recoms] markSentToday =', v);
}

// 재시작 대비(로컬 기록)
async function setLocalSentToday() {
  try {
    await SecureStore.setItemAsync(todayKey(), '1');
  } catch {}
}

async function getLocalSentToday(): Promise<boolean> {
  try {
    return (await SecureStore.getItemAsync(todayKey())) === '1';
  } catch {
    return false;
  }
}

// Utils: 날짜 포맷
function toYYYYMMDD(d: Date) {
  return d.toISOString().slice(0, 10);
}
function toYYYYMMDD_KST(now = new Date()) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

// API: 최신 보낸 1건 (본문만 필요할 때)
export async function fetchMyLatestSent(): Promise<SentData | null> {
  console.log('[recoms] fetchMyLatestSent: calling /api/v1/recoms/sent');
  const res = await api.get<SentResponse>('/api/v1/recoms/sent');
  console.log(
    '[recoms] fetchMyLatestSent: status =',
    res.status,
    'success =',
    res?.data?.success,
  );
  if (res?.data?.success && res.data.data) {
    console.log(
      '[recoms] latest.id =',
      res.data.data.id,
      'createdAt =',
      res.data.data.createdAt,
    );
    return res.data.data;
  }
  console.log('[recoms] latest is null');
  return null;
}

// 내부용: 최신 1건 + 서버 헤더 Date (오늘 판정 정확도↑)
async function fetchMySentWithServerNow(): Promise<{
  latest: SentData | null;
  serverToday: string | null;
}> {
  const res = await api.get<SentResponse>('/api/v1/recoms/sent');
  const latest = res?.data?.success && res.data.data ? res.data.data! : null;

  // 헤더 Date가 있으면 서버 관점의 “오늘(UTC)” 사용
  const hdr = (res?.headers?.date || '').toString(); // ex. "Fri, 22 Aug 2025 00:10:00 GMT"
  const serverToday = hdr ? toYYYYMMDD(new Date(hdr)) : null;

  return { latest, serverToday };
}

// 오늘 보냈는지 여부 (메모리 → 로컬 → 서버)
export async function hasSentToday(): Promise<boolean> {
  // 1) 세션 즉시반영
  if (sentTodayMemory) {
    console.log('[recoms] hasSentToday -> true (memory)');
    return true;
  }

  // 2) 로컬 기록(재시작/네트워크 실패 방어)
  if (await getLocalSentToday()) {
    console.log('[recoms] hasSentToday -> true (local)');
    return true;
  }

  // 3) 서버 확인
  try {
    const { latest, serverToday } = await fetchMySentWithServerNow();
    const createdAt = latest?.createdAt ?? null;
    if (!createdAt) {
      console.log('[recoms] hasSentToday -> false (server: no latest)');
      return false;
    }

    const todayUTC = toYYYYMMDD(new Date());
    const todayKST = toYYYYMMDD_KST();
    const candidates = [serverToday, todayUTC, todayKST].filter(
      Boolean,
    ) as string[];
    const hit = candidates.includes(createdAt);

    console.log('[recoms] compare:', { createdAt, candidates, hit });
    return hit;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 401) {
      console.warn('[recoms] 401 Unauthorized — 토큰 필요/만료');
    } else {
      console.warn('[recoms] hasSentToday failed:', e?.message || e);
    }
    return false;
  }
}

// 홈 게이트에서 사용: 분기 헬퍼
export async function routeBySentToday(
  replace: (href: { pathname: string }) => void,
  opts?: { myPath?: string; searchPath?: string },
) {
  const myPath = opts?.myPath ?? '/music-recommend/myRecommend';
  const searchPath = opts?.searchPath ?? '/music-recommend/searchMusic';
  const sent = await hasSentToday();
  replace({ pathname: sent ? myPath : searchPath });
}

// 전송 성공/409 직후 확정 이동(세션+로컬 기록)
export async function confirmSentTodayAndGo(
  replace: (href: { pathname: string }) => void,
  myPath = '/music-recommend/myRecommend',
) {
  markSentToday(true); // 세션 확정
  await setLocalSentToday(); // 재시작 대비
  replace({ pathname: myPath });
}

// replyId로 코멘트 가져오기 (선택)
// export async function fetchReplyById(replyId: string): Promise<any | null> {
//   try {
//     const r = await api.get(`/api/v1/replies/${replyId}`);
//     return r?.data ?? null;
//   } catch {
//     return null;
//   }
// }

export { api }; // 필요 시 다른 모듈에서 동일 인스턴스 사용
