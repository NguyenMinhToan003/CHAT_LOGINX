import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_HOST}/api`,
  headers: {
    "Content-Type": "application/json"
  }
})