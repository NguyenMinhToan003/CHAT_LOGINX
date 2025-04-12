import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getFriends } from '../api/userAPI'
import { getRoomChatByUserId } from '../api'
import { createMessage } from '../api/messageAPI'
import { findOrCreateRoomPrivate } from '../api/roomAPI'
import {socket} from '../socket'

const FormSharePost = ({ post, open, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [friends, setFriends] = useState([])
  const [roomChats, setRoomChats] = useState([])
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')

  const fetchData = async () => {
    try {
      const resFriends = await getFriends(user._id)
      setFriends(resFriends)
      const resRoomChats = await getRoomChatByUserId(user._id, 'group')
      setRoomChats(resRoomChats)
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  useEffect(() => {
    if (open) {
      fetchData()
      setSelected(null)
      setMessage('')
    }
  }, [open])

  const handleShare = async () => {
    let id = selected?._id
    if (type === 'friend') {
      const findRoom = await findOrCreateRoomPrivate(user._id, selected._id)
      id = findRoom._id || findRoom.insertedId
    }

    const response = await createMessage(
      id,
      user._id,
      message || '<chiasebaiviet/>',
      null,
      post._id
    )
    if (response.insertedId) {
      let data = {
        status: 'read',
        content: message || '<chiasebaiviet/>',
        _id: response.insertedId,
        sender: {
          _id: user?._id,
          name: user?.name,
          picture: user?.picture,
        },
        roomId: id,
        images: [],
        followedMessage: null,
        embedPost: {
          _id: post._id,
          author:post.author,
          assets: post.assets,
          content: post.content,
        }
      }
      
      socket.emit('message', data)
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          padding: '16px',
          width: '100%',
          maxWidth: '600px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Chia sẻ bài viết</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1,
            minHeight: 350,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          {/* Hiển thị thông tin bài viết */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
            <img
              src={post?.assets?.length > 0 ? post.assets[0].url : 'https://via.placeholder.com/80'}
              style={{
                width: 60,
                height: 60,
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
              alt="Post thumbnail"
            />
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={post?.author?.picture?.url}
                  alt="Avatar"
                  sx={{ width: 24, height: 24 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {post?.author?.name || 'Tên tác giả'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {new Date(post?.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#555',
                }}
              >
                {post?.content || 'Nội dung bài viết...'}
              </Typography>
            </Box>
          </Box>

          {/* Phần chọn bạn bè/nhóm hoặc nhập nội dung chia sẻ */}
          {selected === null ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'medium', width: '100%' }}>
                Chọn bạn bè hoặc nhóm để chia sẻ
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  overflowY: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  p: 1,
                }}
              >
                {friends.length === 0 && roomChats.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2, textAlign: 'center' }}
                  >
                    Không có bạn bè hoặc nhóm để chia sẻ
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {friends.map((friend) => (
                      <Box
                        key={friend._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1,
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#e0f7fa',
                          },
                        }}
                        onClick={() => {
                          setSelected(friend)
                          setType('friend')
                        }}
                      >
                        <Avatar
                          src={friend.picture?.url}
                          alt="Avatar"
                          sx={{ width: 36, height: 36 }}
                        />
                        <Typography variant="body2">{friend.name}</Typography>
                      </Box>
                    ))}
                    {roomChats.map((roomChat) => (
                      <Box
                        key={roomChat._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          padding: 1,
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#e0f7fa',
                          },
                        }}
                        onClick={() => {
                          setSelected(roomChat)
                          setType('group')
                        }}
                      >
                        <Avatar
                          src={roomChat.avatar?.url}
                          alt="Avatar"
                          sx={{ width: 36, height: 36 }}
                        />
                        <Typography variant="body2">{roomChat.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar
                  src={selected.picture?.url || selected.avatar?.url}
                  alt="Avatar"
                  sx={{ width: 36, height: 36 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {selected.name || selected.roomName}
                </Typography>
              </Box>
              <TextField
                label="Nhập nội dung chia sẻ"
                variant="outlined"
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#1a3c4d',
                    },
                    '&:hover fieldset': {
                      borderColor: '#388e3c',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#388e3c',
                    },
                  },
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setSelected(null)}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            color: '#555',
          }}
          disabled={selected === null}
        >
          Bỏ chọn
        </Button>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            color: '#555',
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleShare}
          variant="contained"
          sx={{
            borderRadius: '8px',
            backgroundColor: '#1a3c4d',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#155a3b',
            },
          }}
          disabled={selected === null}
        >
          Chia sẻ
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormSharePost