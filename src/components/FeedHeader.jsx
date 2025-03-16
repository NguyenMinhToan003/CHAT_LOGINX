const FeedHeader = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null
  return <>
    <div className="post-creation-container">
      <div className="post-creation-input">
        <div className="avatar">
          <img src={user?.picture} />
        </div>
        <div className="post-input">
          <input type="text" placeholder={`${user.name} ơi, bạn đang nghĩ gì thế?`} />
        </div>
      </div>
      <div className="post-creation-actions">
        <button className="action-button video-button">
          <i className="fas fa-video"></i> Video trực tiếp
        </button>
        <button className="action-button photo-button">
          <i className="fas fa-image"></i> Ảnh/video
        </button>
        <button className="action-button emotion-button">
          <i className="far fa-smile"></i> Cảm xúc/hoạt động
        </button>
      </div>
    </div>
  </>
}
export default FeedHeader;