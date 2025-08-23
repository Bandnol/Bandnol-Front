import api from '@/hooks/useAxios';

export const fetchReplyComment = async (
  recomsId: string,
  type: 'sent' | 'received',
) => {
  try {
    const url = `/api/v1/recoms/${recomsId}/replies?type=${type}`;
    const res = await api.get(url);

    const d = res.data?.data;
    if (!d) return null;

    const content = d.replies?.content ?? null;
    const nickname = d.receiver?.nickname ?? null;

    return { content, nickname };
  } catch (err) {
    console.error('답장 조회 실패:', err);
    return null;
  }
};
