/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { socket } from "../socket"
import { getDataUser, getAllUser } from "../api"
import IsCommingCall from "../router/components/IsCommingCall"

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [listUsers, setListUsers] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const videoRef = useRef(null)
  
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null
  })
  const [allUser, setAllUser] = useState([])


  const fetchUser = async () => {
    const response = await getDataUser(id)
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(response))
    const allUser = await getAllUser()
    setAllUser(allUser)
    setUser(response)
  }
  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(()=>{

    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream
    }
  },[localStream])



  const handleAcceptCall = async () => {
    setOnCommingCall((prev) => {
      return {
        ...prev,
        isRinging: false
      }
    })
    await getMediaStream()
  }
  const handleHangup = async ()=>{
    setOnCommingCall((prev) => {
      return {
        ...prev,
        isRinging: false
      }
    })
  }
  useEffect(() => {
    socket.on('getListUsers', (data) => {
      setListUsers(data)
    })
    socket.on('inCommingCall', (data) => {
      setOnCommingCall(data)
    })
    return () => {
      socket.off('getListUsers')
      socket.off('inCommingCall')
    }
  }, [socket])

  const getMediaStream = async (facingMode) => {
    if(localStream) return localStream
    try {
      // const devices = await navigator.mediaDevices.enumerateDevices()
      // const videoDevice = devices.filter(device => device.kind === 'videoinput')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
        
      })
      console.log('stream:', stream)
      setLocalStream(stream)
      return stream
    }
    catch (error) {
      console.error('Error getting user media:', error)
    }
  }

  const handleCallVideo =async (userReciver) => {
    const onCommingCallData =  {
      receiver: userReciver,
      sender: {
        userId: id,
        name: user.name,
        picture: user.picture
      },
      isRinging: true
    }
    const stream = await getMediaStream()
    if (!stream) {
      console.log('Stream is not available')
      return
    }
    socket.emit('callVideo', onCommingCallData)
  }
 



  return (
    <div>
      {
        onCommingCall.isRinging && <IsCommingCall handleAcceptCall={handleAcceptCall} handleHangup={handleHangup} onCommingCall={onCommingCall} />
      }
      <p>User ID: {id}</p>
      <p>User Name: {user?.name}</p>
      <button><a href='/roomchats'>room chat</a></button>
      {
        listUsers.map((user, index) => {
          if(user.userId !== id) {
            return (
               <li key={index} style={{ display: 'flex', alignItems: 'center', gap:'10px' , margin:'10px'}} onClick={()=>{handleCallVideo(user)}}>
            <div style={{ width:'50px', height:'50px'}}>  
              <img src={user.picture} alt="avatar" style={{ borderRadius: "50%" ,width:'100%', height:'100%'}}/>
            </div>
            <p>{user.name}</p>
          </li>
            )
          }
        })
      }

        <table>
        {
          allUser.length > 0 && allUser.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.picture}</td>
                <td>{user.typeAccount}</td>
              </tr>
            )
        })
           }
       </table>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  )
}

export default User
