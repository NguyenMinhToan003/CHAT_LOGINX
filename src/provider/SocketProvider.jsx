import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";

const SocketContext = createContext();

// const URL = "http://localhost:8123";
const URL = 'https://loginx.onrender.com';


export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketUser, setSocketUser] = useState(null);
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null,
    roomId: null,
  });

  // Khởi tạo và quản lý socket
  useEffect(() => {
    if (!user) {
      return;
    }

    const newSocket = io(URL, {
      transports: ["websocket"],
      reconnection: true, // Tự động kết nối lại nếu mất kết nối
      reconnectionAttempts: 5, // Số lần thử kết nối lại
    });

    // Chỉ đặt socket khi đã kết nối thành công
    newSocket.on("connect", () => {
      setSocket(newSocket);
      newSocket.emit("addNewUser", user);
    });

    newSocket.on("connect_error", (error) => {
    });

    newSocket.on("disconnect", () => {
      setSocket(null); // Đặt lại socket về null khi ngắt kết nối
    });

    // Nhận danh sách người dùng online
    const handleUpdateUsers = (users) => {
      const currentSocketUser = users.find((u) => u.userId === user._id);
      if (!socketUser && currentSocketUser) {
        setSocketUser(currentSocketUser);
      }
      setOnlineUsers(users);
    };

    newSocket.on("getListUsers", handleUpdateUsers);

    return () => {
      newSocket.off("getListUsers", handleUpdateUsers);
      newSocket.disconnect();
    };
  }, [user]); // Chỉ chạy lại khi user thay đổi

  // Xử lý các sự kiện socket liên quan đến cuộc gọi
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      setOnCommingCall(data);
    };

    const handleHangupCall = (data) => {
      setOnCommingCall((prev) => ({ ...prev, isRinging: false }));
    };

    const handleAcceptCall = (data) => {
      setOnCommingCall(data);
    };

    socket.on("iscomming-call", handleIncomingCall);
    socket.on("hangup-call", handleHangupCall);
    socket.on("accept-call", handleAcceptCall);

    return () => {
      socket.off("iscomming-call", handleIncomingCall);
      socket.off("hangup-call", handleHangupCall);
      socket.off("accept-call", handleAcceptCall);
    };
  }, [socket]); // Chạy lại khi socket thay đổi

  // Gửi yêu cầu gọi video
  const handleCallVideo = (userReceiver) => {
    if (!socket || !socket.connected) {
      return;
    }
    const roomId = uuidv4();
    const callData = {
      receiver: userReceiver,
      sender: { userId: user._id, name: user.name, picture: user.picture },
      isRinging: true,
      roomId: roomId,
    };
    socket.emit("call-video", callData);
    window.open(`/video-call/${roomId}`, "_blank");
  };

  // Chấp nhận cuộc gọi
  const handleAcceptCall = () => {
    if (!socket || !socket.connected) {
      return;
    }
    const updateAcceptCall = {
      ...onCommingCall,
      isRinging: false,
      isCallAccepted: true,
    };
    setOnCommingCall(updateAcceptCall);
    socket.emit("accept-call", updateAcceptCall);
    window.open(`/video-call/${onCommingCall.roomId}`, "_blank");
  };

  const handleHangupCall = () => {
    if (!socket || !socket.connected) {
      return;
    }
    socket.emit("hangup-call", {
      sender: { userId: user._id, name: user.name, picture: user.picture },
      receiver: onCommingCall.receiver,
    });
    setOnCommingCall((prev) => ({ ...prev, isRinging: false }));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        onCommingCall,
        setOnCommingCall,
        handleAcceptCall,
        handleHangupCall,
        handleCallVideo,
        socketUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);