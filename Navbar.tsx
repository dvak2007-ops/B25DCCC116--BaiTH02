import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MiniBlog
        </Link>

        <nav className="navbar-links">
          <Link to="/" className="nav-link">Trang chủ</Link>
          
          {isAuthenticated && (
            <Link to="/create" className="nav-link nav-highlight">
              + Viết bài mới
            </Link>
          )}

          {isAuthenticated ? (
            <div className="auth-info">
              <span className="user-badge">Xin chào, <strong>admin</strong></span>
              <button onClick={handleLogout} className="btn btn-logout">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};