import axios from 'axios';
// const host = 'https://loginx.onrender.com/api'
const host = 'http://localhost:8123/api'
//////////! room
export const createRoomChat = async (type,name,avartar = null,admins,member) => {
	const response = await axios.post(`${host}/roomchat/create`, {
		type: type,
		name: name,
		avartar: avartar,
		admins: admins,
		members: member
	})
	return response?.data;
}

export const getRoomChat = async (id) => {
	const response = await axios.get(`${host}/roomchat/getRoom?roomId=${id}`)
	return response?.data;
}
export const getAllMessage = async (roomId,userId) => {
	const response = await axios.post(`${host}/message/all`, {
		roomId: roomId,
		userId: userId
	})
	return response?.data;
}
export const createMessage = async (roomId, userId, message) => {
	const response = await axios.post(`${host}/message/create`, {
		roomId: roomId,
		sender: userId,
		content: message
	})
	return response?.data;
}
export const getRoomChatByUserId = async (userId) => {
	const response = await axios.get(`${host}//roomchat/getRoomChatByUserId?userId=${userId}`)
	return response?.data;
}
//////////! user
export const getAllUser = async () => {
	const response = await axios.get(`${host}/user/all`)
	return response?.data;
}
export const getDataUser = async (id) => {
	const response = await axios.post(`${host}/user`, {
			id:id
	})
	return response?.data;
}

//////////! call Stringee
export const createRoomStringee = async () => {
	const response = await axios.post(`${host}/roomVideoCall/create-room`)
	return response?.data;
}
export const getUserTokenStringee = async (userId) => {
	const response = await axios.post(`${host}/roomVideoCall/get-user-token`, {
		userId: userId
	})
	return response?.data;
}
export const getRoomTokenStringee = async (roomId) => {
	const response = await axios.post(`${host}/roomVideoCall/get-room-token`, {
		roomId: roomId
	})
	return response?.data;
}