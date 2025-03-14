// Index.jsx
import React from "react";
import "./index.css";

const Index = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <main className="main-content">
        <div className="feed-container">
          <PostFeed />
          <SuggestionsPanel />
        </div>
      </main>
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
          <i className="fas fa-home"></i> Trang chủ
        </li>
        <li>
          <i className="fas fa-search"></i> Tìm kiếm
        </li>
        <li>
          <i className="fas fa-compass"></i> Khám phá
        </li>
        <li>
          <i className="fas fa-video"></i> Reels
        </li>
        <li>
          <i className="fas fa-envelope"></i> Tin nhắn
        </li>
        <li>
          <i className="fas fa-heart"></i> Thông báo <span className="notification-dot"></span>
        </li>
        <li>
          <i className="fas fa-plus-square"></i> Tạo
        </li>
        <li>
          <i className="fas fa-user"></i> Trang cá nhân
        </li>
      </ul>
      <div className="more-options">
        <i className="fas fa-bars"></i> Xem thêm
      </div>
    </nav>
  );
};

// Post Feed Component
const PostFeed = () => {
  return (
    <div className="post-feed">
      <article className="post">
        <PostHeader
          username="cristiano"
          isVerified={true}
          timePosted="1 tuần"
          avatarUrl="https://via.placeholder.com/150"
        />
        <PostContent
          imageUrl="https://cellphones.com.vn/sforum/wp-content/uploads/2023/06/hinh-nen-bong-da-12.jpg"
          altText="Football training"
        />
        <PostActions />
        <PostDetails
          likes="4.225.974"
          username="cristiano"
          isVerified={true}
          caption="Working hard"
          commentsCount="26.066"
        />
      </article>
    </div>
  );
};

// Post Header Component
const PostHeader = ({ username, isVerified, timePosted, avatarUrl }) => {
  return (
    <div className="post-header">
      <div className="user-info">
        <div className="user-avatar">
          <img src={avatarUrl} alt={username} />
        </div>
        <div className="user-details">
          <div className="username-container">
            <span className="username">{username}</span>
            {isVerified && (
              <span className="verified-badge">
                <i className="fas fa-check-circle"></i>
              </span>
            )}
          </div>
          <span className="post-time">{timePosted}</span>
        </div>
      </div>
      <button className="more-options-button">
        <i className="fas fa-ellipsis-h"></i>
      </button>
    </div>
  );
};

// Post Content Component
const PostContent = ({ imageUrl, altText }) => {
  return (
    <div className="post-image-container">
      <img src={imageUrl} alt={altText} className="post-image" />
      <div className="carousel-controls">
        <button className="carousel-control carousel-prev">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-control carousel-next">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className="carousel-indicator">
        <div className="indicator-dot active"></div>
        <div className="indicator-dot"></div>
        <div className="indicator-dot"></div>
        <div className="indicator-dot"></div>
        <div className="indicator-dot"></div>
      </div>
    </div>
  );
};




// Post Details Component
const PostDetails = ({ likes, username, isVerified, caption, commentsCount }) => {
  return (
    <div className="post-details">
      <div className="likes">{likes} lượt thích</div>
      <div className="caption">
        <span className="caption-username">{username}</span>
        {isVerified && (
          <span className="verified-badge-small">
            <i className="fas fa-check-circle"></i>
          </span>
        )}
        <span className="caption-text">{caption}</span>
        <span className="emoji">
          <i className="fas fa-user-ninja"></i>
        </span>
      </div>
      <div className="view-translation">Xem bản dịch</div>
      <div className="view-comments">Xem tất cả {commentsCount} bình luận</div>
      <div className="add-comment">
        <input type="text" className="comment-input" placeholder="Bình luận..." />
        <button className="emoji-button">
          <i className="far fa-smile"></i>
        </button>
      </div>
    </div>
  );
};

// Suggestions Panel Component
const SuggestionsPanel = () => {
  return (
    <aside className="suggestions-panel">
      <CurrentUser
        username="vutuan2318"
        fullName="Tuấn Vũ"
        avatarUrl="https://via.placeholder.com/150"
      />
      <SuggestionsContainer />

    </aside>
  );
};

