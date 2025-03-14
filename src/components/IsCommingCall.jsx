import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { useEffect, useRef } from "react";
import "./IsCommingCall"; // Import CSS file

const IsCommingCall = ({ handleAcceptCall, handleHangup, onCommingCall }) => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (onCommingCall?.isRinging) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [onCommingCall]);
  
  return (
    <>
      <audio ref={audioRef} src="/sounds/call-ringtone.mp3" loop />
      <div className="video-call-overlay">
        <div className="video-call-container">
          <div className="caller-info">
            <div className="caller-avatar">
              <img src={onCommingCall?.sender.picture} alt="caller" />
              <div className="calling-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h2 className="caller-name">{onCommingCall?.sender.name}</h2>
            <p className="call-status">Đang gọi...</p>
          </div>
          
          <div className="call-actions">
            <button className="decline-button" onClick={handleHangup}>
              <MdCallEnd />
              <span>Từ chối</span>
            </button>
            <button className="accept-button" onClick={handleAcceptCall}>
              <IoIosCall />
              <span>Trả lời</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IsCommingCall;