// src/components/GlobalLoading.js

import { Box, CircularProgress, Backdrop, Typography } from '@mui/material';


const GlobalLoading = ({ loading }) => {
  
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Đảm bảo layer loading nằm trên cùng
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
      }}
      open={loading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Đang tải...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoading;