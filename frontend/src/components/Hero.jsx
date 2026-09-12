import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import logoImg from '../assets/Logo.png';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_HEADINGS = [
  "Grow Your Business with Smart Technology",
  "Scalable Web & App Development Solutions",
  "Complete Digital Growth Solutions",
  "Building Future-Ready Digital Experiences"
];

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const rightRef = useRef(null);

  const { getSetting } = useSiteSettings();

  // Dynamic Site Settings (CMS Values)
  const heroBadge = getSetting('hero_badge', 'Trusted by Leaders in Enterprise Technology');
  const heroSubtitle = getSetting('hero_subtitle', 'SRJ Global Technologies helps startups and businesses build modern websites, mobile apps, AI solutions, and scalable software.');
  const primaryCtaText = getSetting('hero_cta_primary_text', 'Explore Services');
  const primaryCtaUrl = getSetting('hero_cta_primary_url', '#services');
  const secondaryCtaText = getSetting('hero_cta_secondary_text', 'View Our Work');
  const secondaryCtaUrl = getSetting('hero_cta_secondary_url', '#portfolio');

  const rawHeadingsSetting = getSetting('hero_headings', '');
  const headings = useMemo(() => {
    if (!rawHeadingsSetting) return DEFAULT_HEADINGS;
    if (Array.isArray(rawHeadingsSetting)) return rawHeadingsSetting;
    if (typeof rawHeadingsSetting === 'string' && rawHeadingsSetting.trim()) {
      try {
        const parsed = JSON.parse(rawHeadingsSetting);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        const lines = rawHeadingsSetting.split('\n').map((h) => h.trim()).filter(Boolean);
        if (lines.length > 0) return lines;
      }
    }
    return DEFAULT_HEADINGS;
  }, [rawHeadingsSetting]);

  const [headingIdx, setHeadingIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            setHeadingIdx((prev) => (prev + 1) % headings.length);
            gsap.fromTo(titleRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [headings]);

useEffect(() => {
const ctx = gsap.context(() => {
// Entrance timeline
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

tl.fromTo(titleRef.current, 
{ y: 60, opacity: 0 }, 
{ y: 0, opacity: 1, duration: 1.4 }
)
.fromTo(descRef.current, 
{ y: 40, opacity: 0 }, 
{ y: 0, opacity: 1, duration: 1.1 }, 
'-=0.9'
)
.fromTo(ctaRef.current, 
{ y: 30, opacity: 0 }, 
{ y: 0, opacity: 1, duration: 1.1 }, 
'-=0.8'
)
.fromTo(rightRef.current, 
{ scale: 0.94, opacity: 0 }, 
{ scale: 1, opacity: 1, duration: 1.6 }, 
'-=1.0'
);

// Rotate outer ring clockwise
gsap.to('.logo-ring-outer', {
rotation: 360,
duration: 25,
repeat: -1,
ease: 'none'
});

// Rotate inner ring counter-clockwise
gsap.to('.logo-ring-inner', {
rotation: -360,
duration: 18,
repeat: -1,
ease: 'none'
});

// Gentle floating/breathing animation for the logo card
gsap.to('.logo-card', {
y: -12,
scale: 1.02,
duration: 3.5,
repeat: -1,
yoyo: true,
ease: 'sine.inOut'
});

// Float animations for each individual badge
gsap.to('.tech-badge-1', {
y: '8px',
x: '-4px',
duration: 4,
repeat: -1,
yoyo: true,
ease: 'sine.inOut'
});

gsap.to('.tech-badge-2', {
y: '-10px',
x: '5px',
duration: 4.5,
repeat: -1,
yoyo: true,
ease: 'sine.inOut'
});

gsap.to('.tech-badge-3', {
y: '6px',
x: '6px',
duration: 3.8,
repeat: -1,
yoyo: true,
ease: 'sine.inOut'
});

// Magnetic CTA Button logic
const btn = document.querySelector('.magnetic-btn');
if (btn) {
const handleMouseMove = (e) => {
const rect = btn.getBoundingClientRect();
const x = e.clientX - rect.left - rect.width / 2;
const y = e.clientY - rect.top - rect.height / 2;
gsap.to(btn, {
x: x * 0.35,
y: y * 0.35,
duration: 0.3,
ease: 'power2.out'
});
};
const handleMouseLeave = () => {
gsap.to(btn, {
x: 0,
y: 0,
duration: 0.5,
ease: 'elastic.out(1, 0.3)'
});
};
btn.addEventListener('mousemove', handleMouseMove);
btn.addEventListener('mouseleave', handleMouseLeave);
return () => {
btn.removeEventListener('mousemove', handleMouseMove);
btn.removeEventListener('mouseleave', handleMouseLeave);
};
}
}, containerRef);

return () => ctx.revert();
}, []);

// Particle connection canvas logic
const canvasRef = useRef(null);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext('2d');
let animationFrameId;
let particles = [];
const particleCount = 48;
const colors = [
'rgba(99, 102, 241, ',   // Indigo
'rgba(236, 72, 153, ',   // Pink
'rgba(139, 92, 246, ',   // Violet
'rgba(20, 184, 166, ',   // Teal
'rgba(59, 130, 246, ',   // Blue
];

class Particle {
constructor(width, height) {
this.x = Math.random() * width;
this.y = Math.random() * height;
this.vx = (Math.random() - 0.5) * 0.75;
this.vy = (Math.random() - 0.5) * 0.75;
this.radius = Math.random() * 2.5 + 1.5;
this.color = colors[Math.floor(Math.random() * colors.length)];
}
update(width, height) {
this.x += this.vx;
this.y += this.vy;
if (this.x < 0 || this.x > width) this.vx *= -1;
if (this.y < 0 || this.y > height) this.vy *= -1;
}
}

const resize = () => {
canvas.width = window.innerWidth;
canvas.height = canvas.parentElement.clientHeight;
};
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < particleCount; i++) {
particles.push(new Particle(canvas.width, canvas.height));
}

