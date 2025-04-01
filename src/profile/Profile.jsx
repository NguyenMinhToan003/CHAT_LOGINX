import { useEffect, useState } from 'react';
import './personal.css';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileNav from './ProfileNav';
import ProfileLeftColumn from './ProfileLeftColumn';
import ProfileRightColumn from './ProfileRightColumn';
import { getUserById, getPostByAuthorId } from '../api/userAPI';

const Profile = () => {
  const { id } = useParams();
  const localUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState(localUser);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [currentUser, setCurrentUser] = useState(localUser);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userId = id || localUser._id;
      if (!userId) throw new Error('No userId available');

      // Check if we're looking at our own profile or someone else's
      const isOwn = !id || id === localUser._id;
      setIsOwnProfile(isOwn);
      
      // If we're viewing someone else's profile, set currentUser as local user
      // and profile user as the fetched user
      if (!isOwn) {
        setCurrentUser(localUser);
        const profileUserData = await getUserById(userId);
        setUser(profileUserData);
      } else {
        // If it's our own profile, update both current user and profile user
        const userData = await getUserById(userId);
        setUser(userData);
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Sync localStorage
      }
      
      const postsData = await getPostByAuthorId({ authorId: userId, userId: localUser._id });
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, localUser._id]);

  return (
    <div className='profile-page profile-fix'>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <ProfileHeader 
            user={user} 
            onProfileUpdate={fetchData} 
            isOwnProfile={isOwnProfile}
            currentUser={currentUser}
          />
          <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className='profile-content'>
            <ProfileLeftColumn user={user} setActiveTab={setActiveTab} />
            <ProfileRightColumn
              user={user}
              activeTab={activeTab}
              posts={posts}
              setPosts={setPosts}
              setUser={setUser}
              isOwnProfile={isOwnProfile}
              currentUser={currentUser}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;