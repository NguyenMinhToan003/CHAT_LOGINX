import React from 'react';

const PostCreationForm = ({
  user,
  postContent,
  setPostContent,
  postImages,
  setPostImages,
  fileInputRef,
  handleNewPost,
  closePostForm,
}) => {
  const getProfilePicture = () =>
    user?.picture?.url || 'https://24hstore.vn/upload_images/images/hinh-nen-chibi/hinh-nen-chibi-dep.jpg';

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({ file, preview: URL.createObjectURL(file) }));
    setPostImages(prev => [...prev, ...newImages]);
  };

  return (
    <>
      <div className='modal-overlay' onClick={closePostForm}></div>
      <div className='post-creation-form'>
        <h3>Tạo bài viết</h3>
        <button className='close-button' onClick={closePostForm}><i className='fas fa-times'></i></button>
        <textarea
          placeholder={`${user.name || 'Bạn'} ơi, bạn đang nghĩ gì thế?`}
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        ></textarea>
        {postImages.map((image, index) => (
          <div key={index}>
            <img src={image.preview} alt='Preview' />
            <button onClick={() => setPostImages(prev => prev.filter((_, i) => i !== index))}>
              <i className='fas fa-times'></i>
            </button>
          </div>
        ))}
        <button onClick={() => fileInputRef.current.click()}><i className='fas fa-image'></i></button>
        <input
          type='file'
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept='image/*'
          onChange={handleFileSelect}
        />
        <button onClick={handleNewPost} disabled={!postContent.trim() && postImages.length === 0}>
          Đăng
        </button>
      </div>
    </>
  );
};

export default PostCreationForm;