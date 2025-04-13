import { useState, useEffect, useRef } from 'react';
import './Comment.css';
import { createComment, getCommentFollowCommentId, getComments } from '~/api/commentAPI';
import EmojiPicker from './EmojTicker'; // Import the new component

// Component hiển thị hình ảnh trong bình luận
const CommentImages = ({ images }) => {
  if (!images || images.length === 0) return null;

  const imageCount = images.length;
  let className = `comment-image-container image-count-${imageCount > 4 ? 'more' : imageCount}`;

  return (
    <div className={className}>
      {images.slice(0, imageCount > 4 ? 3 : imageCount).map((image, index) => (
        <div key={index} className="comment-image">
          <img src={image.url} alt={`Comment image ${index + 1}`} />
          {imageCount > 4 && index === 2 && (
            <div className="more-images-overlay">
              +{imageCount - 3}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Component hiển thị hình ảnh trong phản hồi
const ReplyImages = ({ images }) => {
  if (!images || images.length === 0) return null;

  const imageCount = images.length;
  let className = `reply-image-container image-count-${imageCount > 4 ? 'more' : imageCount}`;

  return (
    <div className={className}>
      {images.slice(0, imageCount > 4 ? 3 : imageCount).map((image, index) => (
        <div key={index} className="reply-image">
          <img src={image.url} alt={`Reply image ${index + 1}`} />
          {imageCount > 4 && index === 2 && (
            <div className="more-images-overlay">
              +{imageCount - 3}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CommentModal = ({ postId, postData, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"))

  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const modalRef = useRef(null);
  const commentInputRef = useRef(null);
  const replyInputRef = useRef(null);

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
  }

  // Prevent scrolling when modal is open
  useEffect(() => {
    fetchComments()
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await createComment({ postId, authorId: user._id, content: commentText });
    const newComment = {
      _id: res.insertedId,
      content: commentText,
      createAt: new Date().toISOString(),
      author: {
        name: user.name,
        picture: user.picture
      },
      replyCount: 0,
      assets: [] // Thêm mảng assets rỗng cho comment mới
    }
    setComments([newComment, ...comments]);
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
    // Focus on reply input after it renders
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 10);
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
      assets: [] // Thêm mảng assets rỗng cho reply mới
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
                  <img src={postData?.author?.picture?.url} />
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
              <div className={`post-images image-count-${postData.assets.length > 4 ? 'more' : postData.assets.length}`}>
                {postData.assets.slice(0, postData.assets.length > 4 ? 3 : postData.assets.length).map((asset, index) => (
                  <div key={index} className="post-image">
                    <img src={asset.url} alt="Post" />
                    {postData.assets.length > 4 && index === 2 && (
                      <div className="more-images-overlay">
                        +{postData.assets.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="comments-section">
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-avatar">
                    <img src={comment.author.picture?.url} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <div className="comment-user">{comment.author.name}</div>
                      <div className="comment-text">{comment.content}</div>
                      {comment.assets && comment.assets.length > 0 && (
                        <CommentImages images={comment.assets} />
                      )}
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
                          <img src={user.picture?.url} />
                        </div>
                        <div className="reply-form">
                          <input
                            type="text"
                            placeholder={`Phản hồi ${comment.author.name}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            ref={replyInputRef}
                          />
                          <div className="reply-tools">
                            <EmojiPicker
                              inputRef={replyInputRef}
                              setCommentText={setReplyText}
                            />
                          </div>
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
                              <img src={reply.author.picture?.url} />
                            </div>
                            <div className="reply-content">
                              <div className="reply-bubble">
                                <div className="reply-user">{reply.author.name}</div>
                                <div className="reply-text">{reply.content}</div>
                                {reply.assets && reply.assets.length > 0 && (
                                  <ReplyImages images={reply.assets} />
                                )}
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
            <img src={user.picture?.url} />
          </div>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus
              ref={commentInputRef}
            />

            
              
              <div className="comment-tools">

               <div className='emote-24'><EmojiPicker
                  inputRef={commentInputRef}
                  setCommentText={setCommentText}
                />

                </div> 
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