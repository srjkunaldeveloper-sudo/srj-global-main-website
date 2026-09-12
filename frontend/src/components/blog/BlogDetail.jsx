import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import SEO from '../SEO';
import { blogArticles, editorPicks } from '../../data/blogData';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        if (response.data && response.data.id) {
          setBlog(response.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API blog fetch failed, checking static fallback:", err);
      }

      // Static fallback check for supported user-facing articles
      const fallbackItem = blogArticles.find(a => String(a.id) === String(id) || a.slug === id) ||
                           editorPicks.find(a => String(a.id) === String(id) || a.slug === id);
      if (fallbackItem) {
        setBlog({
          id: fallbackItem.id,
          title: fallbackItem.title,
          category: fallbackItem.category,
          author: fallbackItem.author || "SRJ Global Technologies",
          image: fallbackItem.coverImage || fallbackItem.image,
          description: fallbackItem.description,
          content: fallbackItem.content || `<p className="lead">${fallbackItem.description}</p><p>Building modern scalable enterprise solutions requires deep architectural planning, robust performance tuning, and continuous integration. At SRJ Global Technologies, our engineering teams focus on delivering clean, maintainable codebases that drive long-term digital growth.</p><p>Explore more technical insights and engineering perspectives from SRJ Global Technologies on our main blog page.</p>`,
          created_at: fallbackItem.publishedDate || new Date().toISOString()
        });
        setError(null);
      } else {
        setError("Blog post not found");
      }
      setLoading(false);
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        let apiBlogs = [];
        try {
          const res = await axios.get(`${API_BASE_URL}/blogs`);
          if (Array.isArray(res.data)) {
            apiBlogs = res.data.map(b => ({
              ...b,
              coverImage: b.image,
              publishedDate: b.created_at
            }));
          }
        } catch (e) {
          console.warn("Could not fetch API blogs for related articles:", e);
        }

        const merged = [...apiBlogs, ...blogArticles];
        const candidates = merged.filter(a => String(a.id) !== String(id) && a.slug !== id);
        const uniqueCandidates = Array.from(new Map(candidates.map(item => [item.id || item.title, item])).values());

        const sameCat = uniqueCandidates.filter(a =>
          (a.category || '').toLowerCase() === (blog?.category || '').toLowerCase()
        );
        const otherCats = uniqueCandidates.filter(a =>
          (a.category || '').toLowerCase() !== (blog?.category || '').toLowerCase()
        );

        const finalRelated = [...sameCat, ...otherCats].slice(0, 3);
        setRelatedArticles(finalRelated);
      } catch (err) {
        console.error("Error assembling related articles:", err);
      }
    };

    if (blog) {
      fetchRelated();
    }
  }, [blog, id]);

  const calculateReadingTime = (content) => {
    if (!content) return "1 min read";
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

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

  const readingTimeText = calculateReadingTime(blog.content);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <SEO 
        title={blog.title}
        description={blog.description || `Read ${blog.title} on the SRJ Global Technologies blog.`}
        image={blog.image}
        url={`https://srjglobaltechnology.com/blog/${id}`}
        isArticle={true}
        articleData={{
          title: blog.title,
          datePublished: blog.created_at || new Date().toISOString()
        }}
        extraSchema={{
          "@type": "BlogPosting",
          "headline": blog.title,
          "description": blog.description || `Read ${blog.title} on the SRJ Global Technologies blog.`,
          "image": blog.image ? [blog.image] : ["https://srjglobaltechnology.com/og-image.png"],
          "author": {
            "@type": "Person",
            "name": blog.author || "SRJ Global Technologies"
          },
          "datePublished": blog.created_at || new Date().toISOString(),
          "dateModified": blog.updated_at || blog.created_at || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://srjglobaltechnology.com/blog/${id}`
          }
        }}
      />

      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-10 transition-colors cursor-pointer"
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
                  <span>{readingTimeText}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight text-slate-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </motion.article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="mb-8">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Recommended Reads</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Related Articles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => {
                const relDate = rel.publishedDate || rel.created_at 
                  ? new Date(rel.publishedDate || rel.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '';
                const relImg = rel.coverImage || rel.image || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070";

                return (
                  <motion.div
                    key={rel.id || rel.title}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      navigate(`/blog/${rel.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                      <img 
                        src={relImg} 
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      {rel.category && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
                          {rel.category}
                        </span>
                      )}
                      <h4 className="text-base font-bold text-slate-900 line-clamp-2 mb-3 hover:text-blue-600 transition-colors leading-snug">
                        {rel.title}
                      </h4>
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>{rel.author || "SRJ Global"}</span>
                        <span>{relDate}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

