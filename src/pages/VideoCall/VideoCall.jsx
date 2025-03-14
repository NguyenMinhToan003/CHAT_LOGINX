import { useEffect, useState, useRef } from 'react';
import { getIceServer } from '../../api';
import './VideoCall.css';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../provider/SocketProvider';
import { MdContentCopy } from "react-icons/md";
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

const URL = '0.peerjs.com';

const VideoCall = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [countMember, setCountMember] = useState(0);
  const peerRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [localStream, remoteStream]);


  const getMediaStream = async () => {
    if (localStream) return localStream;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Lỗi getMediaStream:', error);
      return null;
    }
  };

  const setUpCall = async () => {
    try {
      if (!socket) return;
      const stream = await getMediaStream();
      if (!stream) return;
      const iceServersResponse = await getIceServer();
      const iceServers = [
        { urls: "stun:ss-turn2.xirsys.com" },
        ...iceServersResponse.v.iceServers.urls
          .filter(url => url.startsWith("turn"))
          .map(url => ({
            urls: url,
            username: iceServersResponse.v.iceServers.username,
            credential: iceServersResponse.v.iceServers.credential,
          }))
      ];

      const peer = new Peer(user._id || uuidv4(), {
        port: '443',
        host: URL,
        path: '/',
        secure: true,
        config: { iceServers },
      });

      peerRef.current = peer;

      peer.on('open', (peerId) => socket.emit('join-room', { roomId: id, peerId }));
      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => setRemoteStream(remoteStream));
      });

      socket.on('user-joined', ({ peerId }) => {
        const call = peer.call(peerId, stream);
        call.on('stream', (remoteStream) => setRemoteStream(remoteStream));
      });

      peer.on('error', (err) => console.error('Lỗi từ PeerJS:', err));
    } catch (error) {
      console.error('Lỗi trong setUpCall:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    setUpCall();
    socket.on('getRoomCountMember', (data) => setCountMember(data));

    return () => {
      socket.off('getRoomCountMember');
      socket.off('user-joined');
      if (peerRef.current) peerRef.current.destroy();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
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
        <div className="header-content">
          <div className="room-info" onClick={() => handleCopyIdRoom(id)}>
            <span className="room-id">Link: {id}</span>
            <MdContentCopy className="copy-icon" />
          </div>
          <p className="subtitle">Thành viên: {countMember}</p>
          <div className="user-controls">
            <div className="user-info">
              <img src={user?.picture} alt="avatar" className="avatar" />
              <div className="user-details">
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
            </div>
            <a href="/roomchats" className="chat-button">Chat</a>
            <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
      </header>
      <div className="main-content">
        <div className="video-section">
          <video ref={localVideoRef} autoPlay playsInline muted className="video" />
          <div>{user.name}</div>
        </div>
        <div className="video-section">
          {
            remoteStream
              ?
              <video ref={remoteVideoRef} autoPlay playsInline className="video" />
              : <div className="video-placeholder">Chờ kết nối...</div>
          }
          <div>user</div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;