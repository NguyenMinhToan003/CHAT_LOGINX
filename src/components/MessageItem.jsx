
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ClearIcon from '@mui/icons-material/Clear';
import RedoIcon from '@mui/icons-material/Redo';
import { emojiMap } from "../utils/checkIcon";
import { CardCover } from "@mui/joy";


const MessageItem = ({ message, key, user, setRepMessage, removeMessage }) => {

  const content = message.content;
  const isCheckEmoji = emojiMap.find(emoji => emoji.emoji === content);
  const isCheckEmojiFollowed = emojiMap.find(emoji => emoji.emoji === message?.followedMessage?.content);
  return (
    <Box sx={{ padding: '0.5rem 0' }} id={message._id} key={key}>
      {message.followedMessage && message.status === 'read' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: message?.sender?._id === user._id ? 'row-reverse' : 'row',
            alignItems: 'start',
            maxWidth: '100%',
            flexDirection: message?.sender?._id === user._id ? 'row-reverse' : 'row',
          }}
        >
          <a
            href={`#${message.followedMessage._id}`}
            style={{
              maxWidth: '50%',
              backgroundColor: '#f0f0f0f0',
              color: 'gray',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              border: '1px solid green',
              borderRadius: 2,
              padding: isCheckEmojiFollowed?'1rem 2rem':'0.75rem 1.25rem',
            }}
          >
            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.2rem',
                maxHeight: '4.8rem',
                fontSize: isCheckEmojiFollowed? '1.5rem':'0.8625rem',
              }}
            >
              {message?.followedMessage?.content}
            </Typography>
            {message?.followedMessage?.images?.length > 0 && (
            <Box >
                {message?.followedMessage?.images.map((image, index) => {
                  image?.type === 'video' ? <video
                  key={index}
                  src={image.url}
                  controls
                    style={{ maxWidth: '100%', borderRadius: 5 }}
                />
              
                 : image?.type === 'image' ?
                    <img
                    key={index}
                    src={image.url}
                    alt={`Image ${index}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    />
                    // underline link
                    : image?.type === 'raw' ?
                      <a
                        style={{ color: 'gray',textDecoration: 'underline', display: 'block'} }
                        href={image.url} key={index} target="_blank" rel="noreferrer" >
                      {image.public_id}
                    </a> : 'Lỗi hình ảnh'
                })}
            </Box>
          )}
            <RedoIcon />
          </a>
        </Box>
      )}

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
        <Box
          onClick={() => message?.status !=='delete' && setRepMessage(message)}
          sx={{
            zIndex: 1,
            maxWidth: '50%',
            backgroundColor:
              message?.sender?._id === user._id
                ? 'messages.bg_primary'
                : 'messages.bg_secondary',
            borderRadius: 3,
            padding: isCheckEmoji?'1rem 2rem':'0.75rem 1.25rem',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {message?.sender?._id !== user._id && message.status === 'read' && (
            <Typography
              sx={{
                color: 'black',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '1.625rem',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
              }}
            >
              {message?.sender?.name}
            </Typography>
          )}
          <Typography
            
            sx={{
              cursor: 'pointer',
              color:
                message?.status === 'delete'
                  ? 'gray'
                  : message?.sender?._id === user._id
                  ? 'messages.text_primary'
                  : 'messages.text_secondary',
              fontStyle: message?.status === 'delete' ? 'italic' : 'normal',
              fontWeight: 500,
              fontSize: isCheckEmoji? '2rem':'1.0625rem',
              lineHeight: '1.625rem',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {content}
          </Typography>

            {message?.images && message.images.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap:'wrap', gap: 1, width:'100%', justifyContent: 'center', alignItems: 'center' }}>
              {message.images.map((image, index) => (
                image?.type === 'video' ? <video
                  key={index}
                  src={image.url}
                  controls
                    style={{ maxWidth: '100%', borderRadius: 5 }}
                />
              
                 : image?.type === 'image' ?
                    <img
                    key={index}
                    src={image.url}
                    alt={`Image ${index}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    />
                    // underline link
                    : image?.type === 'raw' ?
                      <a
                        style={{ color: 'gray',textDecoration: 'underline'}}
                        href={image.url} key={index} target="_blank" rel="noreferrer" >
                      {image.public_id}
                    </a> : null
              ))}
            </Box>
          )}
        </Box>

        {message?.status === 'read' && message?.sender?._id === user?._id && (
          <Box
            className="more"
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
            <IconButton onClick={() => removeMessage(message._id)}>
              <ClearIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      </Box>

  );
};

export default MessageItem;