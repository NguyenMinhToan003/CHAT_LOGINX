import { Routes, Route } from "react-router-dom";

import Home from '../home/Home'
import User from '../user/User'
import RoomChat from '../roomchat/RoomChat'
import RoomChatId from '../roomchat/RoomChatId'
import VideoCall from '../VideoCall/VideoCall'
import Login from '../auth/Login'
import Index from "../index/Index";
import Profile from '../profile/Profile'
import Main from "../index/Main";


const AppRouter = () => {
  
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path='/roomchats' element={<RoomChat />} />
        <Route path='/roomchats/:id' element={<RoomChatId />} />
        <Route path='/video-call/:id' element={<VideoCall />} />
        <Route path='/login' element={<Login />} />
      
        <Route path='/index' element={<Main />} >
          <Route index  element={<Index />} />
          <Route path='profile/:id' element={<Profile />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      
      </Routes>

  );
};

export default AppRouter;
