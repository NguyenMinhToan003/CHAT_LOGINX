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

export const deletePost = async ({ postId, authorId }) => {

  const response = await axiosInstance.post(`/post/delete`, {

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
export const updateProfilePicture = async (userId, name, files) => {
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


// In postAPI.js, add this function
export const getPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/post/get-post-by-id?postId=${postId}`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};



export const deleteComment = async ({ commentId, authorId }) => {
  try {
    const response = await axiosInstance.post(`/post/delete-comment`, {
      commentId,
      authorId,
    });
    return response?.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};


// API cập nhật bài viết
// API cập nhật bài viết
export const updatePost = async ({ postId, content, authorId, files, deleteFiles }) => {
  try {
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', content);
    formData.append('authorId', authorId);

    // Thêm danh sách public_id của các hình ảnh cần xóa (nếu có)
    if (deleteFiles && deleteFiles.length > 0) {
      deleteFiles.forEach((file) => {
        formData.append('deleteFiles', file);
      });
    }

    // Thêm hình ảnh mới
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    const response = await axiosInstance.post(`/post/edit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const searchPost = async (content) => {

  try {
    const response = await axiosInstance.get(`post/search?content=${encodeURIComponent(content)}`);
    return response.data;

  } catch (error) {
    console.log("error search posts:", error);
    throw error;

  }
}


