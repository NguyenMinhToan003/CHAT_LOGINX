import { useEffect, useState } from 'react';
import { createRoomChat, getAllUser, getRoomChatByUserId } from '../api';
import { useNavigate } from 'react-router-dom';
import './RoomChat.css';
import { Avatar, Button } from '@mui/material';

const RoomChat = () => {
  const navigate = useNavigate();
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};
  const [roomType, setRoomType] = useState('group');
  const [roomName, setRoomName] = useState('');
  const [avatar, setAvatar] = useState('');
  const owner = userLocal?._id;
  const [member, setMember] = useState(userLocal?._id ? [userLocal._id] : []);
  const [users, setUsers] = useState([]);
  const [roomChats, setRoomChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [popupSearchTerm, setPopupSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await getAllUser();
      setUsers(response);
      const roomChatsResponse = await getRoomChatByUserId(userLocal?._id, 'group');
      setRoomChats(roomChatsResponse);
    } catch (err) {
      setError('Không thể tải danh sách người dùng hoặc phòng chat');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName || !owner) {
      setError('Tên phòng và chủ phòng là bắt buộc!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const formdata = new FormData();
      formdata.append('files', avatar);
      formdata.append('type', roomType);
      formdata.append('name', roomName);
      member.forEach((m) => formdata.append('members', m));
      formdata.append('admins[0]', userLocal._id);
      const response = await createRoomChat(formdata);

      if (response.insertedId) {
        navigate(`/roomchats/${response.insertedId}`);
        setSuccessMessage('Tạo phòng thành công!');
        setRoomName('');
        setAvatar('');
        setMember([userLocal?._id]);
        setShowPopup(false);
      } else {
        setError('Tạo phòng thất bại!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (id) => {
    if (member.includes(id)) {
      setMember(member.filter((item) => item !== id));
    } else {
      setMember([...member, id]);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popupFilteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(popupSearchTerm.toLowerCase())
  );

  const resetPopup = () => {
    setRoomType('group');
    setRoomName('');
    setAvatar('');
    setMember(userLocal?._id ? [userLocal._id] : []);
    setPopupSearchTerm('');
    setError(null);
    setSuccessMessage('');
  };

  const openPopup = () => {
    resetPopup();
    setShowPopup(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="room-chat-container">
      <Button
        onClick={() => handleCancel()}
        sx={{
          backgroundColor: '#000000',
          color: '#ffffff',
          margin: '8px',
          '&:hover': { backgroundColor: '#333333', color: '#ffffff' },
        }}
      >
        Quay Lại
      </Button>
      <div className="room-chat-fullscreen">
        {/* Left Side - Users List */}
        <div className="users-panel">
          <div className="panel-header">
            <h2 className="panel-title">Danh sách người dùng</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="users-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="user-card"
                  onClick={() => navigate(`/chat-user/${user._id}`)}
                >
                  <div className="user-avatar">
                    <Avatar src={user?.picture?.url} />
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results-message">Không tìm thấy người dùng</p>
            )}
          </div>
        </div>

        {/* Right Side - Room List */}
        <div className="rooms-panel">
          <div className="panel-header">
            <h2 className="panel-title">Phòng chat của bạn</h2>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#333333',
                  color: '#ffffff',
                },
              }}
              onClick={openPopup}
            >
              Tạo phòng chat
            </Button>
          </div>

          <div className="room-list">
            {roomChats.length > 0 ? (
              roomChats.map((roomChat) => (
                <div
                  key={roomChat._id}
                  onClick={() => navigate(`/roomchats/${roomChat._id}`)}
                  className="room-card"
                >
                  <div className="room-card-content">
                    <div className="room-avatar">
                      <Avatar src={roomChat?.info?.avartar?.url} />
                    </div>
                    <div className="room-info">
                      <h3 className="room-name">{roomChat.info.name}</h3>
                      <p className="room-type">
                        {roomChat.type === 'group' ? 'Nhóm' : 'Riêng tư'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-rooms-message">Bạn chưa có phòng chat nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Room Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h2>Tạo phòng chat mới</h2>
              <button className="close-button" onClick={() => setShowPopup(false)}>
                ×
              </button>
            </div>

            <div className="popup-content">
              <div className="form-group">
                <label className="form-label">Loại phòng</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="form-select"
                >
                  <option value="group">Nhóm</option>
                  <option value="private">Riêng tư</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tên phòng</label>
                <input
                  type="text"
                  placeholder="Nhập tên phòng chat"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ảnh đại diện</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="form-input"
                />
              </div>

              <div className="form-group member-selection-section">
                <label className="form-label">Chọn thành viên</label>
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={popupSearchTerm}
                  onChange={(e) => setPopupSearchTerm(e.target.value)}
                  className="form-input"
                />

                <div className="members-selection-list">
                  {popupFilteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`member-selection-item ${
                        member.includes(user._id) ? 'selected' : ''
                      }`}
                      onClick={() => handleAddMember(user._id)}
                    >
                      <div className="user-avatar small">
                        <Avatar src={user?.picture?.url} />
                      </div>
                      <span className="member-name">{user.name}</span>
                      <span className="selection-indicator">
                        {member.includes(user._id) ? '✓' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="members-count">
                  <span>Đã chọn {member.length} thành viên</span>
                </div>
              </div>
            </div>

            <div className="popup-footer">
              <button className="cancel-button" onClick={() => setShowPopup(false)}>
                Hủy
              </button>
              <button
                className="create-room-button"
                onClick={handleCreateRoom}
                disabled={loading}
              >
                {loading ? 'Đang tạo...' : 'Tạo phòng chat'}
              </button>
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomChat;