import { axiosInstance } from './index';

export const fetchSearchResults = async (name) => {
  try {
    const response = await axiosInstance.get('/user/search', {
      params: { name }
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error?.response?.data || error.message);
    return [];
  }
};