// Current User Component
const CurrentUser = ({ username, fullName, avatarUrl }) => {
  return (
    <div className="current-user-container">
      <div className="user-info">
        <div className="user-avatar">
          <img src={avatarUrl} alt={username} />
        </div>
        <div className="user-details">
          <div className="username-container">
            <span className="username">{username}</span>
          </div>
          <span className="user-fullname">{fullName}</span>
        </div>
      </div>
      <button className="switch-button">Chuyển</button>
    </div>
  );
};

// Suggestions Container Component
const SuggestionsContainer = () => {
  const suggestionUsers = [
    { username: "tuanvu", reason: "Gợi ý cho bạn", isVerified: false },
    { username: "toanlol", reason: "Có cristiano theo dõi", isVerified: true },
    { username: "sieunhan", reason: "Gợi ý cho bạn", isVerified: false },
    { username: "thnguin", reason: "Gợi ý cho bạn", isVerified: false },
    { username: "lethinganhue2101", reason: "Gợi ý cho bạn", isVerified: false },
  ];

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <span className="suggestions-title">Gợi ý cho bạn</span>
        <button className="see-all-button">Xem tất cả</button>
      </div>
      <div className="suggestion-list">
        {suggestionUsers.map((user, index) => (
          <SuggestionItem
            key={index}
            username={user.username}
            reason={user.reason}
            isVerified={user.isVerified}
          />
        ))}
      </div>
    </div>
  );
};

// Suggestion Item Component
const SuggestionItem = ({ username, reason, isVerified }) => {
  return (
    <div className="suggestion-item">
      <div className="user-info">
        <div className="user-avatar small">
          <img src="https://via.placeholder.com/150" alt={username} />
        </div>
        <div className="user-details">
          <div className="username-container">
            <span className="username">{username}</span>
            {isVerified && (
              <span className="verified-badge">
                <i className="fas fa-check-circle"></i>
              </span>
            )}
          </div>
          <span className="suggestion-reason">{reason}</span>
        </div>
      </div>
      <button className="follow-button">Theo dõi</button>
    </div>
  );
};





