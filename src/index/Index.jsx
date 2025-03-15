import React, { useState } from "react";
import "./index.css";
import CommentModal from '../components/comment/Comment';

const Index = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="main-content-index">
        <Feed />
      </div>
      <Contacts />
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h1 className="logo">TheSocialNest</h1>
      <ul className="menu">
        <li className="active">
          <i className="fas fa-home"></i> <span>Trang chủ</span>
        </li>
        <li>
          <i className="fas fa-search"></i> <span>Tìm kiếm</span>
        </li>
        <li>
          <i className="fas fa-compass"></i> <span>Khám phá</span>
        </li>
        <li>
          <i className="fas fa-video"></i> <span>Reels</span>
        </li>
        <li>
          <i className="fas fa-envelope"></i> <span>Tin nhắn</span>
        </li>
        <li>
          <i className="fas fa-heart"></i> <span>Thông báo</span> <span className="notification-dot"></span>
        </li>
        <li>
          <i className="fas fa-plus-square"></i> <span>Tạo</span>
        </li>
        <li>
          <i className="fas fa-user"></i> <span>Trang cá nhân</span>
        </li>
      </ul>
      <div className="more-options">
        <i className="fas fa-bars"></i> <span>Xem thêm</span>
      </div>
    </nav>
  );
};


const Feed = () => {
  // State to track which post has reactions popup open
  const [activeReactionPost, setActiveReactionPost] = useState(null);

  // State to track active reactions for each post
  const [postReactions, setPostReactions] = useState({});

  // State to track which post has comments open
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // Updated post data to match the panda meme
  const posts = [
    {
      id: 1,
      username: "Gió",
      isVerified: true,
      userImg: "https://via.placeholder.com/48",
      postTime: "10 tháng 3 lúc 09:19",
      isPublic: true,
      content: "Nhiều lúc cũng muốn tán gái lắm, nhung chẳng biết nói cái gì gì 😢",
      imageUrl: "https://png.pngtree.com/thumb_back/fh260/background/20240310/pngtree-beautiful-cartoon-landscape-background-with-sunset-green-grass-field-and-trees-image_15639145.jpg",
      likes: 44000,
      comments: 4600,
      shares: 7000,
      reactions: ["like", "haha"]
    },
    {
      id: 2,
      username: "Bóng Đá Trực Tuyến",
      userImg: "https://via.placeholder.com/48",
      postTime: "4 giờ",
      content: "Tất cả tài sản của Lamine Yamal đều đứng tên mẹ anh, lương của anh được trả thẳng vào tài khoản của bà. Điều này khiến bạn gái cũ Alex Padilla khó chịu, có đã chất vấn anh về chuyện này. Tuy nhiên, ngôi sao trẻ vẫn giữ vững lập trường và từ chối thay đổi bất cứ điều gì.",
      imageUrl: "https://media.vov.vn/sites/default/files/styles/large_watermark/public/2024-10/hh1_0.jpg",
      likes: 702,
      comments: 24,
      shares: 6
    },
    {
      id: 3,
      username: "Du Lịch Việt Nam",
      userImg: "https://via.placeholder.com/48",
      postTime: "7 giờ",
      content: "Khám phá vẻ đẹp của Vịnh Hạ Long - Di sản thiên nhiên thế giới tại Việt Nam.",
      imageUrl: "https://via.placeholder.com/600x500",
      likes: 458,
      comments: 32,
      shares: 15
    }
  ];

  // Toggle the reactions popup for a specific post
  const toggleReactions = (postId) => {
    if (activeReactionPost === postId) {
      setActiveReactionPost(null);
    } else {
      setActiveReactionPost(postId);
    }
  };

  // Handle reaction selection
  const handleReaction = (postId, reaction) => {
    setPostReactions({
      ...postReactions,
      [postId]: reaction
    });
    setActiveReactionPost(null); // Close the popup after selection
  };

  // Get the active reaction for a post
  const getActiveReaction = (postId) => {
    return postReactions[postId] || null;
  };

  // Toggle comment section for a specific post
  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };

  // Close the comment section
  const handleCloseComments = () => {
    setActiveCommentPost(null);
  };

  // Reactions data
  const reactions = [
    { name: 'like', icon: 'fas fa-thumbs-up', color: '#1877F2', label: 'Thích' },
    { name: 'love', icon: 'fas fa-heart', color: '#F33E58', label: 'Yêu thích' },
    { name: 'haha', icon: 'fas fa-laugh-squint', color: '#F7B125', label: 'Haha' },
    { name: 'wow', icon: 'fas fa-surprise', color: '#F7B125', label: 'Wow' },
    { name: 'sad', icon: 'fas fa-sad-tear', color: '#F7B125', label: 'Buồn' },
    { name: 'angry', icon: 'fas fa-angry', color: '#E4605A', label: 'Phẫn nộ' }
  ];

  // Get reaction icon and text based on active reaction
  const getReactionDisplay = (postId) => {
    const activeReaction = getActiveReaction(postId);

    if (!activeReaction) {
      return { icon: 'far fa-thumbs-up', text: 'Thích', className: '' };
    }

    const reaction = reactions.find(r => r.name === activeReaction);
    return {
      icon: reaction.icon,
      text: reaction.label,
      className: `active-${reaction.name}`
    };
  };

  return (
    <div className="feed">
      <div className="post-creation-container">
        <div className="post-creation-input">
          <div className="avatar">
            <img src="https://via.placeholder.com/40" alt="User avatar" />
          </div>
          <div className="post-input">
            <input type="text" placeholder="Vũ ơi, bạn đang nghĩ gì thế?" />
          </div>
        </div>
        <div className="post-creation-actions">
          <button className="action-button video-button">
            <i className="fas fa-video"></i> Video trực tiếp
          </button>
          <button className="action-button photo-button">
            <i className="fas fa-image"></i> Ảnh/video
          </button>
          <button className="action-button emotion-button">
            <i className="far fa-smile"></i> Cảm xúc/hoạt động
          </button>
        </div>
      </div>

      <div className="posts-container">
        {posts.map(post => {
          const reactionDisplay = getReactionDisplay(post.id);

          return (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="post-user">
                  <div className="avatar">
                    <img src={post.userImg} alt={post.username} />
                  </div>
                  <div className="user-info">
                    <div className="username-container">
                      <span className="username">{post.username}</span>
                      {post.isVerified && <i className="fas fa-check-circle verified-icon"></i>}
                      <span className="dot-separator">•</span>
                      <span className="follow-text">Theo dõi</span>
                    </div>
                    <div className="post-metadata">
                      <span className="post-time">{post.postTime}</span>
                      {post.isPublic && <span className="visibility-icon"><i className="fas fa-globe-asia"></i></span>}
                    </div>
                  </div>
                </div>
                <div className="post-options">
                  <button className="options-button"><i className="fas fa-ellipsis-h"></i></button>
                  <button className="close-button"><i className="fas fa-times"></i></button>
                </div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
              </div>

              {post.imageUrl && (
                <div className="post-image">
                  <img src={post.imageUrl} alt="Post" />
                </div>
              )}

              <div className="post-stats">
                <div className="reaction-icons">
                  {post.reactions && post.reactions.includes("like") && <span className="reaction like-reaction"><i className="fas fa-thumbs-up"></i></span>}
                  {post.reactions && post.reactions.includes("haha") && <span className="reaction haha-reaction"><i className="far fa-laugh"></i></span>}
                  <span className="likes-count">{post.likes >= 1000 ? `${Math.floor(post.likes / 1000)}K` : post.likes}</span>
                </div>
                <div className="engagement-stats">
                  <span className="comments-count">{post.comments >= 1000 ? `${Math.floor(post.comments / 100) / 10}K` : post.comments} bình luận</span>
                  <span className="shares-count">{post.shares >= 1000 ? `${Math.floor(post.shares / 1000)}K` : post.shares} lượt chia sẻ</span>
                </div>
              </div>

              <div className="post-actions">
                <div className="action-wrapper">
                  <button
                    className={`action-btn like-btn ${reactionDisplay.className}`}
                    onClick={() => toggleReactions(post.id)}
                    onMouseEnter={() => toggleReactions(post.id)}
                  >
                    <i className={reactionDisplay.icon}></i>
                    <span>{reactionDisplay.text}</span>
                  </button>

                  {/* Reactions popup */}
                  {activeReactionPost === post.id && (
                    <div
                      className="reactions-popup"
                      onMouseLeave={() => setActiveReactionPost(null)}
                    >
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.name}
                          className="reaction-btn"
                          title={reaction.label}
                          onClick={() => handleReaction(post.id, reaction.name)}
                        >
                          <div
                            className="reaction-icon"
                            style={{ backgroundColor: reaction.color }}
                          >
                            <i className={reaction.icon}></i>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="action-btn comment-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  <i className="far fa-comment"></i>
                  <span>Bình luận</span>
                </button>
                <button className="action-btn share-btn">
                  <i className="far fa-share-square"></i>
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Conditionally render Comment component when activeCommentPost matches post.id */}
              {activeCommentPost === post.id && (
                <CommentModal
                  postId={post.id}
                  postData={posts.find(p => p.id === post.id)}
                  onClose={handleCloseComments}
                />
              )}

              {/* Keep the existing comment input for quick comments */}

            </div>
          );
        })}
      </div>
    </div>
  );
};



