import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

export const postReplyAsRecoms = async (
  id: string,
  comment: string,
  isAnonymous: boolean,
  title: string,
  artist: string,
  isCommentAIUse = true,
) => {
  const body = {
    id,
    title,
    artist,
    isAnonymous,
    isCommentAIUse,
    comment,
  };

  console.log('🚀 POST BODY:', body);

  try {
    const response = await axios.post(
      'https://bandnol.app/api/v1/recoms/',
      body,
      {
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ postReplyAsRecoms 오류:', error);
    console.log('📩 API 응답 상태:', error.response?.status);
    console.log('📩 API 응답 메시지 전체:', error.response?.data);
    console.log('📩 에러 상세:', error.response?.data?.error);
    console.log('📩 에러 메시지:', error.response?.data?.error?.message);
    return { success: false, error };
  }
};
