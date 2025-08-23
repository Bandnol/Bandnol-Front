import api from '@/hooks/useAxios';

export interface SentRecomsResponse {
  success: boolean;
  data:
    | {
        id: string;
        createdAt: string;
        recomsSong: {
          id: string;
          title: string;
          artistName: string;
          imgUrl: string;
        };
        receiver: {
          id: string;
          nickname: string;
        };
        // 🚀추가: sender 객체와 recomsTime 필드 추가
        sender: {
          id: string;
          recomsTime: string;
        };
        replyId: string;
      }
    | [];
  error: null;
}

export async function fetchSentRecoms(): Promise<SentRecomsResponse> {
  const { data } = await api.get('/api/v1/recoms/sent');
  return data;
}
