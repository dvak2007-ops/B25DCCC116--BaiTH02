import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="page-container not-found">
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
};