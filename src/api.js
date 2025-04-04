import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_HOST}/api`,
});

//////////! room
export const createRoomChat = async (data) => {
	const response = await axiosInstance.post(`/roomchat/create`, data)
	return response?.data;
}

// lay thong tin phng chat
export const getRoomChat = async (id) => {
	const response = await axiosInstance.get(`/roomchat/get-room-info?roomId=${id}`)
	return response?.data;
}
// lay danh sach thong tin phong chat
export const getRoomChatByUserId = async (userId,type) => {
	const response = await axiosInstance.get(`/roomchat/get-list-room-info-by-userId?userId=${userId}&type=${type}`)
	return response?.data;
}
//////////! message 
// lay tat ca cac tin nhan cua phong chat
export const getAllMessage = async (roomId,userId,page, limit) => {
	const response = await axiosInstance.post(`/message/get-message-in-room`, {
		roomId: roomId,
		userId: userId,
		page: page,
		limit: limit
	})
	return response?.data;
}
// sent message
export const createMessage = async (roomId, userId, message, followMessageId) => {
	const data = {
		roomId: roomId,
		sender: userId,
		content: message
	}
	if(followMessageId) data.followMessageId = followMessageId
	const response = await axiosInstance.post(`/message/create`, data)
	return response?.data;
}
//////////! user
export const getAllUser = async () => {
	const response = await axiosInstance.get(`/user/all`)
	return response?.data;
}
export const getDataUser = async (id) => {
	const response = await axiosInstance.post(`/user`, {
			id:id
	})
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

//////////! auth 
export const verifyToken = async (token) => {
	const response =
		await axiosInstance.get(`/auth/decode-token-login?token=${token}`,)
	return response?.data;
}