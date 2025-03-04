import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import './Home.css'; 

const Home = () => {
  const host = 'https://loginx.onrender.com/api';

  const loginWithGithub = async () => {
    try {
      window.location.href = `${host}/auth/github`;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const loginWithX = async () => {
    try {
      window.location.href = `${host}/auth/twitter`;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
   
    <div className="login-container">
      
      <div className="social-login">
        
        <div className="button-group">
          <button className="social-btn github-btn" onClick={loginWithGithub}>
            <FaGithub/>
          </button>
          <button className="social-btn twitter-btn" onClick={loginWithX}>
            <FaXTwitter />
          </button>
        </div>
      </div>
    </div>

  );
};

export default Home;