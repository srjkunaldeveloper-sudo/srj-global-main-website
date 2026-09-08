import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function PromotionPopup() {
  const [promo, setPromo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Increased countdown to 10s for larger size read-time
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchActivePromo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/promotions/active`);
        const activePromo = res.data.promotion;
        
        if (activePromo) {
          const dismissedId = sessionStorage.getItem(`dismissed_promo_${activePromo.id}`);
          if (!dismissedId) {
            setPromo(activePromo);
            // Open popup after a short delay
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 2500);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error("Error loading active launch popups:", err);
      }
    };
    fetchActivePromo();
  }, []);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleDismiss();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (promo) {
      sessionStorage.setItem(`dismissed_promo_${promo.id}`, 'true');
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (!promo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-8 sm:right-8 z-[9999] sm:max-w-[400px] w-auto sm:w-full bg-white border border-slate-100/90 text-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-left overflow-hidden font-sans"
        >
          {/* Subtle gradient glow */}
          <div className="absolute top-[-30%] left-[-30%] w-[80%] h-[80%] rounded-full bg-blue-500/5 blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X size={16} />
          </button>

          {/* Badge Indicator matching primary theme */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-600 border border-blue-100 mb-6">
            <Sparkles size={13} className="fill-blue-100" />
            LATEST UPDATE
          </div>

          {/* Promo Content */}
          <div className="space-y-5">
            {promo.image_url && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-2">
                <img 
                  src={promo.image_url} 
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight sm:leading-snug tracking-tight pr-6 sm:pr-0">
              {promo.title}
            </h3>
            
            <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">
              {promo.description}
            </p>

            <div className="flex flex-col gap-4 pt-1">
              {/* Action Button */}
              {promo.cta_link && (
                <a
                  href={promo.cta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-all w-full cursor-pointer shadow-sm hover:shadow-md"
                >
                  {promo.cta_text || 'Learn More'}
                  <ArrowRight size={15} />
                </a>
              )}

              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">
                {timeLeft > 0 ? `Closing automatically in ${timeLeft}s...` : 'Closing...'}
              </span>
            </div>
          </div>

          {/* Progress bar timer matching dark slate accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div 
              className="h-full bg-slate-900 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
