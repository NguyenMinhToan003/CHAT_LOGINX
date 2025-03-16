import { axiosInstance } from "./index"

export const getFriends = async (userId) => {
  const response = await axiosInstance.get(`/user/get-friends?userId=${userId}`)
  return response.data
}