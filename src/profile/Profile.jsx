import { useEffect, useState } from "react";
import "./personal.css";
import Post from "../components/Post";
import { getPostByAuthorId } from "../api/postAPI";


const Profile= () => {
  // State for active tab in profile
  const user = JSON.parse(localStorage.getItem("user"))
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([])
  const fetchPost = async () => {
    const res = await getPostByAuthorId({authorId: user._id, userId: user._id}) 
    setPosts(res)

  }
  useEffect(() => {
    fetchPost()
  },[])
  
  // Mock data based on the Facebook profile image
  const profileData = {
    name: "Tuấn Vũ",
    friends: "500 người bạn",
    coverPhoto: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg", // Replace with actual path
    profilePhoto: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg", // Replace with actual path
    location: "Sống tại Chợ Lách",
    education: "Đại học Bến Tre",
  };
  
  // Mock friend data
  const friends = [
    { id: 1, name: "Tuấn An", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" },
    { id: 2, name: "Tuan Vu", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" },
    { id: 3, name: "Tuan Vu", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" }
  ];
  
  return (
    <div className="profile-page">
      {/* Cover photo area */}
      <div className="cover-photo-container">
        <div className="cover-photo">
          {/* Cover photo image will be background of this div */}
          <button className="edit-cover-photo-btn">
            <i className="fas fa-camera"></i> Thêm ảnh bìa
          </button>
        </div>
      </div>
      
      {/* Profile info section */}
      <div className="profile-info-container">
        <div className="profile-photo-container">
          <div className="profile-photo">
            {/* Profile photo will be inserted here */}
            <div className="edit-profile-photo">
              <i className="fas fa-camera"></i>
            </div>
          </div>
        </div>
        
        <div className="profile-details">
          <h1 className="profile-name">{profileData.name}</h1>
          <p className="friends-count">{profileData.friends}</p>
          
          {/* Friend thumbnails */}
          <div className="friend-thumbnails">
            {friends.map(friend => (
              <img key={friend.id} src={friend.photo} alt={friend.name} className="friend-thumbnail" />
            ))}
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="add-story-btn">
            <i className="fas fa-plus"></i> Thêm vào tin
          </button>
          <button className="edit-profile-btn">
            <i className="fas fa-pencil-alt"></i> Chỉnh sửa trang cá nhân
          </button>
        </div>
      </div>
      
      {/* Profile navigation */}
      <div className="profile-navigation">
        <ul className="profile-nav-tabs">
          <li className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
            Bài viết
          </li>
          <li className={activeTab === "about" ? "active" : ""} onClick={() => setActiveTab("about")}>
            Giới thiệu
          </li>
          <li className={activeTab === "friends" ? "active" : ""} onClick={() => setActiveTab("friends")}>
            Bạn bè
          </li>
          <li className={activeTab === "photos" ? "active" : ""} onClick={() => setActiveTab("photos")}>
            Ảnh
          </li>
          <li className={activeTab === "videos" ? "active" : ""} onClick={() => setActiveTab("videos")}>
            Video
          </li>
          <li className={activeTab === "checkin" ? "active" : ""} onClick={() => setActiveTab("checkin")}>
            Check-in
          </li>
          <li className="more-dropdown">
            Xem thêm <i className="fas fa-caret-down"></i>
          </li>
        </ul>
      </div>
      
      {/* Main content area with two columns */}
      <div className="profile-content">
        {/* Left column */}
        <div className="profile-left-column">
          {/* Intro box */}
          <div className="profile-box intro-box">
            <h3>Giới thiệu</h3>
            <div className="intro-item">
              <i className="fas fa-home"></i> {profileData.location}
            </div>
            <div className="intro-item">
              <i className="fas fa-graduation-cap"></i> {profileData.education}
            </div>
            <button className="edit-details-btn">Chỉnh sửa chi tiết</button>
            <button className="add-hobbies-btn">Thêm nơi đang sống cho ý</button>
          </div>
          
          {/* Photos box */}
          <div className="profile-box photos-box">
            <div className="box-header">
              <h3>Ảnh</h3>
              <a href="#" className="view-all">Xem tất cả ảnh</a>
            </div>
            <div className="photos-grid">
              {/* Photo grid would go here */}
            </div>
          </div>
          
          {/* Friends box */}
          <div className="profile-box friends-box">
            <div className="box-header">
              <h3>Bạn bè</h3>
              <a href="#" className="view-all">Xem tất cả bạn bè</a>
            </div>
            <p>{profileData.friends}</p>
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <img src={friend.photo} alt={friend.name} />
                  <p>{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column */}
        <div className="profile-right-column">
          {/* Create post box */}
          <div className="profile-box create-post-box">
            <div className="post-input">
              <img src={profileData.profilePhoto} alt="Profile" className="mini-profile" />
              <input type="text" placeholder="Bạn đang nghĩ gì?" />
            </div>
            <div className="post-actions">
              <button className="post-btn video">
                <i className="fas fa-video"></i> Video trực tiếp
              </button>
              <button className="post-btn photo">
                <i className="fas fa-image"></i> Ảnh/Video
              </button>
              <button className="post-btn event">
                <i className="fas fa-calendar-check"></i> Sự kiện trong đời
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="post-filters">
            <button className={activeTab === "feature" ? "active" : ""} onClick={() => setActiveTab("feature")}>
              <i className="fas fa-sliders-h"></i> Chế độ xem dạng danh sách
            </button>
            <button className={activeTab === "grid" ? "active" : ""} onClick={() => setActiveTab("grid")}>
              <i className="fas fa-th"></i> Chế độ xem lưới
            </button>
          </div>
          
          {/* Empty state */}
          <div className="no-posts-message">
            <h3>Không có bài viết</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;