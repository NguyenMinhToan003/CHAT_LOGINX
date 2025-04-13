import { useEffect, useState } from "react";
import FeedHeader from "./FeedHeader";
import Post from "./Post";
import { getPosts, searchPost } from "~/api/postAPI";
import {
  CircularProgress,
  TextField,
  Box,
  Typography,
  Button,
  Fade,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import { Search as SearchIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const Feeds = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isChange, setIsChange] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Hàm lấy danh sách bài viết từ server
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPosts(user._id);
      setPosts(res);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy danh sách bài viết khi component mount hoặc khi isChange thay đổi
  useEffect(() => {
    if (!isSearching) {
      fetchPosts();
    }
  }, [isChange, isSearching]);

  // Hàm xử lý khi đăng bài viết mới
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Hàm xử lý khi xóa bài viết
  const handlePostDelete = (postId) => {
    if (isSearching) {
      setSearchResults((prevResults) => prevResults.filter((post) => post._id !== postId));
    } else {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setIsChange(true);
    }
  };

  // Hàm xử lý khi cập nhật bài viết
  const handlePostUpdate = (updatedPost) => {
    if (isSearching) {
      setSearchResults((prevResults) =>
        prevResults.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    } else {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const result = await searchPost(searchQuery);
      setSearchResults(result);
    } catch (err) {
      setError("Không thể tìm kiếm bài viết. Vui lòng thử lại!");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Hàm quay lại danh sách bài viết mặc định
  const handleBackToFeed = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  return (
    <div className="feed">
      {/* Thanh tìm kiếm */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5, // Giảm khoảng cách giữa các phần tử
          mb: 3,
          alignItems: "center",
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          p: 1.5,
          borderRadius: "16px",
          boxShadow: `0 4px 12px ${alpha(theme.palette.grey[300], 0.2)}`,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: `0 6px 16px ${alpha(theme.palette.grey[400], 0.3)}`,
          },
        }}
      >
        {isSearching && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToFeed}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "14px", // Đồng bộ kích thước chữ
              fontWeight: 500,
              height: "48px", // Đặt chiều cao cố định để căn hàng
              px: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            Quay lại
          </Button>
        )}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.grey[500], fontSize: "20px" }} /> {/* Thu nhỏ icon */}
              </InputAdornment>
            ),
            sx: {
              borderRadius: "12px",
              backgroundColor: theme.palette.grey[100],
              height: "48px", // Đặt chiều cao cố định để căn hàng
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.grey[400],
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.grey[600],
              },
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.grey[200],
              },
              "& .MuiInputBase-input": {
                fontSize: "14px", // Đồng bộ kích thước chữ
                padding: "12px 14px", // Điều chỉnh padding để căn giữa
              },
            },
          }}
          sx={{
            "& .MuiInputLabel-outlined": {
              color: theme.palette.grey[600],
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon sx={{ fontSize: "20px" }} />} // Thu nhỏ icon
          onClick={handleSearch}
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "14px", // Đồng bộ kích thước chữ
            fontWeight: 500,
            height: "48px", // Đặt chiều cao cố định để căn hàng
            px: 3,
            backgroundColor: theme.palette.grey[500], // Màu xám cho nút
            color: "white",
            transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.grey[600],
              transform: "scale(1.02)",
            },
            "&:disabled": {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Phần đăng bài */}
      <FeedHeader setIsChange={setIsChange} onPostCreated={handlePostCreated} />

      {/* Hiển thị danh sách bài viết */}
      <div className="posts-container">
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={50} />
          </Box>
        ) : error ? (
          <Typography
            color="error"
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "medium",
            }}
          >
            {error}
          </Typography>
        ) : isSearching && searchResults.length === 0 ? (
          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: "1.1rem",
              color: theme.palette.text.secondary,
            }}
          >
            Không tìm thấy bài viết nào phù hợp với "{searchQuery}".
          </Typography>
        ) : (
          <Fade in={true} timeout={800}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(isSearching ? searchResults : posts).map((post) => (
                <Box
                  key={post._id}
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.grey[400], 0.15)}`,
                    },
                  }}
                >
                  <Post
                    post={post}
                    onDelete={handlePostDelete}
                    onUpdate={handlePostUpdate}
                  />
                </Box>
              ))}
            </Box>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default Feeds;