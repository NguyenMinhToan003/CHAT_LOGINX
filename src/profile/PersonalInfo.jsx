import  { useState } from 'react';

const PersonalInfo = ({ user, setUser }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    workplace: 'Công ty ABC',
    education: user.education || 'Đại học Bến Tre',
    hometown: 'Chợ Lách, Bến Tre',
    currentCity: user.currentCity || 'TP Hồ Chí Minh',
    relationship: 'Độc thân',
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
    website: 'www.mywebsite.com',
    birthdate: '01/01/1990',
  });

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = () => {
    setIsEditingInfo(false);
    setUser(prev => ({
      ...prev,
      currentCity: personalInfo.currentCity,
      education: personalInfo.education,
      email: personalInfo.email,
      phone: personalInfo.phone,
      address: personalInfo.address,
    }));
  };

  return (
    <div className='personal-info-section' id='header'>
      {isEditingInfo ? (
        <div className='personal-info-edit-form'>
          <h3>Chỉnh sửa thông tin cá nhân</h3>
          <div className='form-group'>
            <label>Nơi làm việc</label>
            <input name='workplace' value={personalInfo.workplace} onChange={handleInfoChange} />
          </div>
          <div className='form-group'>
            <label>Học vấn</label>
            <input name='education' value={personalInfo.education} onChange={handleInfoChange} />
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
          <div><i className='fas fa-briefcase'></i> Làm việc tại <strong>{personalInfo.workplace}</strong></div>
          <div><i className='fas fa-graduation-cap'></i> Học tại <strong>{personalInfo.education}</strong></div>
          
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
          
          <button onClick={() => setIsEditingInfo(true)}>
            <i className='fas fa-pencil-alt'></i> Chỉnh sửa
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;