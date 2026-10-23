import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types.ts/index.ts';
import { LOCAL_POSTS_KEY } from '../types.ts/index.ts';

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`Lỗi kết nối máy chủ (Mã lỗi: ${response.status})`);
        }
        const apiPosts: Post[] = await response.json();

        // Lấy thêm bài viết do người dùng tạo trong localStorage
        const stored = localStorage.getItem(LOCAL_POSTS_KEY);
        const localPosts: Post[] = stored ? JSON.parse(stored) : [];

        // Gộp bài viết mới lên đầu danh sách
        setPosts([...localPosts, ...apiPosts]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải danh sách bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Danh sách bài viết</h1>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết theo tiêu đề..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div className="status-box loading">Đang tải danh sách bài viết...</div>}

      {error && <div className="status-box error">Lỗi: {error}</div>}

      {!loading && !error && (
        <>
          <p className="result-count">
            Hiển thị <strong>{filteredPosts.length}</strong> bài viết
          </p>

          {filteredPosts.length === 0 ? (
            <div className="status-box">Không tìm thấy bài viết nào phù hợp với từ khóa.</div>
          ) : (
            <div className="post-grid">
              {filteredPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-card-header">
                    {post.isLocal && <span className="badge-local">Bài mới (Local)</span>}
                    <h2 className="post-title">
                      <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </h2>
                  </div>
                  <p className="post-excerpt">
                    {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
                  </p>
                  <Link to={`/posts/${post.id}`} className="read-more">
                    Xem chi tiết &rarr;
                  </Link>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};