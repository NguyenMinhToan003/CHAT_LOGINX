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

const RoomChatId = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { id } = useParams();
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

  const handleChangeMessage = (e) => setMessage(e.target.value);

  const handleSentMessage = async () => {
    if (!message.trim()) return;
    const response = await createMessage(id, user?._id, message);
    if (response.insertedId) {
      socket.emit('message', {
        content: message,
        _id: response.insertedId,
        sender: {
          _id: user?._id,
          name: user?.name,
          picture: user?.picture,
        },  
        roomId: id,
      });
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
                <IconButton color='error' onClick={()=>navigate('/roomchats')} >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Button startIcon={<Avatar sx={{ width: 36, height: 36 }}
                src={room?.info?.avartar} />}>
                <Typography sx={{ color: 'text.main' }}>
                  {room?.info?.name}
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
            {messages.length>0 && messages?.map((data, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: data.sender._id === user._id ? 'row-reverse' : 'row',
                  alignItems: 'start',
                  maxWidth: '100%',
                  flexDirection: data.sender._id === user._id ? 'row-reverse' : 'row',
                  gap: 1,
                  padding: '5px',
                  ':hover .more': { opacity: 1, visibility: 'visible' }
                }}
              >
                {data.sender._id !== user._id && (
                  <Avatar
                    src={data.sender.picture}
                    sx={{ width: 36, height: 36 }}
                  />
                )}
                <Box sx={{
                  maxWidth: '70%',
                  backgroundColor: data.sender._id === user._id
                    ? 'messages.bg_primary'
                    : 'messages.bg_secondary',
                  borderRadius: 5,
                  padding: '0.75rem 1.25rem',
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}>
                  {data.sender._id !== user._id && (
                    <Typography
                      sx={{
                        color: 'black',
                        fontWeight: 500,
                        fontSize: '1.0625rem',
                        lineHeight: '1.625rem',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {data.sender.name}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      color: data.sender._id === user._id
                        ? 'messages.text_primary'
                        : 'messages.text_secondary',
                      fontWeight: 500,
                      fontSize: '1.0625rem',
                      lineHeight: '1.625rem',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {data.content}
                  </Typography>
                </Box>
              </Box>
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

        <Box sx={{
          display: toggleShowInfoRoom ? 'block' : 'none',
          transition: 'display 1.5s ease-in-out',
          flex: 1,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          padding: 2,

          overflowY: 'auto'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button variant='outlined' sx={{ color: 'text.primary', borderColor: 'text.primary' }}>
              Thêm thành viên
            </Button>
            <Tooltip title='Thoát nhóm'>
              <IconButton color='error' onClick={handlLeaveRoom}>
              <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography 
              sx={{ 
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 'medium',
                mb: 2
              }}
            >
              Thành viên ({room?.members?.length || 0})
            </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5 
          }}>
            {room?.members?.map((member, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: 1,
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