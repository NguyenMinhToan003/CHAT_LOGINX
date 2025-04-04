import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Tooltip,
  Fade,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { updateRoom } from '../api/roomAPI';

const EditGroupForm = ({ open, onClose, room, setIsChange }) => {
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Update the form when the room data changes or the dialog opens
  useEffect(() => {
    if (room && open) {
      setName(room.name || '');
      setAvatarPreview(room.avatar?.url || '');
      setError('');
      setShowSuccess(false);
    }
  }, [room, open]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!name.trim()) {
        setError('Tên nhóm không được để trống');
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('roomId', room._id);
      formData.append('name', name);
      formData.append('userAction', user._id);
      
      if (avatarFile) {
        formData.append('files', avatarFile);
      }
      
      const response = await updateRoom(formData);
      
      if (response && response.acknowledged) {
        setShowSuccess(true);
        setIsChange(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response?.message || 'Có lỗi xảy ra khi cập nhật nhóm');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhóm:', error);
      setError('Có lỗi xảy ra khi cập nhật nhóm');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? null : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: { borderRadius: 2, overflow: 'hidden' }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon fontSize="small" />
            Chỉnh sửa thông tin nhóm
          </Typography>
          <IconButton onClick={onClose} disabled={isLoading} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 1 }}>
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Cập nhật thông tin nhóm thành công!
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
            <Paper elevation={3} sx={{ 
              borderRadius: '50%', 
              position: 'relative',
              overflow: 'hidden',
              width: 120, 
              height: 120,
            }}>
              <Avatar
                src={avatarPreview}
                sx={{ width: '100%', height: '100%' }}
              />
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                py: 0.5,
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('avatar-upload').click()}
              >
                <PhotoCameraIcon sx={{ color: 'white' }} />
              </Box>
            </Paper>
            
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            
            <Tooltip title="Nhấn để thay đổi ảnh nhóm">
              <Button 
                variant="outlined" 
                size="small"
                color="secondary"
                onClick={() => document.getElementById('avatar-upload').click()}
                startIcon={<PhotoCameraIcon />}
              >
                Thay đổi ảnh
              </Button>
            </Tooltip>
          </Box>
          
          <TextField
            label="Tên nhóm"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? error : ''}
            autoComplete="off"
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 1.5 }
            }}
          />
          
          {error && !(!name.trim() && error) && (
            <Alert severity="error">{error}</Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose} 
          color="error" 
          variant="outlined"
          disabled={isLoading}
          sx={{ borderRadius: 1.5 }}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            borderRadius: 1.5,
            minWidth: 130,
            boxShadow: 2
          }}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupForm;