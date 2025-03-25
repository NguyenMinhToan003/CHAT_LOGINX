import { axiosInstance } from "./index"


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

export const updateRoom = async ({roomId,name,admins,userAction}) => {
  const response = await axiosInstance.post('/roomchat/update-info', { roomId,name,admins,userAction })
  return response.data
}