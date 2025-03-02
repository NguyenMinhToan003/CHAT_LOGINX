/* eslint-disable no-undef */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { socket } from "../socket"
import { getDataUser, getAllUser } from "../api"

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [listUsers, setListUsers] = useState([])
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null
  })
  const [allUser, setAllUser] = useState([])
  const [localStream, setLocalStream] = useState(null)



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

  useEffect(() => {
    onCommingCall.isRinging && window.confirm(`${onCommingCall.sender.name} is calling you`)
      ? handleAcceptCall()
      : handleHangUp()
  },[onCommingCall])

  const handleHangUp = () => {
    console.log('Hang up')
  }
  const handleAcceptCall = async() => {
    setOnCommingCall((prev) => {
      return {
        ...prev,
        isRinging: false
      }
    })
    const stream = await getMediaStream()
    console.log('Accept call:', stream)
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


  const handleCallVideo = async (user) => {
    const stream = await getMediaStream()
    console.log('Call video:', stream)
    socket.emit('callVideo', {
      receiver: user,
      sender: {
        userId: id,
        name: user.name,
        picture: user.picture
      },
      isRinging: true
    })
  }

  const getMediaStream = async () => {
    if (localStream) return localStream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalStream(stream) 
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      const localVideo = document.querySelector('.local-video')
      if (localVideo) {
        localVideo.appendChild(video)
      }
      return stream
    }
    catch (error) {
      console.log('Error when get media stream:', error)
    }
  }

  return (
    <div>
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
      <div className="local-vide"></div>
    </div>
  )
}

export default User
