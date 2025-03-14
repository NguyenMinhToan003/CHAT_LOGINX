import { Routes, Route } from "react-router-dom";

import Home from '../pages/home/Home'
import User from '../pages/user/User'
import RoomChat from '../pages/roomChat/RoomChat'
import RoomChatId from '../pages/roomChat/RoomChatId'
import Login from '../auth/Login'
import VideoCall from "../pages/VideoCall/VideoCall";



const AppRouter = () => {
  
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path='/roomchats' element={<RoomChat />} />
        <Route path='/roomchats/:id' element={<RoomChatId />} />
        <Route path='/video-call/:id' element={<VideoCall />} />
        <Route path='/login' element={<Login />} />
      </Routes>

  );
};

export default AppRouter;
