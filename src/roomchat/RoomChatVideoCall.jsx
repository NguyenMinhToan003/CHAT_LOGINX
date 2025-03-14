
import { useParams } from "react-router-dom";


const RoomChatVideoCall = () => {
  const { id } = useParams(); // Lấy roomId từ URL params
  const user = JSON.parse(localStorage.getItem("user"));


  return (
    <>
      <div>Room ID: {id}</div>
     
    </>
  );
};

export default RoomChatVideoCall;