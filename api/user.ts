
import axiosInstance from '@/hooks/useAxios';

export const getUserProfile = async (ownId: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/users/${ownId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
