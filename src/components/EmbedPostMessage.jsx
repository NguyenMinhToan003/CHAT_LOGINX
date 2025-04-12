import { Avatar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmbedPostMessage = ({ embedPost }) => {
  const navigate = useNavigate();

  if (!embedPost) return null;

  return (
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#e0e0e0',
            padding: '0.5rem',
            borderRadius: '10px 10px 0 0',
          }}
        >
          <Avatar
            src={embedPost?.author?.picture?.url}
            sx={{ width: 40, height: 40 }}
          />
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: '#333',
              cursor: 'pointer',
              ':hover': { textDecoration: 'underline' },
            }}
          >
            {embedPost?.author?.name}
          </Typography>
        </Box>
        <img
          onClick={() => navigate(`/post/${embedPost?._id}`)}
          src={embedPost?.assets[0]?.url}
          style={{ width: '100%' }}
          alt="Embedded post"
        />
        <Typography
          onClick={() => navigate(`/post/${embedPost?._id}`)}
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
          {embedPost?.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmbedPostMessage;