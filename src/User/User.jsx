/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import { getDataUser, getAllUser } from '../api';
import IsCommingCall from '../router/components/IsCommingCall';
import { FaGithub, FaTwitter } from 'react-icons/fa'; // Import GitHub và Twitter icons
import './User.css'; // Import file CSS

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [listUsers, setListUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const videoRef = useRef(null);
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null,
  });
  const [allUser, setAllUser] = useState([]);

  const fetchUser = async () => {
    const response = await getDataUser(id);
    localStorage.setItem('user', JSON.stringify(response));
    const allUserData = await getAllUser();
    setAllUser(allUserData);
    setUser(response);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    socket.on('getListUsers', (data) => setListUsers(data));
    socket.on('inCommingCall', (data) => setOnCommingCall(data));
    return () => {
      socket.off('getListUsers');
      socket.off('inCommingCall');
    };
  }, [socket]);

  const getMediaStream = async () => {
    if (localStream) return localStream;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
    }
  };

  const handleCallVideo = async (userReceiver) => {
    const callData = {
      receiver: userReceiver,
      sender: { userId: id, name: user.name, picture: user.picture },
      isRinging: true,
    };
    const stream = await getMediaStream();
    if (!stream) return console.log('Stream is not available');
    socket.emit('callVideo', callData);
  };

  const handleAcceptCall = async () => {
    setOnCommingCall((prev) => ({ ...prev, isRinging: false }));
    await getMediaStream();
  };

  const handleHangup = () => {
    setOnCommingCall((prev) => ({ ...prev, isRinging: false }));
  };

  // Hàm xử lý logout
  const handleLogout = () => {
    
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Hàm để chọn icon dựa trên typeAccount
  const getAccountTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'github':
        return <FaGithub className='icon' />;
      case 'twitter':
        return <FaTwitter className='icon' />;
      default:
        return null;
    }
  };

  return (
    <div className='container'>
      {onCommingCall.isRinging && (
        <IsCommingCall
          handleAcceptCall={handleAcceptCall}
          handleHangup={handleHangup}
          onCommingCall={onCommingCall}
        />
      )}

      {/* Header Section */}
      <header className='header'>

        <div className='button-group'>
          <div>
            <h4 className='title'>{user?.name || 'User'}</h4>
            <p className='subtitle'>User ID: {id}</p>
          </div>
          <img src={user?.picture} alt='avatar' className='avatar' />
          <a href='/roomchats' className='chat-button'>
            Room Chat
          </a>
          <button className='logout-button' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className='main-content'>
        {/* Video Section - Commented out */}
        {/* <div className='video-section'>
          <video ref={videoRef} autoPlay playsInline muted className='video' />
        </div> */}

        {/* Hidden Online Users Section */}
        <div className='users-section'>
          <h3 className='section-title'>Online Users</h3>
          <ul className='user-list'>
            {listUsers.map(
              (onlineUser, index) =>
                onlineUser.userId !== id && (
                  <li
                    key={index}
                    className='user-item'
                    onClick={() => handleCallVideo(onlineUser)}
                  >
                    <img
                      src={onlineUser.picture}
                      alt='avatar'
                      className='avatar'
                    />
                    <span className='user-name'>{onlineUser.name}</span>
                  </li>
                )
            )}
          </ul>
        </div>

        {/* All Users Table */}
        <div className='table-section'>
          <h3 className='section-title'>Danh sách người dùng</h3>
          <div className='table-wrapper'>
            <table className='table'>
              <thead>
                <tr>
                  <th className='table-header'>ID</th>
                  <th className='table-header'>Name</th>
                  <th className='table-header'>Picture</th>
                  <th className='table-header'>Type</th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((user, index) => (
                  <tr key={index} className='table-row'>
                    <td className='table-cell'>{user._id}</td>
                    <td className='table-cell'>{user.name}</td>
                    <td className='table-cell'>
                      <img
                        src={user.picture}
                        alt='avatar'
                        className='table-avatar'
                      />
                    </td>
                    <td className='table-cell'>
                      <div className='type-container'>
                        {getAccountTypeIcon(user.typeAccount)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;