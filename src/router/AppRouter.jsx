import { Routes, Route, useNavigate } from "react-router-dom";

import Home from '../home/Home'
import User from '../user/User'
import RoomChat from '../roomchat/RoomChat'
import RoomChatId from '../roomchat/RoomChatId'
import VideoCall from '../VideoCall/VideoCall'
import Login from '../auth/Login'
import Index from "../index/Index";
import Profile from '../profile/Profile'
import Main from "../index/Main";
import RoomChatPrivate from "../roomchat/RoomChatPrivate";
import StatusAddSocial from "../StatusAddSocial/StatusAddSocial";


const AppRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const routerNow = window.location.pathname;
  if (!user && routerNow !== '/') {
    window.location.href = '/';
  }
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path='/roomchats' element={<RoomChat />} />
        <Route path='/roomchats/:id' element={<RoomChatId />} />
        <Route path='/video-call/:id' element={<VideoCall />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat-user/:id' element={<RoomChatPrivate />} />
        <Route path='/index' element={<Main />} >
          <Route index  element={<Index />} />
          <Route path='profile/:id' element={<Profile />} />
        <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/addSocial/:code' element={<StatusAddSocial />} />
      </Routes>

  );
};

export default AppRouter;
