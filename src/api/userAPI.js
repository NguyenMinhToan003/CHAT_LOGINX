import { axiosInstance } from "./index"

export const getFriends = async (userId) => {
  const response = await axiosInstance.get(`/user/get-friends?userId=${userId}`)
  return response.data
}
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/user/get-user-by-id?userId=${userId}`)
  return response.data
}