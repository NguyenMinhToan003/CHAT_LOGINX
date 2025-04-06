import { axiosInstance } from "./index"

export const deleteMessage = async(messageId, userId) => {
  const response = await axiosInstance.post('/message/delete', {
    messageId,
    userId
  })
  return response.data
}
export const createMessageImage = async(data) => {
  const response = await axiosInstance.post('/message/create', data)
  return response.data
}
export const createMessage = async (roomId, userId, message, followMessageId,embedPostId) => {
  const data = {
    roomId: roomId,
    sender: userId,
    content: message
  }
  if (followMessageId) data.followMessageId = followMessageId
  if (embedPostId) data.embedPostId = embedPostId
  const response = await axiosInstance.post(`/message/create`, data)
  return response?.data;
}