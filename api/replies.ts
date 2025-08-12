import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

export const fetchReplyComment = async (
  recomsId: string,
  type: 'sent' | 'received',
) => {
  try {
    const res = await axios.get(
      `/api/v1/recoms/${recomsId}/replies?type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
        },
      },
    );

    return res.data?.data ?? null;
  } catch (err) {
    console.error('❌ 답장 조회 실패:', err);
    return null;
  }
};
