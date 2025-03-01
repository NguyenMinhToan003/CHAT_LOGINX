import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import User from "../User/User";
import Home from "../Home";
import RoomChat from "../roomchat/RoomChat";
import RoomChatId from "../roomchat/RoomChatId";
import RoomChatVideoCall from "../roomchat/RoomChatVideoCall";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />
        <Route path='/roomchats' element={<RoomChat />} />
        <Route path='/roomchats/:id' element={<RoomChatId />} />
        <Route path='/roomChatVideoCall/:id' element={<RoomChatVideoCall />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
