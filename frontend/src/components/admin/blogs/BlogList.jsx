import React, { useState } from 'react';
import { 
  Trash2, 
  ExternalLink, 
  Edit3, 
  Eye, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  Tag, 
  Calendar, 
  User, 
  Clock, 
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function BlogList({ blogs = [], onEditBlog, onDeleteBlog }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  // Filtered blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (b.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (blog) => {
    const publicUrl = `${window.location.origin}/blog/${blog.id || blog.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedId(blog.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewArticle = (blog) => {
    const targetUrl = `/blog/${blog.id || blog.slug}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="xl:col-span-2 space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              Published Blog Articles
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {blogs.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your articles, preview live reading pages, and verify SEO/AEO metadata.
          </p>
        </div>

        {/* Global Hub Quick Link */}
        <a
          href="/blog"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm flex-shrink-0"
        >
          <BookOpen size={14} />
          <span>Open Public Blog Hub</span>
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs by title, summary, or author..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {categories.length > 2 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Article Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
          <BookOpen size={36} className="mx-auto mb-3 opacity-40 text-slate-300" />
          <h4 className="font-bold text-slate-700 mb-1">No articles found</h4>
          <p className="text-xs">
            {searchQuery ? 'Try adjusting your search terms or filters.' : 'Use the form on the left to publish your first article.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((b) => {
            const liveUrl = `/blog/${b.id || b.slug}`;
            const isCopied = copiedId === b.id;
            const hasAeo = !!(b.aeo_summary || b.aeo_faqs);
            const hasSeo = !!(b.meta_title || b.meta_description);

            return (
              <div
                key={b.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-blue-200/80 transition-all flex flex-col md:flex-row gap-5 items-start justify-between group"
              >
                {/* Thumbnail Preview */}
                <div className="w-full md:w-36 h-28 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-100">
                  {b.image ? (
                    <img 
                      src={b.image} 
                      alt={b.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500">
                      <BookOpen size={24} />
                      <span className="text-[10px] font-bold mt-1">No Cover</span>
                    </div>
                  )}
                  {b.type && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-sm">
                      {b.type === "Editor's Pick" ? "Pick" : "Fresh"}
                    </span>
                  )}
                </div>

                {/* Article Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {b.category || 'General'}
                    </span>

                    {/* SEO & AEO Status Pill */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      hasSeo && hasAeo 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : hasSeo 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <ShieldCheck size={11} />
                      <span>{hasSeo && hasAeo ? 'SEO + AEO + GEO Active' : hasSeo ? 'SEO Active' : 'Default Meta'}</span>
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      ID: #{b.id}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {b.title}
                  </h4>

                  <p className="text-slate-500 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                    {b.description || 'No description provided.'}
                  </p>

                  {/* Public Link Bar */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <User size={13} className="text-slate-400" />
                      <span>{b.author || 'SRJ Global'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar size={13} />
                      <span>{new Date(b.created_at).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <code className="text-[11px] text-blue-600 font-mono bg-blue-50/70 px-2 py-0.5 rounded">
                      {liveUrl}
                    </code>
                  </div>
                </div>

                {/* Actions Suite */}
                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  
                  {/* Read Article Live Button */}
                  <button
                    onClick={() => handleViewArticle(b)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                    title="Read published article on the live website"
                  >
                    <Eye size={14} />
                    <span>Read Article</span>
                    <ExternalLink size={12} className="opacity-80" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopyLink(b)}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                      title="Copy Public Link to Clipboard"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditBlog(b)}
                      className="p-2 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                      title="Edit blog post & SEO"
                    >
                      <Edit3 size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteBlog(b.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isCopied && (
                    <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
                      Copied!
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
