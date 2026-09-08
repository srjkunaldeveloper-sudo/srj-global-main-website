import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis with production-ready config
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Native touch is usually preferred, but setting up for performance
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing to prevent jitter
    gsap.ticker.lagSmoothing(0);

    // 4. Handle Anchor Links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: -80, // Navbar offset
            duration: 1.2,
          });
          window.history.pushState(null, '', href);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // 5. Dynamically refresh ScrollTrigger on DOM resize/content changes
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    // Initial refresh
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      resizeObserver.disconnect();
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  // 6. Handle route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => {
        lenisRef.current.resize();
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [location.pathname]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
