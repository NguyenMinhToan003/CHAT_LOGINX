import { useEffect, useState } from 'react';
import CommentModal from './comment/Comment';
import { reactPost } from '../api/postAPI';
import { convertTime } from '../utils/convertTime';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState(post);
  const [countReaction, setCountReaction] =
    useState(
      postData?.interactions?.likes
      + postData?.interactions?.hahas
      + postData?.interactions?.hearts
      + postData?.interactions?.wows
      + postData?.interactions?.sads
      + postData?.interactions?.angrys
      || 0);
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeReactionPost, setActiveReactionPost] = useState(null);
  const [postReactions, setPostReactions] = useState({});
  const getActiveReaction = (postData) => {
    return postData.interactions?.userAction || null;
  };

  useEffect(() => {
    const activeReaction = getActiveReaction(postData);
    console.log(activeReaction);
    if (activeReaction) {
      setPostReactions((prev) => ({ ...prev, [postData._id]: activeReaction }));
    }
  }, [postData]);



    // Toggle comment section for a specific postData
  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };
  const toggleReactions = (postId) => {
    if (activeReactionPost === postId) {
      setActiveReactionPost(null);
    } else {
      setActiveReactionPost(postId);
    }
  };

  // Handle reaction selection
const handleReaction = async (postId, reaction) => {
  setActiveReactionPost(null);

  // Cập nhật UI ngay lập tức
  setPostReactions((prev) => ({ ...prev, [postId]: reaction }));

  try {
    const response = await reactPost({ postId, userId: user._id, type: reaction });

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
    { name: 'angry', icon: 'fas fa-angry', color: '#E4605A', label: 'Phẫn nộ' }
  ];


  // State to track which postData has comments open





  // Get reaction icon and text based on active reaction

const getReactionDisplay = (postId) => {
  const activeReaction = postReactions[postId]; // Ưu tiên lấy từ state cập nhật mới nhất

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
  return <>
    <div key={postData._id} className='post'>
              <div className='post-header'>
                <div className='post-user'>
          <div className='avatar'
            onClick={() => navigate(`/index/profile/${postData.author._id}`)}>
                    <img src={postData.author.picture} />
                  </div>
                  <div className='user-info'>
                    <div className='username-container'>
                      <span className='username'>{postData.author.name}</span>
                      <span className='follow-text'>Theo dõi</span>
                    </div>
                    <div className='post-metadata'>
                      <span className='post-time'>{convertTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className='post-options'>
                  <button className='options-button'><i className='fas fa-ellipsis-h'></i></button>
                  <button className='close-button'><i className='fas fa-times'></i></button>
                </div>
              </div>

              <div className='post-content'>
                <p>{postData.content}</p>
              </div>

              {postData.assets.length>0 && (
                <div className='post-image'>
                  <img src={postData.assets[0].url} alt='Post' />
                </div>
              )}

              <div className='post-stats'>
        <div className='reaction-icons'>
          <span className='reaction-count likes-count'>{
            countReaction
              }</span>
                  {postData?.interactions?.likes > 0 && (
                    <span className='reaction like-reaction' style={{ backgroundColor: '#1877F2',color: 'white' }}>
                      <i className='fas fa-thumbs-up'></i>
                    </span>
                  )}
                  {postData?.interactions?.hahas > 0 && (
                    <span className='reaction haha-reaction' style={{ backgroundColor: '#F7B125',color: 'white' }}>
                      <i className='fas fa-laugh-squint'></i>
                    </span>
                  )}
                  {postData?.interactions?.hearts > 0 && (
                    <span className='reaction love-reaction' style={{ backgroundColor: '#F33E58',color: 'white' }}>
                      <i className='fas fa-heart'></i>
                    </span>
                  )}
                  <span className='likes-count'>
                    {postData?.interactions?.likes >= 1000
                      ? `${Math.floor(postData?.interactions?.likes / 1000)}K`
                      : postData?.interaction?.likes}
                  </span>
                </div>

                <div className='engagement-stats'>
                  <span className='comments-count'>{postData.comments >= 1000 ? `${Math.floor(postData.coundComment / 100) / 10}K` : postData.coundComment} bình luận</span>
                </div>
              </div>

              <div className='post-actions'>
                <div className='action-wrapper'>
                  <button
                    className={`action-btn like-btn ${reactionDisplay.className}`}
                    onClick={() => toggleReactions(postData._id)}
                    onMouseEnter={() => toggleReactions(postData._id)}
                  >
                    <i className={reactionDisplay.icon}></i>
                    <span>{reactionDisplay.text}</span>
                  </button>

                  {/* Reactions popup */}
                  {activeReactionPost === postData._id && (
                    <div
                      className='reactions-popup'
                      onMouseLeave={() => setActiveReactionPost(null)}
                    >
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.name}
                          className='reaction-btn'
                          title={reaction.label}
                          onClick={() => handleReaction(postData._id, reaction.name)}
                        >
                          <div
                            className='reaction-icon'
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
                  className='action-btn comment-btn'
                  onClick={() => toggleComments(postData._id)}
                >
                  <i className='far fa-comment'></i>
                  <span>Bình luận</span>
                </button>
                <button className='action-btn share-btn'>
                  <i className='far fa-share-square'></i>
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Conditionally render Comment component when activeCommentPost matches postData.id */}
              {activeCommentPost === postData._id && (
                <CommentModal
                  postId={postData._id}
                  postData={postData}
                  onClose={handleCloseComments}
                />
              )}

              {/* Keep the existing comment input for quick comments */}

            </div>
  </>
}
export default Post;