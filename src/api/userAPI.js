import { axiosInstance } from "./index"

export const getFriends = async (userId) => {
  const response = await axiosInstance.get(`/user/get-friends?userId=${userId}`)
  return response.data
}
//lấy user theo id
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/user/get-user-by-id?userId=${userId}`)
  return response.data
}
export const searchUser = async (search) => {
  const response = await axiosInstance.get(`/user/search?name=${search}`)
  return response.data
}
//lấy tất cả user
export const getAllUser = async () => {
  const response = await axiosInstance.get(`/user/all`)
  return response.data
}




  // API cập nhật ảnh đại diện người dùng
  
  export const updateProfilePicture = async (userId, name, files) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('name', name);
        
        // Only append files if they exist
        if (files) {
            formData.append('files', files);
        }
    
        const response = await axiosInstance.post('/user/edit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response?.data;
    } catch (error) {
        console.error('Error updating profile picture:', error);
        throw error;
    }
};
      export const getPostByAuthorId = async ({ authorId, userId }) => {
        const response = await axiosInstance.get(`/post/get-post-by-author-id?authorId=${authorId}&userId=${userId}`)
        return response.data
      }




      export const sendFriendRequest = async (senderId, receiverId) => {
        try {
          const response = await axiosInstance.post('/user/send-friend-request', {
            senderId,
            receiverId
          });
          return response.data;
        } catch (error) {
          console.error('Error sending friend request:', error);
          throw error;
        }
      };
      
      // API to check friend status
      export const checkFriendStatus = async (userId1, userId2) => {
        try {
          const response = await axiosInstance.get(`/user/check-friend-status?userId1=${userId1}&userId2=${userId2}`);
          return response.data;
        } catch (error) {
          console.error('Error checking friend status:', error);
          throw error;
        }
      };