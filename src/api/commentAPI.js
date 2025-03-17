import { axiosInstance } from "./index"

export const getComments = async (postId) => {
  const response = await axiosInstance.get(`/post/get-comments?postId=${postId}`)
  return response.data
}

export const getCommentFollowCommentId = async (commentId) => {
  const response =
    await axiosInstance.get(`/post/get-comment-follow-comment-id?commentId=${commentId}`)
  return response.data
}

export const createComment = async ({ postId, authorId, content, followCommentId }) => {
  const response = await axiosInstance.post(`/post/comment`, {
    postId,
    authorId,
    content,
    followCommentId
  })
  return response.data
}

