import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
import audio from '~/assets/sound/message-notification.mp3'
import { getRoomChatByUserId } from '../api/roomAPI'
import { enqueueSnackbar } from 'notistack'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'


const SocketContext = createContext()

const URL = import.meta.env.VITE_SERVER_HOST

export const SocketProvider = ({ user, children }) => {
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [newMessage, setNewMessage] = useState(null)
  const [socketUser, setSocketUser] = useState(null)
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null,
    roomId: null,
  })


  // Kết nối đến các phòng chat của người dùng
  const connectRooms = async (socket) => {
    try {
      const response = await getRoomChatByUserId(user._id, 'all')
      const rooms = response?.map((room) => room._id)
      socket.emit('join-list-rooms', rooms)
    }
    catch (error) {
      console.error('Error fetching rooms connected:', error)
    }
  }

  // Kết nối đến socket server khi người dùng đăng nhập
  useEffect(() => {
    if (!user) return
    const newSocket = io(URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    })
    
    newSocket.on('connect', async () => {
     
      setSocket(newSocket)
      newSocket.emit('addNewUser', user)
      newSocket.emit('join-room', user._id)
      await connectRooms(newSocket)
    })


    newSocket.on('disconnect', () => {
      setSocket(null)
    })

    // Nhận danh sách người dùng online
    const handleUpdateUsers = (users) => {
      const currentSocketUser = users.find((u) => u.userId === user._id)
      if (!socketUser && currentSocketUser) {
        setSocketUser(currentSocketUser)
      }
      setOnlineUsers(users)
    }
    newSocket.on('getListUsers', handleUpdateUsers)
    return () => {
      newSocket.off('getListUsers', handleUpdateUsers)
      newSocket.disconnect()
    }
  }, [user]) // Chỉ chạy lại khi user thay đổi
  // Xử lý các sự kiện socket liên quan đến cuộc gọi va tin nhan
  useEffect(() => {
    if (!socket) return

    const handleIncomingCall = (data) => {
      setOnCommingCall(data)
    }

    const handleHangupCall = (data) => {
      setOnCommingCall((prev) => ({ ...prev, isRinging: false }))
    }

    const handleAcceptCall = (data) => {
      setOnCommingCall(data)
    }

    const handleRecieveMessage = (message) => {
      setNewMessage(message)
      const param = window.location.pathname.split('/')[2]
      if (audioRef.current && message.sender._id !== user._id) {
        console.log(param, message.roomId)
        param !== message.roomId && enqueueSnackbar('Bạn có một tin nhắn mới', {
          variant: 'success',
          autoHideDuration: 3000,
          action: () => (
            <Button onClick={()=>navigate(`/roomchats/${message.roomId}`)} variant="text" color="inherit">
              Xem ngay
            </Button>
          )
          }
        )
        audioRef.current.play()
      }
      
    }

    socket.on('message', handleRecieveMessage)
    socket.on('iscomming-call', handleIncomingCall)
    socket.on('hangup-call', handleHangupCall)
    socket.on('accept-call', handleAcceptCall)

    return () => {
      socket.off('iscomming-call', handleIncomingCall)
      socket.off('hangup-call', handleHangupCall)
      socket.off('accept-call', handleAcceptCall)
    }
  }, [socket]) // Chạy lại khi socket thay đổi

  // Gửi yêu cầu gọi video
  const handleCallVideo = (userReceiver) => {
    if (!socket || !socket.connected) {
      return
    }
    const roomId = uuidv4()
    const callData = {
      receiver: userReceiver,
      sender: { userId: user._id, name: user.name, picture: user.picture },
      isRinging: true,
      roomId: roomId,
    }
    socket.emit('call-video', callData)
    window.open(`/video-call/${roomId}`, '_blank')
  }


  const handleAcceptCall = () => {
    if (!socket || !socket.connected) {
      return
    }
    const updateAcceptCall = {
      ...onCommingCall,
      isRinging: false,
      isCallAccepted: true,
    }
    setOnCommingCall(updateAcceptCall)
    socket.emit('accept-call', updateAcceptCall)
    window.open(`/video-call/${onCommingCall.roomId}`, '_blank')
  }

  const handleHangupCall = () => {
    if (!socket || !socket.connected) {
      return
    }
    socket.emit('hangup-call', {
      sender: {
        userId: user._id, name: user.name, picture: user.picture
      },
      receiver: onCommingCall.receiver,
    })
    setOnCommingCall((prev) => ({ ...prev, isRinging: false }))
  }
  // xu ly nhan tin nhan
  
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
        newMessage,
        setNewMessage,
        socketUser
      }}
    >
     <audio ref={audioRef} src={audio} />
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)