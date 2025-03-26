import { useState, useRef } from "react";
import axios from "axios";

const FeedHeader = ({setIsChange}) => {
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const fileInputRef = useRef(null);
  
  // Safely get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) 

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

  // Sửa đổi hàm createPost - Gửi formData trực tiếp không qua object data
  const createPost = async (formData) => {
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
  };

  const newPost = async () => {
    if (!postContent.trim() && postImages.length === 0) return;
    
    try {
      // Tạo FormData với đúng tham số mà server yêu cầu
      const formData = new FormData();
      formData.append('content', postContent);
      
      // Lấy authorId từ thông tin user (giả sử có lưu trong localStorage)
      const userId = user._id || JSON.parse(localStorage.getItem('user'))?._id;
      formData.append('authorId', userId);
      
      // Thêm hình ảnh vào FormData
      postImages.forEach((image, index) => {
        formData.append(`files`, image.file);
      });
      
      // Gửi đến backend
      await createPost(formData);
      setIsChange(true);
      closePostForm();
    } catch (error) {
      console.error("Error creating post:", error);
      // Xử lý lỗi - có thể hiển thị thông báo cho người dùng
    }
  };

  // Format time in Vietnamese style
  const formatTime = (date) => {
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

  // JSX không thay đổi...
  return (
    <>
      <div className="post-creation-container">
        {!showPostForm ? (
          <div className="post-creation-input" onClick={openPostForm}>
            <div className="avatar">
              <img src={user.picture?.url} alt="User avatar" />
            </div>
            <div className="post-input">
              <input 
                type="text" 
                placeholder={`${user.name} ơi, bạn đang nghĩ gì thế?`}
                readOnly
              />
            </div>
          </div>
        ) : (
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
                  <img src={user.picture?.url} alt="User avatar" />
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="privacy-setting">
                    <i className="fas fa-globe-asia"></i> Công khai <i className="fas fa-caret-down"></i>
                  </div>
                </div>
              </div>
              
              <div className="post-input-container">
                <textarea
                  placeholder={`${user.name} ơi, bạn đang nghĩ gì thế?`}
                  value={postContent}
                  onChange={handleContentChange}
                  rows={4}
                  autoFocus
                  className="post-textarea"
                />
                <button className="emoji-button">
                  <i className="far fa-smile"></i>
                </button>
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
                  onClick={newPost}
                  disabled={!postContent.trim() && postImages.length === 0}
                >
                  Đăng
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      
    </>
  );
};

export default FeedHeader;