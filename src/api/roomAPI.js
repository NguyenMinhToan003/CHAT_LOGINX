import { axiosInstance } from "./index"


export const joinRoom = async ({ roomId, members }) => {
  const response = await axiosInstance.post('/roomchat/join', { roomId, members })
  return response.data
}

export const leaveRoom = async ({ roomId, userId }) => {
  const response = await axiosInstance.post('/roomchat/leave', { roomId, userId })
  return response.data
}