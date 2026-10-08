import React from 'react';
import { Trash2 } from 'lucide-react';

export default function BlogList({ blogs = [], onEditBlog, onDeleteBlog }) {
  return (
    <div className="xl:col-span-2 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Active Blog Posts ({blogs.length})</h3>
      {blogs.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          No blog posts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-start gap-4"
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {b.category}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-3">{b.title}</h4>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{b.description}</p>
                <div className="flex items-center gap-2 mt-3 text-slate-400 text-xs">
                  <span className="font-bold text-slate-600">By {b.author || 'Admin'}</span>
                  <span>•</span>
                  <span>Published on: {new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditBlog(b)}
                  className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteBlog(b.id)}
                  className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
