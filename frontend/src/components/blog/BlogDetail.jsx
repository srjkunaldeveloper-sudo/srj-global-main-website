import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  Eye,
  Tag,
  Copy,
  HelpCircle
} from 'lucide-react';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaWhatsapp 
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import SEO from '../SEO';
import { blogArticles, editorPicks } from '../../data/blogData';
import '../../styles/blog.css';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBlogsList, setAllBlogsList] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [prevArticle, setPrevArticle] = useState(null);
  const [nextArticle, setNextArticle] = useState(null);
  
  // Reading state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article and collection
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      let foundBlog = null;
      let fullMergedList = [];

      // 1. Fetch API blogs
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`);
        if (Array.isArray(res.data)) {
          const formattedApi = res.data.map(b => ({
            ...b,
            coverImage: b.image,
            publishedDate: b.created_at,
            authorImage: b.author_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            authorRole: b.author_role || "Principal Technical Architect",
            readingTime: b.reading_time || null,
            tags: b.tags ? (typeof b.tags === 'string' ? b.tags.split(',').map(t => t.trim()) : b.tags) : []
          }));
          fullMergedList = [...formattedApi];
        }
      } catch (err) {
        console.warn("Could not fetch API blogs collection:", err);
      }

      // Merge with static blog data
      const staticMerged = [...blogArticles, ...editorPicks];
      const combined = [...fullMergedList, ...staticMerged];
      
      // Deduplicate by ID and Title
      const uniqueCollection = Array.from(
        new Map(combined.map(item => [String(item.id || item.title), item])).values()
      );
      setAllBlogsList(uniqueCollection);

      // 2. Fetch specific blog from API
      try {
        const detailRes = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        if (detailRes.data && detailRes.data.id) {
          foundBlog = {
            ...detailRes.data,
            coverImage: detailRes.data.image,
            publishedDate: detailRes.data.created_at,
            authorImage: detailRes.data.author_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            authorRole: detailRes.data.author_role || "Principal Technical Architect",
            readingTime: detailRes.data.reading_time || null,
            tags: detailRes.data.tags ? (typeof detailRes.data.tags === 'string' ? detailRes.data.tags.split(',').map(t => t.trim()) : detailRes.data.tags) : []
          };
        }
      } catch (err) {
        // Fallback to static collection
      }

      // 3. Fallback search if API didn't return
      if (!foundBlog) {
        const candidate = uniqueCollection.find(
          a => String(a.id) === String(id) || a.slug === id
        );
        if (candidate) {
          foundBlog = {
            id: candidate.id,
            title: candidate.title,
            slug: candidate.slug,
            category: candidate.category || "Technology",
            author: candidate.author || "SRJ Global Technologies",
            authorImage: candidate.authorImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            authorRole: candidate.authorRole || "Principal Technical Architect",
            image: candidate.coverImage || candidate.image,
            coverImage: candidate.coverImage || candidate.image,
            description: candidate.description,
            content: candidate.content,
            tags: candidate.tags || ["Technology", "Engineering", "Architecture"],
            created_at: candidate.publishedDate || new Date().toISOString(),
            views: candidate.views || 4820,
            likes: candidate.likes || 320
          };
        }
      }

      if (foundBlog) {
        setBlog(foundBlog);
        setError(null);

        // Calculate Related Articles & Prev/Next
        const currentIndex = uniqueCollection.findIndex(
          a => String(a.id) === String(foundBlog.id) || a.slug === foundBlog.slug
        );

        if (currentIndex > 0) {
          setPrevArticle(uniqueCollection[currentIndex - 1]);
        } else {
          setPrevArticle(null);
        }

        if (currentIndex !== -1 && currentIndex < uniqueCollection.length - 1) {
          setNextArticle(uniqueCollection[currentIndex + 1]);
        } else {
          setNextArticle(null);
        }

        // Related articles: prioritize same category
        const others = uniqueCollection.filter(
          a => String(a.id) !== String(foundBlog.id) && a.slug !== foundBlog.slug
        );
        const sameCategory = others.filter(
          a => (a.category || '').toLowerCase() === (foundBlog.category || '').toLowerCase()
        );
        const differentCategory = others.filter(
          a => (a.category || '').toLowerCase() !== (foundBlog.category || '').toLowerCase()
        );
        setRelatedArticles([...sameCategory, ...differentCategory].slice(0, 3));
      } else {
        setError("Article not found");
      }

      setLoading(false);
    };

    fetchBlogData();
    window.scrollTo(0, 0);
  }, [id]);

  // Parse AEO FAQs if present (JSON or Q: / A: format)
  const parsedFaqs = useMemo(() => {
    if (!blog?.aeo_faqs) return [];
    try {
      if (blog.aeo_faqs.trim().startsWith('[') || blog.aeo_faqs.trim().startsWith('{')) {
        const parsed = JSON.parse(blog.aeo_faqs);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}

    const lines = blog.aeo_faqs.split('\n').map(l => l.trim()).filter(Boolean);
    const items = [];
    let currentQ = '';
    for (const line of lines) {
      if (/^q(\d*):/i.test(line)) {
        currentQ = line.replace(/^q(\d*):\s*/i, '');
      } else if (/^a(\d*):/i.test(line) && currentQ) {
        const currentA = line.replace(/^a(\d*):\s*/i, '');
        items.push({ question: currentQ, answer: currentA });
        currentQ = '';
      }
    }
    return items;
  }, [blog?.aeo_faqs]);

  // Synthesize rich editorial content and Table of Contents
  const processedArticle = useMemo(() => {
    if (!blog) return { html: '', toc: [], keyTakeaways: [] };

    let rawContent = blog.content || '';
    const rawDesc = blog.description || '';
    const title = blog.title || '';
    const category = blog.category || 'Technology';

    // If content is very short or plain text without H2 tags, expand into rich structured editorial
    const hasHeadings = /<h[23][^>]*>/i.test(rawContent);

    if (!hasHeadings) {
      // Split plain text paragraphs if available
      const existingParagraphs = rawContent
        ? rawContent.split(/\n\s*\n/).filter(p => p.trim().length > 0)
        : [];

      const p1 = existingParagraphs[0] || rawDesc || "Modern enterprise systems demand resilient software architectures, continuous scalability, and agile engineering workflows to stay ahead in fast-moving global markets.";
      const p2 = existingParagraphs[1] || "As distributed infrastructure and intelligent automation redefine industry standards, engineering teams must balance rapid velocity with deep security, predictable performance, and high availability.";
      const p3 = existingParagraphs[2] || "By implementing modular designs, strict code quality pipelines, and cloud-native monitoring, organizations can eliminate single points of failure while driving measurable business value.";

      rawContent = `
        <h2 id="section-overview">1. Executive Overview & Industry Context</h2>
        <p>${p1}</p>
        <p>In modern digital transformation, technology is no longer just a supporting function—it is the core engine of competitive advantage. At SRJ Global Technologies, our cross-functional engineering teams collaborate with global enterprises to solve complex software challenges with precision and speed.</p>
        
        <div class="article-callout">
          <h4 style="font-weight: 800; color: #1e3a8a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
            💡 Key Architectural Principle
          </h4>
          <p style="margin-bottom: 0; color: #1e293b; font-size: 0.975rem;">
            Architecture decisions made during the foundation phase compound over time. Prioritizing modular boundaries, clear API contracts, and automated validation prevents technical debt before it starts.
          </p>
        </div>

        <h2 id="section-architecture">2. Architectural Strategy & Core Pillars</h2>
        <p>${p2}</p>
        <p>Whether deploying high-throughput microservices, generative AI pipelines, or multi-platform cloud systems, three foundational pillars remain essential:</p>
        <ul>
          <li><strong>Zero-Trust Security & Governance:</strong> Validating inputs, strictly enforcing role-based access, and running continuous vulnerability audits across all service boundaries.</li>
          <li><strong>Observable & Resilient Pipelines:</strong> Implementing distributed tracing, structured telemetry, and health check probes to identify anomalies before end-users are impacted.</li>
          <li><strong>Scalable Decoupling:</strong> Isolating business logic into domain-driven modules, ensuring updates can be deployed autonomously without system-wide regressions.</li>
        </ul>

        <blockquote>
          "True engineering excellence is not about how many features you ship in a sprint; it is about how reliably those systems perform under extreme load when the business depends on them most."
        </blockquote>

        <h2 id="section-implementation">3. Technical Implementation & Best Practices</h2>
        <p>${p3}</p>
        <p>To successfully execute this strategy in production environments, development teams should adhere to standardized delivery workflows:</p>
        <ol>
          <li><strong>Define Clear Contracts:</strong> Standardize OpenAPI specifications and typed schemas across all client and backend touchpoints.</li>
          <li><strong>Automate Verification:</strong> Enforce automated linting, unit benchmarks, and end-to-end integration tests on every pull request.</li>
          <li><strong>Monitor Production Telemetry:</strong> Track p95/p99 latency metrics and error budgets to drive continuous optimization.</li>
        </ol>

        <h2 id="section-takeaways">4. Strategic Summary & Moving Forward</h2>
        <p>As technology ecosystems evolve, adopting a forward-looking mindset is crucial. Organizations that invest in robust engineering foundations and partner with proven technology providers position themselves for sustained market leadership.</p>
        <p>Looking to elevate your technology stack? Connect with the senior engineering leaders at SRJ Global Technologies to turn architectural ambition into seamless enterprise reality.</p>
      `;
    }

    // Extract headings for Table of Contents and ensure ID injection
    const tocList = [];
    let counter = 0;

    const modifiedHtml = rawContent.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      let idMatch = attrs.match(/id=["']([^"']+)["']/i);
      let headingId = idMatch ? idMatch[1] : `heading-${counter++}`;

      tocList.push({
        id: headingId,
        text: cleanText,
        level: tag.toLowerCase() === 'h2' ? 2 : 3
      });

      if (!idMatch) {
        return `<${tag}${attrs} id="${headingId}">${text}</${tag}>`;
      }
      return match;
    });

    // Custom Key Takeaways from Admin or synthesized fallback
    let keyTakeaways = [];
    if (blog.key_takeaways) {
      keyTakeaways = blog.key_takeaways
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean);
    }
    if (keyTakeaways.length === 0) {
      keyTakeaways = [
        `Comprehensive architectural breakdown tailored for modern ${category.toLowerCase()} ecosystems.`,
        `Key engineering strategies for high performance, modularity, and zero-trust security.`,
        `Practical production guidelines and deployment checklists verified by SRJ Global engineers.`
      ];
    }

    return {
      html: modifiedHtml,
      toc: tocList,
      keyTakeaways
    };
  }, [blog]);

  // ScrollSpy observer for Table of Contents
  useEffect(() => {
    if (!processedArticle.toc.length) return;

    const handleScrollSpy = () => {
      const headingElements = processedArticle.toc
        .map(item => document.getElementById(item.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 180;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(el.id);
          return;
        }
      }

      if (headingElements[0]) {
        setActiveSectionId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [processedArticle.toc]);

  // Smooth scroll handler
  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      setActiveSectionId(headingId);
      setMobileTocOpen(false);
    }
  };

  // Copy link handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Social sharing handlers
  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${blog?.title} via @SRJGlobal`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${blog?.title} - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const calculateReadingTime = (content) => {
    if (!content) return "6 min read";
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.ceil(wordCount / 190));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 pb-24 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium text-sm">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 pb-24 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">{error || "Article Not Found"}</h2>
        <p className="text-slate-500 text-center max-w-md mb-8">
          The requested article may have been relocated or updated. Browse our knowledge hub for more enterprise insights.
        </p>
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Blog Hub
        </button>
      </div>
    );
  }

  const formattedDate = new Date(blog.created_at || blog.publishedDate || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const readingTimeText = blog.readingTime || blog.reading_time || calculateReadingTime(blog.content);

  const keywordsString = blog.meta_keywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags) || "technology, software architecture, enterprise engineering";

  return (
    <div className="min-h-screen bg-slate-50/70 pt-20 pb-28">
      {/* Top Floating Reading Progress Bar */}
      <div className="reading-progress-track">
        <div 
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <SEO 
        title={blog.meta_title ? `${blog.meta_title} | SRJ Global` : `${blog.title} | SRJ Global Insights`}
        description={blog.meta_description || blog.description || `Read ${blog.title} on the SRJ Global Technologies knowledge base.`}
        keywords={keywordsString}
        image={blog.image || blog.coverImage}
        url={window.location.href}
        isArticle={true}
        articleData={{
          title: blog.title,
          datePublished: blog.created_at || new Date().toISOString()
        }}
        faqs={parsedFaqs.length > 0 ? parsedFaqs : null}
        extraSchema={{
          "@type": "BlogPosting",
          "headline": blog.meta_title || blog.title,
          "description": blog.meta_description || blog.description || `Read ${blog.title} on the SRJ Global Technologies engineering blog.`,
          "image": [blog.image || blog.coverImage || "https://srjglobaltechnology.com/og-image.png"],
          "author": {
            "@type": "Person",
            "name": blog.author || "SRJ Global Engineering Team",
            "jobTitle": blog.authorRole || blog.author_role || "Principal Technical Architect"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SRJ Global Technologies",
            "logo": {
              "@type": "ImageObject",
              "url": "https://srjglobaltechnology.com/logo.png"
            }
          },
          "datePublished": blog.created_at || new Date().toISOString(),
          "dateModified": blog.updated_at || blog.created_at || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          },
          ...(blog.aeo_summary ? { "abstract": blog.aeo_summary } : {})
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 py-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog & Insights</Link>
          {blog.category && (
            <>
              <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
              <span className="capitalize text-slate-600">{blog.category.replace(/-/g, ' ')}</span>
            </>
          )}
          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
          <span className="text-slate-400 truncate max-w-xs">{blog.title}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1 cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Hero Article Header */}
        <header className="mb-10">
          <div className="max-w-4xl">
            {blog.category && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100/80 mb-5">
                <Tag size={12} />
                <span>{blog.category.replace(/-/g, ' ')}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              {blog.title}
            </h1>

            {blog.description && (
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8">
                {blog.description}
              </p>
            )}

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-200/80">
              <div className="flex items-center gap-3.5">
                <img 
                  src={blog.authorImage || blog.author_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={blog.author || "Author"}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {blog.author || "SRJ Global Technologies"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {blog.authorRole || blog.author_role || "Principal Technical Architect"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={15} className="text-slate-400" />
                  <span>{readingTimeText}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {(blog.coverImage || blog.image) && (
          <div className="w-full mb-12 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-200/60 bg-slate-900 max-h-[520px]">
            <img 
              src={blog.coverImage || blog.image}
              alt={blog.title}
              className="w-full h-full object-cover max-h-[520px] filter brightness-[0.98]"
            />
          </div>
        )}

        {/* Mobile Quick Table of Contents Toggle */}
        {processedArticle.toc.length > 0 && (
          <div className="lg:hidden mb-8 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-slate-900"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-blue-600" />
                Table of Contents ({processedArticle.toc.length} sections)
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                {mobileTocOpen ? "Collapse" : "Expand"}
              </span>
            </button>
            
            {mobileTocOpen && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                {processedArticle.toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`text-left text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      activeSectionId === item.id 
                        ? 'bg-blue-50 text-blue-700 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Two-Column Layout (Article Prose + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Content (8 Columns) */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            
            {/* Executive Key Takeaways Box */}
            {processedArticle.keyTakeaways.length > 0 && (
              <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-100">
                <div className="flex items-center gap-2.5 text-blue-700 font-bold text-sm mb-3">
                  <Sparkles size={17} className="text-blue-600" />
                  <span>Key Takeaways at a Glance</span>
                </div>
                <ul className="space-y-2.5">
                  {processedArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rich Formatted Article Body */}
            <div 
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: processedArticle.html }}
            />

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(blog.tags) ? blog.tags : [blog.tags]).map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-medium transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AEO FAQ Accordion Section (if present) */}
            {parsedFaqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={18} className="text-blue-600" />
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="space-y-3">
                  {parsedFaqs.map((faq, i) => (
                    <details 
                      key={i} 
                      className="group rounded-2xl bg-slate-50 border border-slate-200/70 p-4 transition-all"
                    >
                      <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.question}</span>
                        <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/50 pt-3">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Bar */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Share2 size={16} className="text-blue-600" />
                Share this knowledge:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareLinkedIn}
                  aria-label="Share on LinkedIn"
                  className="share-action-btn share-linkedin"
                >
                  <FaLinkedin size={16} />
                </button>
                <button
                  onClick={handleShareTwitter}
                  aria-label="Share on Twitter"
                  className="share-action-btn share-twitter"
                >
                  <FaTwitter size={15} />
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  aria-label="Share on WhatsApp"
                  className="share-action-btn share-whatsapp"
                >
                  <FaWhatsapp size={17} />
                </button>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  className="share-action-btn share-copy relative"
                >
                  {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
                {copiedLink && (
                  <span className="text-xs font-bold text-emerald-600 ml-1 animate-pulse">
                    Link Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Comprehensive Author Bio Card */}
            <div className="mt-12 p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img 
                src={blog.authorImage || blog.author_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={blog.author || "Author"}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md flex-shrink-0"
              />
              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {blog.author || "SRJ Global Technologies"}
                    </h3>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                      {blog.authorRole || blog.author_role || "Principal Technical Architect"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Passionate about distributed system reliability, modern AI orchestration, and cloud infrastructure. Our engineering team publishes research and practical architectural patterns to guide high-growth technology leaders.
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Explore more insights <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Previous & Next Article Navigation */}
            {(prevArticle || nextArticle) && (
              <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <div
                    onClick={() => {
                      navigate(`/blog/${prevArticle.id || prevArticle.slug}`);
                      window.scrollTo(0, 0);
                    }}
                    className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors">
                        <ChevronLeft size={14} /> Previous Article
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                        {prevArticle.title}
                      </h4>
                    </div>
                  </div>
                ) : <div />}

                {nextArticle && (
                  <div
                    onClick={() => {
                      navigate(`/blog/${nextArticle.id || nextArticle.slug}`);
                      window.scrollTo(0, 0);
                    }}
                    className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between text-right"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 inline-flex items-center gap-1 mb-2 transition-colors">
                        Next Article <ChevronRight size={14} />
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                        {nextArticle.title}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Consultation Banner / Lead Gen CTA */}
            <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-900/50 border border-blue-500/30 mb-4">
                  Enterprise Solutions
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Ready to Build a High-Performance Digital Platform?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                  From scalable cloud architectures to AI integrations and enterprise web applications, SRJ Global delivers bespoke engineering that powers business success.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/contact"
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    Schedule Free Consultation <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/services"
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl transition-all border border-white/10"
                  >
                    Explore Our Services
                  </Link>
                </div>
              </div>
            </div>

          </main>

          {/* Sticky Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Table of Contents Widget */}
            {processedArticle.toc.length > 0 && (
              <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] toc-sidebar">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm mb-4 pb-3 border-b border-slate-100">
                  <BookOpen size={16} className="text-blue-600" />
                  <span>Table of Contents</span>
                </div>
                
                <nav className="space-y-1">
                  {processedArticle.toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`toc-link w-full text-left cursor-pointer ${
                        item.level === 3 ? 'toc-h3' : ''
                      } ${activeSectionId === item.id ? 'active' : ''}`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>

                {/* Quick Share Widget inside TOC */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Share Article
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareLinkedIn}
                      aria-label="Share on LinkedIn"
                      className="share-action-btn share-linkedin"
                      title="Share to LinkedIn"
                    >
                      <FaLinkedin size={15} />
                    </button>
                    <button
                      onClick={handleShareTwitter}
                      aria-label="Share on Twitter"
                      className="share-action-btn share-twitter"
                      title="Share to Twitter"
                    >
                      <FaTwitter size={14} />
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      aria-label="Share on WhatsApp"
                      className="share-action-btn share-whatsapp"
                      title="Share to WhatsApp"
                    >
                      <FaWhatsapp size={16} />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      aria-label="Copy link"
                      className="share-action-btn share-copy"
                      title="Copy Article Link"
                    >
                      {copiedLink ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                    </button>
                  </div>
                  {copiedLink && (
                    <p className="text-xs text-emerald-600 font-bold mt-2 animate-pulse">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Author Sidebar Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                Written By
              </span>
              <div className="flex items-center gap-3.5 mb-3">
                <img 
                  src={blog.authorImage || blog.author_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={blog.author || "Author"}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/10 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {blog.author || "SRJ Global Technologies"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {blog.authorRole || blog.author_role || "Principal Technical Architect"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publishing actionable insights, best practices, and enterprise architectural standards at SRJ Global Technologies.
              </p>
            </div>

            {/* Newsletter Mini Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h4 className="text-lg font-black mb-2">Subscribe to Tech Pulse</h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Join 10,000+ engineers receiving our monthly curations on AI, cloud engineering, and scalable architectures.
              </p>
              <div className="space-y-2">
                <input 
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 placeholder-blue-200 text-white text-xs border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button 
                  onClick={() => alert("Thank you for subscribing to SRJ Global Tech Pulse!")}
                  className="w-full py-2.5 bg-white text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Join Newsletter
                </button>
              </div>
            </div>

          </aside>

        </div>

        {/* Bottom Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
                  Continue Reading
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Related Insights & Case Studies
                </h3>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all articles <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel) => {
                const relDate = rel.publishedDate || rel.created_at 
                  ? new Date(rel.publishedDate || rel.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recent';
                const relImg = rel.coverImage || rel.image || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070";

                return (
                  <motion.div
                    key={rel.id || rel.title}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      navigate(`/blog/${rel.id || rel.slug}`);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                      <img 
                        src={relImg} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {rel.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-white/95 backdrop-blur-md shadow-sm">
                          {rel.category.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-3">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {rel.description}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>{rel.author || "SRJ Global"}</span>
                        <span>{relDate}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
