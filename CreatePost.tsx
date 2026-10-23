import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types.ts/index.ts';
import { LOCAL_POSTS_KEY } from '../types.ts/index.ts';

export const CreatePost = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: { title?: string; body?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề bài viết không được để trống.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Tiêu đề bài viết phải có ít nhất 5 ký tự.';
    }

    if (!body.trim()) {
      newErrors.body = 'Nội dung bài viết không được để trống.';
    } else if (body.trim().length < 10) {
      newErrors.body = 'Nội dung bài viết phải có ít nhất 10 ký tự.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const newPost: Post = {
      id: Date.now(),
      userId: 1,
      title: title.trim(),
      body: body.trim(),
      isLocal: true,
    };

    const stored = localStorage.getItem(LOCAL_POSTS_KEY);
    const existingPosts: Post[] = stored ? JSON.parse(stored) : [];
    const updatedPosts = [newPost, ...existingPosts];

    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(updatedPosts));
    navigate('/');
  };

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <h2>Viết bài mới</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề bài viết (*)</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề (tối thiểu 5 ký tự)..."
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="body">Nội dung bài viết (*)</label>
            <textarea
              id="body"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nhập nội dung bài viết (tối thiểu 10 ký tự)..."
            />
            {errors.body && <span className="field-error">{errors.body}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Đăng bài viết
          </button>
        </form>
      </div>
    </div>
  );
};