import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

export const fetchAIComment = async (title: string, artist: string) => {
  try {
    const response = await axios.post(
      'https://bandnol.app/api/v1/recoms/ai-comment',
      {
        title,
        artist,
      },
      {
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('fetchAIComment 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ AI 코멘트 생성 오류:', error);
    return null;
  }
};
