import { Routes, Route } from "react-router-dom";

import Home from '../home/Home'
import User from '../user/User'
import RoomChat from '../roomchat/RoomChat'
import RoomChatId from '../roomchat/RoomChatId'
import VideoCall from '../VideoCall/VideoCall'
import Login from '../auth/Login'


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
