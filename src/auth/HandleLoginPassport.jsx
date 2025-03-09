import { useEffect } from "react";
import { getUserWithCookieServer } from "../api";

const HandleLoginPassport = () => {
  const fetchLogin = async () => {
    const response = await getUserWithCookieServer()
    if(response?.data) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
      window.location.href = `user`
    }
  }
  useEffect(() => {
    fetchLogin()
  })
}
export default HandleLoginPassport;