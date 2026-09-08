import { useEffect, useRef, useState } from "react";

/* Reveal-on-scroll wrapper for the Services page. */
export default function Reveal({ as: Tag = "div", className = "", style, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`services-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
