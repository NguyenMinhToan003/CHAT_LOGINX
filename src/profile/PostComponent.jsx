import { useState, useEffect } from 'react';
import Post from '../components/Post'; // Giả sử Post nằm cùng thư mục hoặc bạn cần điều chỉnh đường dẫn

const PostComponent = ({ post, onDelete, onUpdate }) => {
  // Không cần định nghĩa lại các state hay logic vì Post đã xử lý hết
  return (
    <Post
      post={post}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );
};

export default PostComponent;