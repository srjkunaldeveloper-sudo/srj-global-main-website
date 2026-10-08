import React from 'react';
import { Plus } from 'lucide-react';

export default function BlogForm({
  editBlogId,
  newBlog,
  setNewBlog,
  onSubmit,
  onCancelEdit
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editBlogId ? 'Edit Blog Post' : 'New Blog Post'}
        </h3>
        {editBlogId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Title
          </label>
          <input
            type="text"
            required
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            placeholder="Latest tech developments"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <input
            type="text"
            required
            value={newBlog.category}
            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
            placeholder="Technology"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Type of Blog
          </label>
          <select
            value={newBlog.type}
            onChange={(e) => setNewBlog({ ...newBlog, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value="Fresh Perspectives">Fresh Perspectives</option>
            <option value="Editor's Pick">Editor's Pick</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Author Name
          </label>
          <input
            type="text"
            value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Blog Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewBlog({ ...newBlog, image: e.target.files[0] })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          />
          {typeof newBlog.image === 'string' && newBlog.image && (
            <p className="text-xs text-slate-500 mt-2">
              Current Image:{' '}
              <a href={newBlog.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                View
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            required
            value={newBlog.description}
            rows={3}
            onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
            placeholder="Short summary of the blog..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Content (Markdown/HTML supported)
          </label>
          <textarea
            required
            value={newBlog.content}
            rows={6}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            placeholder="Detailed body content of the blog..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer shadow-md"
        >
          {editBlogId ? 'Update Post' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
