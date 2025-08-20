import axiosInstance from '@/hooks/useAxios';

export const postReplyAsRecoms = async (
  id: string,
  comment: string,
  isAnoymous: boolean,
) => {
  const body = {
    id,
    comment,
    isAnoymous: isAnoymous, // 서버 명세에 따라 isAnoymous 필드명 사용
  };

  console.log('🚀 POST BODY:', body);

  try {
    const response = await axiosInstance.post(`/api/v1/recoms/`, body);

    return { success: true, data: response.data };
  } catch (err: any) {
    console.error(
      '❌ postReplyAsRecoms 오류:',
      err?.message,
      err?.response?.status,
      err?.config?.url,
    );
    return { success: false, err };
  }
};
