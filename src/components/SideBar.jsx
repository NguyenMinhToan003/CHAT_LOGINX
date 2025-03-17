
import { NavLink } from 'react-router-dom';
import '../index/index.css'

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h1 className="logo">STU</h1>
      <ul className="menu">
        <NavLink to="/index" exact>
          <li className="active"><i className="fas fa-home"></i> <span>Trang chủ</span></li>
        </NavLink>
        <NavLink to="/explore">
          <li><i className="fas fa-search"></i> <span>Tìm kiếm</span></li>
        </NavLink>
        <NavLink to="/reels">
          <li><i className="fas fa-compass"></i> <span>Khám phá</span></li>
        </NavLink>
        <NavLink to="/inbox">
          <li><i className="fas fa-envelope"></i> <span>Tin nhắn</span></li>
        </NavLink>
        <NavLink to="/roomchats">
          <li><i className="fas fa-envelope"></i> <span>Tin nhắn</span></li>
        </NavLink>
        <NavLink to="/bookmarks">
          <li><i className="fas fa-heart"></i> <span>Thông báo</span> <span className="notification-dot"></span></li>
        </NavLink>

        <NavLink to="/index/profile">
          <li><i className="fas fa-user"></i> <span>Trang cá nhân</span></li>
        </NavLink>
      </ul>
      
    </nav>
  );
};

export default Sidebar;
