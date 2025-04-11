import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../provider/SocketProvider';
import { 
  createMessage, 
  getAllMessage, 
  getRoomChat
} from '../api';
import { deleteMessage ,createMessageImage} from '../api/messageAPI';
import { findOrCreateRoomPrivate } from '../api/roomAPI';
import MessageItem from '../components/MessageItem';
import GlobalLoading from '../components/GlobalLoading';
import audio from '../assets/sound/message-notification.mp3';
import { emojiMap } from '../utils/checkIcon';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VideocamIcon from '@mui/icons-material/Videocam';


const emojiList = emojiMap;

const RoomChatPrivate = () => {
  const { onlineUsers, socket, handleCallVideo } = useSocket();
  const navigate = useNavigate();
  const { id: idUserOrder } = useParams();
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/';
  }

  const [isLoading, setIsLoading] = useState(false);
  const [toggleShowInfoRoom, setToggleShowInfoRoom] = useState(false);
  const [room, setRoom] = useState(null);
  const [id, setId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [repMessage, setRepMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSentMessage, setIsSentMessage] = useState(false);

  const handleChangeMessage = (e) => setMessage(e.target.value);

  const handleSetRepMessage = (message) => {
    setRepMessage((prev) =>
      prev === message
        ? null
        : {
            _id: message._id,
            content: message.content,
            sender: message.sender,
            images: message.images,
          }
    );
  };

  const handleSentMessageImage = async (e) => {
    setIsSentMessage(true);
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('roomId', id);
    formData.append('sender', user._id);
    if (repMessage) {
      formData.append('followMessageId', repMessage._id);
    }

    const response = await createMessageImage(formData);
    if (response.insertedId) {
      const data = {
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
      };
      socket.emit('message', data);
      setRepMessage(null);
      setIsSentMessage(false);
    }
  };

  const handleSentMessageIcon = async (emoji) => {
    setIsSentMessage(true);
    let response;
    if (repMessage !== null) {
      response = await createMessage(id, user?._id, emoji, repMessage._id);
      setRepMessage(null);
    } else {
      response = await createMessage(id, user?._id, emoji);
    }

    if (response.insertedId) {
      const data = {
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
      };
      socket.emit('message', data);
    }
    setShowEmojiPicker(false);
    setIsSentMessage(false);
  };

  const handleSentMessageText = async () => {
    setIsSentMessage(true);
    if (!message.trim()) return;

    let response;
    if (repMessage === null) {
      response = await createMessage(id, user?._id, message);
    } else {
      response = await createMessage(id, user?._id, message, repMessage._id);
      setRepMessage(null);
    }

    if (response.insertedId) {
      const data = {
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
      };
      socket.emit('message', data);
      setMessage('');
      setIsSentMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSentMessageText();
    }
  };

  const handleDeleteMessage = async (id) => {
    await deleteMessage(id, user._id);
    await fetchRoom();
  };

  const handleVideoCallFunc = () => {
    handleCallVideo({
      userId: idUserOrder,
      name: room.name,
      picture: room.avatar,
      socketId: idUserOrder,
    });
  };

  const fetchRoom = async () => {
    try {
      setIsLoading(true);
      let response = await findOrCreateRoomPrivate(user._id, idUserOrder);
      if (response?.insertedId) {
        response = await getRoomChat(response.insertedId);
      }
      setId(response._id);

      const roomData = response;
      const isOnline = onlineUsers.some((user) => user.userId === idUserOrder);
      roomData.isOnline = isOnline;
      setRoom(roomData);

      const resMess = await getAllMessage(response._id, user._id);
      if (Array.isArray(resMess.messages)) {
        setMessages(resMess.messages);
        socket.emit('join-room', { roomId: response._id, user: user._id });
      }
    } catch (error) {
      console.error('Lỗi khi fetch room chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (socket) {
      socket.emit('leave-room', { roomId: id, user: user._id });
    }
    navigate('/roomchats');
  };

  useEffect(() => {
    if (!socket) return;
    fetchRoom();
  }, [id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSentMessage]);

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

  return (
    <>
      <audio ref={audioRef} src={audio} />
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
                padding: 1,
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
                  startIcon={<Avatar sx={{ width: 36, height: 36 }} src={room?.avatar?.url} />}
                >
                  <Typography sx={{ color: 'text.main' }}>
                    {room?.name.length > 10 ? `${room?.name.slice(0, 10)}...` : room?.name}
                  </Typography>
                </Button>
              </Box>
              <Box>
                <Tooltip title="Call video">
                  <IconButton color="primary" onClick={handleVideoCallFunc}>
                    <VideocamIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="menu">
                  <IconButton
                    color="primary"
                    onClick={() => setToggleShowInfoRoom(!toggleShowInfoRoom)}
                  >
                    <MoreHorizIcon sx={{ color: 'text.primary' }} />
                  </IconButton>
                </Tooltip>
              </Box>
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
                messages.map((data, index) => (
                  <MessageItem
                    key={index}
                    removeMessage={handleDeleteMessage}
                    setRepMessage={handleSetRepMessage}
                    message={data}
                    user={user}
                  />
                ))}

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

            <Box>
              {repMessage && (
                <Box
                  sx={{
                    height: 100,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    padding: 1,
                    color: 'white',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold', padding:2 }}>
                      Đang trả lời {repMessage.sender.name}
                    </Typography>
                    <Typography
                      sx={{
                        borderLeft: '3px solid #4caf50',
                        paddingLeft: 1,
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {repMessage.images.length > 0
                        ? repMessage.images.map((image, index) => {
                            if (image.type === 'image') {
                              return (
                                <img
                                  key={index}
                                  src={image.url}
                                  alt=""
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                />
                              );
                            } else if (image.type === 'video') {
                              return (
                                <video
                                  key={index}
                                  src={image.url}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                  controls
                                />
                              );
                            } else {
                              return (
                                <a
                                  key={index}
                                  href={image.url}
                                  download
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                >
                                  {image.url}
                                </a>
                              );
                            }
                          })
                        : repMessage.content}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setRepMessage(null)}>
                    <ArrowBackIcon />
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
                      bottom: '100%',
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
                      zIndex: 10,
                      flexWrap: 'wrap',
                      transition: 'width 0.5s, height 0.5s, opacity 0.5s, visibility 0.5s',
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
                  onChange={handleChangeMessage}
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
                  <Tooltip title="Send message">
                    <IconButton color="success" onClick={handleSentMessageText}>
                      <ThumbUpAltIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Like">
                    <IconButton color="success" onClick={() => handleSentMessageIcon('👍')}>
                      <ThumbUpAltIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
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
              onClick={() => navigate(`/profile/${idUserOrder}`)}
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
              {room?.detail || 'Không có mô tả'}
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
              }}
            >
              {room?.isOnline ? (
                <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  Đang hoạt động
                </Typography>
              ) : (
                <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  Không hoạt động
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RoomChatPrivate;