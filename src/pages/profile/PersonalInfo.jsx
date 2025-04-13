import { useState } from 'react';
import { updateUserProfile } from '~/api/userAPI';

const PersonalInfo = ({ user, setUser, onProfileUpdate, isOwnProfile }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    work: user.work || '',
    bio: user.bio || '',
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
  });

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = async () => {
    try {
      const updatedData = {
        name: user.name || "Chưa cập nhật",
        phone: personalInfo.phone,
        email: personalInfo.email,
        address: personalInfo.address,
        bio: personalInfo.bio,
        work: personalInfo.work,
      };
  
      console.log("Dữ liệu gửi lên:", updatedData);
  
      await updateUserProfile(user._id, updatedData);
  
      setUser(prev => ({
        ...prev,
        ...updatedData,
      }));
  
      if (onProfileUpdate) {
        onProfileUpdate();
      }
  
      setIsEditingInfo(false);
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Có lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };
  
  return (
    <div className='personal-info-section' id='header'>
      {isEditingInfo ? (
        <div className='personal-info-edit-form'>
          <h3>Chỉnh sửa thông tin cá nhân</h3>
          <div className='form-group'>
            <label>Nơi làm việc</label>
            <input name="work" value={personalInfo.work} onChange={handleInfoChange} />
          </div>
          <div className='form-group'>
            <label>Học vấn</label>
            <input name='bio' value={personalInfo.bio} onChange={handleInfoChange} />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input name='email' value={personalInfo.email} onChange={handleInfoChange} />
          </div>
          <div className='form-group'>
            <label>Số điện thoại</label>
            <input name='phone' value={personalInfo.phone} onChange={handleInfoChange} />
          </div>
          <div className='form-group'>
            <label>Địa chỉ</label>
            <input name='address' value={personalInfo.address} onChange={handleInfoChange} />
          </div>
          <button onClick={() => setIsEditingInfo(false)}>Hủy</button>
          <button onClick={savePersonalInfo}>Lưu thay đổi</button>
        </div>
      ) : (
        <div className='personal-info-display'>
          <h3>Thông tin cá nhân</h3>
          <div><i className='fas fa-briefcase'></i> Làm việc tại <strong>{personalInfo.work || 'Chưa cập nhật'}</strong></div>
          <div><i className='fas fa-graduation-cap'></i> Học tại: <strong>{personalInfo.bio || 'Chưa cập nhật'}</strong></div>
          
          <h4>Thông tin liên hệ</h4>
          <div>
            <i className='fas fa-envelope'></i> Email: <strong>{personalInfo.email || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <i className='fas fa-phone'></i> Số điện thoại: <strong>{personalInfo.phone || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <i className='fas fa-map-marker-alt'></i> Địa chỉ: <strong>{personalInfo.address || 'Chưa cập nhật'}</strong>
          </div>
          
          {/* Chỉ hiển thị nút chỉnh sửa nếu đây là profile của chính người dùng */}
          {isOwnProfile && (
            <button onClick={() => setIsEditingInfo(true)}>
              <i className='fas fa-pencil-alt'></i> Chỉnh sửa
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;