import { useEffect, useRef, useState } from "react";
import { createMessage, getAllMessage, getRoomChat } from "../api";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import audio from "../../public/sound/message-notification.mp3"
import "./RoomChatId.css"; // Import file CSS riêng

const RoomChatId = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const audioRef = useRef(null);

  const handleChangeMessage = (e) => setMessage(e.target.value);

  const handleSentMessage = async () => {
    const response = await createMessage(id, user._id, message);
    if (response.insertedId) {
      socket.emit("message", {
        content: message,
        _id: response.insertedId,
        sender: {
          _id: user._id,
          name: user.name,
          picture: user.picture,
        },  
        roomId: id,
      });
      setMessage("");
    }
  };


  const fetchRoom = async () => {
    try {
      const response = await getRoomChat(id);
      if (Array.isArray(response) && response.length > 0) {
        setRoom(response[0]);
        const resMess = await getAllMessage(id, user._id);
        setMessages(Array.isArray(resMess) ? resMess : [resMess.message]);
        socket.emit("join-room", { roomId: id, user: user._id });
      }
    } catch (error) {
      console.error("Lỗi khi fetch room chat:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
      if (audioRef.current && data.sender._id !== user._id) {
        audioRef.current.play();
      }
    });

   
    return () => {
      socket.off("message");
    };
  }, [socket]);

  return (
    <div className="chat-container">
      <audio ref={audioRef} src={audio} />
      {room ? (
        <div className="chat-box">
          {/* Sidebar hiển thị admin */}
          <div className="sidebar">
            <h3>Admin</h3>
            {room.info.admins.map((admin) => (
              <div key={admin._id} className="admin-info">
                <img src={admin.picture} alt={admin.name} className="avatar" />
                <span>{admin.name}</span>
              </div>
            ))}
            <h3>Online</h3>
            {
              
            }
          </div>

          <div className="chat-content">
            <div className="chat-header">
              <h2>{room.info.name}</h2>
              <button className="video-call-btn">📹 Video Call</button>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="chat-messages">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`message-box ${item.sender._id === user._id ? "sent" : "received"}`}
                >
                  {item.sender !== user._id && (
                    <img src={item.sender.picture} alt={item.sender.name} className="message-avatar" />
                  )}
                  <div className="message-content">
                    {item.sender !== user._id && <span className="sender-name">{item.sender.name}</span>}
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ô nhập tin nhắn */}
            <div className="chat-input">
              <input type="text" placeholder="Nhập tin nhắn..." value={message} onChange={handleChangeMessage} />
              <button onClick={handleSentMessage}>Gửi</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default RoomChatId;
