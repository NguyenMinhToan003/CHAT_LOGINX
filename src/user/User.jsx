/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { getAllUser } from '../api'
import { FaGithub, FaTwitter } from 'react-icons/fa' 
import './User.css'
import { useSocket } from '../provider/SocketProvider'

const User = () => {
  const { onlineUsers, handleCallVideo } = useSocket()
  const user = JSON.parse(localStorage.getItem('user'))
  const [allUser, setAllUser] = useState([])

  const fetchUser = async () => {
    const allUserData = await getAllUser()
    setAllUser(allUserData)
  }

  useEffect(() => {
    fetchUser()
  }, [])
  
  const handleLogout = () => {
    
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const getAccountTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'github':
        return <FaGithub className='icon' />
      case 'twitter':
        return <FaTwitter className='icon' />
      default:
        return null
    }
  }

  return (
    <div className='container'>

      {/* Header Section */}
      <header className='header-user'>

        <div className='button-group'>
          <div>
            <h4 className='title'>{user?.name || 'User'}</h4>
            <p className='subtitle'>User ID: {user._id}</p>
          </div>
          <img src={user?.picture} alt='avatar' className='avatar' />
          <a href='/roomchats' className='chat-button'>
            Room Chat
          </a>
          <button className='logout-button' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className='main-content'>
        {/* Video Section - Commented out */}
        {/* Hidden Online Users Section */}
        <div className='users-section'>
          <h3 className='section-title'>Online Users</h3>
          <ul className='user-list'>
            {onlineUsers.map(
              (onlineUser, index) =>
                onlineUser.userId !== user._id && (
                  <li
                    key={index}
                    className='user-item'
                    onClick={() => {
                      handleCallVideo(onlineUser)
                    }}
                  >
                    <img
                      src={onlineUser.picture}
                      alt='avatar'
                      className='avatar'
                    />
                    <span className='user-name'>{onlineUser.name}</span>
                  </li>
                )
            )}
          </ul>
        </div>

        {/* All Users Table */}
        <div className='table-section'>
          <h3 className='section-title'>Danh sách người dùng</h3>
          <div className='table-wrapper'>
            <table className='table'>
              <thead>
                <tr>
                  <th className='table-header'>ID</th>
                  <th className='table-header'>Name</th>
                  <th className='table-header'>Picture</th>
                  <th className='table-header'>Type</th>
                </tr>
              </thead>
              <tbody>
                {allUser.map((user, index) => (
                  <tr key={index} className='table-row'>
                    <td className='table-cell'>{user._id}</td>
                    <td className='table-cell'>{user.name}</td>
                    <td className='table-cell'>
                      <img
                        src={user.picture}
                        alt='avatar'
                        className='table-avatar'
                      />
                    </td>
                    <td className='table-cell'>
                      <div className='type-container'>
                        {getAccountTypeIcon(user.typeAccount)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User