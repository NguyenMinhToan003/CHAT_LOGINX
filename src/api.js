import axios from 'axios';
const axiosInstance = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_HOST}/api`,
	withCredentials: true
})

//////////! room
export const createRoomChat = async (type,name,avartar = null,admins,member) => {
	const response = await axiosInstance.post(`/roomchat/create`, {
		type: type,
		name: name,
		avartar: avartar,
		admins: admins,
		members: member
	})
	return response?.data;
}

export const getRoomChat = async (id) => {
	const response = await axiosInstance.get(`/roomchat/getRoom?roomId=${id}`)
	return response?.data;
}
export const getAllMessage = async (roomId,userId) => {
	const response = await axiosInstance.post(`/message/all`, {
		roomId: roomId,
		userId: userId
	})
	return response?.data;
}
export const createMessage = async (roomId, userId, message) => {
	const response = await axiosInstance.post(`/message/create`, {
		roomId: roomId,
		sender: userId,
		content: message
	})
	return response?.data;
}
export const getRoomChatByUserId = async (userId) => {
	const response = await axiosInstance.get(`/roomchat/getRoomChatByUserId?userId=${userId}`)
	return response?.data;
}
//////////! user
export const getAllUser = async () => {
	const response = await axiosInstance.get(`/user/all`)
	return response?.data;
}
export const getDataUser = async (id) => {
	const response = await axiosInstance.get(`/user/?id=${id}`)
	return response?.data;
}

//////////! call Stringee
export const createRoomStringee = async () => {
	const response = await axiosInstance.post(`/roomVideoCall/create-room`)
	return response?.data;
}
export const getUserTokenStringee = async (userId) => {
	const response = await axiosInstance.post(`/roomVideoCall/get-user-token`, {
		userId: userId
	})
	return response?.data;
}
export const getRoomTokenStringee = async (roomId) => {
	const response = await axiosInstance.post(`/roomVideoCall/get-room-token`, {
		roomId: roomId
	})
	return response?.data;
}

//////! peerjs server
export const getIceServer = async () => {
	const response = await axiosInstance.get(`/peer-server/get-ice-server`)
	return response?.data;
}

//////! auth
export const getUserWithCookieServer = async () => {
	const response = await axiosInstance.post(`/auth/user`)
	return response?.data;
}