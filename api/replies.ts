import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://bandnol.app/api/v1';

export const fetchReplyComment = async (
  recomsId: string,
  type: 'sent' | 'received',
) => {
  try {
    const url = `${API_BASE}/recoms/${recomsId}/replies?type=${type}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}` },
    });

    const d = res.data?.data;
    if (!d) return null;

    const content = d.replies?.content ?? null;
    const nickname = d.receiver?.nickname ?? null;

    return { content, nickname };
  } catch (err) {
    console.error('❌ 답장 조회 실패:', err);
    return null;
  }
};
