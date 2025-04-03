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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateRoom } from '../api/roomAPI';

const EditGroupForm = ({ open, onClose, room, setIsChange }) => {
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Update the form when the room data changes or the dialog opens
  useEffect(() => {
    if (room && open) {
      setName(room.name || '');
      setAvatarPreview(room.avatar?.url || '');
      setError('');
    }
  }, [room, open]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
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
        setIsChange(true);
        onClose();
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật nhóm');
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
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chỉnh sửa thông tin nhóm</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
            <Avatar
              src={avatarPreview}
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              onClick={() => document.getElementById('avatar-upload').click()}
            />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              Thay đổi ảnh
            </Button>
          </Box>
          
          <TextField
            label="Tên nhóm"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? error : ''}
          />
          
          {error && !(!name.trim() && error) && (
            <Typography color="error">{error}</Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="error" variant="outlined">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupForm;