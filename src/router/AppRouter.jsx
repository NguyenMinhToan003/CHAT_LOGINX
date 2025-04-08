import { Routes, Route, Navigate } from "react-router-dom";

import Home from '../home/Home';
import User from '../user/User';
import RoomChat from '../roomchat/RoomChat';
import RoomChatId from '../roomchat/RoomChatId';
import VideoCall from '../VideoCall/VideoCall';
import Login from '../auth/Login';
import Index from "../index/Index";
import Profile from '../profile/Profile';
import Main from "../index/Main";
import RoomChatPrivate from "../roomchat/RoomChatPrivate";
import StatusAddSocial from "../StatusAddSocial/StatusAddSocial";
import NotFound from "./NotFound";
import Register from "../auth/Register";
import SinglePost from "../components/SinglePost";

const AppRouter = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const notCheckUser = [
    '/login',
    '/register',
  ]
  if (!user && !notCheckUser.includes(window.location.pathname)) {
    window.location.href = "/login"
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />  
      {/* Các route yêu cầu user phải đăng nhập */}
      {user ? (
        <>
          <Route path="/user" element={<User />} />
          <Route path="/roomchats" element={<RoomChat />} />
          <Route path="/roomchats/:id" element={<RoomChatId />} />
          <Route path="/video-call/:id" element={<VideoCall />} />
          <Route path="/chat-user/:id" element={<RoomChatPrivate />} />
          <Route path="/index" element={<Main />}>
            <Route index element={<Index />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            

           
           
          </Route>
          <Route path="/addSocial/:code" element={<StatusAddSocial />} />

          <Route path="/post/:postId" element={<SinglePost />} />

         

        </>
      ) : (
        // Nếu user chưa đăng nhập, chuyển hướng về "/"
        <Route path="*" element={<Navigate to="/" replace />} />
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
