import { axiosInstance } from "./index"

export const getRoomChat = async (id) => {
  const response = await axiosInstance.get(`/roomchat/get-room-info?roomId=${id}`)
  return response?.data;
}

export const joinRoom = async ({ roomId, members }) => {
  const response = await axiosInstance.post('/roomchat/join', { roomId, members })
  return response.data
}

export const leaveRoom = async ({ roomId, userId }) => {
  const response = await axiosInstance.post('/roomchat/leave', { roomId, userId })
  return response.data
}
export const findOrCreateRoomPrivate = async (userSearchId, userOrtherId) => {
  const response = await axiosInstance.post('/roomchat/find-or-create-room-private',
    { 
      userSearchId,
      userOrtherId
     })
  return response.data
}

export const delateRoom = async ({roomId,userId}) => {
  const response = await axiosInstance.post('/roomchat/delete', { roomId, userId })
  return response.data
}

export const updateRoom = async (formData) => {
  const response = await axiosInstance.post('/roomchat/update-info', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}