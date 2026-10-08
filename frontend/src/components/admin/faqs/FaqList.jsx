import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

export default function FaqList({
  faqs = [],
  faqSearchQuery,
  setFaqSearchQuery,
  faqCategoryFilter,
  setFaqCategoryFilter,
  onEditFaq,
  onToggleFaq,
  onDeleteFaq
}) {
  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory =
      faqCategoryFilter === 'all'
        ? true
        : faqCategoryFilter === 'custom'
        ? !['General', 'Pricing', 'Blog', 'About', 'Services', 'Careers'].includes(f.category)
        : f.category?.toLowerCase() === faqCategoryFilter.toLowerCase();

    const matchesSearch = !faqSearchQuery.trim()
      ? true
      : (f.question && f.question.toLowerCase().includes(faqSearchQuery.toLowerCase())) ||
        (f.answer && f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())) ||
        (f.category && f.category.toLowerCase().includes(faqSearchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryPill = (cat) => {
    switch (cat) {
      case 'General':
        return { text: '🏠 Home Page', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'Pricing':
        return { text: '🏷️ Pricing Page', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'Blog':
        return { text: '📰 Blog Page', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'About':
        return { text: '🏢 About Us Page', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'Services':
        return { text: '⚙️ Services Page', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'Careers':
        return { text: '💼 Careers Page', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default:
        return {
          text: `🧩 Custom: ${cat || 'General'}`,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  return (
    <div className="xl:col-span-2 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Frequently Asked Questions ({faqs.length})
          </h3>
          <p className="text-xs text-slate-400">Filter FAQs by target page or search keywords</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${faqs.length})` },
          { id: 'General', label: `🏠 Home (${faqs.filter((f) => f.category === 'General').length})` },
          { id: 'Pricing', label: `🏷️ Pricing (${faqs.filter((f) => f.category === 'Pricing').length})` },
          { id: 'Blog', label: `📰 Blog (${faqs.filter((f) => f.category === 'Blog').length})` },
          { id: 'About', label: `🏢 About (${faqs.filter((f) => f.category === 'About').length})` },
          { id: 'Services', label: `⚙️ Services (${faqs.filter((f) => f.category === 'Services').length})` },
          { id: 'Careers', label: `💼 Careers (${faqs.filter((f) => f.category === 'Careers').length})` },
          {
            id: 'custom',
            label: `🧩 Custom (${
              faqs.filter(
                (f) =>
                  !['General', 'Pricing', 'Blog', 'About', 'Services', 'Careers'].includes(f.category)
              ).length
            })`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFaqCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              faqCategoryFilter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Items Grid */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          {faqSearchQuery || faqCategoryFilter !== 'all'
            ? 'No FAQs found matching the selected filter/search.'
            : 'No FAQs found in database. Use the form on the left to create your first FAQ entry.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFaqs.map((f) => {
            const catPill = getCategoryPill(f.category);
            return (
              <div
                key={f.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${catPill.badgeClass}`}
                    >
                      {catPill.text}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ml-auto md:ml-0 ${
                        f.is_active
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {f.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                      Order: #{f.sort_order || 0}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mb-2">{f.question}</h4>
                  <p className="text-slate-600 text-xs whitespace-pre-line leading-relaxed">
                    {f.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => onToggleFaq(f.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      f.is_active
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                    }`}
                  >
                    {f.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => onEditFaq(f)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => onDeleteFaq(f.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
