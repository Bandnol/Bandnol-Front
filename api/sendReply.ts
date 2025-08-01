import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

export const postReply = async (
  recomsId: string, // 또는 number
  content: string,
  isAnonymous: boolean,
) => {
  if (!content.trim()) {
    console.warn('댓글 내용이 없습니다.');
    return { success: false, error: '내용 없음' };
  }

  try {
    const response = await axios.post(
      `https://bandnol.app/api/v1/recoms/${recomsId}/replies`,
      {
        content,
        isAnonymous,
      },
      {
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ postReply 오류:', error);
    return { success: false, error };
  }
};