// Contacts Component
const Contacts = () => {
  const contacts = [
    { id: 1, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/FF5733", online: true },
    { id: 2, name: "Nguyễn Vinh", avatar: "https://via.placeholder.com/32/33FF57", online: true },
    { id: 3, name: "Ngọc Hân", avatar: "https://via.placeholder.com/32/5733FF", online: true },
    { id: 4, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/FF3357", online: true },
    { id: 5, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/33FFDB", online: true },
    { id: 6, name: "Tài Nguyễn", avatar: "https://via.placeholder.com/32/DB33FF", online: true },
    { id: 7, name: "Nguyễn Văn Toàn", avatar: "https://via.placeholder.com/32/DBFF33", online: true },
    { id: 8, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/33DBFF", online: true },
    { id: 9, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/FF33DB", online: true },
    { id: 10, name: "An Khan", avatar: "https://via.placeholder.com/32/57FF33", online: true },
    { id: 11, name: "Hồng Nhung", avatar: "https://via.placeholder.com/32/3357FF", online: true },
    { id: 12, name: "Tuan Vu", avatar: "https://via.placeholder.com/32/FF5733", online: true }
  ];

  return (
    <div className="contacts-sidebar">
      <div className="contacts-header">
        <h3>Người liên hệ</h3>
        <div className="contacts-actions">
          <button><i className="fas fa-search"></i></button>
          <button><i className="fas fa-ellipsis-h"></i></button>
        </div>
      </div>
      <div className="contacts-list">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-item">
            <div className="contact-avatar">
              <img src={contact.avatar} alt={contact.name} />
              {contact.online && <span className="online-status"></span>}
            </div>
            <span className="contact-name">{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;