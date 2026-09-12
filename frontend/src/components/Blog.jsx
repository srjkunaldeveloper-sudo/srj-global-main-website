import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import "../styles/blog.css";
import SEO from "./SEO";

import BlogHero from "./blog/BlogHero";
import CategoryBrowser from "./blog/CategoryBrowser";
import LatestArticles from "./blog/LatestArticles";

import EditorsPicks from "./blog/EditorsPicks";

import SuccessStories from "./blog/SuccessStories";
import Newsletter from "./blog/Newsletter";
import LatestVideos from "./blog/LatestVideos";
import PopularTags from "./blog/PopularTags";
import BlogFAQ from "./blog/BlogFAQ";


import {
  categories,
  blogArticles,

  editorPicks,

  successStories,
  popularTags,
  videos,
} from "../data/blogData";


function Blog() {
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    readTime: "",
    author: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`);
        if (Array.isArray(res.data)) {
          const formattedBlogs = res.data.map(b => ({
            ...b,
            coverImage: b.image || "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070",
            category: b.category || "General",
            publishedDate: b.created_at || new Date().toISOString(),
            readingTime: b.content 
              ? `${Math.max(1, Math.ceil(b.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length / 200))} min read` 
              : "5 min read",
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 500),
            authorImage: "https://ui-avatars.com/api/?name=" + encodeURIComponent(b.author || "Admin") + "&background=random",
          }));
          setArticles(formattedBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs from API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const displayArticles = [...articles.filter(a => a.type === "Fresh Perspectives" || !a.type), ...blogArticles];
  const displayEditorPicks = [...articles.filter(a => a.type === "Editor's Pick"), ...editorPicks];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.title = "Knowledge Center | SRJ Global Technologies Blog";

    const metaTags = [
      { name: "description", content: "Expert insights on software engineering, AI, mobile development, startup strategy, cloud computing, cybersecurity, and digital transformation by SRJ Global Technologies." },
      { property: "og:title", content: "Knowledge Center | SRJ Global Technologies" },
      { property: "og:description", content: "Explore in-depth articles on software engineering, AI, cloud computing, and digital transformation written by experienced technology professionals." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://srjglobaltechnologies.com/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Knowledge Center | SRJ Global Technologies" },
      { name: "twitter:description", content: "Expert insights on software engineering, AI, mobile development, and digital transformation." },
      { name: "robots", content: "index, follow" },
      { name: "canonical", content: "https://srjglobaltechnologies.com/blog" },
    ];

    const createdTags = metaTags.map((tag) => {
      const el = document.createElement("meta");
      Object.entries(tag).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
      return el;
    });

    return () => {
      createdTags.forEach((el) => el.remove());
      document.title = "SRJ Global Technologies";
    };
  }, []);

  const filteredArticles = useMemo(() => {
    let results = displayArticles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
          (a.author && a.author.toLowerCase().includes(q)) ||
          (a.category && a.category.replace(/-/g, " ").includes(q))
      );
    }

    if (filters.category) {
      results = results.filter((a) => a.category === filters.category);
    }

    if (filters.author) {
      results = results.filter((a) => a.author === filters.author);
    }

    if (selectedCategory) {
      const slug = selectedCategory.toLowerCase();
      results = results.filter((a) => {
        const cat = (a.category || "").toLowerCase();
        return cat === slug || cat.replace(/\s+/g, "-") === slug || slug.replace(/-/g, " ") === cat;
      });
    }

    if (selectedTag) {
      results = results.filter((a) =>
        a.tags && a.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (filters.readTime) {
      results = results.filter((a) => {
        const mins = parseInt(a.readingTime || 5);
        switch (filters.readTime) {
          case "Under 5 min": return mins < 5;
          case "5-10 min": return mins >= 5 && mins <= 10;
          case "10-15 min": return mins >= 10 && mins <= 15;
          case "15+ min": return mins >= 15;
          default: return true;
        }
      });
    }

    return results;
  }, [displayArticles, searchQuery, filters, selectedCategory, selectedTag]);

  const hasActiveFiltering =
    searchQuery || filters.category || filters.difficulty || filters.readTime || filters.author || selectedCategory || selectedTag;

  const categoriesWithCounts = useMemo(() => {
    const countMap = {};
    displayArticles.forEach((a) => {
      countMap[a.category] = (countMap[a.category] || 0) + 1;
    });
    return categories.map((cat) => ({
      ...cat,
      articleCount: countMap[cat.id] || 0,
    }));
  }, [displayArticles]);

  return (
    <div className="blog-page pt-4 min-h-screen bg-slate-50">
      <SEO 
        title="Blog & Insights"
        description="Stay updated with the latest trends in software development, AI, and digital transformation from the experts at SRJ Global Technologies."
        keywords="tech blog, software development blog, IT insights, SRJ Global Technologies blog"
        url="https://srjglobaltechnology.com/blog"
      />
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "SRJ Global Technologies Knowledge Center",
            description:
              "Expert insights on software engineering, AI, mobile development, cloud computing, and digital transformation.",
            url: "https://srjglobaltechnologies.com/blog",
            publisher: {
              "@type": "Organization",
              name: "SRJ Global Technologies",
              logo: {
                "@type": "ImageObject",
                url: "https://srjglobaltechnologies.com/logo.png",
              },
            },
            blogPost: blogArticles.map((article) => ({
              "@type": "BlogPosting",
              headline: article.title,
              description: article.description,
              datePublished: article.publishedDate,
              author: {
                "@type": "Person",
                name: article.author,
              },
              url: `https://srjglobaltechnologies.com/blog/${article.slug}`,
            })),
          }),
        }}
      />

      <BlogHero />

      <div id="blog-articles">
        <CategoryBrowser
          categories={categoriesWithCounts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <LatestArticles articles={filteredArticles} />

        {!hasActiveFiltering && (
          <>
            <EditorsPicks articles={displayEditorPicks} />

            <SuccessStories stories={successStories} />

            <LatestVideos videos={videos} />

            <PopularTags
              tags={popularTags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />

            <div id="newsletter">
              <Newsletter />
            </div>



            <BlogFAQ />

          </>
        )}

        {hasActiveFiltering && (
          <div id="newsletter">
            <Newsletter />
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
