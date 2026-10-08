import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import BlogForm from './BlogForm';
import BlogList from './BlogList';

const INITIAL_BLOG_STATE = {
  title: '',
  slug: '',
  category: 'Software Development',
  type: 'Fresh Perspectives',
  description: '',
  content: '',
  image: '',
  author: 'SRJ Global Technologies',
  author_role: 'Principal Technical Architect',
  author_image: '',
  reading_time: '8 min read',
  tags: '',
  key_takeaways: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  aeo_summary: '',
  aeo_faqs: ''
};

export default function BlogManager({ onNotify }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newBlog, setNewBlog] = useState(INITIAL_BLOG_STATE);
  const [editBlogId, setEditBlogId] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      setBlogs(Array.isArray(res.data) ? res.data : (res.data?.blogs || []));
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showNotification('error', 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const finalSlug = newBlog.slug?.trim() || newBlog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const payload = {
        ...newBlog,
        slug: finalSlug
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      });

      if (editBlogId) {
        await api.put(`/blogs/${editBlogId}`, formData);
        showNotification('success', 'Article & SEO metadata updated successfully!');
      } else {
        await api.post('/blogs', formData);
        showNotification('success', 'Article published live successfully!');
      }

      setNewBlog(INITIAL_BLOG_STATE);
      setEditBlogId(null);
      fetchBlogs();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleEditBlog = (blog) => {
    setNewBlog({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Software Development',
      type: blog.type || 'Fresh Perspectives',
      description: blog.description || '',
      content: blog.content || '',
      image: blog.image || '',
      author: blog.author || 'SRJ Global Technologies',
      author_role: blog.author_role || 'Principal Technical Architect',
      author_image: blog.author_image || '',
      reading_time: blog.reading_time || '8 min read',
      tags: blog.tags || '',
      key_takeaways: blog.key_takeaways || '',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      aeo_summary: blog.aeo_summary || '',
      aeo_faqs: blog.aeo_faqs || ''
    });
    setEditBlogId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      showNotification('success', 'Blog deleted successfully!');
      fetchBlogs();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleCancelEdit = () => {
    setEditBlogId(null);
    setNewBlog(INITIAL_BLOG_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <BlogForm
          editBlogId={editBlogId}
          newBlog={newBlog}
          setNewBlog={setNewBlog}
          onSubmit={handleCreateBlog}
          onCancelEdit={handleCancelEdit}
        />

        <BlogList
          blogs={blogs}
          onEditBlog={handleEditBlog}
          onDeleteBlog={handleDeleteBlog}
        />
      </div>
    </div>
  );
}
