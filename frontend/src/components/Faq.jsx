import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "What is your typical project timeline?",
      a: "Depending on size and complexity, standard web or mobile MVP launches take 4 to 8 weeks. Larger systems requiring complex custom microservices or third-party enterprise syncs typically span 12 to 24 weeks."
    },
    {
      q: "Do you offer post-deployment maintenance?",
      a: "Yes, we support our projects post-launch. We provide custom maintenance SLAs covering security patches, framework updates, cloud performance tuning, and on-call developer availability."
    },
    {
      q: "Can you collaborate with our in-house engineering team?",
      a: "Absolutely. We routinely embed ourselves with client engineering setups, utilizing unified Git workflows, shared Slack channels, and coordinated agile sprints."
    },
    {
      q: "How do you handle intellectual property (IP)?",
      a: "Upon project completion and milestone reconciliation, full code repository ownership and all intellectual property rights are officially transferred to your organization."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-section-bg px-6 border-b border-slate-100">
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
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-border-light rounded-2xl overflow-hidden transition-all duration-350"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-primary-text hover:text-black transition-colors duration-200"
                >
                  <span className="text-base font-bold pr-4">{faq.q}</span>
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
                    <p className="px-6 pb-6 text-sm text-secondary-text leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
