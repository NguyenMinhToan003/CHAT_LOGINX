import { axiosInstance } from "./index"

export const deleteMessage = async(messageId, userId) => {
  const response = await axiosInstance.post('/message/delete', {
    messageId,
    userId
  })
  return response.data
}