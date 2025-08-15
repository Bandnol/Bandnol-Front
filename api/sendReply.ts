import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
    const token = await SecureStore.getItemAsync('JWTToken');
    console.log('[postReply] JWTToken:', token);

    const response = await axios.post(
      `https://bandnol.app/api/v1/recoms/${recomsId}/replies`,
      {
        content,
        isAnonymous,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('[postReply] 서버 응답:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('postReply 오류:', error);
    return { success: false, error };
  }
};
