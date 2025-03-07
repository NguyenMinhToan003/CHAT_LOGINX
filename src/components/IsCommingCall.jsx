
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import "./IsCommingCall.css"; // Import file CSS
import audio from '../../public/sound/zalo-calling.mp3';
import { useEffect, useRef } from "react";

const IsCommingCall = ({ handleAcceptCall, handleHangup, onCommingCall }) => {
  const audioRef = useRef(null);
  useEffect(() => {
    if (onCommingCall?.isRinging) {
      audioRef.current.play();
    }
    else {
      audioRef.current.pause();
    }
  },[onCommingCall])
  return (
    <>
      <audio ref={audioRef} src={audio} loop />
       <div className="call-overlay">
      <div className="call-container">
        {/* Ảnh đại diện */}
        <div className="call-avatar">
          <img src={onCommingCall?.sender.picture} alt="caller avatar" />
        </div>

        {/* Tên người gọi */}
        <p className="call-text">{onCommingCall?.sender.name} đang gọi...</p>

        {/* Nút Accept & Decline */}
        <div className="call-buttons">
          <button className="accept-btn" onClick={handleAcceptCall}>
            <IoIosCall size={22} /> Chấp nhận
          </button>
          <button className="decline-btn" onClick={handleHangup}>
            <MdCallEnd size={22} /> Từ chối
          </button>
        </div>
      </div>
    </div>
   </>
  );
};

export default IsCommingCall;
