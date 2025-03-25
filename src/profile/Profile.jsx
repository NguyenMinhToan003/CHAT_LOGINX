import { useEffect, useState, useRef } from "react";
import "./personal.css";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import FeedHeader from "../components/FeedHeader";

import  Feed  from "../components/Feeds";






// Create axiosInstance 
const axiosInstance = axios.create({
  baseURL: "http://localhost:8123", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json"
  }
});

// API functions
const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/get-user-by-id?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const getPostByAuthorId = async ({ authorId, userId }) => {
  try {
    const response = await axiosInstance.get(`/post/get-post-by-author-id?authorId=${authorId}`);
    return response.data; // This should return the array of posts
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array on error
  }
};

const createPost = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_HOST}/api/post/create`, 
      formData, 
      {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

const Profile = () => {
  const { id } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user"));
  
  // Initialize with localUser data to have picture immediately available
  const [user, setUser] = useState(localUser || {});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Post creation states
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("hello");
  const [postImages, setPostImages] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const fileInputRef = useRef(null);
  
  // Initialize personal info with default values
  const [personalInfo, setPersonalInfo] = useState({
    workplace: "Công ty ABC",
    education: "Đại học Bến Tre",
    hometown: "Chợ Lách, Bến Tre",
    currentCity: "TP Hồ Chí Minh",
    relationship: "Độc thân",
    phone: "0123456789",
    email: "email@example.com",
    website: "www.mywebsite.com",
    birthdate: "01/01/1990",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Determine which user ID to use
        const userId = id || localUser?._id;
        
        if (!userId) {
          console.error("No user ID available");
          setIsLoading(false);
          return;
        }
        
        // Fetch user data
        const userData = await getUserById(userId);
        
        if (userData) {
          // Merge with any existing user data to preserve picture
          setUser(prevUser => ({ ...prevUser, ...userData }));
          
          // Update personal info with user data if available
          setPersonalInfo(prevInfo => ({
            ...prevInfo,
            currentCity: userData.currentCity || prevInfo.currentCity,
            education: userData.education || prevInfo.education,
            email: userData.email || prevInfo.email,
            // Add other fields from userData as needed
          }));
          
          // Fetch posts by this user
          const postsData = await getPostByAuthorId({
            authorId: userId,
            userId: userId
          });
          
          // Make sure postsData is an array before setting it
          if (Array.isArray(postsData)) {
            setPosts(postsData);
          } else {
            console.error("Posts data is not an array:", postsData);
            setPosts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, localUser]);
  
  // Mock data based on the Facebook profile UI
  const profileData = {
    friends: "500 người bạn",
    coverPhoto: "https://png.pngtree.com/thumb_back/fh260/background/20240310/pngtree-beautiful-cartoon-landscape-background-with-sunset-green-grass-field-and-trees-image_15639145.jpg",
    // Default profile picture as fallback
    profilePhoto: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg",
  };
  
  // Mock friend data
  const friends = [
    { id: 1, name: "Tuấn An", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" },
    { id: 2, name: "Tuan Vu", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" },
    { id: 3, name: "Tuan Vu", photo: "https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg" }
  ];
  
  // Handler for personal info form changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };
  
  // Handler to save personal info
  const savePersonalInfo = async () => {
    setIsEditingInfo(false);
    
    try {
      // This is where you'd connect to your backend API
      // Example: await updateUserProfile(id || localUser._id, personalInfo);
      
      // Update the user state to reflect changes
      setUser(prevUser => ({
        ...prevUser,
        currentCity: personalInfo.currentCity,
        education: personalInfo.education,
        // Add other fields as needed
      }));
      
      // You might want to show a success message here
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      // You might want to show an error message here
    }
  };



  //cập nhât thông tin cá nhân
  

  // Post creation handlers
  const openPostForm = () => setShowPostForm(true);
  
  const closePostForm = () => {
    setShowPostForm(false);
    setPostContent("");
    setPostImages([]);
  };

  const handleContentChange = (e) => setPostContent(e.target.value);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPostImages([...postImages, ...newImages]);
  };
  
  const removeImage = (index) => {
    const updatedImages = [...postImages];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setPostImages(updatedImages);
  };

  const handleNewPost = async () => {
    if (!postContent.trim() && postImages.length === 0) return;
    
    try {
      setIsLoading(true);
      
      // Create FormData with the required parameters
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', postContent);
      
      // Get authorId from user info
      const userId = user._id || localUser?._id;
      formData.append('authorId', userId);
      
      // Add images to FormData
      postImages.forEach((image) => {
        formData.append(`files`, image.file);
      });
      
      // Send to backend
      const newPostData = await createPost(formData);
      
      // Update posts list with the new post
      if (newPostData) {
        setPosts(prevPosts => [newPostData, ...prevPosts]);
      }
      
      closePostForm();
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error - could show message to user
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for post
  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const postDate = new Date(date);
    const diffMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

  // Function to render personal info content based on active tab
  const renderPersonalInfoContent = () => {
    if (activeTab !== "about") return null;
    
    return (
      <div className="personal-info-section">
        {isEditingInfo ? (
          <div className="personal-info-edit-form">
            <h3>Chỉnh sửa thông tin cá nhân</h3>
            
            <div className="info-edit-section">
              <h4>Công việc và học vấn</h4>
              <div className="form-group">
                <label>Nơi làm việc</label>
                <input 
                  type="text" 
                  name="workplace" 
                  value={personalInfo.workplace} 
                  onChange={handleInfoChange} 
                />
              </div>
              <div className="form-group">
                <label>Học vấn</label>
                <input 
                  type="text" 
                  name="education" 
                  value={personalInfo.education} 
                  onChange={handleInfoChange} 
                />
              </div>
            </div>
            
            <div className="info-edit-section">
              <h4>Địa điểm</h4>
              <div className="form-group">
                <label>Quê quán</label>
                <input 
                  type="text" 
                  name="hometown" 
                  value={personalInfo.hometown} 
                  onChange={handleInfoChange} 
                />
              </div>
              <div className="form-group">
                <label>Nơi ở hiện tại</label>
                <input 
                  type="text" 
                  name="currentCity" 
                  value={personalInfo.currentCity} 
                  onChange={handleInfoChange} 
                />
              </div>
            </div>
            
            <div className="info-edit-section">
              <h4>Thông tin liên hệ</h4>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={personalInfo.phone} 
                  onChange={handleInfoChange} 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={personalInfo.email} 
                  onChange={handleInfoChange} 
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="text" 
                  name="website" 
                  value={personalInfo.website} 
                  onChange={handleInfoChange} 
                />
              </div>
            </div>
            
            <div className="info-edit-section">
              <h4>Thông tin cơ bản</h4>
              <div className="form-group">
                <label>Mối quan hệ</label>
                <select 
                  name="relationship" 
                  value={personalInfo.relationship}
                  onChange={handleInfoChange}
                >
                  <option value="Độc thân">Độc thân</option>
                  <option value="Hẹn hò">Hẹn hò</option>
                  <option value="Đã kết hôn">Đã kết hôn</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input 
                  type="text" 
                  name="birthdate" 
                  value={personalInfo.birthdate} 
                  onChange={handleInfoChange} 
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setIsEditingInfo(false)}>Hủy</button>
              <button className="save-btn" onClick={savePersonalInfo}>Lưu thay đổi</button>
            </div>
          </div>
        ) : (
          <div className="personal-info-display">
            <div className="info-section">
              <div className="section-header">
                <h3>Công việc và học vấn</h3>
                <button className="edit-section-btn" onClick={() => setIsEditingInfo(true)}>
                  <i className="fas fa-pencil-alt"></i> Chỉnh sửa
                </button>
              </div>
              <div className="info-item">
                <i className="fas fa-briefcase"></i>
                <span>Làm việc tại <strong>{personalInfo.workplace}</strong></span>
              </div>
              <div className="info-item">
                <i className="fas fa-graduation-cap"></i>
                <span>Học tại <strong>{personalInfo.education}</strong></span>
              </div>
            </div>
            
            <div className="info-section">
              <div className="section-header">
                <h3>Địa điểm</h3>
                <button className="edit-section-btn" onClick={() => setIsEditingInfo(true)}>
                  <i className="fas fa-pencil-alt"></i> Chỉnh sửa
                </button>
              </div>
              <div className="info-item">
                <i className="fas fa-home"></i>
                <span>Sống tại <strong>{personalInfo.currentCity}</strong></span>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Đến từ <strong>{personalInfo.hometown}</strong></span>
              </div>
            </div>
            
            <div className="info-section">
              <div className="section-header">
                <h3>Thông tin liên hệ</h3>
                <button className="edit-section-btn" onClick={() => setIsEditingInfo(true)}>
                  <i className="fas fa-pencil-alt"></i> Chỉnh sửa
                </button>
              </div>
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>{personalInfo.email}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-globe"></i>
                <span>{personalInfo.website}</span>
              </div>
            </div>
            
            <div className="info-section">
              <div className="section-header">
                <h3>Thông tin cơ bản</h3>
                <button className="edit-section-btn" onClick={() => setIsEditingInfo(true)}>
                  <i className="fas fa-pencil-alt"></i> Chỉnh sửa
                </button>
              </div>
              <div className="info-item">
                <i className="fas fa-heart"></i>
                <span>{personalInfo.relationship}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>Sinh ngày {personalInfo.birthdate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Get profile picture with fallback
  const getProfilePicture = () => {
    // First try user.picture, then fall back to the default profile photo
    return user?.picture?.url || profileData.profilePhoto;
  };
  
  // Post component for rendering individual posts
  const PostComponent = ({ post }) => {
    if (!post) return null;
    
    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleDateString("vi-VN");
    };
    
    return (
      <div className="post-card">
        <div className="post-header">
          <img 
            src={post.author?.picture || profileData.profilePhoto} 
            alt={post.author?.name || "User"} 
            className="post-avatar" 
          />
          <div className="post-info">
            <h4 className="post-author">{post.author?.name || "Unknown User"}</h4>
            <p className="post-date">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        <div className="post-content">
          {post.title && <h3 className="post-title">{post.title}</h3>}
          <p className="post-text">{post.content}</p>
        </div>
        
        {post.assets && post.assets.length > 0 && (
          <div className="post-images">
            {post.assets.map((asset, index) => (
              <img 
                key={index} 
                src={asset.url} 
                alt={`Post attachment ${index + 1}`} 
                className="post-image"
              />
            ))}
          </div>
        )}
        
        <div className="post-actions">
          <button className="post-action-btn">
            <i className="far fa-thumbs-up"></i> Thích
          </button>
          <button className="post-action-btn">
            <i className="far fa-comment"></i> Bình luận
          </button>
          <button className="post-action-btn">
            <i className="far fa-share-square"></i> Chia sẻ
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="profile-page profile-fix">
      {/* Cover photo area */}
      <div className="cover-photo-container">
        <div className="cover-photo">
          <img 
            src={profileData.coverPhoto} 
            alt="Cover" 
            style={{objectFit:'fill', width:'100%', height:'100%'}}
          />
          <button className="edit-cover-photo-btn">
            <i className="fas fa-camera"></i> Thêm ảnh bìa
          </button>
        </div>
      </div>
      
      {/* Profile info section */}
      <div className="profile-info-container">
        <div className="profile-photo-container">
          <div className="profile-photo">
            <img 
              src={getProfilePicture()} 
              alt="Profile" 
              style={{width:'100%', height:'100%'}}
            />
            <div className="edit-profile-photo">
              <i className="fas fa-camera"></i>
            </div>
          </div>
        </div>
        
        <div className="profile-details">
          <h1 className="profile-name">{user?.name || "Loading..."}</h1>
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
              <i className="fas fa-home"></i> Sống tại <strong>{personalInfo.currentCity}</strong>
            </div>
            <div className="intro-item">
              <i className="fas fa-graduation-cap"></i> Học tại <strong>{personalInfo.education}</strong>
            </div>
            <button className="edit-details-btn" onClick={() => {
              setActiveTab("about");
              setIsEditingInfo(true);
            }}>Chỉnh sửa chi tiết</button>
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
          {/* Personal info content when About tab is active */}
          {renderPersonalInfoContent()}
          
      
            
       

          
          {/* Post creation modal */}
          {showPostForm && (
            <>
              <div className="modal-overlay" onClick={closePostForm}></div>
              <div className="post-creation-form">
                <div className="form-header">
                  <h3>Tạo bài viết</h3>
                  <button className="close-button" onClick={closePostForm}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="user-section">
                  <div className="avatar">
                    <img src={getProfilePicture()} alt="Profile avatar" />
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name || "User"}</div>
                    <div className="privacy-setting">
                      <i className="fas fa-globe-asia"></i> Công khai <i className="fas fa-caret-down"></i>
                    </div>
                  </div>
                </div>
                
                
                
                {postImages.length > 0 && (
                  <div className="image-preview-container">
                    {postImages.map((image, index) => (
                      <div className="image-preview" key={index}>
                        <img src={image.preview} alt="Preview" />
                        <button 
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="post-attachments">
                  <div className="attachment-label">Thêm vào bài viết của bạn</div>
                  <div className="attachment-buttons">
                    <button className="attachment-btn photo-btn" onClick={() => fileInputRef.current.click()}>
                      <i className="fas fa-image" style={{ color: "#45BD62" }}></i>
                    </button>
                    <button className="attachment-btn tag-btn">
                      <i className="fas fa-user-tag" style={{ color: "#1877F2" }}></i>
                    </button>
                    <button className="attachment-btn emoji-btn">
                      <i className="far fa-laugh" style={{ color: "#F7B928" }}></i>
                    </button>
                    <button className="attachment-btn location-btn">
                      <i className="fas fa-map-marker-alt" style={{ color: "#F5533D" }}></i>
                    </button>
                    <button className="attachment-btn gif-btn">
                      <span style={{ color: "#F44080", fontWeight: "bold" }}>GIF</span>
                    </button>
                    <button className="attachment-btn more-btn">
                      <i className="fas fa-ellipsis-h" style={{ color: "#606770" }}></i>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
                
                <div className="post-submit-container">
                  <button 
                    className="post-submit-button"
                    onClick={handleNewPost}
                    disabled={!postContent.trim() && postImages.length === 0}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Filters - Only show when Posts tab is active */}
         

          
          
          {/* Posts container - Only show when Posts tab is active */}
          {activeTab === "posts" && (
            <div className="posts-container">

                      <Feed/>
              {isLoading ? (
                <div className="loading-indicator">
                 
                
                 
                 
                </div>
              ) : posts.length > 0 ? (

                
                // Using our custom PostComponent instead of the imported Post component
                
                posts.map(post => <PostComponent key={post._id} post={post} />)
              ) : (
                <div className="no-posts-message">


                   
                  Không có bài viết nào để hiển thị.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;