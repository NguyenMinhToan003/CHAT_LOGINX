import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import User from "../User/User";
import Home from "../home/Home";
import RoomChat from "../roomchat/RoomChat";
import RoomChatId from "../roomchat/RoomChatId";
import RoomChatVideoCall from "../roomchat/RoomChatVideoCall";
import Profile from "../VideoCall/VideoCall";
import Login from "../auth/Login";



const AppRouter = () => {
  
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path='/roomchats' element={<RoomChat />} />
        <Route path='/roomchats/:id' element={<RoomChatId />} />
        <Route path='/video-call/:id' element={<Profile/>} />
      <Route path='/roomChatVideoCall/:id' element={<RoomChatVideoCall />} />
      <Route path='/login' element={<Login />} />
      </Routes>

  );
};

export default AppRouter;
