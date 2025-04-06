import { axiosInstance } from "./index"
export const loginLocal = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password
  })
  return response.data
}

export const registerLocal = async (email, password, name) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
    name
  })
  return response.data
}