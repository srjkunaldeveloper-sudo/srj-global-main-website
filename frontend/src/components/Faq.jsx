import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import api from '../config/api';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs?category=General');
        if (res.data && res.data.success && Array.isArray(res.data.faqs)) {
          setFaqs(res.data.faqs);
        } else if (Array.isArray(res.data)) {
          setFaqs(res.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error('Error fetching General FAQs:', err);
        setError(true);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  if (!loading && (faqs.length === 0 || error)) {
    return null;
  }

  return (
    <section id="faq" className="py-24 bg-section-bg px-6 border-b border-slate-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Help Center
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-border-light rounded-2xl p-6 animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))
          ) : (
            faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              const questionText = faq.question || faq.q;
              const answerText = faq.answer || faq.a;

              return (
                <div
                  key={faq.id || idx}
                  className="bg-white border border-border-light rounded-2xl overflow-hidden transition-all duration-350"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-primary-text hover:text-black transition-colors duration-200"
                  >
                    <span className="text-base font-bold pr-4">{questionText}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transform transition-transform duration-350 ${
                        isOpen ? 'rotate-180 text-slate-900' : ''
                      }`}
                    />
                  </button>
                  
                  <div
                    className={`grid transition-all duration-350 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-secondary-text leading-relaxed whitespace-pre-line">
                        {answerText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

