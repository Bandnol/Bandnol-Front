import api from '@/hooks/useAxios';

export async function sendReply(recomsId: string, content: string) {
  const url = `/api/v1/recoms/${encodeURIComponent(recomsId)}/replies`;
  const { data } = await api.post(url, { content });
  return data; // { success, data, error }
}

export async function fetchReplies(
  recomsId: string,
  type: 'sent' | 'received',
) {
  const url = `/api/v1/recoms/${encodeURIComponent(recomsId)}/replies`;
  const { data } = await api.get(url, { params: { type } });
  return data;
}

/** 내가 보낸 답장 가져오기. 서버가 sent/received 중 어느 쪽으로 주든 커버 */
export async function fetchMyReply(recomsId: string) {
  try {
    return await fetchReplies(recomsId, 'sent');
  } catch (e: any) {
    // sent가 없거나 4xx면 received로 재시도
    if (e?.response && e.response.status < 500) {
      return await fetchReplies(recomsId, 'received');
    }
    throw e;
  }
}
