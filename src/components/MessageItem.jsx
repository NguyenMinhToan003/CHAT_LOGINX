import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import RedoIcon from '@mui/icons-material/Redo'
import { emojiMap } from '../utils/checkIcon'
import { useNavigate } from 'react-router-dom'
import linkifyHtml from 'linkify-html'
import Button from '@mui/material/Button'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import TypeFile from './typeFile/TypeFile'

const MessageItem = ({ message, key, user, setRepMessage, removeMessage }) => {
  const navigate = useNavigate()

  const content = message?.content === '<chiasebaiviet/>' || message?.content === '' || message?.content === null || message?.content === undefined
    ? null
    : linkifyHtml(message?.content, {
      defaultProtocol: 'https',  
      className: 'link',
    })

  const isCheckEmoji = emojiMap.find((emoji) => emoji.emoji === content)

  const isCheckEmojiFollowed = emojiMap.find((emoji) => emoji.emoji === message?.followedMessage?.content)

  const checkDisplayName =
    message?.sender?._id !== user._id && message?.status === 'read'
      ? message?.followedMessage?._id === undefined
        ? true
        : false
      : false

  return (
    <Box sx={{ padding: { xs: '0.3rem 0', sm: '0.5rem 0' } }} id={message._id} key={key}>
      {message.followedMessage && message.status === 'read' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: message?.sender?._id === user._id ? 'flex-end' : 'flex-start',
            alignItems: 'start',
            maxWidth: '100%',
          }}
        >
          <Box
            component='a'
            href={`#${message.followedMessage._id}`}
            sx={{
              maxWidth: { xs: '60%', sm: '40%' },
              backgroundColor: '#f5f5f5',
              borderLeft: '3px solid #4caf50',
              borderRadius: '4px',
              padding: isCheckEmojiFollowed
                ? { xs: '0.2rem 0.4rem', sm: '0.3rem 0.5rem' }
                : { xs: '0.3rem 0.6rem', sm: '0.5rem 1rem' },
              marginBottom: '0.3rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              sx={{
                color: 'gray',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                fontWeight: 500,
                lineHeight: '1.1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {message?.followedMessage?.sender?.name}
            </Typography>
            <Typography
              sx={{
                lineHeight: '1.1rem',
                fontSize: isCheckEmojiFollowed ? { xs: '1rem', sm: '1.2rem' } : { xs: '0.75rem', sm: '0.85rem' },
                color: '#555',
              }}
            >
              {message?.followedMessage?.content}
            </Typography>
            {message?.followedMessage?.images?.length > 0 && (
              <Box sx={{ mt: '0.3rem' }}>
                {message?.followedMessage?.images.map((image, index) => (
                  image?.type === 'video' ? (
                    <video
                      key={index}
                      src={image.url}
                      style={{ maxWidth: 300, borderRadius: '4px', maxHeight: 300 }}
                    />
                  ) : image?.type === 'image' ? (
                    <img
                      key={index}
                      src={image.url}
                      style={{
                        maxWidth: 150,
                        maxHeight: { xs: '80px', sm: '120px' },
                        borderRadius: '4px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : image?.type === 'raw' ? (
                        <TypeFile file={image} />
                  ) : (
                    'Lỗi hình ảnh'
                  )
                ))}
              </Box>
            )}
            <RedoIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: '#4caf50', alignSelf: 'flex-end' }} />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: message?.sender?._id === user._id ? 'flex-end' : 'flex-start',
          alignItems: 'start',
          maxWidth: '100%',
          gap: { xs: 0.5, sm: 1 },
          ':hover .more': { opacity: 1, visibility: 'visible' },
        }}
      >
        {message?.sender?._id !== user._id && (
          <Avatar
            src={message?.sender?.picture?.url}
            sx={{ width: { xs: 30, sm: 36 }, height: { xs: 30, sm: 36 }, mt: '0.2rem' }}
          />
        )}
        {message?.status === 'read' && message?.sender?._id === user?._id && (
          <Box
            className='more'
            sx={{
              opacity: 0,
              visibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s ease',
            }}
          >
            
            <IconButton onClick={() => removeMessage(message._id)} sx={{ padding: 1 }}>
              <DeleteOutlineIcon
                color='error'
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  backgroundColor: '#f0f0f0',
                }} />
            </IconButton>
            <Button onClick={() => setRepMessage(message)} sx={{
              backgroundColor: '#f0f0f0f0',
              color: 'black',
              borderRadius: { xs: 5, sm: 10 },
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              paddingX: { xs: 1, sm: 2 },
              paddingY: { xs: 0.5, sm: 1 },
            }}>
              Trả lời
            </Button>
          </Box>
        )}
        <Box
          
          sx={{
            cursor: message?.status === 'read' ? 'pointer' : 'default',
            maxWidth: { xs: '70%', sm: '50%' },
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            
          }}
        >
          {checkDisplayName && (
            <Typography
              sx={{
                color: '#333',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                lineHeight: '1.2rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {message?.sender?.name}
            </Typography>
          )}
          {content ? (
            <Typography
              sx={{
                backgroundColor:
                  message?.sender?._id === user._id ? 'messages.bg_primary' : 'messages.bg_secondary',
                borderRadius: '8px',
                width: 'fit-content',
                padding: isCheckEmoji
                  ? { xs: '0.25rem 1rem', sm: '0.5rem 0.75rem' }
                  : { xs: '0.25rem 0.5rem', sm: '0.5rem 0.75rem' },
                cursor: 'pointer',
                color:
                  message?.status === 'delete'
                    ? 'gray'
                    : message?.sender?._id === user._id
                    ? 'messages.text_primary'
                    : 'messages.text_secondary',
                fontStyle: message?.status === 'delete' ? 'italic' : 'normal',
                fontWeight: 500,
                fontSize: isCheckEmoji ? { xs: '1.5rem', sm: '2rem' } : { xs: '0.9rem', sm: '1rem' },
                lineHeight: '1.4rem',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : null}
          {message?.images && message.images.length > 0 && (
            <Box sx={{
              display: 'flex', flexWrap: 'wrap', gap: 1, width: 'fit-content',
              justifyContent: message?.images?.length === 1 ? 'center'
                : message?.sender?._id === user._id ? 'flex-end' : 'flex-start',
              alignItems: message?.images?.length === 1 ? 'center'
                : message?.sender?._id === user._id ? 'flex-end' : 'flex-start',
            }}>
              {message.images.map((image, index) => (
                image?.type === 'video' ? (
                  <Box sx={{
                    maxWidth: { xs: 250, sm: 400 },
                    maxHeight: { xs: 250, sm: 400 },
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}>
                    <video
                      key={index}
                      src={image.url}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 1
                      }}
                      loop
                      muted
                      src={image.url}
                    />
                  </Box>
                ) : image?.type === 'image' ? (
                  <img
                    key={index}
                    src={image.url}
                    style={{
                      maxWidth: message?.images?.length === 1
                        ? 250 : 150,
                      maxHeight: message?.images?.length === 1
                        ? 250 : 150,
                      borderRadius: 1,
                      objectFit: 'cover',
                    }}
                  />
                ) : image?.type === 'raw' ? (
                  <TypeFile file={image} />
                ) : null
              ))}
            </Box>
          )}
          {message?.embedPost?.author && (
            <Box
              sx={{
                minHeight: { xs: 100, sm: 120 },
                maxWidth: { xs: 550, sm: 400 },
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' ,backgroundColor: '#e0e0e0',
                    padding: '0.5rem',
                    borderRadius: '10px 10px 0 0',}}>
                    <Avatar src={message?.embedPost?.author?.picture?.url} sx={{ width: 40, height: 40 }} />
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#333',
                        cursor: 'pointer',
                        ':hover': { textDecoration: 'underline' },
                      }}
                    >
                      {message?.embedPost?.author?.name}
                    </Typography>
                  </Box>
                <img
                  onClick={() => navigate(`/post/${message?.embedPost?._id}`)}
                  src={message?.embedPost?.assets[0]?.url}
                  style={{ width: '100%' }}
                />
                <Typography
                  onClick={() => navigate(`/post/${message?.embedPost?._id}`)}
                  sx={{
                    padding: '0.5rem',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    color: '#333',
                    ':hover': {
                      textDecoration: 'underline',
                      color: '#007bff',
                    },
                  }}
                >
                  {message?.embedPost?.content}
                </Typography>
              </Box>
            </Box>
            
          )}
        </Box>
        {message?.status === 'read' && message?.sender?._id !== user?._id && (
          <Box
            className='more'
            sx={{
              opacity: 0,
              visibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s ease',
            }}
          >
            <Button onClick={() => setRepMessage(message)} sx={{
              backgroundColor: '#f0f0f0f0',
              color: 'black',
              borderRadius: { xs: 5, sm: 10 },
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              paddingX: { xs: 1, sm: 2 },
              paddingY: { xs: 0.5, sm: 1 },
            }}>
              Trả lời
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MessageItem