import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentModal from './comment/Comment';
import { reactPost, deletePost, updatePost } from '~/api/postAPI';
import { getComments } from '~/api/commentAPI'; // Thêm import getComments
import { convertTime } from '~/utils/convertTime';
import FormSharePost from './FormSharePost';
import DeleteConfirmationDialog from './DeleteDiaLog';

import { Comment as CommentIcon, Share as ShareIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  CircularProgress, // Thêm CircularProgress để hiển thị loading
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Post = ({ post, onDelete, onUpdate }) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const navigate = useNavigate();
  const [openSharePost, setOpenSharePost] = useState(false);
  const [postData, setPostData] = useState(post);
  const user = JSON.parse(localStorage.getItem('user'));
  const [countReaction, setCountReaction] = useState(
    (post?.interactions?.likes || 0) +
    (post?.interactions?.hahas || 0) +
    (post?.interactions?.hearts || 0) +
    (post?.interactions?.wows || 0) +
    (post?.interactions?.sads || 0) +
    (post?.interactions?.angrys || 0)
  );
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeReactionPost, setActiveReactionPost] = useState(null);
  const [postReactions, setPostReactions] = useState({});
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateContent, setUpdateContent] = useState(post.content || '');
  const [updateFiles, setUpdateFiles] = useState([]);
  const [existingAssets, setExistingAssets] = useState(post.assets || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false); // Thêm state để theo dõi trạng thái loading

  if (!postData || !postData._id) {
    console.error("Invalid post data:", postData);
    return <div>Bài viết không hợp lệ hoặc thiếu dữ liệu.</div>;
  }
