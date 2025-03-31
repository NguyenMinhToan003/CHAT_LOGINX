import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyToken } from '../api';
import './Login.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setError("Không tìm thấy token!");
        setLoading(false);
        return;
      }

      try {
        const user = await verifyToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/index'; // Chuyển hướng về trang chính sau khi xác thực thành công
      } catch (err) {
        setError("Xác thực thất bại! Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang đăng nhập...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Quay về trang chủ</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
