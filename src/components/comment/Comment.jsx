import { useState, useEffect, useRef } from 'react';
import { createComment, getCommentFollowCommentId, getComments } from '~/api/commentAPI';
import { deleteComment } from '~/api/postAPI';
import EmojiPicker from './EmojTicker';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  Divider,
  Stack,
  Collapse,
  InputAdornment,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  CameraAlt as CameraIcon,
  Note as NoteIcon,
  Send as SendIcon,
  Reply as ReplyIcon,
  ThumbUp as ThumbUpIcon,
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
} from '@mui/icons-material';

const CommentModal = ({ postId, postData, onClose, onEmojiPickerChange, onCommentCountChange }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const modalRef = useRef(null);
  const commentInputRef = useRef(null);
  const replyInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [replyAnchorEl, setReplyAnchorEl] = useState(null);
  const [openReplyEmojiPicker, setOpenReplyEmojiPicker] = useState(false);

  useEffect(() => {
    if (onEmojiPickerChange) {
      onEmojiPickerChange(openEmojiPicker || openReplyEmojiPicker);
    }
  }, [openEmojiPicker, openReplyEmojiPicker, onEmojiPickerChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!event.target.closest('.emoji-picker')) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const res = await getComments(postId);
    setComments(res);
    // Cập nhật số lượng comment ban đầu
    if (onCommentCountChange) {
      onCommentCountChange(res.length);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await createComment({ postId, authorId: user._id, content: commentText });
    const newComment = {
      _id: res.insertedId,
      content: commentText,
      createAt: new Date().toISOString(),
      author: { name: user.name, picture: user.picture },
      replyCount: 0,
      assets: [],
    };
    setComments([newComment, ...comments]);
    setCommentText('');
    setOpenEmojiPicker(false);
    // Cập nhật số lượng comment sau khi thêm
    if (onCommentCountChange) {
      onCommentCountChange(comments.length + 1);
    }
  };

  const toggleReplies = async (commentId) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: null }));
    } else {
      const replies = await getCommentFollowCommentId(commentId);
      setShowReplies((prev) => ({ ...prev, [commentId]: replies }));
    }
  };

  const handleReplyStart = (commentId) => {
    setReplyingTo(commentId);
    setTimeout(() => replyInputRef.current?.focus(), 10);
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyText('');
    setOpenReplyEmojiPicker(false);
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    const res = await createComment({
      postId,
      authorId: user._id,
      content: replyText,
      followCommentId: commentId,
    });
    const newReply = {
      _id: res._id,
      content: replyText,
      createAt: new Date().toISOString(),
      author: { name: user.name, picture: user.picture },
      replyCount: 0,
      assets: [],
    };
    setComments(comments.map((comment) =>
      comment._id === commentId
        ? { ...comment, replyCount: comment.replyCount + 1 }
        : comment
    ));
    setReplyingTo(null);
    setReplyText('');
    setOpenReplyEmojiPicker(false);

    if (showReplies[commentId]) {
      setShowReplies((prev) => ({
        ...prev,
        [commentId]: [newReply, ...prev[commentId]],
      }));
    }
    // Cập nhật số lượng comment sau khi thêm reply
    if (onCommentCountChange) {
      onCommentCountChange(comments.length + 1);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmDelete = window.confirm("Bạn có chắc muốn xóa bình luận này không?");
      if (!confirmDelete) return;

      await deleteComment({ commentId, authorId: user._id });
      setComments(comments.filter((comment) => comment._id !== commentId));
      // Cập nhật số lượng comment sau khi xóa
      if (onCommentCountChange) {
        onCommentCountChange(comments.length - 1);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      alert("Không thể xóa bình luận. Vui lòng thử lại!");
    }
  };

  const CommentImages = ({ images }) => {
    if (!images || images.length === 0) return null;
    const imageCount = images.length;
    const displayCount = imageCount > 4 ? 3 : imageCount;

    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        {images.slice(0, displayCount).map((image, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={image.url}
              alt={`Comment image ${index + 1}`}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
            />
            {imageCount > 4 && index === 2 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  +{imageCount - 3}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const ReplyImages = ({ images }) => {
    if (!images || images.length === 0) return null;
    const imageCount = images.length;
    const displayCount = imageCount > 4 ? 3 : imageCount;

    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        {images.slice(0, displayCount).map((image, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={image.url}
              alt={`Reply image ${index + 1}`}
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
            />
            {imageCount > 4 && index === 2 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  +{imageCount - 3}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const handleEmojiClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenEmojiPicker((prev) => !prev);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
    setOpenEmojiPicker(false);
  };

  const handleReplyEmojiClick = (event) => {
    setReplyAnchorEl(event.currentTarget);
    setOpenReplyEmojiPicker((prev) => !prev);
  };

  const handleReplyEmojiClose = () => {
    setReplyAnchorEl(null);
    setOpenReplyEmojiPicker(false);
  };

  const handleTextFieldResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleBackdropClick = (event, reason) => {
    if (reason === 'backdropClick') {
      onClose();
    }
  };

  return (
    <Dialog
      open={true}
      onClose={handleBackdropClick}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Bài viết của {postData.author.name}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.05)', borderRadius: 10 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10 },
        }}
      >
        <div ref={modalRef}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              bgcolor: 'rgba(0,0,0,0.01)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={postData?.author?.picture?.url} sx={{ mr: 2, width: 40, height: 40 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{postData.author.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {postData.postTime}
                  {postData.isPublic && <i className="fas fa-globe-asia" style={{ marginLeft: 8 }} />}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.5 }}>{postData.content}</Typography>
            {postData.assets.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {postData.assets
                  .slice(0, postData.assets.length > 4 ? 3 : postData.assets.length)
                  .map((asset, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={asset.url}
                        alt="Post"
                        style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                      />
                      {postData.assets.length > 4 && index === 2 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                          }}
                        >
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                            +{postData.assets.length - 3}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
              </Box>
            )}
          </Paper>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar src={comment.author.picture?.url} sx={{ mr: 1.5, width: 36, height: 36 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {comment.author.name}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{comment.content}</Typography>
                      <CommentImages images={comment.assets} />
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 1 }}>
                      <Button size="small" startIcon={<ThumbUpIcon fontSize="small" />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                        Thích
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ReplyIcon fontSize="small" />}
                        onClick={() => handleReplyStart(comment._id)}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                      >
                        Phản hồi
                      </Button>
                      {user._id === comment.author._id && (
                        <Button
                          size="small"
                          onClick={() => handleDeleteComment(comment._id)}
                          sx={{ textTransform: 'none', color: 'error.main' }}
                        >
                          Xóa
                        </Button>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {comment.time}
                      </Typography>
                    </Box>

                    {comment.replyCount > 0 && (
                      <Button
                        size="small"
                        onClick={() => toggleReplies(comment._id)}
                        sx={{ mt: 1, ml: 1, color: 'primary.main', textTransform: 'none', fontWeight: 500 }}
                      >
                        {showReplies[comment._id] ? 'Ẩn phản hồi' : `Xem ${comment.replyCount} phản hồi`}
                      </Button>
                    )}

                    {replyingTo === comment._id && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                        <Avatar src={user.picture?.url} sx={{ mr: 1.5, width: 32, height: 32 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Phản hồi ${comment.author.name}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            inputRef={replyInputRef}
                            onInput={handleTextFieldResize}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: 'rgba(0,0,0,0.03)',
                                paddingRight: '40px',
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton size="small" onClick={handleReplyEmojiClick}>
                                    <SentimentSatisfiedAltIcon fontSize="small" />
                                  </IconButton>
                                  <Popper
                                    open={openReplyEmojiPicker}
                                    anchorEl={replyAnchorEl}
                                    placement="bottom-end"
                                    sx={{ zIndex: 2000 }}
                                  >
                                    <ClickAwayListener onClickAway={handleReplyEmojiClose}>
                                      <EmojiPicker
                                        inputRef={replyInputRef}
                                        setCommentText={setReplyText}
                                        isOpen={openReplyEmojiPicker}
                                        onClose={handleReplyEmojiClose}
                                        zIndex={2000}
                                      />
                                    </ClickAwayListener>
                                  </Popper>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button onClick={handleReplyCancel} sx={{ mr: 1, textTransform: 'none' }} size="small">
                              Hủy
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleReplySubmit(comment._id)}
                              disabled={!replyText.trim()}
                              size="small"
                              sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
                            >
                              Phản hồi
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Collapse in={showReplies[comment._id]}>
                      <Box sx={{ mt: 2, pl: 3 }}>
                        {showReplies[comment._id]?.map((reply) => (
                          <Box key={reply._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Avatar src={reply.author.picture?.url} sx={{ mr: 1.5, width: 28, height: 28 }} />
                            <Box>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  borderRadius: 3,
                                  bgcolor: 'rgba(0,0,0,0.03)',
                                  border: '1px solid rgba(0,0,0,0.04)',
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {reply.author.name}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{reply.content}</Typography>
                                <ReplyImages images={reply.assets} />
                              </Paper>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, ml: 1 }}>
                                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', minWidth: 'auto', fontSize: '0.75rem' }}>
                                  Thích
                                </Button>
                                <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', minWidth: 'auto', fontSize: '0.75rem' }}>
                                  Phản hồi
                                </Button>
                                <Typography variant="caption" color="text.secondary">
                                  {reply.time}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                </Box>
                <Divider sx={{ my: 1, opacity: 0.6 }} />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: 'background.paper',
              p: 2,
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar src={user.picture?.url} sx={{ width: 40, height: 40 }} />
              <form onSubmit={handleCommentSubmit} style={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={5}
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onInput={handleTextFieldResize}
                  autoFocus
                  inputRef={commentInputRef}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      paddingRight: 1,
                      '& textarea': { overflow: 'hidden !important', resize: 'none' },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <IconButton size="small"><ImageIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><CameraIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><NoteIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={handleEmojiClick}>
                            <SentimentSatisfiedAltIcon fontSize="small" />
                          </IconButton>
                          <Popper
                            open={openEmojiPicker}
                            anchorEl={anchorEl}
                            placement="bottom-end"
                            sx={{ zIndex: 2000 }}
                          >
                            <ClickAwayListener onClickAway={handleEmojiClose}>
                              <EmojiPicker
                                inputRef={commentInputRef}
                                setCommentText={setCommentText}
                                isOpen={openEmojiPicker}
                                onClose={handleEmojiClose}
                                zIndex={2000}
                              />
                            </ClickAwayListener>
                          </Popper>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={!commentText.trim()}
                            endIcon={<SendIcon fontSize="small" />}
                            sx={{ borderRadius: 2, textTransform: 'none', px: 2, py: 0.5, fontSize: '0.875rem' }}
                          >
                            Bình luận
                          </Button>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;