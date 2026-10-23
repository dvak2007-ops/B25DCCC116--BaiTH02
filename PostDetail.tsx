import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment } from '../types.ts/index.ts';
import { LOCAL_POSTS_KEY } from '../types.ts/index.ts';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Kiểm tra xem bài viết có nằm trong localStorage không
        const stored = localStorage.getItem(LOCAL_POSTS_KEY);
        const localPosts: Post[] = stored ? JSON.parse(stored) : [];
        const foundLocal = localPosts.find((p) => String(p.id) === id);

        if (foundLocal) {
          setPost(foundLocal);
          setComments([]);
          return;
        }

        // Nếu không phải bài trong localStorage thì gọi API
        const [postRes, commentsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
        ]);

        if (!postRes.ok) {
          throw new Error('Không tìm thấy bài viết hoặc lỗi kết nối máy chủ.');
        }

        const postData: Post = await postRes.json();
        const commentsData: Comment[] = commentsRes.ok ? await commentsRes.json() : [];

        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/" className="back-link">&larr; Quay lại danh sách</Link>

      {loading && <div className="status-box loading">Đang tải chi tiết bài viết...</div>}

      {error && <div className="status-box error">Lỗi: {error}</div>}

      {!loading && !error && post && (
        <div className="post-detail-wrapper">
          <article className="post-detail">
            {post.isLocal && <span className="badge-local">Bài viết của bạn (Local)</span>}
            <h1>{post.title}</h1>
            <p className="post-detail-body">{post.body}</p>
          </article>

          <section className="comments-section">
            <h3>Bình luận ({comments.length})</h3>
            {comments.length === 0 ? (
              <p className="empty-comments">Chưa có bình luận nào cho bài viết này.</p>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <strong>{comment.name}</strong>
                      <span className="comment-email">{comment.email}</span>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};