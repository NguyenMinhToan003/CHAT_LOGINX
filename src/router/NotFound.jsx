import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import image from '~/assets/images/error.png';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(82, 108, 112, 1) 85%)',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: '50px', sm: '100px', md: '170px' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: { xs: '20px', md: '0' },
        }}
      >
        <Typography
          sx={{
            letterSpacing: '14.5px',
            lineHeight: '92.5px',
            fontWeight: 'bold',
            fontSize: { xs: '50px', md: '80px' },
            color: '#7F60F9',
            textShadow: '0 0 10px rgba(127, 96, 249, 0.5)',
          }}
        >
          404
        </Typography>
        <Typography
          sx={{
            letterSpacing: '2.5px',
            lineHeight: '50px',
            fontWeight: '600',
            fontSize: { xs: '30px', md: '40px' },
            color: '#ffffff',
          }}
        >
          PAGE NOT FOUND
        </Typography>
        <Typography
          sx={{
            letterSpacing: '0px',
            lineHeight: '24px',
            fontWeight: '300',
            fontSize: '18px',
            color: '#a0a0a9',
            marginTop: '10px',
            maxWidth: '440px',
          }}
        >
          Oops!{' '}Trang web này không tồn tại hoặc nó đã bị xóa.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: '30px' }}>
          <Link
            sx={{
              fontSize: '16px',
              color: '#7F60F9',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Link>
          <NavLink to="/">
            <Button
              variant="contained"
              sx={{
                padding: '12px 25px',
                borderRadius: '50px',
                background: '#7F60F9',
                fontSize: '16px',
                color: '#ffffff',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(127, 96, 249, 0.4)',
                '&:hover': {
                  background: '#6a4ed9',
                  boxShadow: '0 6px 20px rgba(127, 96, 249, 0.6)',
                },
              }}
            >
              Back to Home
            </Button>
          </NavLink>
        </Box>
      </Box>
      <Box
        sx={{
          animation: 'float 3s ease-in-out infinite', // Adding animation
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
            '100%': { transform: 'translateY(0px)' },
          },
        }}
      >
        <img
          src={image}
          alt="error"
          style={{ width: '300px', height: '300px', objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );
};

export default NotFound;