const Comments = ({ postId, onClose }) => {
  const [comments, setComments] = React.useState([
    {
      id: 1,
      username: "nordic_scott",
      isVerified: true,
      content: "This idea man 🙌 🤩 Look great!",
      timePosted: "21 giờ",
      likes: 9,
      replies: [
        {
          id: 101,
          username: "jordi.koalitic",
          isVerified: true,
          content: "Cảm ơn bạn rất nhiều! 🙏",
          timePosted: '',
          likes: ''
        }
      ],
      showReplies: false,
      loadingReplies: false
    },
    {
      id: 2,
      username: "martigf7",
      isVerified: false,
      content: "❤️ ❤️ ❤️ ❤️",
      timePosted: "21 giờ",
      likes: 1,
      replies: [
        {
          id: 201,
          username: "jordi.koalitic",
          isVerified: true,
          content: "❤️❤️",
          timePosted: "20 giờ",
          likes: 0
        }
      ],
      showReplies: false,
      loadingReplies: false
    },
    {
      id: 3,
      username: "art_dailydose",
      isVerified: false,
      content: "That's epic! 🔥",
      timePosted: "21 giờ",
      likes: 29,
      replies: [
        {
          id: 301,
          username: "jordi.koalitic",
          isVerified: true,
          content: "Cảm ơn bạn đã ủng hộ! 🙏🔥",
          timePosted: "20 giờ",
          likes: 2
        }
      ],
      showReplies: false,
      loadingReplies: false
    },
    {
      id: 4,
      username: "jjs5309",
      isVerified: false,
      content: "Off the charts! 🔥 🔥 🔥 🔥 🔥 🔥",
      timePosted: "21 giờ",
      likes: 1,
      replies: [],
      showReplies: false,
      loadingReplies: false
    }
  ]);

  const [newComment, setNewComment] = React.useState("");

  const handleSubmitComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: comments.length + 1,
      username: "vutuan2318", // Current user
      isVerified: false,
      content: newComment,
      timePosted: "Vừa xong",
      likes: 0,
      replies: [],
      showReplies: false,
      loadingReplies: false
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  const toggleReplies = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        // If we're showing replies, simulate loading effect
        if (!comment.showReplies) {
          // First set loading state
          comment.loadingReplies = true;

          // After a delay, show the replies and remove loading state
          setTimeout(() => {
            setComments(prevComments => prevComments.map(c => {
              if (c.id === commentId) {
                return {
                  ...c,
                  showReplies: true,
                  loadingReplies: false
                };
              }
              return c;
            }));
          }, 700); // Delay to show the loading spinner

          return {
            ...comment,
            loadingReplies: true
          };
        } else {
          // If we're hiding replies, do it immediately
          return {
            ...comment,
            showReplies: false,
            loadingReplies: false
          };
        }
      }
      return comment;
    }));
  };

  return (
    <div className="comments-overlay">
      <div className="comments-container">
        <div className="comments-header">
          <h3>Bình luận</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="post-preview">
          <img
            src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/06/hinh-nen-bong-da-12.jpg"
            alt="Post preview"
            className="post-preview-image"
          />
          <div className="post-preview-details">
            <p className="post-likes">44.158 lượt thích</p>
            <p className="post-time">21 giờ trước</p>
          </div>
        </div>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <img
                  src="https://i.pinimg.com/474x/71/21/b0/7121b097363da3f3bf0a9439e23f6848.jpg"
                  alt={comment.username}
                />
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <div className="username-line">
                    <span className="comment-username">{comment.username}</span>
                    {comment.isVerified && (
                      <span className="verified-badge-small">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    )}
                  </div>
                  <div className="comment-line">
                    <span className="comment-text">{comment.content}</span>
                  </div>
                </div>
                <div className="comment-actions">
                  <span className="comment-time">{comment.timePosted}</span>
                  <span className="comment-likes">{comment.likes} lượt thích</span>
                  <button className="reply-button">Trả lời</button>
                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      className="view-replies"
                      onClick={() => toggleReplies(comment.id)}
                    >
                      {comment.showReplies ?
                        "Ẩn câu trả lời" :
                        <>
                          Xem câu trả lời ({comment.replies.length})
                          {comment.loadingReplies && (
                            <span className="loading-spinner">
                              <i className="fas fa-spinner fa-spin"></i>
                            </span>
                          )}
                        </>
                      }
                    </button>
                  )}
                </div>

                {/* Replies section */}
                {comment.showReplies && comment.replies && comment.replies.length > 0 && (
                  <div className="replies-container">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="reply-item">


                        <div className="reply-avatar">
                          <img
                            src="https://i.pinimg.com/474x/71/21/b0/7121b097363da3f3bf0a9439e23f6848.jpg"
                            alt={reply.username}
                          />

                          <span className="reply-username">{reply.username}</span>
                        </div>
                        <div className="reply-content">
                          <div className="reply-header">
                            
                            <div className="reply-line">
                              <span className="reply-text">{reply.content}</span>
                            </div>
                          </div>
                          <div className="reply-actions">
                            
                            <button className="reply-button">Trả lời</button>
                          </div>
                        </div>
                       
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="like-comment-button">
                <i className="far fa-heart"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="add-comment-section">
          <div className="emoji-selector">
            <button className="emoji-button">
              <i className="far fa-smile"></i>
            </button>
          </div>
          <div className="comment-input-container">
            <input
              type="text"
              className="comment-input"
              placeholder="Thêm bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSubmitComment();
              }}
            />
          </div>
          <button
            className={`post-comment-button ${newComment.trim() === "" ? "disabled" : ""}`}
            onClick={handleSubmitComment}
            disabled={newComment.trim() === ""}
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated Post Actions Component to include Comments functionality
const PostActions = () => {
  const [showComments, setShowComments] = React.useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <>
      <div className="post-actions">
        <div className="action-buttons">
          <button className="action-button">
            <i className="far fa-heart"></i>
          </button>
          <button className="action-button" onClick={toggleComments}>
            <i className="far fa-comment"></i>
          </button>
          <button className="action-button">
            <i className="far fa-paper-plane"></i>
          </button>
        </div>
        <button className="action-button bookmark">
          <i className="far fa-bookmark"></i>
        </button>
      </div>

      {showComments && (
        <Comments
          postId={1}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
};
export default Index;