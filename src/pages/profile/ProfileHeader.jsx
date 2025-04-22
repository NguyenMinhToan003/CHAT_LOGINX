import React, { useState, useEffect } from 'react';
import { getUserById, updateProfilePicture, sendFriendRequest, getFriends } from '~/api/userAPI';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Box, 
  Avatar, 
  IconButton, 
  Typography,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { unfriend } from '~/api/notificationApi';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

const ProfileHeader = ({ user, onProfileUpdate, isOwnProfile, currentUser }) => {
  const navigate = useNavigate();
  const [coverPhoto, setCoverPhoto] = useState('https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/10/tai-anh-phong-canh-dep-5.jpg.webp');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [contacts, setContacts] = useState([]);

  const defaultProfilePhoto = 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg';
  const getProfilePicture = () => user?.picture?.url || defaultProfilePhoto;

  // Logic lấy danh sách bạn bè
  const fetchContacts = async () => {
    if (!user?._id) return;
    try {
      const res = await getFriends(user._id);
      setContacts(res || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user?._id]);

  // Kiểm tra xem currentUser có phải là bạn bè của user không
  const isFriend = contacts.some(contact => contact._id === currentUser?._id);

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPhoto(URL.createObjectURL(file));
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || !user?._id) return;

    try {
      setIsLoading(true);
      const result = await updateProfilePicture(user._id, user.name, file);
      if (result) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSave = async () => {
    if (!newName.trim()) return;

    try {
      setIsLoading(true);
      const response = await updateProfilePicture(user._id, newName, null);
      if (response) {
        onProfileUpdate();
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!currentUser?._id || !user?._id) return;

    try {
      const response = await sendFriendRequest(currentUser._id, user._id);
      console.log("Gửi lời mời kết bạn:", response);
      setFriendRequestSent(true);
    } catch (error) {
      console.error('Lỗi khi gửi lời mời kết bạn:', error);
    }
  };

  const handleUnFriend = async () => {
    if (!currentUser?._id || !user?._id) return;

    try {
      const response = await unfriend(user._id, currentUser._id);
      console.log("Hủy kết bạn:", response);
      fetchContacts(); // Cập nhật lại danh sách bạn bè sau khi hủy
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
    }
  };

  const handleOpenEditProfileDialog = () => {
    setOpenEditProfileDialog(true);
    setNewName(user?.name || '');
    setPreviewProfileImage(getProfilePicture());
    setSelectedProfileImage(null);
  };

  const handleCloseEditProfileDialog = () => {
    setOpenEditProfileDialog(false);
    setNewName(user?.name || '');
    setPreviewProfileImage(null);
    setSelectedProfileImage(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfileChanges = async () => {
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      if (selectedProfileImage && newName !== user?.name) {
        await updateProfilePicture(user._id, newName, selectedProfileImage);
      } else if (selectedProfileImage) {
        await updateProfilePicture(user._id, user.name, selectedProfileImage);
      } else if (newName !== user?.name) {
        await updateProfilePicture(user._id, newName, null);
      }
      
      onProfileUpdate();
      handleCloseEditProfileDialog();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='cover-photo-container'>
        <div className='cover-photo'>
          <img src={coverPhoto} alt='Cover' style={{ objectFit: 'fill', width: '100%', height: '100%' }} />
          {isOwnProfile && (
            <>
              <Button variant="contained" color="primary" onClick={() => navigate('/login')} className='logout-btn'>
                Logout
              </Button>
              <label className='edit-cover-photo-btn' htmlFor="cover-photo-input">
                <i className='fas fa-camera'></i> Thêm ảnh bìa
              </label>
              <input
                id="cover-photo-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverPhotoChange}
              />
            </>
          )}
        </div>
      </div>
      <div className='profile-info-container'>
        <div className='profile-photo-container'>
          <div className='profile-photo'>
            <img src={getProfilePicture()} alt='Profile' style={{ width: '100%', height: '100%' }} />
            {isOwnProfile && (
              <>
                <label className='edit-profile-photo' htmlFor="profile-photo-input">
                  <i className='fas fa-camera'></i>
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoChange}
                />
              </>
            )}
            {isLoading && <div className="loading-overlay">Đang tải...</div>}
          </div>
        </div>
        <div className='profile-details'>
          <h1 
            className='profile-name'
            onClick={() => isOwnProfile && setIsEditingName(true)}
            style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
          >
            {user?.name || 'Loading...'}
            {isOwnProfile && <i className='fas fa-pencil-alt edit-icon'></i>}
          </h1>
          <p className='friends-count'>{contacts.length} người bạn</p>
        </div>
        <div className='profile-actions'>
          {isOwnProfile ? (
            <>
              <button className='add-story-btn'>
                <i className='fas fa-plus'></i> Thêm vào tin
              </button>
              <button className='edit-profile-btn' onClick={handleOpenEditProfileDialog}>
                <i className='fas fa-pencil-alt'></i> Chỉnh sửa trang cá nhân
              </button>
            </>
          ) : (
            <>
              {friendRequestSent ? (
                <button className='friend-request-sent-btn' disabled>
                  <i className='fas fa-user-clock'></i> Đã gửi lời mời kết bạn
                </button>
              ) : isFriend ? (
                // Nếu đã là bạn bè, chỉ hiển thị nút "Hủy kết bạn"
                <button className='add-friend-btn' onClick={handleUnFriend}>
                  <i className='fas fa-user-minus'></i> Hủy kết bạn
                </button>
              ) : (
                // Nếu chưa là bạn bè, hiển thị nút "Thêm bạn bè"
                <button className='add-friend-btn' onClick={handleAddFriend}>
                  <i className='fas fa-user-plus'></i> Thêm bạn bè
                </button>
              )}
              <button onClick={() => navigate(`/chat-user/${user._id}`)} className='message-btn'>
                <i className='fas fa-comment'></i> Nhắn tin
              </button>
            </>
          )}
        </div>
      </div>

      {isEditingName && (
        <div className="modal-overlay" onClick={() => setIsEditingName(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh sửa tên</h2>
              <button className="close-btn" onClick={() => setIsEditingName(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <label className="name-label">Tên:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="name-input"
                placeholder="Nhập tên mới"
                maxLength={50}
              />
              <p className="name-hint">Tên phải từ 2-50 ký tự</p>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsEditingName(false);
                  setNewName(user?.name || '');
                }}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className="save-btn"
                onClick={handleNameSave}
                disabled={isLoading || newName.trim().length < 2}
              >
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog 
        open={openEditProfileDialog} 
        onClose={handleCloseEditProfileDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          <Typography variant="h6">Chỉnh sửa trang cá nhân</Typography>
          <IconButton onClick={handleCloseEditProfileDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ảnh đại diện</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                position: 'relative', 
                width: 150, 
                height: 150, 
                borderRadius: '50%', 
                overflow: 'hidden',
                border: '2px solid #3f51b5'
              }}
            >
              {previewProfileImage && (
                <img 
                  src={previewProfileImage} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  p: 1
                }}
              >
                <input
                  accept="image/*"
                  id="profile-image-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton 
                    component="span" 
                    sx={{ color: 'white' }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
            </Paper>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2 }}>Thông tin cá nhân</Typography>
          <TextField
            label="Họ tên"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: <EditIcon color="action" fontSize="small" />
            }}
            helperText="Tên phải từ 2-50 ký tự"
            error={newName.trim().length < 2}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleCloseEditProfileDialog}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveProfileChanges}
            disabled={isLoading || newName.trim().length < 2}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileHeader;