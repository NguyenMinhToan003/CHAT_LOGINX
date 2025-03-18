import { useEffect, useRef, useState } from 'react';
import { createMessage, getAllMessage, getRoomChat } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import audio from '../../public/sound/message-notification.mp3'
import { useSocket } from '../provider/SocketProvider';
import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AddReactionIcon from '@mui/icons-material/AddReaction'
import SendIcon from '@mui/icons-material/Send'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { joinRoom, leaveRoom } from '../api/roomAPI';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MessageItem from '../components/MessageItem';
import { deleteMessage } from '../api/messageAPI';

const RoomChatId = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { id } = useParams();
  const inputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/';
  }
  const [toggleShowInfoRoom, setToggleShowInfoRoom] = useState(false);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [checkIsMember, setCheckIsMember] = useState(false);

  const [repMessage, setRepMessage] = useState(null);

  const handleChangeMessage = (e) => setMessage(e.target.value);
  const handlSetRepMessage = (message) => {
    setRepMessage(message);
    inputRef.current.focus();
  }
  const handleSentMessage = async () => {
    if (!message.trim()) return;
    let response;
    if (repMessage===null) {
      response = await createMessage(id, user?._id, message);
    }
    else {
      response = await createMessage(id, user?._id, message, repMessage._id);
      setRepMessage(null);
    }
    if (response.insertedId) {
      let data = {
        content: message,
        _id: response.insertedId,
        sender: {
          _id: user?._id,
          name: user?.name,
          picture: user?.picture,
        },  
        roomId: id,
      }
      if (repMessage) {
        data.followedMessage = {
          _id: repMessage._id,
          content: repMessage.content,
        };
      }
      socket.emit('message',data);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSentMessage();
    }
  };
  const handleJoinRoom = async () => {
    const response = await joinRoom({ roomId: id, members: [user._id] });
    if (response) {
      setCheckIsMember(true);
      fetchRoom();
    }
  }

  const handleDeleteMessage = async (id) => {
    console.log('id', id);
    const response = await deleteMessage(id, user._id);
    await fetchRoom()
  }
  const handleDeleteRoom = async () => {
  }
  const handlLeaveRoom = async () => {
    const response = await leaveRoom({ roomId: id, userId: user._id });
    if (response.code === 0) {
      navigate('/roomchats');
    }
    else {
      alert(response.message);
    }
  }
  const fetchRoom = async () => {
    try {
      const response = await getRoomChat(id);
      if (Array.isArray(response) && response.length > 0) {
        const room = response[0];
        // sort members admin is top 
        const admins = room.info.admins;
        const members = room.members;
        const newMembers = members.filter(m => !admins.some(a => a._id === m._id));
        const sortMembers = [...admins, ...newMembers];
        room.members = sortMembers;
        setRoom(room);
        const resMess = await getAllMessage(id, user._id);
        if (Array.isArray(resMess)) {
          setMessages(resMess);
          socket.emit('join-room', { roomId: id, user: user._id });
        }
        setCheckIsMember(room.members.some(m => m._id === user._id));
      }
    } catch (error) {
      console.error('Lỗi khi fetch room chat:', error);
    }
  };

  const handleCancel = () => {
    if (socket) {
      socket.emit('leave-room', { roomId: id, user: user._id });
    }
    navigate('/roomchats');
  }
  useEffect(() => {
    if(!socket) return;
    fetchRoom();
  }, [id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      if (audioRef.current && data.sender._id !== user._id) {
        audioRef.current.play();
      }
    };
    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket]);

  return <>
    <audio ref={audioRef} src={audio} />
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 1 }}>
      <Box sx={{
        padding: 1,
        backgroundColor: 'background.default',
        height: '100vh',
        flex: 1,
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'secondary.main',
          height: '100%',
          borderRadius: 3
        }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 60,
              padding: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'background.primary'
              }}
            >
              <Tooltip title='back'>
                <IconButton color='error' onClick={handleCancel} >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Button startIcon={<Avatar sx={{ width: 36, height: 36 }}
                src={room?.info?.avartar} />}>
                <Typography sx={{ color: 'text.main' }}>
                  {
                    room?.info?.name.length>10 ? room?.info?.name.slice(0,10)+'...' : room?.info?.name
                  }
                </Typography>
              </Button>
            </Box>
            <Tooltip title='menu'>
              <IconButton color='primary' onClick={() => setToggleShowInfoRoom(!toggleShowInfoRoom)}>
                <MoreHorizIcon sx={{ color: 'text.primary' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider />
          <Box sx={{ 
            overflowY: 'auto', 
            overflowX: 'hidden', 
            height: '100%', 
            padding: 1 
          }}>
            {messages.length > 0 && messages?.map((data, index) => (
              <>
                <MessageItem
                  removeMessage={handleDeleteMessage}
                  setRepMessage={handlSetRepMessage}
                  message={data}
                  user={user}
                  key={index}
                />
              </>
            ))}
            {
              !checkIsMember && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap:1
                  }}
                >
                  <Typography sx={{ color: 'text.secondary',fontWeight: 'bold' }}>
                    Bạn không phải là thành viên của nhóm
                  </Typography>
                  <Button sx={{ marginLeft: 1 }} variant='outlined' onClick={handleJoinRoom}>
                    Tham gia
                  </Button>
                </Box>
              )
            }
            <div ref={messagesEndRef} />
          </Box>
          <Divider />
          {
            checkIsMember && (
              <Box>
                {
                  repMessage && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                        padding: 1,
                        color: 'white',
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        Đang trả lời {repMessage.sender.name}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {repMessage.content}
                      </Typography>
                      </Box>
                      <IconButton onClick={() => setRepMessage(null)}>
                        <ArrowBackIcon />
                      </IconButton>
                    </Box>
                  )
                }
          <Box sx={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: 1
          }}>
            <Tooltip title='Add reaction'>
              <IconButton color='error'>
                <AddReactionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Attach file'>
              <IconButton color='warning' component='label'>
                <AttachFileIcon />
                <input type='file' style={{ display: 'none' }} />
              </IconButton>
            </Tooltip>
            <InputBase
              value={message}
              onChange={(event) => handleChangeMessage(event)}
              onKeyPress={handleKeyPress}
              component='textarea'
                    placeholder='Aa'
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
                padding: 3
              }}
            />
            <Tooltip title='Send'>
              <IconButton color='info' onClick={handleSentMessage}>
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
            </Box>
            )
          }
        </Box>
      </Box>


      <Box sx={{
        width: toggleShowInfoRoom ? 350 : 0,
        display:'flex',
        overflow: 'hidden',
        transition: 'width 0.5s',
        backgroundColor: 'secondary.main',
        borderRadius: 3,
        padding: toggleShowInfoRoom ? 2 : 0,
        height: '100vh',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{
          display: toggleShowInfoRoom ? 'flex' : 'none', 
          transition: 'display 1.5s ease-in-out',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 1,
        }}>
          <Avatar
            src={room?.info?.avartar}
            sx={{
              width: 80,
              height: 80,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          />
          <Typography 
            sx={{ 
              color: 'text.primary',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              textAlign: 'center',
              wordBreak: 'break-word'
            }}
          >
            {room?.info?.name}
          </Typography>
          <Typography 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.9rem',
              textAlign: 'center',
              wordBreak: 'break-word',
              paddingX: 1
            }}
          >
            {room?.info?.description || 'Không có mô tả'}
          </Typography>
        </Box>

        <Box sx={{display: toggleShowInfoRoom ? 'block' : 'none',
          transition: 'display 1.5s ease-in-out',
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'background.default',
            padding: 1,
            borderRadius: 1
          }}>
            
            <Tooltip title='Thêm thành viên'>
               <IconButton color='primary'>
              <AddOutlinedIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title='Chỉnh sửa thông tin'>
              <IconButton color='success'
                disabled={room?.info?.admins?.some(m => m._id === user._id) ? false : true}
              >
              <EditCalendarOutlinedIcon/>
              </IconButton>
            </Tooltip>

             <Tooltip title='Thoát nhóm'>
              <IconButton color='warning' onClick={handlLeaveRoom}>
              <ExitToAppIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Xóa nhóm'>
              <IconButton color='error'
                onClick={handleDeleteRoom}
                disabled={room?.info?.admins?.some(m => m._id === user._id) ? false : true}
              >
              <DeleteOutlineOutlinedIcon/>
              </IconButton>
            </Tooltip>
              
           
          </Box>
        </Box>
        <Box sx={{
          display: toggleShowInfoRoom ? 'block' : 'none',
          transition: 'display 1.5s ease-in-out',
          flex: 1,
          backgroundColor: 'background.paper',
          borderRadius: 2,
                      overflowY: 'auto',
        }}>
          
          <Typography 
              sx={{ 
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 'medium',
              my: 2
                
              }}
            >
              Thành viên ({room?.members?.length || 0})
            </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5 ,
          }}>
            {room?.members?.map((member, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  paddingY: 1,
                  paddingRight: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Avatar
                  src={member.picture}
                  sx={{
                    width: 36,
                    height: 36,
                    border: room?.info?.admins?.some(m => m._id === member._id)
                      ? '2px solid orange'
                      : 'none'
                  }}
                />
                <Typography 
                  sx={{ 
                    color: 'text.primary',
                    fontSize: '0.95rem',
                    flex: 1
                  }}
                >
                  {member.name}
                  {member._id === user._id && (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'gray',
                      fontWeight: 'medium'
                    }}
                  >
                    (bạn)
                  </Typography>
                )}
                </Typography>
                {room?.info?.admins?.some(m => m._id === member._id) && (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'orange',
                      fontWeight: 'medium'
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
};

export default RoomChatId;