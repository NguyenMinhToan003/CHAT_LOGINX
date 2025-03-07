import { useEffect, useState, useRef } from 'react';
import { getDataUser } from '../api';
import './VideoCall.css';
import { useParams } from 'react-router-dom';
import { useSocket } from '../provider/SocketProvider';
import { MdContentCopy } from "react-icons/md"
import Peer from 'peerjs';
const VideoCall = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const idUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))._id : null;
  const [user, setUser] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const videoRef = useRef(null);
  const [countMember, setCountMember] = useState(0);
  const [peer, setPeer] = useState(null);

  const fetchUser = async () => {
    const response = await getDataUser(idUser);
    localStorage.setItem('user', JSON.stringify(response));
    setUser(response);
  };

  const setUpCall = async () => {
    const stream = await getMediaStream();
    if (!stream) return console.log('Stream is not available');
    const newPeer = createPeer(stream, true);
    socket.emit('join-room', id);
    setPeer({
      peerConnection: newPeer,
      stream: undefined,
      roomId: id,
    })
    newPeer.on('signal', async (signal) => {
      if (socket) 
        socket.emit('webrtc-signal', {
          sdp: signal,
          roomId: id,
        })
    })

  };
  const completePeerConnection = async (signal) => {
    if (!localStream) return 
    if (peer) 
      peer.peerConnection.signal(signal); 
    else {
      const newPeer = createPeer(localStream, true);
      socket.emit('join-room', id);
      setPeer({
        peerConnection: newPeer,
        stream: undefined,
        roomId: id,
      })
      newPeer.on('signal', async (signal) => {
        if (socket) 
          socket.emit('webrtc-signal', {
            sdp: signal,
            roomId: id,
          })
      })
    }
  }

  useEffect(() => {
    if (!socket) return;
    fetchUser();
    setUpCall();
    socket.on('getRoomCountMember', (data) => setCountMember(data));
    socket.on('webrtc-signal', completePeerConnection)
    return () => {
      socket.off('getRoomCountMember');
    };
    
  }, [socket]);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleHangupCall = () => {
    if (peer) {
      peer.destroy();
      setPeer(null);
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    socket.emit('leave-room', id);
  };
  const createPeer = (stream, initiator = false) => {
    const iceServers = [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
        ]
      }
    ]
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
      config: { iceServers }
    });
    peer.on('stream', (stream) => {
      setPeer((prev) => {
        if (prev) return { ...prev, stream };
        return { prev };
      })
    })
    peer.on('error', (error) => console.error('Error peer:', error));
    peer.on('close', () => handleHangupCall());
    const rtcPeerConnection = peer._pc
    rtcPeerConnection.oniceconnectionstatechange = () => {
      if (rtcPeerConnection.iceConnectionState === 'failed'|| rtcPeerConnection.iceConnectionState === 'disconnected' || rtcPeerConnection.iceConnectionState === 'closed') {
        handleHangupCall();
      }
    }
    return peer;
  }
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
      console.error('Error getMediaStream:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleCopyIdRoom = (id) => {
    navigator.clipboard.writeText(`localhost:5173/video-call/${id}`);
    alert('Hãy gửi link cho người khác');
  }
  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <div className="button-group">
          <div>
            <div className='button-group' style={{cursor: 'pointer'}} onClick={() => handleCopyIdRoom(id)}>
              <span className="room-id">link: {id}</span>
              <MdContentCopy className="copy-icon" />
            </div>
            <p className="subtitle">Member: {countMember}</p>
          </div>

          <div className="button-group">
            <img src={user?.picture} alt="avatar" className="avatar" />
            <a href="/roomchats" className="chat-button">
              Room Chat
            </a>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Local Video */}
        <div className="video-section">
          <video ref={videoRef} autoPlay playsInline muted className="video" />
        </div>
        <div className="video-section">
          {
            peer && peer.stream && (
              <video srcObject={peer.stream} autoPlay playsInline className="video" />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default VideoCall;