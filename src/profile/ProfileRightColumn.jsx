import  { useState, useRef } from 'react';

import PersonalInfo from './PersonalInfo';
import PostCreationForm from './PostCreationForm';
import PostComponent from './PostComponent';
import Feed from '../components/Feeds';
import {createPost} from '../api/postAPI';

const ProfileRightColumn = ({ user, activeTab, posts, setPosts, isLoading, isOwnProfile }) => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState([]);
    const fileInputRef = useRef(null);
    
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const currentUserId = currentUser._id;
  
    const handleNewPost = async () => {
      if (!postContent.trim() && postImages.length === 0) return;
      
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('authorId', currentUserId);
      postImages.forEach((image) => formData.append('files', image.file));
  
      try {
        const newPostData = await createPost(formData);
        if (newPostData) setPosts(prev => [newPostData, ...prev]);
        setShowPostForm(false);
        setPostContent('');
        setPostImages([]);
      } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
      }
    };
  
    return (
      <div className='profile-right-column'>
        {activeTab === 'about' && <PersonalInfo user={user} />}
        
        {showPostForm && (
          <PostCreationForm 
            user={user}
            postContent={postContent}
            setPostContent={setPostContent}
            postImages={postImages}
            setPostImages={setPostImages}
            fileInputRef={fileInputRef}
            handleNewPost={handleNewPost}
            closePostForm={() => setShowPostForm(false)}
          />
        )}
        
        {activeTab === 'posts' && (
          <div className='posts-container'>
            {isOwnProfile }
            {isLoading ? (
              <div className='loading-indicator'></div>
            ) : posts.length > 0 ? (
              posts.map(post => <PostComponent key={post._id} post={post} />)
            ) : (
              <div className='no-posts-message'>Không có bài viết nào để hiển thị.</div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default ProfileRightColumn;
  