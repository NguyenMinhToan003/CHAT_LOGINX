import { Avatar, Box, IconButton, Typography } from "@mui/material"
import ReplyIcon from '@mui/icons-material/Reply';
import ClearIcon from '@mui/icons-material/Clear'
import RedoIcon from '@mui/icons-material/Redo'
const MessageItem = ({ message, key, user, setRepMessage, removeMessage }) => {
  return <>
    <Box sx={{padding: '0.5rem 0'}}>
      {
        message.followedMessage && (
          <Box sx={{
            display: 'flex',
            justifyContent: message?.sender?._id === user._id ? 'row-reverse' : 'row',
            alignItems: 'start',
            maxWidth: '100%',
            flexDirection: message?.sender?._id === user._id ? 'row-reverse' : 'row',
        }}>
          <Box sx={{
            maxWidth: '70%',
            backgroundColor: '#f0f0f0f0',
            padding: '0.75rem 1.25rem',
            color:'gray',
            height: 'fit-content',
            display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '1px solid green',
            borderRadius:2
          }}>
              <Typography>
                {message?.followedMessage?.content}
              </Typography>
              <RedoIcon/>
          </Box>
        </Box>
        )
      }
      <Box
        
        key={key}
        sx={{
          display: 'flex',
          justifyContent: message?.sender?._id === user._id ? 'row-reverse' : 'row',
          alignItems: 'start',
          maxWidth: '100%',
          flexDirection: message?.sender?._id === user._id ? 'row-reverse' : 'row',
          gap: 1,
          ':hover .more': { opacity: 1, visibility: 'visible' },
        }}
      >
        {message?.sender?._id !== user._id && (
          <Avatar
            src={message?.sender?.picture}
            sx={{ width: 36, height: 36 }}
          />
        )}
        <Box sx={{
          zIndex: 1,
          maxWidth: '70%',
          backgroundColor:
            message.status === 'read' ?message?.sender?._id === user._id
              ? 'messages.bg_primary'
              : 'messages.bg_secondary'
            : '#de5454',
          borderRadius: 3,
          padding: '0.75rem 1.25rem',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          {message?.sender?._id !== user._id && (
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
              {message?.sender?.name}
            </Typography>
          )}
          <Typography
            sx={{
              color: message.status === 'read'
              ? message?.sender?._id === user._id
                ? 'messages.text_primary'
                  : 'messages.text_secondary'
              : 'white',

              fontWeight: 500,
              fontSize: '1.0625rem',
              lineHeight: '1.625rem',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word'
            }}
          >
            {message.content}
            
          </Typography>
        </Box>
        {
          message?.status ==='read' && (
        <Box className='more'
          sx={{
            opacity: 0,
            visibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'opacity 0.3s ease',
          }}
        >
          <IconButton onClick={() => setRepMessage(message)} >
            <ReplyIcon />
          </IconButton>
          <IconButton onClick={()=>removeMessage(message._id)}>
            <ClearIcon  />
          </IconButton>
        </Box>
          )
        }
      </Box>
    </Box>
  </>
}
export default MessageItem