import axiosInstance from '@/hooks/useAxios';

export const postReplyAsRecoms = async (
  id: string,
  comment: string,
  isAnonymous: boolean,
) => {
  const body = {
    id,
    comment,
    isAnoymous: isAnonymous, // 서버 명세에 따라 isAnoymous 필드명 사용
  };

  console.log('🚀 POST BODY:', body);

  try {
    const response = await axiosInstance.post(
      `/api/v1/recoms/`,
      body,
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ postReplyAsRecoms 오류:', error);
    return { success: false, error };
  }
};
