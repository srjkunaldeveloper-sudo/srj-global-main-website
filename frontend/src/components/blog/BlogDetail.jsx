import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import SEO from '../SEO';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Could not load blog post.");
        setLoading(false);
      }
    };
    
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || "Blog post not found"}</h2>
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Blog
        </button>
      </div>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <SEO 
        title={blog.title}
        description={blog.description || `Read ${blog.title} on the SRJ Global Technologies blog.`}
        image={blog.image}
        url={`https://srjglobaltechnology.com/blog/${id}`}
      />

      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-10 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          {blog.image && (
            <div className="w-full h-[400px] sm:h-[500px] relative">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-16">
            <div className="mb-8">
              {blog.category && (
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 mb-6">
                  {blog.category}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium border-b border-slate-100 pb-8">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.author || "SRJ Global Technologies"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight text-slate-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
