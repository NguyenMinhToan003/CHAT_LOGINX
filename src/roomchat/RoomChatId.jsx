import { useEffect, useState } from "react";
import { createMessage, createRoomStringee, getAllMessage, getRoomChat } from "../api";
import { useParams } from "react-router-dom";
import { socket } from "../socket";

const RoomChatId = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [usersOnline, setUsersOnline] = useState([])
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const handleChangeMessage = (e) => {
    setMessage(e.target.value)
  }
  const handleSentMessage = async() => {
    const response = await createMessage(id, user._id, message)
    if (response.insertedId) {
      socket.emit('message', {
        content: message,
        _id: response.insertedId,
        sender: user._id,
        roomId: id
      })
      setMessage('')
    }
  }

  const fetchRoom = async () => {
    try {
      const response = await getRoomChat(id); // Chờ dữ liệu trả về
      if (Array.isArray(response) && response.length > 0) {
        setRoom(response[0]); // Chỉ lấy phần tử đầu tiên nếu có dữ liệu
        const resMess = await getAllMessage(id, user._id)
        if (Array.isArray(resMess)) {
          setMessages(resMess)
          socket.emit('join-room', {
            roomId: id,
            user: user._id
          })
        }
        else {
          setMessages([resMess.message])
        }
      }
    } catch (error) {
      console.error("Lỗi khi fetch room chat:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data])
    })
    socket.on('getListUsers', (data) => {
      console.log('getLs user online:', data)
      setUsersOnline(data)
    })
  }, [socket])

  const handleVideoCall = async () => {
    try {
    const createdRoom = await createRoomStringee();
      window.location.href = `/roomChatVideoCall/${createdRoom.roomId}`;
  } catch (error) {
    console.error('Lỗi trong handleVideoCall:', error);
  }
  };
  
  useEffect(() => {
    
  },[ ])

  return (
    <>
      <h1>Room Chat</h1>
      {room ? (
        <div>
          <button onClick={handleVideoCall}>video call</button>
          <p><strong>Id:</strong> {room._id}</p>
          <p><strong>Name:</strong> {room.info.name}</p>
          <p><strong>Type:</strong> {room.type}</p>
          <p><strong>Avatar:</strong> {room.info.avartar}</p>

          <p><strong>Admin:</strong></p>
          <ul>
            {room.info.admins.map((admin) => (
              <li key={admin._id}>
                <img src={admin.picture} alt={admin.name} width="30" style={{ borderRadius: "50%" }} /> {admin.name}
              </li>
            ))}
          </ul>

          <p><strong>Danh sách thành viên:</strong></p>
          <ul>
            {room.members.map((member) => (
              <li key={member._id}>
                <img src={member.picture} alt={member.name} width="30" style={{ borderRadius: "50%" }} /> {member.name}
                {
                  usersOnline.includes(member._id) && <span style={{color:'green'}}> - Online</span>
                }
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <p>Tin nhan </p>
      
      {
       messages.length > 0 && messages.map((item, index) => (
         <p key={index}>{item?.content}</p>
        ))
      }
      <input 
        onChange={handleChangeMessage}
        value={message}
      />
      <button onClick={handleSentMessage}>Gui</button>
    </>
  );
};

export default RoomChatId;
