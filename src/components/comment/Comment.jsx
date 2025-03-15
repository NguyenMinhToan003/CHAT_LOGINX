import { useState, useEffect, useRef } from 'react';
import './Comment.css';

const CommentModal = ({ postId, postData, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Nguyễn Văn A",
      userImg: "https://via.placeholder.com/32",
      content: "Đúng thế, mình cũng thấy vậy!",
      time: "10 phút",
      likes: 5,
      replies: []
    },
    {
      id: 2,
      username: "Trần Thị B",
      userImg: "https://via.placeholder.com/32",
      content: "Haha, điều này thật sự rất hài hước 😂",
      time: "45 phút",
      likes: 12,
      replies: [
        {
          id: 21,
          username: "Lê Văn C",
          userImg: "https://via.placeholder.com/32",
          content: "Tôi đồng ý với bạn!",
          time: "30 phút",
          likes: 3
        }
      ]
    }
  ]);
  
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const modalRef = useRef(null);
  
  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      username: "Vũ",
      userImg: "https://via.placeholder.com/32",
      content: commentText,
      time: "Vừa xong",
      likes: 0,
      replies: []
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };
  
  const toggleReplies = (commentId) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId]
    });
  };
  
  const handleReplyStart = (commentId) => {
    setReplyingTo(commentId);
  };
  
  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyText('');
  };
  
  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(),
              username: "Vũ",
              userImg: "https://via.placeholder.com/32",
              content: replyText,
              time: "Vừa xong",
              likes: 0
            }
          ]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText('');
    
    // Auto-show replies after adding one
    setShowReplies({
      ...showReplies,
      [commentId]: true
    });
  };
  
  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal-container" ref={modalRef}>
        <div className="comment-modal-header">
          <h3>Bài viết của {postData.username}</h3>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="comment-modal-content">
          <div className="comment-modal-post">
            {/* Post information */}
            <div className="post-header">
              <div className="post-user">
                <div className="avatar">
                  <img src={postData.userImg} />
                </div>
                <div className="user-info">
                  <div className="username-container">
                    <span className="username">{postData.username}</span>
                    {postData.isVerified && <i className="fas fa-check-circle verified-icon"></i>}
                  </div>
                  <div className="post-metadata">
                    <span className="post-time">{postData.postTime}</span>
                    {postData.isPublic && <span className="visibility-icon"><i className="fas fa-globe-asia"></i></span>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Post content */}
            <div className="post-content">
              <p>{postData.content}</p>
            </div>
            
            {/* Post image */}
            {postData.imageUrl && (
              <div className="post-image">
                <img src={postData.imageUrl}  />
              </div>
            )}
          </div>
          
          <div className="comments-section">
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <div style={{width:40 , height:40 , borderRadius:'100%', background:'black'}}></div>
                  </div>
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <div className="comment-user">{comment.username}</div>
                      <div className="comment-text">{comment.content}</div>
                    </div>
                    
                    <div className="comment-actions">
                      <button>Thích</button>
                      <button onClick={() => handleReplyStart(comment.id)}>Phản hồi</button>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="reply-toggle">
                        <button 
                          className="view-replies" 
                          onClick={() => toggleReplies(comment.id)}
                        >
                          {showReplies[comment.id] ? 'Ẩn phản hồi' : `Xem ${comment.replies.length} phản hồi`}
                        </button>
                      </div>
                    )}
                    
                    {replyingTo === comment.id && (
                      <div className="reply-input">
                        <div className="avatar">
                           <div style={{width:40 , height:40 , borderRadius:'100%', background:'green'}}></div>
                        </div>
                        <div className="reply-form">
                          <input 
                            type="text" 
                            placeholder={`Phản hồi ${comment.username}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="reply-actions">
                            <button 
                              className="cancel-reply" 
                              onClick={handleReplyCancel}
                            >
                              Hủy
                            </button>
                            <button 
                              className="submit-reply"
                              onClick={() => handleReplySubmit(comment.id)}
                            >
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showReplies[comment.id] && comment.replies.length > 0 && (
                      <div className="replies-container">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply-item">
                            <div className="reply-avatar">
                              <img src={reply.userImg}  />
                            </div>
                            <div className="reply-content">
                              <div className="reply-bubble">
                                <div className="reply-user">{reply.username}</div>
                                <div className="reply-text">{reply.content}</div>
                              </div>
                              <div className="reply-actions">
                                <button>Thích</button>
                                <button onClick={() => handleReplyStart(comment.id)}>Phản hồi</button>
                                <span className="reply-time">{reply.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="comment-input-main">
          <div className="avatar">
            <div style={{width:40 , height:40 , borderRadius:'100%', background:'green'}}></div>
          </div>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              placeholder="Viết bình luận..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus
            />
            <div className="comment-tools">
              <button type="button"><i className="far fa-smile"></i></button>
              <button type="button"><i className="far fa-image"></i></button>
              <button type="button"><i className="fas fa-camera"></i></button>
              <button type="button"><i className="fas fa-sticky-note"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;