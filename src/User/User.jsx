/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { socket } from "../socket"
import { getDataUser } from "../api"

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [listUsers, setListUsers] = useState([])
  const [onCommingCall, setOnCommingCall] = useState({
    isRinging: false,
    sender: null,
    receiver: null
  })
  const [localStream, setLocalStream] = useState(null)
  const [messagesError, setMessagesError] = useState('')
  const videoRef = useRef(null)


  const fetchUser = async () => {
    const response = await getDataUser(id)
    localStorage.removeItem('user')
    localStorage.setItem('user', JSON.stringify(response))
    setUser(response)
  }
  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    onCommingCall.isRinging && window.confirm(`${onCommingCall.sender.name} is calling you`)
      ? console.log('Accept')
      : console.log('Cancel')
  },[onCommingCall])

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

  // const createPeerConnection = () => {
    
  // }

  const handleCallVideo =async (user) => {

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

  return (
    <div>
      <p>User ID: {id}</p>
      <p>User Name: {user?.name}</p>
      <button><a href='/roomchats'>room chat</a></button>
      {
        messagesError && <strong>{messagesError}</strong>
      }
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
      {
        localStream && 'video'
      }
    </div>
  )
}

export default User
