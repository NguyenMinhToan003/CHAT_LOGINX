import { useEffect, useState } from "react";
import { createRoomChat, getAllUser, getRoomChatByUserId } from '../../api';

const userLocal =JSON.parse(localStorage.getItem('user'));
const RoomChat = () => {
  const [roomType, setRoomType] = useState("group");
  const [roomName, setRoomName] = useState("");
  const [avatar, setAvatar] = useState("");
  const owner = userLocal?._id
  const [member, setMember] = useState(userLocal ? [userLocal?._id] : []);
  const [users, setUsers] = useState([]);
  const [roomChats , setRoomChats] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  

  const fetchUsers = async () => {
    const response = await getAllUser()
    setUsers(response)
    const roomChatsResponse = await getRoomChatByUserId(userLocal?._id)
    setRoomChats(roomChatsResponse)
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  
const handleCreateRoom = async () => {
  if (!roomName || !owner) {
    setError("Tên phòng và chủ phòng là bắt buộc!");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccessMessage("");

  try {
    const response = await createRoomChat(roomType, roomName, avatar, [owner], member);

    if (response.insertedId) {
      window.location.href = `/roomchats/${response.insertedId}`;
      setSuccessMessage("Tạo phòng thành công!");
      setRoomName("");
      setAvatar("");
      setMember([]);
    }
    else {
      setError("Tạo phòng thất bại!");
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleAddMember = (id) => {
    if (member.includes(id)) {
      setMember(member.filter((item) => item !== id))
    } else {
      setMember([...member, id])
    }
  }


  return (
       <>
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Tạo phòng chat</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={{ padding: "8px" }}>
          <option value="group">Nhóm</option>
          <option value="private">Riêng tư</option>
        </select>

        <input 
          type="text" 
          placeholder="Tên phòng" 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} 
          style={{ padding: "8px" }}
        />

        <input 
          type="text" 
          placeholder="URL ảnh đại diện (tùy chọn)" 
          value={avatar} 
          onChange={(e) => setAvatar(e.target.value)} 
          style={{ padding: "8px" }}
        />


        {
  users.length > 0 && users.map((user) => (
    <button key={user._id} onClick={() => handleAddMember(user._id)} style={{ padding: "8px", cursor: "pointer" }}>
      {user.name}
      {
        member.includes(user._id) ? " (Đã thêm)" : ""
      }
    </button>
  ))
}



        <button onClick={handleCreateRoom} disabled={loading} style={{ padding: "10px", cursor: "pointer" }}>
          {loading ? "Đang tạo..." : "Tạo phòng chat"}
        </button>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

    </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', padding: '20px' }}>
        {
          roomChats.length > 0 && roomChats.map((roomChat) => (
            <a href={`/roomchats/${roomChat._id}`} key={roomChat._id} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer", display:'block'}} onClick={() => window.location.href = `/roomchats/${roomChat._id}`}>
              <p><strong>Name:</strong> {roomChat.info.name}</p>
              <p><strong>Type:</strong> {roomChat.type}</p>
              <div style={{ width: "50px", height: "50px" }}>
                <img src={roomChat.info.avartar} style={{width:'100%', height:'100%'}}/>
              </div>
            </a>
          ))
        }
      </div>
   
      
      </>
  );
};

export default RoomChat;
