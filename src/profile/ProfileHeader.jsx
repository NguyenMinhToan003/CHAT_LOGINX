import React, { useState } from 'react';
import { getUserById, updateProfilePicture } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ user, onProfileUpdate, isOwnProfile, currentUser }) => {
  const navigate = useNavigate()
  const [coverPhoto, setCoverPhoto] = useState('https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/10/tai-anh-phong-canh-dep-5.jpg.webp');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  const defaultProfilePhoto = 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg';
  const getProfilePicture = () => user?.picture?.url || defaultProfilePhoto;

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

  const handleAddFriend = () => {
    // Here you would implement the API call to add a friend
    // For now, we'll just toggle the state to show a different button
    setFriendRequestSent(true);
    // In a real implementation, you would call an API like:
  };

  return (
    <>
      <div className='cover-photo-container'>
        <div className='cover-photo'>
          <img src={coverPhoto} alt='Cover' style={{ objectFit: 'fill', width: '100%', height: '100%' }} />
          {isOwnProfile && (
            <>
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
          <h1 className='profile-name' 
              onClick={() => isOwnProfile && setIsEditingName(true)} 
              style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}>
            {user?.name || 'Loading...'}
            {isOwnProfile && <i className='fas fa-pencil-alt edit-icon'></i>}
          </h1>
          <p className='friends-count'>500 người bạn</p>
        </div>
        <div className='profile-actions'>
          {isOwnProfile ? (
            <>
              <button className='add-story-btn'>
                <i className='fas fa-plus'></i> Thêm vào tin
              </button>
              <button className='edit-profile-btn'>
                <i className='fas fa-pencil-alt'></i> Chỉnh sửa trang cá nhân
              </button>
            </>
          ) : (
            <>
              {friendRequestSent ? (
                <button className='friend-request-sent-btn' disabled>
                  <i className='fas fa-user-clock'></i> Đã gửi lời mời kết bạn
                </button>
              ) : (
                <button className='add-friend-btn' onClick={handleAddFriend}>
                  <i className='fas fa-user-plus'></i> Thêm bạn bè
                </button>
              )}
              <button onClick={()=>navigate(`/chat-user/${user._id}`)} className='message-btn'>
                <i className='fas fa-comment'></i> Nhắn tin
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa tên */}
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
    </>
  );
};

export default ProfileHeader;