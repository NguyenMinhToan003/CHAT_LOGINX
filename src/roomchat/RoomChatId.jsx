import { useEffect, useRef, useState } from 'react';
import { createMessage, getAllMessage, getRoomChat } from '../api';
import { useParams } from 'react-router-dom';

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

const RoomChatId = () => {
  const { socket } = useSocket();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '/';
  }

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const audioRef = useRef(null);

  const handleChangeMessage = (e) => setMessage(e.target.value);

  const handleSentMessage = async () => {
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


  const fetchRoom = async () => {
    try {
      const response = await getRoomChat(id);
      if (Array.isArray(response) && response.length > 0) {
        setRoom(response[0]);
        const resMess = await getAllMessage(id, user._id);
        setMessages(Array.isArray(resMess) ? resMess : [resMess.message]);
        socket.emit('join-room', { roomId: id, user: user._id });
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

      <Box sx={{
        paddingX: 1,
        paddingY: 1,
        backgroundColor: 'background.default',
        height: '100vh'
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
                <IconButton color='error'>
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
              <IconButton >
                <MoreHorizIcon sx={{ color: 'text.primary' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider />
          <Box sx={{ overflowY: 'auto', overflowX: 'hidden', height: '100%', padding: 1 }}>
            {
              messages?.map((data, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      data.sender._id === user._id ? 'row-reverse' : 'row',
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
                    backgroundColor:
                      data.sender._id === user._id
                        ? 'messages.bg_primary'
                        : 'messages.bg_secondary',
                    borderRadius: 5,
                    padding: '0.75rem 1.25rem',
                    height: 'fit-content',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}>
                    {
                      data.sender._id !== user._id && (
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
                      )
                    }
                    <Typography
                      sx={{
                        color:
                          data.sender._id === user._id
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
              ))
            }
          </Box>
          <Divider />
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
              onChange={(event)=>handleChangeMessage(event)}
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
        </Box>
      </Box >
  </>
};

export default RoomChatId;
