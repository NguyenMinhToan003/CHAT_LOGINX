    import axios from 'axios';

   

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_SERVER_HOST}/api`,
    });

   

  

    // API tạo bài viết mới
    export const createPost = async (formData) => {
        try {
            const response = await axiosInstance.post('/post/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response?.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    };

    // API cập nhật ảnh đại diện người dùng
    export const updateProfilePicture = async (userId, name,files) => {
        try {
          const formData = new FormData();
          formData.append('userId', userId);
          formData.append('name', name);
          formData.append('files', files);
      
          const response = await axiosInstance.post('/user/edit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response?.data;
        } catch (error) {
          console.error('Error updating profile picture:', error);
          throw error;
        }
      };





   
   
   