let mouse = { x: null, y: null };
const handleSectionMouseMove = (e) => {
const rect = canvas.getBoundingClientRect();
mouse.x = e.clientX - rect.left;
mouse.y = e.clientY - rect.top;
};
const handleSectionMouseLeave = () => {
mouse.x = null;
mouse.y = null;
};

const sectionEl = containerRef.current;
if (sectionEl) {
sectionEl.addEventListener('mousemove', handleSectionMouseMove);
sectionEl.addEventListener('mouseleave', handleSectionMouseLeave);
}

const draw = () => {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Update and Draw Particles
particles.forEach((p) => {
p.update(canvas.width, canvas.height);
ctx.beginPath();
ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
ctx.fillStyle = p.color + '0.75)';
ctx.shadowBlur = 8;
ctx.shadowColor = p.color + '0.6)';
ctx.fill();
});

// Reset shadow blur for performance and crisp lines
ctx.shadowBlur = 0;

// Draw connection lines
for (let i = 0; i < particles.length; i++) {
for (let j = i + 1; j < particles.length; j++) {
const dx = particles[i].x - particles[j].x;
const dy = particles[i].y - particles[j].y;
const dist = Math.sqrt(dx * dx + dy * dy);

if (dist < 100) {
ctx.beginPath();
ctx.moveTo(particles[i].x, particles[i].y);
ctx.lineTo(particles[j].x, particles[j].y);

const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
grad.addColorStop(0, particles[i].color + `${0.25 * (1 - dist / 100)})`);
grad.addColorStop(1, particles[j].color + `${0.25 * (1 - dist / 100)})`);

ctx.strokeStyle = grad;
ctx.lineWidth = 0.85;
ctx.stroke();
}
}

// Draw line to cursor if within range
if (mouse.x !== null && mouse.y !== null) {
const dx = particles[i].x - mouse.x;
const dy = particles[i].y - mouse.y;
const dist = Math.sqrt(dx * dx + dy * dy);

if (dist < 150) {
ctx.beginPath();
ctx.moveTo(particles[i].x, particles[i].y);
ctx.lineTo(mouse.x, mouse.y);

const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, mouse.x, mouse.y);
grad.addColorStop(0, particles[i].color + `${0.4 * (1 - dist / 150)})`);
grad.addColorStop(1, 'rgba(99, 102, 241, 0.05)');

ctx.strokeStyle = grad;
ctx.lineWidth = 1.2;
ctx.stroke();
}
}
}

