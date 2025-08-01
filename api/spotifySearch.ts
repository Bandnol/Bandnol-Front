import { EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';

export const searchSpotifySong = async (keyword: string) => {
  try {
    const response = await axios.get(
      'https://bandnol.app/api/v1/recoms/search/song',
      {
        params: { keyword },
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('🎯 searchSpotifySong 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ searchSpotifySong 오류:', error);
    return null;
  }
};
