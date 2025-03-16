import { useState, useEffect, useRef } from 'react';
import './Comment.css';
import { createComment, getCommentFollowCommentId, getComments } from '../../api/commentAPI';

const CommentModal = ({ postId, postData, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"))
  
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

  const fetchComments = async () => {
    const res = await getComments(postId);
    setComments(res);
    console.log(res)
  }
  // Prevent scrolling when modal is open
  useEffect(() => {
    fetchComments()
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleCommentSubmit =async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    

    const res= await createComment({ postId, authorId: user._id, content: commentText });
    const newComment = {
      _id: res.insertedId,
      content: commentText,
      createAt: new Date().toISOString(),
      author: {
        name: user.name,
        picture: user.picture

      },
      replyCount: 0,
    }
    setComments([newComment,...comments]);
    setCommentText('');
  };
  
const toggleReplies = async (commentId) => {
  if (showReplies[commentId]) {
    setShowReplies(prev => ({ ...prev, [commentId]: null }));
  } else {
    const replies = await getCommentFollowCommentId(commentId);
    setShowReplies(prev => ({ ...prev, [commentId]: replies }));
  }
};

  
  const handleReplyStart = (commentId) => {
    setReplyingTo(commentId);
  };
  
  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyText('');
  };
  
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    const res = await createComment({ postId, authorId: user._id, content: replyText, followCommentId: commentId });
    const newReply = {
      _id: res._id,
      content: replyText,
      createAt: new Date().toISOString(),
      author: {
        name: user.name,
        picture: user.picture
      },
      replyCount: 0,
    }
    const updateComments = comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          replyCount: comment.replyCount + 1
        };
      }
      return comment;
    });
    setComments(updateComments);
    setReplyingTo(null);
    setReplyText('');
    
    // Auto-show replies after adding one
    if (showReplies[commentId]) {
      setShowReplies(prev => ({
        ...prev,
        [commentId]: [newReply, ...prev[commentId]]
      }));
    }
  };
  
  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal-container" ref={modalRef}>
        <div className="comment-modal-header">
          <h3>Bài viết của {postData.author.name}</h3>
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
                  <img src={postData.assets[0].url} />
                </div>
                <div className="user-info">
                  <div className="username-container">
                    <span className="username">{postData.author.name}</span>
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
            {postData.assets.length > 0 && (
              postData.assets.map((asset,index) => (
                <div key={index} className="post-image">
                  <img src={asset.url} alt="Post" />
                </div>
              ))
            )
          }
          </div>
          
          <div className="comments-section">
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-avatar">
                    <img src={comment.author.picture} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <div className="comment-user">{comment.author.name}</div>
                      <div className="comment-text">{comment.content}</div>
                    </div>
                    
                    <div className="comment-actions">
                      <button>Thích</button>
                      <button onClick={() => handleReplyStart(comment._id)}>Phản hồi</button>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    
                    {comment.replyCount > 0 && (
                      <div className="reply-toggle">
                        <button 
                          className="view-replies" 
                          onClick={() => toggleReplies(comment._id)}
                        >
                          {showReplies[comment._id] ? 'Ẩn phản hồi' : `Xem ${comment.replyCount} phản hồi`}
                        </button>
                      </div>
                    )}
                    
                    {replyingTo === comment._id && (
                      <div className="reply-input">
                        <div className="avatar">
                           <div style={{width:40 , height:40 , borderRadius:'100%', background:'green'}}></div>
                        </div>
                        <div className="reply-form">
                          <input 
                            type="text" 
                            placeholder={`Phản hồi ${comment.author.name}...`}
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
                              onClick={() => handleReplySubmit(comment._id)}
                            >
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                   {showReplies[comment._id] && (
  <div className="replies-container">
    {showReplies[comment._id].map(reply => (
      <div key={reply._id} className="reply-item">
        <div className="reply-avatar">
          <img src={reply.author.picture} />
        </div>
        <div className="reply-content">
          <div className="reply-bubble">
            <div className="reply-user">{reply.author.name}</div>
            <div className="reply-text">{reply.content}</div>
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
            <img src={user.picture} />
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