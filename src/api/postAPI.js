import { axiosInstance } from "./index"

export const getPosts = async (userId) => {
  const response = await axiosInstance.get(`/post/get-posts-friend?userId=${userId}`)
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