//dong hinh anh
  useEffect(() => {
    const handleScroll = () => {
      if (showFullGallery) {
        handleCloseFullGallery();
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullGallery]);

  // Lấy số lượng comment ban đầu khi component được render
  useEffect(() => {
    const fetchInitialComments = async () => {
      setIsLoadingComments(true);
      try {
        const comments = await getComments(postData._id);
        setPostData((prev) => ({
          ...prev,
          comments: comments.length,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy số lượng comment ban đầu:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchInitialComments();
  }, [postData._id]);

  const handleCommentCountChange = (newCommentCount) => {
    setPostData((prev) => ({
      ...prev,
      comments: newCommentCount,
    }));
  };

  const handleCloseComments = () => {
    if (!isEmojiPickerOpen) {
      setActiveCommentPost(null);
    }
  };

  const handleDeletePost = (e) => {
    if (e) e.stopPropagation();
    setShowOptionsMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost({ postId: postData._id, authorId: user._id });
      if (onDelete && typeof onDelete === 'function') {
        onDelete(postData._id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const getActiveReaction = (postData) => postData.interactions?.userAction || null;

  useEffect(() => {
    const activeReaction = getActiveReaction(postData);
    if (activeReaction) {
      setPostReactions((prev) => ({ ...prev, [postData._id]: activeReaction }));
    }
  }, [postData]);

  const toggleComments = (postId) => {
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  const toggleReactions = (postId) => {
    setActiveReactionPost(activeReactionPost === postId ? null : postId);
  };

  const toggleOptionsMenu = (e) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowOptionsMenu(false);
    if (showOptionsMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showOptionsMenu]);

  useEffect(() => {
    if (activeCommentPost === postData._id) {
      console.log('Modal opened, locking scroll');
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Modal closed, restoring scroll');
      document.body.style.overflow = '';
    }
  }, [activeCommentPost, postData._id]);

  const handleUpdatePost = (e) => {
    e.stopPropagation();
    setOpenUpdateDialog(true);
    setShowOptionsMenu(false);
    setUpdateContent(postData.content || '');
    setExistingAssets(postData.assets || []);
    setUpdateFiles([]);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateContent(postData.content || '');
    setUpdateFiles([]);
    setExistingAssets(postData.assets || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdateFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setUpdateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAsset = (index) => {
    setExistingAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSubmit = async () => {
    setIsUpdating(true);
    try {
      const deleteFiles = postData.assets
        ? postData.assets
            .filter((asset) => !existingAssets.some((existing) => existing.url === asset.url))
            .map((asset) => asset.public_id)
        : [];
  
      const updatedPost = await updatePost({
        postId: postData._id,
        content: updateContent,
        authorId: user._id,
        files: updateFiles,
        deleteFiles,
      });
  
      if (updatedPost.acknowledged) {
        const newAssets = updateFiles.length > 0 
          ? updateFiles.map((file) => ({ url: URL.createObjectURL(file) }))
          : [];
        const updatedAssets = [...existingAssets, ...newAssets];
  
        setPostData((prev) => ({
          ...prev,
          content: updateContent,
          assets: updatedAssets,
        }));
  
        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate({
            ...postData,
            content: updateContent,
            assets: updatedAssets,
          });
        }
        handleCloseUpdateDialog();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      alert('Không thể cập nhật bài viết. Vui lòng thử lại!');
    } finally {
      setIsUpdating(false);
    }
  };

const handleReaction = async (postId, reaction) => {
  setActiveReactionPost(null);

  // Lưu trạng thái cảm xúc trước đó
  const previousReaction = postReactions[postId];

  try {
    // Gọi API để gửi phản ứng
    const response = await reactPost({ postId, userId: user._id, type: reaction });

    // Cập nhật cảm xúc của người dùng
    setPostReactions((prev) => ({ ...prev, [postId]: reaction }));

    // Tính toán lại số lượng cảm xúc từ dữ liệu server
    if (response?.data?.interactions) {
      const { likes = 0, hahas = 0, hearts = 0, wows = 0, sads = 0, angrys = 0 } = response.data.interactions;
      const newCount = likes + hahas + hearts + wows + sads + angrys;

      // Cập nhật postData và countReaction
      setPostData((prev) => ({
        ...prev,
        interactions: response.data.interactions,
      }));
      setCountReaction(newCount);
    } else {
      // Fallback: Cập nhật thủ công nếu server không trả về interactions đầy đủ
      setCountReaction((prev) => {
        if (!previousReaction) {
          // Nếu chưa có phản ứng trước đó, tăng số lượng
          return prev + 1;
        } else if (previousReaction !== reaction) {
          // Nếu đổi phản ứng, số lượng không đổi (giảm cũ, tăng mới)
          return prev;
        }
        return prev; // Nếu cùng phản ứng, không thay đổi
      });
    }
  } catch (error) {
    console.error('Lỗi khi gửi reaction:', error);
    // Khôi phục trạng thái trước đó nếu có lỗi
    setPostReactions((prev) => ({ ...prev, [postId]: previousReaction }));
  }
};

  const handleOpenFullGallery = (index) => {
    setSelectedImageIndex(index);
    setShowFullGallery(true);
  };

  const handleCloseFullGallery = () => setShowFullGallery(false);

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === postData.assets.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? postData.assets.length - 1 : prev - 1
    );
  };

  const reactions = [
    { name: 'like', icon: '👍', color: '#1877F2', label: 'Thích' },
    { name: 'heart', icon: '❤️', color: '#F33E58', label: 'Yêu thích' },
    { name: 'haha', icon: '😂', color: '#F7B125', label: 'Haha' },
    { name: 'wow', icon: '😮', color: '#F7B125', label: 'Wow' },
    { name: 'sad', icon: '😢', color: '#F7B125', label: 'Buồn' },
    { name: 'angry', icon: '😡', color: '#E4605A', label: 'Phẫn nộ' },
  ];

  const getReactionDisplay = (postId) => {
    const activeReaction = postReactions[postId];
    if (!activeReaction) {
      return { icon: '👍', text: 'Thích', className: '', color: '#757575' };
    }
    const reaction = reactions.find((r) => r.name === activeReaction);
    return {
      icon: reaction ? reaction.icon : '👍',
      text: reaction ? reaction.label : 'Thích',
      className: reaction ? `active-${reaction.name}` : '',
      color: reaction ? reaction.color : '#757575',
    };
  };

  const renderGallery = () => {
    const assets = postData.assets || [];
    const count = assets.length;

    if (count === 0) return null;

    if (count === 1) {
      return (
        <div className="post-image single-image" onClick={() => handleOpenFullGallery(0)}>
          <img src={assets[0].url} alt="Post" />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="post-gallery gallery-2">
          {assets.map((asset, index) => (
            <div key={index} className="gallery-item" onClick={() => handleOpenFullGallery(index)}>
              <img src={asset.url} alt={`Post ${index + 1}`} />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="post-gallery gallery-3">
          <div className="gallery-item main-image" onClick={() => handleOpenFullGallery(0)}>
            <img src={assets[0].url} alt="Post 1" />
          </div>
          <div className="gallery-column">
            {assets.slice(1, 3).map((asset, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => handleOpenFullGallery(index + 1)}
              >
                <img src={asset.url} alt={`Post ${index + 2}`} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="post-gallery gallery-4">
          {assets.slice(0, 4).map((asset, index) => (
            <div key={index} className="gallery-item" onClick={() => handleOpenFullGallery(index)}>
              <img src={asset.url} alt={`Post ${index + 1}`} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="post-gallery gallery-5-plus">
        <div className="gallery-row">
          {assets.slice(0, 2).map((asset, index) => (
            <div key={index} className="gallery-item" onClick={() => handleOpenFullGallery(index)}>
              <img src={asset.url} alt={`Post ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="gallery-row">
          {assets.slice(2, 5).map((asset, index) => (
            <div
              key={index}
              className={`gallery-item ${index === 2 && count > 5 ? 'more-images' : ''}`}
              onClick={() => handleOpenFullGallery(index + 2)}
            >
              <img src={asset.url} alt={`Post ${index + 3}`} />
              {index === 2 && count > 5 && (
                <div className="more-overlay">
                  <span>+{count - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const reactionDisplay = getReactionDisplay(postData?._id);
  const isAuthor = user && postData && user._id === (postData.author?._id || postData.authorID);

  return (
    <>
      <FormSharePost open={openSharePost} onClose={() => setOpenSharePost(false)} post={postData} />
      <div key={postData._id} className="post" id="header">
        <div className="post-header">
          <div className="post-user">
            <div
              className="avatar"
              onClick={() => navigate(`/profile/${postData.author?._id || postData.authorID}`)}
            >
              <img src={postData.author?.picture?.url || 'default-avatar.jpg'} alt="Author" />
            </div>
            <div className="user-info">
              <div className="username-container">
                <span className="username">{postData.author?.name || 'Unknown Author'}</span>
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

        <div className="post-content">
          <p>{postData.content || 'No content'}</p>
        </div>

        {postData.assets?.length > 0 && renderGallery()}

        {showFullGallery && (
          <div className="full-gallery-overlay" onClick={handleCloseFullGallery}>
            <div className="full-gallery-container" onClick={(e) => e.stopPropagation()}>
              <button className="gallery-close-btn" onClick={handleCloseFullGallery}>
                <i className="fas fa-times"></i>
              </button>
              <button className="gallery-nav prev" onClick={handlePrevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="full-gallery-image">
                <img src={postData.assets[selectedImageIndex].url} alt={`Full size ${selectedImageIndex + 1}`} />
              </div>
              <button className="gallery-nav next" onClick={handleNextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className="gallery-counter">
                {selectedImageIndex + 1}/{postData.assets.length}
              </div>
            </div>
          </div>
        )}

        <div className="post-stats">
          <div className="reaction-icons">
            <span className="reaction-count likes-count">{countReaction}</span>
            {postData?.interactions?.likes > 0 && (
              <span className="reaction like-reaction" style={{ fontSize: '16px', marginLeft: '5px' }}>
                👍
              </span>
            )}
            {postData?.interactions?.hearts > 0 && (
              <span className="reaction love-reaction" style={{ fontSize: '16px', marginLeft: '5px' }}>
                ❤️
              </span>
            )}
            {postData?.interactions?.hahas > 0 && (
              <span className="reaction haha-reaction" style={{ fontSize: '16px', marginLeft: '5px' }}>
                😂
              </span>
            )}
          </div>
          <div className="engagement-stats">
            {isLoadingComments ? (
              <CircularProgress size={16} sx={{ mr: 1 }} />
            ) : (
              <span className="comments-count">
                {(postData.comments || 0) >= 1000
                  ? `${Math.floor((postData.comments || 0) / 100) / 10}K`
                  : postData.comments || 0}{' '}
                bình luận
              </span>
            )}
          </div>
        </div>

        <div className="post-actions" style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
          <div className="action-wrapper">
            <button
              className={`action-btn like-btn ${reactionDisplay.className}`}
              onClick={() => toggleReactions(postData._id)}
              onMouseEnter={() => toggleReactions(postData._id)}
              style={{
                color: reactionDisplay.color,
                display: 'flex',
                alignItems: 'center',
                gap: '1px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: '#f5f5f5',
                transition: 'background 0.3s, transform 0.2s',
              }}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            >
              <span style={{ fontSize: '20px' }}>{reactionDisplay.icon}</span>
              <span style={{ fontWeight: '500' }}>{reactionDisplay.text}</span>
            </button>
            {activeReactionPost === postData._id && (
              <div
                className="reactions-popup"
                onMouseLeave={() => setActiveReactionPost(null)}
                style={{
                  display: 'flex',
                  gap: '1px',
                  padding: '5px 5px',
                  background: '#fff',
                  borderRadius: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  position: 'absolute',
                  bottom: '40px',
                  left: '45',
                }}
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.name}
                    className="reaction-btn"
                    title={reaction.label}
                    onClick={() => handleReaction(postData._id, reaction.name)}
                    style={{
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {reaction.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="action-btn comment-btn"
            onClick={() => toggleComments(postData._id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: '#f5f5f5',
              color: '#616161',
              transition: 'background 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          >
            <CommentIcon style={{ fontSize: '20px' }} />
            <span style={{ fontWeight: '500' }}>Bình luận</span>
          </button>

          <button
            className="action-btn share-btn"
            onClick={() => setOpenSharePost(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: '#f5f5f5',
              color: '#616161',
              transition: 'background 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          >
            <ShareIcon style={{ fontSize: '20px' }} />
            <span style={{ fontWeight: '500' }}>Chia sẻ</span>
          </button>
        </div>

        {activeCommentPost === postData._id && (
          <CommentModal
            postId={postData._id}
            postData={postData}
            onClose={handleCloseComments}
            onEmojiPickerChange={setIsEmojiPickerOpen}
            onCommentCountChange={handleCommentCountChange}
          />
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={confirmDeletePost}
        isLoading={isDeleting}
      />

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Cập nhật bài viết</Typography>
          <IconButton onClick={handleCloseUpdateDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nội dung bài viết"
              multiline
              rows={4}
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {existingAssets.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Hình ảnh hiện tại
                </Typography>
                <Grid container spacing={2}>
                  {existingAssets.map((asset, index) => (
                    <Grid item xs={4} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={asset.url}
                          alt={`Existing ${index}`}
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)' }}
                          onClick={() => handleRemoveExistingAsset(index)}
                        >
                          <DeleteIcon sx={{ color: 'white' }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Thêm hình ảnh mới
              </Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '8px' }}
              />
              {updateFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Hình ảnh mới đã chọn:</Typography>
                  <Grid container spacing={2}>
                    {updateFiles.map((file, index) => (
                      <Grid item xs={4} key={index}>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index}`}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <IconButton
                            sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)' }}
                            onClick={() => handleRemoveNewFile(index)}
                          >
                            <DeleteIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateSubmit}
            color="primary"
            variant="contained"
            disabled={isUpdating || !updateContent.trim()}
          >
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;