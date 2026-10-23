import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    const success = login(username.trim(), password);
    if (success) {
      navigate('/create');
    } else {
      setError('Sai thông tin đăng nhập! (Gợi ý: admin / 123456)');
    }
  };

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <h2>Đăng nhập hệ thống</h2>
        <p className="form-subtitle">Tài khoản thử nghiệm: <strong>admin</strong> / Mật khẩu: <strong>123456</strong></p>

        {error && <div className="status-box error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập admin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập 123456"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};