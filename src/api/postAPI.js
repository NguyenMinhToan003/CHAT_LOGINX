import { axiosInstance } from "./index"

export const getPosts = async (userId) => {
  const response = await axiosInstance.get(`/post/get-posts-index-show?userId=${userId}`)
  return response.data
}

export const getPostByAuthorId = async ({ authorId, userId }) => {
  const response = await axiosInstance.get(`/post/get-post-by-author-id?authorId=${authorId}&userId=${userId}`)
  return response.data
}

export const reactPost = async ({ postId, userId, type }) => {
  const response = await axiosInstance.post(`/post/interaction`, {
    postId,
    userId,
    type
  })
  return response.data
}

export const  deletePost=async ({postId,authorId})=>{

  const response =await axiosInstance.post(`/post/delete`,{

    postId,
    authorId
  })

  return response.data
}

   

  

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
