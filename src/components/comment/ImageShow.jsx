import { useState } from 'react';
import './ImageShow.css';

const ImageSlideshow = ({ images, isReply = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const containerClass = isReply ? 'reply-slideshow-container' : 'comment-slideshow-container';
  
  const openSlideshow = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSlideshow = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Grid display of images in the comment/reply
  const imageCount = images.length;
  let className = `${isReply ? 'reply' : 'comment'}-image-container image-count-${imageCount > 4 ? 'more' : imageCount}`;

  return (
    <>
      <div className={className}>
        {images.slice(0, imageCount > 4 ? 3 : imageCount).map((image, index) => (
          <div 
            key={index} 
            className={`${isReply ? 'reply' : 'comment'}-image`}
            onClick={() => openSlideshow(index)}
          >
            <img src={image.url} alt={`${isReply ? 'Reply' : 'Comment'} image ${index + 1}`} />
            {imageCount > 4 && index === 2 && (
              <div className="more-images-overlay">
                +{imageCount - 3}
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="slideshow-overlay" onClick={closeSlideshow}>
          <div className={containerClass} onClick={(e) => e.stopPropagation()}>
            <button className="close-slideshow" onClick={closeSlideshow}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="slideshow-content">
              <button className="nav-button prev-button" onClick={goToPrevious}>
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="slideshow-image-container">
                <img 
                  src={images[currentIndex].url} 
                  alt={`Slideshow image ${currentIndex + 1}`} 
                />
              </div>
              
              <button className="nav-button next-button" onClick={goToNext}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="slideshow-footer">
              <div className="image-counter">
                {currentIndex + 1} / {images.length}
              </div>
              
              <div className="thumbnail-container">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSlideshow;