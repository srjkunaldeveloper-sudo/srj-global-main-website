import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Globe, 
  User, 
  FileText, 
  Check, 
  HelpCircle,
  Eye,
  Tag,
  Clock,
  Layers,
  Image,
  ExternalLink
} from 'lucide-react';

export default function BlogForm({
  editBlogId,
  newBlog,
  setNewBlog,
  onSubmit,
  onCancelEdit
}) {
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'author' | 'seo'
  const [autoSlug, setAutoSlug] = useState(true);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (autoSlug && !editBlogId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setNewBlog({ ...newBlog, title: val, slug: generatedSlug });
    } else {
      setNewBlog({ ...newBlog, title: val });
    }
  };

  const insertSnippet = (snippet) => {
    setNewBlog({
      ...newBlog,
      content: (newBlog.content || '') + '\n' + snippet + '\n'
    });
  };

  const previewSlug = newBlog.slug || (newBlog.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const serpHref = `https://srjglobaltechnologies.com/blog/${previewSlug || (editBlogId || 'new-article')}`;

  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] h-fit sticky top-24">
      
      {/* Header & Mode Badge */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            {editBlogId ? `Edit Article #${editBlogId}` : 'Publish New Article'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full control over reading layout, author card, and SEO/AEO/GEO.
          </p>
        </div>

        {editBlogId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 px-3 py-1 bg-rose-50 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'content'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText size={13} />
          <span>Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('author')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'author'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User size={13} />
          <span>Author & Meta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'seo'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe size={13} />
          <span>SEO & AEO</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        
        {/* ================= TAB 1: ARTICLE CONTENT ================= */}
        {activeTab === 'content' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={newBlog.title}
                onChange={handleTitleChange}
                placeholder="e.g. Scaling Kubernetes Microservices in Production"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Case Studies">Case Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Type / Placement
                </label>
                <select
                  value={newBlog.type}
                  onChange={(e) => setNewBlog({ ...newBlog, type: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Fresh Perspectives">Fresh Perspectives</option>
                  <option value="Editor's Pick">Editor's Pick</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Cover Image (File Upload or Image URL)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewBlog({ ...newBlog, image: e.target.files[0] })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="Or paste external image URL (https://...)"
                value={typeof newBlog.image === 'string' ? newBlog.image : ''}
                onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
              {typeof newBlog.image === 'string' && newBlog.image && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-600">✓ Image Attached</span>
                  <a href={newBlog.image} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                    Preview <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Executive Summary / Description *
              </label>
              <textarea
                required
                value={newBlog.description}
                rows={3}
                onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                placeholder="2-3 sentence overview that appears under the title and in search results..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Article Body (Markdown / HTML) *
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertSnippet('<h2>Subheading Title</h2>\n<p>Explain your concept here...</p>')}
                    className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded transition"
                  >
                    + H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('<div class="article-callout">\n<h4>💡 Pro Tip</h4>\n<p>Key insight here...</p>\n</div>')}
                    className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded transition"
                  >
                    + Callout
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('<blockquote>\n"Engineering quote here"\n</blockquote>')}
                    className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded transition"
                  >
                    + Quote
                  </button>
                </div>
              </div>
              <textarea
                required
                value={newBlog.content}
                rows={9}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                placeholder="Write full article body. Headings (<h2>, <h3>) will automatically build the Table of Contents in the sidebar!"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Key Takeaways (Top Card Points)</span>
                <span className="text-[10px] font-normal text-slate-400">1 point per line</span>
              </label>
              <textarea
                value={newBlog.key_takeaways || ''}
                rows={3}
                onChange={(e) => setNewBlog({ ...newBlog, key_takeaways: e.target.value })}
                placeholder="High-performance architectural blueprint&#10;Zero-trust security recommendations&#10;Production checklist for scale"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: AUTHOR & META ================= */}
        {activeTab === 'author' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={newBlog.author || ''}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                placeholder="e.g. Arjun Mehta"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Author Role / Title
              </label>
              <input
                type="text"
                value={newBlog.author_role || ''}
                onChange={(e) => setNewBlog({ ...newBlog, author_role: e.target.value })}
                placeholder="e.g. Principal Cloud & AI Architect"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Author Avatar URL
              </label>
              <input
                type="text"
                value={newBlog.author_image || ''}
                onChange={(e) => setNewBlog({ ...newBlog, author_image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Reading Time
                </label>
                <input
                  type="text"
                  value={newBlog.reading_time || ''}
                  onChange={(e) => setNewBlog({ ...newBlog, reading_time: e.target.value })}
                  placeholder="e.g. 8 min read"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Topic Tags
                </label>
                <input
                  type="text"
                  value={newBlog.tags || ''}
                  onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                  placeholder="Node.js, AWS, Scalability"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>URL Slug</span>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] text-blue-600 font-semibold"
                >
                  {autoSlug ? '🔒 Auto Sync (Title)' : '✏️ Custom Slug'}
                </button>
              </label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={newBlog.slug || ''}
                  onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                  placeholder="slug-url-string"
                  disabled={autoSlug && !editBlogId}
                  className="w-full bg-transparent font-mono text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SEO & AEO & GEO ================= */}
        {activeTab === 'seo' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Live Google SERP Card Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Live Google Search Preview
              </span>
              <div className="font-sans text-left">
                <div className="text-[11px] text-emerald-800 truncate font-medium">
                  {serpHref}
                </div>
                <div className="text-sm font-semibold text-blue-700 line-clamp-1 hover:underline cursor-pointer mt-0.5">
                  {newBlog.meta_title || newBlog.title || 'Article Title - SRJ Global Technologies'}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {newBlog.meta_description || newBlog.description || 'Read in-depth enterprise architecture insights and software engineering solutions on the SRJ Global blog.'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={newBlog.meta_title || ''}
                onChange={(e) => setNewBlog({ ...newBlog, meta_title: e.target.value })}
                placeholder={newBlog.title || 'Custom Title for Google / Social'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  SEO Meta Description
                </label>
                <span className={`text-[10px] font-mono ${
                  (newBlog.meta_description || '').length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'
                }`}>
                  {(newBlog.meta_description || '').length} / 160 chars
                </span>
              </div>
              <textarea
                value={newBlog.meta_description || ''}
                rows={3}
                onChange={(e) => setNewBlog({ ...newBlog, meta_description: e.target.value })}
                placeholder={newBlog.description || 'Compelling search description for high CTR...'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Keywords
              </label>
              <input
                type="text"
                value={newBlog.meta_keywords || ''}
                onChange={(e) => setNewBlog({ ...newBlog, meta_keywords: e.target.value })}
                placeholder="microservices architecture, nodejs kubernetes, cloud scalability"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* AEO Engine Direct Answer */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-600" />
                <span>AEO Direct AI Answer (Perplexity / ChatGPT)</span>
              </label>
              <p className="text-[11px] text-blue-700/80 mb-2 leading-relaxed">
                Clear 1-2 sentence direct answer that AI search engines quote in AI Overviews.
              </p>
              <textarea
                value={newBlog.aeo_summary || ''}
                rows={2}
                onChange={(e) => setNewBlog({ ...newBlog, aeo_summary: e.target.value })}
                placeholder="To scale microservices reliably, orchestrate containers with Kubernetes while maintaining decoupled database boundaries and zero-trust mTLS security."
                className="w-full px-3 py-2 text-xs rounded-xl border border-blue-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            {/* AEO FAQ Questions & Answers */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Article FAQ Schema (Format: Q: ... / A: ...)</span>
              </label>
              <textarea
                value={newBlog.aeo_faqs || ''}
                rows={3}
                onChange={(e) => setNewBlog({ ...newBlog, aeo_faqs: e.target.value })}
                placeholder="Q: What is the main benefit of this pattern?&#10;A: It isolates operational failures and enables independent zero-downtime deployments.&#10;&#10;Q: How does SRJ Global assist?&#10;A: We provide end-to-end migration roadmaps and performance tuning."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px] leading-relaxed"
              />
            </div>

          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>{editBlogId ? 'Save & Update Article' : 'Publish Article Live'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
