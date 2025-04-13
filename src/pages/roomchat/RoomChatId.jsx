import { useEffect, useRef, useState } from 'react'
import { getRoomChat } from '~/api/roomAPI'
import { createMessage, getAllMessage } from '~/api/messageAPI'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocket } from '~/provider/SocketProvider'
import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import InputBase from '@mui/material/InputBase'
import { joinRoom } from '~/api/roomAPI'
import MessageItem from '~/components/MessageItem'
import { createMessageImage, deleteMessage } from '~/api/messageAPI'
import GlobalLoading from '~/components/GlobalLoading'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import { emojiMap } from '~/utils/checkIcon'
import RoomInfoPanel from '~/components/RoomInfoPanel'
import './RoomChatId.css'
import ReplyMessage from '~/components/ReplyMessage'

const emojiList = emojiMap

const RoomChatId = () => {
  const navigate = useNavigate()
  const { onlineUsers, socket, newMessage } = useSocket()
  const { id } = useParams()
  const inputRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    window.location.href = '/'
  }
  const [isLoading, setIsLoading] = useState(false)
  const [toggleShowInfoRoom, setToggleShowInfoRoom] = useState(false)
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  const [checkIsMember, setCheckIsMember] = useState(false)
  const [repMessage, setRepMessage] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isChange, setIsChange] = useState(false)
  const [isSentMessage, setIsSentMessage] = useState(false)

  const handleChangeMessage = (e) => setMessage(e.target.value)
  const handlSetRepMessage = (message) => {
    setRepMessage((prev) =>
      prev === message
        ? null
        : {
            _id: message?._id,
            content: message?.content,
            sender: message?.sender,
            images: message?.images,
          }
    )
  }

  const handleSentMessageImage = async (e) => {
    setIsSentMessage(true)
    const files = Array.from(e.target.files)
    if (!files.length) return
    let formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    formData.append('roomId', id)
    formData.append('sender', user._id)
    if (repMessage) {
      formData.append('followMessageId', repMessage._id)
    }
    const response = await createMessageImage(formData)
    if (response.insertedId) {
      let data = {
        status: 'read',
        _id: response.insertedId,
        sender: {
          _id: user._id,
          name: user.name,
          picture: user.picture,
        },
        roomId: id,
        images: response.images,
        followedMessage: repMessage,
      }
      socket.emit('message', data)
      setRepMessage(null)
      setIsSentMessage(false)
    }
  }

  const handleSentMessageIcon = async (emoji) => {
    setIsSentMessage(true)
    let response
    if (repMessage !== null) {
      response = await createMessage(id, user?._id, emoji, repMessage._id)
      setRepMessage(null)
    } else {
      response = await createMessage(id, user?._id, emoji)
    }
    if (response.insertedId) {
      let data = {
        status: 'read',
        content: emoji,
        _id: response.insertedId,
        sender: {
          _id: user?._id,
          name: user?.name,
          picture: user?.picture,
        },
        roomId: id,
        images: [],
        followedMessage: repMessage,
      }
      socket.emit('message', data)
      setIsSentMessage(false)
    }
    setShowEmojiPicker(false)
  }

  const handleSentMessageText = async () => {
    setIsSentMessage(true)
    if (!message.trim()) return
    let response

    if (repMessage === null) {
      response = await createMessage(id, user?._id, message)
    } else {
      response = await createMessage(id, user?._id, message, repMessage._id)
      setRepMessage(null)
    }
    if (response.insertedId) {
      let data = {
        status: 'read',
        content: message,
        _id: response.insertedId,
        sender: {
          _id: user?._id,
          name: user?.name,
          picture: user?.picture,
        },
        roomId: id,
        images: [],
        followedMessage: repMessage,
      }
      socket.emit('message', data)
      setMessage('')
      setIsSentMessage(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSentMessageText()
    }
  }

  const handleJoinRoom = async () => {
    const response = await joinRoom({ roomId: id, members: [user._id] })
    if (response) {
      setCheckIsMember(true)
      fetchRoom()
    }
  }

  const handleDeleteMessage = async (id) => {
    const response = await deleteMessage(id, user._id)
    if (response) {
      await fetchRoom()
    }
  }

  const fetchRoom = async () => {
    try {
      setIsLoading(true)
      const response = await getRoomChat(id)
      const room = response
      setRoom(room)
      const resMess = await getAllMessage(id, user._id)
      if (Array.isArray(resMess.messages)) {
        setMessages(resMess.messages)
      }
      setCheckIsMember(room.members.some((m) => m._id === user._id))
      setIsLoading(false)
    } catch (error) {
      console.error('Lỗi khi fetch room chat:', error)
    }
  }

  const handleCancel = () => {
    navigate('/roomchats')
  }

  // lay thong tin room chat khi component mount
  useEffect(() => {
    if (!socket) return
    fetchRoom()
  }, [id, socket])

  // cuon xuong cuoi khi co tin nhan moi
  useEffect(() => {
    scrollToBottom()
  }, [messages, isSentMessage])

  // nhan tin nhan moi tu socket provider
  useEffect(() => {
    if (!newMessage || newMessage.roomId!==id ) return
      setMessages((prev) => [...prev, newMessage])
  }, [newMessage])

  // lay thong tin moi khi co thay doi
  useEffect(() => {
    if (isChange) {
      fetchRoom()
      setIsChange(false)
    }
  }, [isChange])

  return (
    <>
      <GlobalLoading loading={isLoading} />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 1 }}>
        <Box
          sx={{
            padding: 1,
            backgroundColor: 'background.default',
            height: '100vh',
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'secondary.main',
              height: '100%',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'background.primary',
                }}
              >
                <Tooltip title="back">
                  <IconButton color="error" onClick={handleCancel}>
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
                <Button
                  startIcon={
                    <Avatar sx={{ width: 36, height: 36 }} src={room?.avatar?.url} />
                  }
                >
                  <Typography sx={{ color: 'text.main' }}>{room?.name}</Typography>
                </Button>
              </Box>
              <Tooltip title="menu">
                <IconButton
                  color="primary"
                  onClick={() => setToggleShowInfoRoom(!toggleShowInfoRoom)}
                >
                  <MoreHorizIcon sx={{ color: 'text.primary' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
            <Box
              sx={{
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '100%',
                padding: 1,
              }}
            >
              {messages.length > 0 &&
                messages?.map((data, index) => (
                  <MessageItem
                    removeMessage={handleDeleteMessage}
                    setRepMessage={handlSetRepMessage}
                    message={data}
                    user={user}
                    key={index}
                  />
                ))}

              {!checkIsMember && !isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    Bạn không phải là thành viên của nhóm
                  </Typography>
                  <Button sx={{ marginLeft: 1 }} variant="outlined" onClick={handleJoinRoom}>
                    Tham gia
                  </Button>
                </Box>
              )}

              <Box ref={messagesEndRef}>
                {isSentMessage && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: 1,
                      padding: 1,
                      transition: 'all 0.5s ease',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        width: 'fit-content',
                        background: 'secondary.main',
                        paddingX: 2,
                      }}
                    >
                      Đang gửi...
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {checkIsMember && (
              <Box>
                <ReplyMessage repMessage={repMessage} onClear={setRepMessage} />
                <Box
                  sx={{
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: 1,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{ position: 'relative' }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Tooltip title="Add reaction">
                      <IconButton color="error">
                        <AddReactionIcon />
                      </IconButton>
                    </Tooltip>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '120%',
                        left: 0,
                        backgroundColor: '#263238',
                        borderRadius: 2,
                        boxShadow: 3,
                        padding: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: showEmojiPicker ? 'flex' : 'none',
                        height: 400,
                        width: 360,
                        transition: 'all 0.5s ease',
                        overflow: 'hidden',
                        zIndex: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      {emojiList.map((item) => (
                        <Tooltip key={item.name} title={item.name}>
                          <IconButton
                            onClick={() => handleSentMessageIcon(item.emoji)}
                            sx={{
                              width: 'fit-content',
                              height: 'fit-content',
                              fontSize: '1.5rem',
                              padding: 1,
                              backgroundColor: 'transparent',
                              '&:hover': {
                                backgroundColor: item.background,
                                transform: 'scale(1.4) rotate(360deg)',
                                transition: 'transform 0.2s ease',
                              },
                            }}
                          >
                            <span>{item.emoji}</span>
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  <Tooltip title="Attach file">
                    <IconButton color="warning" component="label">
                      <AttachFileIcon />
                      <input
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleSentMessageImage(e)}
                      />
                    </IconButton>
                  </Tooltip>
                  <InputBase
                    value={message}
                    onChange={(event) => handleChangeMessage(event)}
                    onKeyPress={handleKeyPress}
                    placeholder="Aa"
                    ref={inputRef}
                    sx={{
                      backgroundColor: 'background.default',
                      border: 'none',
                      width: '100%',
                      height: '100%',
                      outline: 'none',
                      color: 'text.main',
                      fontSize: '1rem',
                      borderRadius: 3,
                      padding: 3,
                    }}
                  />
                  {message.length > 0 ? (
                    <Tooltip title="Gửi tin nhắn">
                      <IconButton color="primary" onClick={handleSentMessageText}>
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Thích">
                      <IconButton
                        color="success"
                        onClick={() => handleSentMessageIcon('👍')}
                      >
                        <ThumbUpAltIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <RoomInfoPanel
          room={room}
          user={user}
          toggleShowInfoRoom={toggleShowInfoRoom}
          setIsChange={setIsChange}
          handleCloseInfoPanel={() => setToggleShowInfoRoom(false)}
        />
      </Box>
    </>
  )
}

export default RoomChatId