import { useEffect, useRef, useState } from 'react'
import { createMessage, getAllMessage, getRoomChat } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import audio from '../assets/sound/message-notification.mp3'
import { useSocket } from '../provider/SocketProvider'
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
import ClearIcon from '@mui/icons-material/Clear' 
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import ShareIcon from '@mui/icons-material/Share'
import InputBase from '@mui/material/InputBase'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { delateRoom, joinRoom, leaveRoom } from '../api/roomAPI'
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MessageItem from '../components/MessageItem'
import { createMessageImage, deleteMessage } from '../api/messageAPI'
import GlobalLoading from '../components/GlobalLoading'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import { emojiMap } from '../utils/checkIcon'
import AddMemberForm from '../components/AddMemberForm'
import './RoomChatId.css'
import EditGroupForm from '../components/EditGroupForm'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TypeFile from '../components/typeFile/TypeFile'

const emojiList = emojiMap

const RoomChatId = () => {
  const [openEditGroupForm, setOpenEditGroupForm] = useState(false)
  const [openAddMemberForm, setOpenAddMemberForm] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const navigate = useNavigate()
  const { socket } = useSocket()
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
  const audioRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [checkIsMember, setCheckIsMember] = useState(false)
  const [repMessage, setRepMessage] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isChange, setIsChange] = useState(false)
  const [isSentMessage, setIsSentMessage] = useState(false)

  const handleChangeMessage = (e) => setMessage(e.target.value)
  const handlSetRepMessage = (message) => {
    setRepMessage((prev) => (prev === message ? null : {
      _id: message._id,
      content: message.content,
      sender: message.sender,
      images: message.images,
    }))
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
    if (repMessage!==null) {
      response = await createMessage(id, user?._id, emoji, repMessage._id)
      setRepMessage(null)
    }
    else {
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

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteRoom = async () => {
    const response = await delateRoom({ roomId: id, userId: user._id })
    if (response) {
      setOpenDeleteDialog(false)
      navigate('/roomchats')
    }
  }

  const handleDeleteMessage = async (id) => {
    const response = await deleteMessage(id, user._id)
    if (response) {
      await fetchRoom()
    }
  }

  const handlLeaveRoom = async () => {
    const response = await leaveRoom({ roomId: id, userId: user._id })
    if (response.code === 0) {
      navigate('/roomchats')
    } else {
      alert(response.message)
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
          socket.emit('join-room', { roomId: id, user: user._id })
        }
        setCheckIsMember(room.members.some((m) => m._id === user._id))
      setIsLoading(false)
    } catch (error) {
      console.error('Lỗi khi fetch room chat:', error)
    }
  }

  const handleCancel = () => {
    if (socket) {
      socket.emit('leave-room', { roomId: id, user: user._id })
    }
    navigate(-1)
  }

  useEffect(() => {
    if (!socket) return
    fetchRoom()
  }, [id, socket])

  useEffect(() => {
    
    scrollToBottom()
  }, [messages,isSentMessage])

  useEffect(() => {
    if (!socket) return
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data])
      if (audioRef.current && data.sender._id !== user._id) {
        audioRef.current.play()
      }
    }
    socket.on('message', handleMessage)
    return () => {
      socket.off('message', handleMessage)
    }
  }, [socket])
  useEffect(() => {
    if (isChange) {
      fetchRoom()
      setIsChange(false)
    }
  }, [isChange])

  return (
    <>
      <audio ref={audioRef} src={audio} />
      <AddMemberForm
        setIsChange = {setIsChange}
        room={room}

        open={openAddMemberForm}
        onClose={() => setOpenAddMemberForm(false)}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: "delete-dialog-paper"
        }}
      >
        <DialogTitle className="delete-dialog-title" id="alert-dialog-title">
          <DeleteOutlineOutlinedIcon /> Xác nhận
        </DialogTitle>
        <DialogContent className="delete-dialog-content">
          <DialogContentText id="alert-dialog-description" className="delete-dialog-text">
            Bạn có chắc chắn muốn xóa nhóm này?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="delete-dialog-actions">
          <Button onClick={handleCloseDeleteDialog} className="cancel-button">
            Hủy
          </Button>
          <Button onClick={handleDeleteRoom} className="delete-button" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <AddMemberForm
       setIsChange = {setIsChange}
         room={room}
       open={openAddMemberForm}
       onClose={() => setOpenAddMemberForm(false)}
     />
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
                  }>
                    <Typography sx={{ color: 'text.main' }}>
                    {room?.name}
                    </Typography>
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
                  
                  <Box ref={messagesEndRef} >
                    {
                      <Box sx={{
                        display: isSentMessage ? 'flex' : 'none', justifyContent: 'flex-end', alignItems: 'center', gap: 1, padding: 1,
                        transition: 'all 0.5s ease',
                      }}>
                        <Typography sx={{ color: 'text.secondary', width: 'fit-content', background: 'secondary.main', paddingX: 2 }}>
                          Đang gửi...
                        </Typography>
                      </Box>
                    }
                </Box>
              </Box>

              {checkIsMember && (
                <Box>
                  {repMessage && (
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1,
                        padding: 1,
                        color: 'white',
                        minHeight: 100,
                        maxHeight: 200,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold',paddingBottom:1}}>
                          Đang trả lời {repMessage.sender.name}
                        </Typography>
                        <Typography
                            sx={{
                            borderLeft: '3px solid #4caf50',
                            paddingLeft: 1,
                            color: 'text.secondary',
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            lineHeight: '1.2rem',
                            fontSize: '0.875rem',
                          }}
                        >
                            {
                              repMessage.images.length > 0 ? repMessage.images.map((image, index) => {
                                if (image.type === 'image')
                                  return <img key={index} src={image.url} alt="" style={{ width: 100, height: 100, borderRadius: 5, marginRight: 5 }} />
                                else if (image.type === 'video')
                                  return <video key={index} src={image.url} alt="" style={{ width: 100, height: 100, borderRadius: 5, marginRight: 5 }} controls />
                                else return <TypeFile file={image} key={index} isClick={false} />
                              }) : <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' ,padding:1}}>
                              {repMessage.content}
                            </Typography>
                          }
                        </Typography>
                      </Box>
                      <IconButton onClick={() => setRepMessage(null)}>
                        <ClearIcon sx={{ color: 'text.secondary' }} />
                      </IconButton>
                    </Box>
                  )}
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
                      sx={{ position: 'relative', }}
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
                            display: showEmojiPicker?'flex':'none',
                            height:  400,
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
                  {
                    message.length > 0 
                      ? (
                        <Tooltip title="Gửi tin nhắn">
                          <IconButton color="primary" onClick={handleSentMessageText}>
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Thích">
                          <IconButton color="success" onClick={() => handleSentMessageIcon('👍')}>
                            <ThumbUpAltIcon />
                          </IconButton>
                        </Tooltip>
                    )
                   }
                    
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: toggleShowInfoRoom ? 350 : 0,
              display: 'flex',
              overflow: 'hidden',
              transition: 'width 0.5s',
              backgroundColor: 'secondary.main',
              borderRadius: 3,
              padding: toggleShowInfoRoom ? 2 : 0,
              height: '100vh',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: toggleShowInfoRoom ? 'flex' : 'none',
                transition: 'display 1.5s ease-in-out',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 1,
              }}
            >
              <Avatar
                src={room?.avatar?.url}
                sx={{
                  width: 80,
                  height: 80,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              />
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {room?.name}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  paddingX: 1,
                }}
              >
                {room?.description || 'Không có mô tả'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: toggleShowInfoRoom ? 'block' : 'none',
                transition: 'display 1.5s ease-in-out',
                backgroundColor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'background.default',
                  padding: 1,
                  borderRadius: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: '100%',
                  
                }}
              >
                <Tooltip title="Thêm thành viên">
                  <IconButton color="primary" onClick={() => setOpenAddMemberForm(true)}>
                    <AddOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <EditGroupForm
                  room={room}
                  open={openEditGroupForm}
                  onClose={() => setOpenEditGroupForm(false)}
                  setIsChange={setIsChange}
              />
              <Tooltip title="Chia sẻ nhóm">
                <IconButton
                  color='info'
                >
                  <ShareIcon/>
                </IconButton>
              </Tooltip>
                <Tooltip title="Chỉnh sửa thông tin">
                  <IconButton
                    color="success"
                    onClick={() => setOpenEditGroupForm(true)}
                  >
                    <EditCalendarOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Thoát nhóm">
                  <IconButton color="warning" onClick={handlLeaveRoom}>
                    <ExitToAppIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Xóa nhóm">
                  <IconButton
                    color="error"
                    onClick={handleOpenDeleteDialog}
                    disabled={
                      room?.members?.some((m) => (m._id===user._id&&m.role==='admin')) ? false : true
                    }
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                display: toggleShowInfoRoom ? 'block' : 'none',
                transition: 'display 1.5s ease-in-out',
                flex:1,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                overflowY: 'auto',
              }}
            >
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  my: 2,
                }}
              >
                Thành viên ({room?.members?.length || 0})
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {room?.members?.map((member, index) => (
                  <Box
                    onClick={() => {navigate(`/chat-user/${member._id}`)}}
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      paddingY: 1,
                      paddingRight: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Avatar
                      src={member.picture?.url?member.picture?.url:member.picture}
                      sx={{
                        width: 36,
                        height: 36,
                        border: room?.admins?.some((m) => m._id === member._id)
                          ? '2px solid orange'
                          : 'none',
                      }}
                    />
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontSize: '0.95rem',
                        flex: 1,
                      }}
                    >
                      {member.name}
                      {member._id === user._id && (
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: 'gray',
                            fontWeight: 'medium',
                          }}
                        >
                          (bạn)
                        </Typography>
                      )}
                    </Typography>
                    {member?.role==='admin' && (
                      <Typography
                        sx={{
                          padding: 0.5,
                          fontSize: '0.75rem',
                          color: 'red',
                          fontWeight: 'bold',
                          border: '1px solid gray',
                          borderRadius: 1,
                        }}
                      >
                        Admin
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
    </>
  )
}

export default RoomChatId