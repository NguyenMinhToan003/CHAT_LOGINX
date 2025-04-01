import React from 'react';
import Feed from '../components/Feeds';
const ProfileLeftColumn = ({ user, setActiveTab }) => {
  const personalInfo = {
    currentCity: user.currentCity || 'TP Hồ Chí Minh',
    education: user.education || 'Đại học Bến Tre',
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
          <i className='fas fa-home'></i> Sống tại <strong>{personalInfo.currentCity}</strong>
        </div>
        <div className='intro-item'>
          <i className='fas fa-graduation-cap'></i> Học tại <strong>{personalInfo.education}</strong>
        </div>
        <button 
          className='edit-details-btn' 
          onClick={() => {
            setActiveTab('about');
          }}
        >
          Chỉnh sửa chi tiết
        </button>
      </div>
      <div className='profile-box photos-box'>
        <div className='box-header'>
          <h3>Ảnh</h3>
          <a href='#' className='view-all'>Xem tất cả ảnh</a>
        </div>
        <div className='photos-grid'></div>
      </div>
      <div className='profile-box friends-box'>
        <div className='box-header'>
          <h3>Bạn bè</h3>
          <a href='#' className='view-all'>Xem tất cả bạn bè</a>
        </div>
        <p>500 người bạn</p>
        <div className='friends-grid'>
          {friends.map(friend => (
            <div key={friend.id} className='friend-card'>
              <img src={friend.photo} alt={friend.name} />
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftColumn;