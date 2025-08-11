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

    // 서버 스키마: { id, receiver: { nickname }, replies: { content } }
    const content = d.replies?.content ?? null;
    // sender 정보가 응답에 없으니, 화면에서 ‘상대 이름’이 필요하면 일단 receiver.nickname으로 대체
    const nickname = d.receiver?.nickname ?? null;

    return { content, nickname };
  } catch (err) {
    console.error('❌ 답장 조회 실패:', err);
    return null;
  }
};
