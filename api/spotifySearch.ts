import { API_URL } from '@/constants/env';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const searchSpotifySong = async (keyword: string) => {
  try {
    const jwtToken = await SecureStore.getItemAsync('JWTToken');
    console.log('Retrieved JWT Token:', jwtToken);
    const response = await axios.get(
      `${API_URL}/api/v1/recoms/search/song`,
      {
        params: { keyword },
        headers: {
          Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('searchSpotifySong 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('searchSpotifySong 오류:', error);
    return null;
  }
};
