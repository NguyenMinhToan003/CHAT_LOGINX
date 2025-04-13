import React from 'react';
import Feed from '~/components/Feeds';

const ProfileLeftColumn = ({ user, setActiveTab,isOwnProfile  }) => {
  const personalInfo = {
    work: user.work || 'Chưa có',
    bio: user.bio || 'Chưa có',
    phone:user.phone ||'',
    email:user.email || '',
    address:user.address || '',
    
    

  };

  const friends = [
    { id: 1, name: 'Tuấn An', photo: 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg' },
    { id: 2, name: 'Tuan Vu', photo: 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg' },
    { id: 3, name: 'Tuan Vu', photo: 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg' },
  ];

  return (
    <div className='profile-left-column'>
      <div className='profile-box intro-box'>
        <h3>Giới thiệu</h3>
        <div className='intro-item'>
          <i className='fas fa-home'></i> Sống tại <strong>{personalInfo.work}</strong>
        </div>
        <div className='intro-item'>
          <i className='fas fa-graduation-cap'></i> Học tại <strong>{personalInfo.bio}</strong>
        </div>
        <button 
          className='edit-details-btn' 
          onClick={() => {
            setActiveTab('about');
          }}
        >
          {isOwnProfile ? 'Chỉnh sửa chi tiết' : 'Xem thông tin chi tiết'}
        </button>
      </div>
      
      {/* Phần code còn lại... */}
    </div>
  );
};

export default ProfileLeftColumn;