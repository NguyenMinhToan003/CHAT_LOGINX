import { Outlet } from "react-router-dom"
import Sidebar from "../components/SideBar"
import './index.css'
const Main = () => {
  return <>
    <div className="body">
      <div className="home-page">
        <Sidebar />
        <Outlet/>
      </div>
    </div>
      
   </>
}
export default Main