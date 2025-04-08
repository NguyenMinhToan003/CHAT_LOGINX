import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, getPostByAuthorId } from '../api/postAPI';
import { getUserById } from '../api/userAPI';
import Post from './Post';
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with ID:", postId);
        setIsLoading(true);

        const postData = await getPostById(postId);
        console.log("Post data from getPostById:", postData);

        if (!postData || !postData._id) {
          throw new Error('Dữ liệu bài viết không hợp lệ');
        }

        const authorId = postData.authorId || postData.author?._id;
        if (!authorId) {
          throw new Error('Không tìm thấy authorId trong dữ liệu bài viết');
        }

        const authorData = await getUserById(authorId);
        console.log("Author data:", authorData);

        if (!authorData) {
          throw new Error('Không tìm thấy thông tin tác giả');
        }

        const postsByAuthor = await getPostByAuthorId({ authorId, userId: user?._id });
        console.log("Posts by author:", postsByAuthor);

        const specificPost = Array.isArray(postsByAuthor)
          ? postsByAuthor.find((p) => p._id === postId)
          : postsByAuthor;

        if (!specificPost) {
          throw new Error('Không tìm thấy bài viết trong danh sách của tác giả');
        }

        const formattedPost = {
          ...specificPost,
          author: {
            _id: authorId,
            name: authorData.name || 'Unknown Author',
            picture: { url: authorData.picture?.url || 'default-avatar.jpg' },
          },
          interactions: specificPost.interactions || {
            likes: 0,
            hahas: 0,
            hearts: 0,
            wows: 0,
            sads: 0,
            angrys: 0,
            userAction: null,
          },
          createdAt: specificPost.createdAt || new Date().toISOString(),
          comments: specificPost.comments || 0,
        };

        console.log("Formatted post:", formattedPost);
        setPost(formattedPost);
        setDebug({ postId, data: formattedPost });
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setDebug({ postId, error: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (postId && user?._id) {
      fetchPost();
    } else {
      setError("Thiếu thông tin bài viết hoặc người dùng");
      setIsLoading(false);
    }
  }, [postId, user?._id]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Đang tải bài viết...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
          <Alert severity="error">
            <AlertTitle>Lỗi</AlertTitle>
            {error}
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Debug info: {JSON.stringify(debug)}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
          <Alert severity="warning">
            <AlertTitle>Cảnh báo</AlertTitle>
            Không tìm thấy bài viết.
          </Alert>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Debug info: {JSON.stringify(debug)}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 800,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Post post={post} />
        <Typography
          variant="caption"
          sx={{ display: 'none', mt: 2, color: 'text.secondary' }}
        >
          Debug info: {JSON.stringify(debug)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SinglePost;