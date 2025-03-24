import { useParams } from "react-router-dom"

const StatusAddSocial = () => {
  const { code } = useParams()
  return <>
    {code === '1' && <h1>Tài Khoản đã kết nối rồi</h1>}
    {code === '2' && <h1>Đã kết nối tài khoản Github</h1>}
  </>
}
export default StatusAddSocial