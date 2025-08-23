import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import axiosInstance from '@/hooks/useAxios';
import axios from 'axios';

export function useAIRecommend() {

  const getAIComment = useCallback(
    async (title: string, artist: string) => {
      console.log('[AIRecommend] 요청 데이터:', { title, artist });
      const res = await axiosInstance.post('/api/v1/recoms/ai-comment', { title, artist });
      console.log('[AIRecommend] 응답 데이터:', res.data);
      return res.data;
    },
    [],
  );

  return { getAIComment };
}

export const fetchAIComment = async (title: string, artist: string) => {
  try {
    console.log('[AIRecommend] fetchAIComment 호출:', { title, artist });
    const token = await SecureStore.getItemAsync('JWTToken');
    console.log('[AIRecommend] JWTToken:', token);
    if (!token) {
      console.error('AI 코멘트 요청 실패: JWTToken 없음');
      return null;
    }

    const response = await axios.post(
      'https://bandnol.app/api/v1/recoms/ai-comment',
      { title, artist },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('[AIRecommend] 서버 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('AI 코멘트 생성 오류:', error);
    return null;
  }
};
