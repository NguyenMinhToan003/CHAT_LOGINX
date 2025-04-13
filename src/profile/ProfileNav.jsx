import React from 'react';
import Feed from '~/components/Feeds';
const ProfileNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className='profile-navigation'>
      <ul className='profile-nav-tabs'>
        <li className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
          Bài viết
        </li>
        <li className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>
          Giới thiệu
        </li>
        <li className={activeTab === 'friends' ? 'active' : ''} onClick={() => setActiveTab('friends')}>
          Bạn bè
        </li>
        <li className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>
          Ảnh
        </li>
        <li className={activeTab === 'videos' ? 'active' : ''} onClick={() => setActiveTab('videos')}>
          Video
        </li>
        <li className={activeTab === 'checkin' ? 'active' : ''} onClick={() => setActiveTab('checkin')}>
          Check-in
        </li>
        <li className='more-dropdown'>
          Xem thêm <i className='fas fa-caret-down'></i>
        </li>
      </ul>
    </div>
  );
};

export default ProfileNav;