animationFrameId = requestAnimationFrame(draw);
};
draw();

return () => {
window.removeEventListener('resize', resize);
if (sectionEl) {
sectionEl.removeEventListener('mousemove', handleSectionMouseMove);
sectionEl.removeEventListener('mouseleave', handleSectionMouseLeave);
}
cancelAnimationFrame(animationFrameId);
};
}, []);

return (
<section
id="home"
ref={containerRef}
className="relative min-h-screen pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-white overflow-hidden"
>
{/* Full-Screen Interactive Canvas */}
<canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none z-0" />


{/* Extremely subtle hero accent */}
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-slate-900/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" />

<div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center relative z-10">
{/* Left text column */}
<div className="lg:col-span-7 text-left flex flex-col justify-center">
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6 w-fit shadow-xs max-w-full">
<span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse shrink-0" />
<span className="text-xs font-semibold text-secondary-text tracking-wide uppercase truncate">{heroBadge}</span>
</div>

<h1
ref={titleRef}
className="text-3xl sm:text-5xl lg:text-6xl text-fluid-3xl font-extrabold tracking-tight text-primary-text leading-[1.1] mb-6 min-h-[90px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px]"
>
{headings[headingIdx % headings.length]}
</h1>

<p
ref={descRef}
className="text-fluid-base md:text-fluid-lg text-secondary-text leading-relaxed max-w-xl mb-8 sm:mb-10"
>
{heroSubtitle}
</p>

<div ref={ctaRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
<a
href={primaryCtaUrl}
className="magnetic-btn inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-h-[48px]"
>
{primaryCtaText}
<ArrowRight size={18} />
</a>
<a
href={secondaryCtaUrl}
className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 text-primary-text border border-slate-200 font-semibold transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
>
{secondaryCtaText}
</a>
</div>
</div>

{/* Right side: Animated Logo showcase */}
<div ref={rightRef} className="lg:col-span-5 flex justify-center items-center relative h-[300px] sm:h-[420px] md:h-[480px]">
<div className="relative w-full max-w-[340px] sm:max-w-[460px] aspect-square flex items-center justify-center">
{/* Glow effect behind logo */}
<div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 via-indigo-50/30 to-slate-100/50 rounded-full blur-2xl sm:blur-3xl opacity-75" />

{/* Outer animated dashed ring */}
<div className="logo-ring-outer absolute inset-0 border-2 border-dashed border-slate-200/80 rounded-full" />

{/* Inner animated solid ring */}
<div className="logo-ring-inner absolute inset-3 sm:inset-4 border border-slate-300/40 rounded-full" />

{/* Central Logo Container */}
<div className="logo-card absolute inset-6 sm:inset-8 bg-white/80 backdrop-blur-md border border-slate-100/85 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center justify-center p-4 sm:p-6 hover:shadow-indigo-100/40 transition-shadow duration-300">
<img
src={logoImg}
alt="SRJ Global Logo"
className="w-[85%] h-[85%] object-contain logo-main"
onError={(e) => {
e.target.style.display = 'none';
e.target.nextSibling.style.display = 'block';
}}
/>
<span className="hidden font-sans font-bold text-2xl sm:text-3xl text-slate-800 tracking-tight text-center">
SRJ GLOBAL
</span>
</div>

{/* Floating Badges with dynamic GSAP animations */}
<div className="tech-badge-1 absolute top-1 sm:top-2 left-0 sm:left-2 bg-white border border-slate-150 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-2 z-10">
<span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
<span className="text-[11px] sm:text-xs font-semibold text-slate-700">Web & App</span>
</div>

<div className="tech-badge-2 absolute bottom-2 sm:bottom-4 right-0 sm:right-2 bg-white border border-slate-150 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-2 z-10">
<span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500" />
<span className="text-[11px] sm:text-xs font-semibold text-slate-700">AI & Cloud</span>
</div>

<div className="tech-badge-3 absolute top-1/2 right-0 sm:-right-4 -translate-y-1/2 bg-white border border-slate-150 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-2 z-10">
<span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDuration: '3s' }} />
<span className="text-[11px] sm:text-xs font-semibold text-slate-700">Scale</span>
</div>
</div>
</div>
</div>
</section>
);
}
