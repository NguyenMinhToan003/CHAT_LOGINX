import { Routes, Route, Navigate } from 'react-router-dom'

import User from '~/pages/user/User'
import RoomChat from '~/pages/roomchat/RoomChat'
import RoomChatId from '~/pages/roomchat/RoomChatId'
import VideoCall from '~/pages/VideoCall/VideoCall'
import Login from '~/pages/auth/Login'
import Index from '~/pages/index/Index'
import Profile from '~/pages/profile/Profile'
import Main from '~/pages/index/Main'
import RoomChatPrivate from '~/pages/roomchat/RoomChatPrivate'
import NotFound from './NotFound'
import Register from '~/pages/auth/Register'
import SearchPage from '~/pages/searchpage/SearchPage'
import SinglePost from '~/components/SinglePost'
import FriendRequestList from '~/pages/notifications/FriendRequestList'

const AppRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const notCheckUser = [
    '/login',
    '/register',
  ]
  if (!user && !notCheckUser.includes(window.location.pathname)) {
    window.location.href = '/login'
  }
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />  
      {/* Các route yêu cầu user phải đăng nhập */}
      {user ? (
        <>
          <Route path='/user' element={<User />} />
          <Route path='/roomchats' element={<RoomChat />} />
          <Route path='/roomchats/:id' element={<RoomChatId />} />
          <Route path='/video-call/:id' element={<VideoCall />} />
          <Route path='/chat-user/:id' element={<RoomChatPrivate />} />
          <Route path='/' element={<Main />}>
            <Route index element={<Index />} />
            <Route path='profile/:id' element={<Profile />} />
            <Route path='profile' element={<Profile />} />
            <Route path='notification' element={<FriendRequestList />} /> 
            <Route path='search' element={<SearchPage />} />
          </Route>
          <Route path='/post/:postId' element={<SinglePost />} />
        </>
      ) : (
        // Nếu user chưa đăng nhập, chuyển hướng về '/'
        <Route path='*' element={<Navigate to='/login' replace />} />
      )}

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
