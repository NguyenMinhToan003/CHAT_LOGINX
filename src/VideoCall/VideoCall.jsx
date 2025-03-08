import { useEffect, useState, useRef } from 'react';
import { getDataUser, getIceServer } from '../api';
import './VideoCall.css';
import { useParams } from 'react-router-dom';
import { useSocket } from '../provider/SocketProvider';
import { MdContentCopy } from "react-icons/md";
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

// const URL = 'https://loginx.onrender.com';
// const URL ='http://localhost:8123'
const URL = '0.peerjs.com';

const VideoCall = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const idUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))._id : null;
  const [user, setUser] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [countMember, setCountMember] = useState(0);
  const peerRef = useRef(null);

  // Gán stream vào video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const fetchUser = async () => {
    try {
      const response = await getDataUser(idUser);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
    } catch (error) {
      console.error('Lỗi fetchUser:', error);
    }
  };

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
      console.error('Lỗi getMediaStream:', error);
      return null;
    }
  };

  const setUpCall = async () => {
    try {
      if (!socket) return
      const stream = await getMediaStream();
      if (!stream) return;
      const iceServersResponse = await getIceServer();


      // Tách STUN và TURN servers đúng chuẩn WebRTC
      const iceServers = [
        // Thêm STUN server (không cần username & credential)
        { urls: "stun:ss-turn2.xirsys.com" },

        // Thêm TURN servers với username & credential
        ...iceServersResponse.v.iceServers.urls
          .filter(url => url.startsWith("turn")) // Chỉ lấy TURN servers
          .map(url => ({
            urls: url,
            username: iceServersResponse.v.iceServers.username,
            credential: iceServersResponse.v.iceServers.credential,
          }))
      ];


      const peer = new Peer(idUser || uuidv4(), {
        port: '443', 
        host: URL,
        path: '/',
        secure: true,
        config: { iceServers },
      });

      peerRef.current = peer;

      // Khi peer đã sẵn sàng
      peer.on('open', (peerId) => {
        socket.emit('join-room', { roomId: id, peerId }); 
      });

      // lang nghe khi co nguoi vao 
      peer.on('call', (call) => {
        call.answer(stream); 
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });

      // Lắng nghe thông tin peer khác từ socket để gọi
      socket.on('user-joined', ({ peerId }) => {
        const call = peer.call(peerId, stream); // Gọi peer khác
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });

      peer.on('error', (err) => {
        console.error('Lỗi từ PeerJS:', err);
      });

    } catch (error) {
      console.error('Lỗi trong setUpCall:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    fetchUser();
    setUpCall();

    socket.on('getRoomCountMember', (data) => setCountMember(data));

    return () => {
      socket.off('getRoomCountMember');
      socket.off('user-joined');
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [socket]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleCopyIdRoom = (id) => {
    navigator.clipboard.writeText(`localhost:5173/video-call/${id}`);
    alert('Đã sao chép link');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="button-group">
          <div>
            <div className='button-group' style={{cursor: 'pointer'}} onClick={() => handleCopyIdRoom(id)}>
              <span className="room-id">link: {id}</span>
              <MdContentCopy className="copy-icon" />
            </div>
            <p className="subtitle">Thành viên: {countMember}</p>
          </div>
          <div className="button-group">
            <img src={user?.picture} alt="avatar" className="avatar" />
            <a href="/roomchats" className="chat-button">Phòng Chat</a>
            <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
      </header>
      <div className="main-content">
        <div className="video-section">
          <video ref={localVideoRef} autoPlay playsInline muted className="video" />

        </div>
        <div className="video-section">
          <video ref={remoteVideoRef} autoPlay playsInline className="video" />

        </div>
      </div>
    </div>
  );
};

export default VideoCall;