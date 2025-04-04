import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentModal from '../components/comment/Comment'; // Assuming you have a CommentModal component
import { reactPost, deletePost } from '../api/postAPI';
import { convertTime } from '../utils/convertTime'; // Assuming you have a utility to format time

const PostComponent = ({ post, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState(post);
  const [countReaction, setCountReaction] = useState(
    (post?.interactions?.likes || 0) +
    (post?.interactions?.hahas || 0) +
    (post?.interactions?.hearts || 0) +
    (post?.interactions?.wows || 0) +
    (post?.interactions?.sads || 0) +
    (post?.interactions?.angrys || 0) || 0
  );
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeReactionPost, setActiveReactionPost] = useState(null);
  const [postReactions, setPostReactions] = useState({});
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Ensure postData is updated if the post prop changes
  useEffect(() => {
    setPostData(post);
  }, [post]);

  // Get the active reaction for the post
  const getActiveReaction = (postData) => {
    return postData.interactions?.userAction || null;
  };

  useEffect(() => {
    const activeReaction = getActiveReaction(postData);
    if (activeReaction) {
      setPostReactions((prev) => ({ ...prev, [postData._id]: activeReaction }));
    }
  }, [postData]);

  // Toggle comment section
  const toggleComments = (postId) => {
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  // Toggle reactions popup
  const toggleReactions = (postId) => {
    setActiveReactionPost(activeReactionPost === postId ? null : postId);
  };

  // Toggle options menu
  const toggleOptionsMenu = (e) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptionsMenu(false);
    };

    if (showOptionsMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOptionsMenu]);

  // Handle reaction selection
  const handleReaction = async (postId, reaction) => {
    setActiveReactionPost(null);
    setPostReactions((prev) => ({ ...prev, [postId]: reaction }));

    try {
      const response = await reactPost({ postId, userId: user._id, type: reaction });
      setCountReaction((prev) => prev + 1);
      if (response?.data) {
        setPostData((prev) => ({
          ...prev,
          interactions: response.data.interactions,
        }));
      }
    } catch (error) {
      console.error('Lỗi khi gửi reaction:', error);
    }
  };

  // Handle delete post
  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;

    try {
      await deletePost({ postId: postData._id, authorId: user._id });
      if (onDelete && typeof onDelete === "function") {
        onDelete(postData._id);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }

    setShowOptionsMenu(false);
  };

  // Handle update post
  const handleUpdatePost = (e) => {
    e.stopPropagation();
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(postData);
    }
    setShowOptionsMenu(false);
  };

  // Close the comment section
  const handleCloseComments = () => {
    setActiveCommentPost(null);
  };

  // Reactions data
  const reactions = [
    { name: 'like', icon: 'fas fa-thumbs-up', color: '#1877F2', label: 'Thích' },
    { name: 'heart', icon: 'fas fa-heart', color: '#F33E58', label: 'Yêu thích' },
    { name: 'haha', icon: 'fas fa-laugh-squint', color: '#F7B125', label: 'Haha' },
    { name: 'wow', icon: 'fas fa-surprise', color: '#F7B125', label: 'Wow' },
    { name: 'sad', icon: 'fas fa-sad-tear', color: '#F7B125', label: 'Buồn' },
    { name: 'angry', icon: 'fas fa-angry', color: '#E4605A', label: 'Phẫn nộ' },
  ];

  // Get reaction icon and text based on active reaction
  const getReactionDisplay = (postId) => {
    const activeReaction = postReactions[postId];
    if (!activeReaction) {
      return { icon: 'far fa-thumbs-up', text: 'Thích', className: '' };
    }

    const reaction = reactions.find((r) => r.name === activeReaction);
    return {
      icon: reaction ? reaction.icon : 'far fa-thumbs-up',
      text: reaction ? reaction.label : 'Thích',
      className: reaction ? `active-${reaction.name}` : '',
    };
  };

  const reactionDisplay = getReactionDisplay(postData?._id);

  // Check if the current user is the post author
  const isAuthor = user && postData && user._id === postData.author?._id;

  if (!postData) return null;

  return (
    <div className="post" id="header">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <div
            className="avatar"
            onClick={() => navigate(`/index/profile/${postData.author?._id}`)}
          >
            <img src={postData.author?.picture?.url || '/default-avatar.png'} alt="Author avatar" />
          </div>
          <div className="user-info">
            <div className="username-container">
              <span className="username">{postData.author?.name || 'Unknown'}</span>
              <span className="follow-text">Theo dõi</span>
            </div>
            <div className="post-metadata">
              <span className="post-time">{convertTime(postData.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="post-options">
          <button className="options-button" onClick={toggleOptionsMenu}>
            <i className="fas fa-ellipsis-h"></i>
          </button>
          {showOptionsMenu && (
            <div className="options-dropdown" onClick={(e) => e.stopPropagation()}>
              {isAuthor && (
                <>
                  <button className="dropdown-item" onClick={handleUpdatePost}>
                    <i className="fas fa-edit"></i> Cập nhật bài viết
                  </button>
                  <button className="dropdown-item" onClick={handleDeletePost}>
                    <i className="fas fa-trash"></i> Xóa bài viết
                  </button>
                </>
              )}
              {!isAuthor && (
                <button className="dropdown-item">
                  <i className="fas fa-flag"></i> Báo cáo bài viết
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        {postData.content && <p>{postData.content}</p>}
      </div>

      {/* Post Images */}
      {postData.assets && postData.assets.length > 0 && (
        <div className="post-image">
          <img src={postData.assets[0].url} alt="Post" />
        </div>
      )}

      {/* Post Stats */}
      <div className="post-stats">
        <div className="reaction-icons">
          <span className="reaction-count likes-count">{countReaction}</span>
          {postData?.interactions?.likes > 0 && (
            <span className="reaction like-reaction" style={{ backgroundColor: '#1877F2', color: 'white' }}>
              <i className="fas fa-thumbs-up"></i>
            </span>
          )}
          {postData?.interactions?.hahas > 0 && (
            <span className="reaction haha-reaction" style={{ backgroundColor: '#F7B125', color: 'white' }}>
              <i className="fas fa-laugh-squint"></i>
            </span>
          )}
          {postData?.interactions?.hearts > 0 && (
            <span className="reaction love-reaction" style={{ backgroundColor: '#F33E58', color: 'white' }}>
              <i className="fas fa-heart"></i>
            </span>
          )}
         
        </div>
        <div className="engagement-stats">
          <span className="comments-count">
            {postData.coundComment >= 1000
              ? `${Math.floor(postData.coundComment / 100) / 10}K`
              : postData.coundComment || 0}{' '}
            bình luận
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <div className="action-wrapper">
          <button
            className={`action-btn like-btn ${reactionDisplay.className}`}
            onClick={() => toggleReactions(postData._id)}
            onMouseEnter={() => toggleReactions(postData._id)}
          >
            <i className={reactionDisplay.icon}></i>
            <span>{reactionDisplay.text}</span>
          </button>
          {activeReactionPost === postData._id && (
            <div
              className="reactions-popup"
              onMouseLeave={() => setActiveReactionPost(null)}
            >
              {reactions.map((reaction) => (
                <button
                  key={reaction.name}
                  className="reaction-btn"
                  title={reaction.label}
                  onClick={() => handleReaction(postData._id, reaction.name)}
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
          onClick={() => toggleComments(postData._id)}
        >
          <i className="far fa-comment"></i>
          <span>Bình luận</span>
        </button>
        <button className="action-btn share-btn">
          <i className="far fa-share-square"></i>
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comment Section */}
      {activeCommentPost === postData._id && (
        <CommentModal
          postId={postData._id}
          postData={postData}
          onClose={handleCloseComments}
        />
      )}
    </div>
  );
};

export default PostComponent;