import { IoIosCall } from 'react-icons/io'
import { MdCallEnd } from 'react-icons/md'
import { useEffect, useRef } from 'react'
import { IoVideocamOutline } from 'react-icons/io5'
import './IsComingCall.css' 
import audio from '~/assets/sound/zalo-calling.mp3'


const IsCommingCall = ({ handleAcceptCall, handleHangup, onCommingCall }) => {
  console.log('onCommingCall', onCommingCall) 
  const audioRef = useRef(null)
  useEffect(() => {
    if (onCommingCall?.isRinging) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [onCommingCall])
  
  return (
    <>
      <audio ref={audioRef} src={audio} loop />
      <div className='video-call-overlay'>
        <div className='video-call-container'>
          <div className='call-type'>
            <IoVideocamOutline />
          </div>
            
          <div className='caller-info'>
            <div className='caller-avatar'>
              <img src={onCommingCall?.sender.picture?.url} alt='caller' />
              <div className='calling-indicator'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <p className='caller-name'>{onCommingCall?.sender?.name}</p>
            <p className='call-status'>đang gọi cho bạn</p>
          </div>
          
          <div className='call-actions'>
            <button className='decline-button' onClick={handleHangup}>
              <MdCallEnd />
              <span>Từ chối</span>
            </button>
            <button className='accept-button' onClick={handleAcceptCall}>
              <IoIosCall />
              <span>Trả lời</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default IsCommingCall