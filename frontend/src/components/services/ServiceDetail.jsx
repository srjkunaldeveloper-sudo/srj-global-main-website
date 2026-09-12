import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, DollarSign } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import SEO from '../SEO';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services/${id}`);
        setService(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Could not load service details.");
        setLoading(false);
      }
    };
    
    fetchService();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || "Service not found"}</h2>
        <button 
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Services
        </button>
      </div>
    );
  }

  // Dynamic Lucide Icon Resolver
  const renderServiceIcon = (iconName) => {
    if (!iconName) return null;
    if (typeof iconName === 'function' || typeof iconName === 'object') {
      const IconComponent = iconName;
      return <IconComponent size={16} />;
    }
    if (typeof iconName === 'string') {
      const IconComponent = LucideIcons[iconName] || LucideIcons.Layers;
      return <IconComponent size={16} />;
    }
    return null;
  };

  // Service JSON-LD Schema
  const canonicalBase = 'https://srjglobaltechnology.com';
  const serviceCanonicalUrl = `${canonicalBase}/services/${id}`;
  const categoryName = typeof service.category === 'object' && service.category ? service.category.title : service.category;

  const serviceSchema = {
    "@type": "Service",
    "@id": `${serviceCanonicalUrl}#service`,
    "name": service.title,
    "description": service.short_description || service.description || `Expert ${service.title} services by SRJ Global Technologies.`,
    "url": serviceCanonicalUrl,
    "provider": {
      "@id": `${canonicalBase}/#organization`
    },
    ...(service.image ? { "image": service.image } : {}),
    ...(categoryName ? { "serviceType": categoryName } : {})
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <SEO 
        title={service.title}
        description={service.short_description || service.description || `Expert ${service.title} services by SRJ Global Technologies.`}
        image={service.image}
        url={serviceCanonicalUrl}
        extraSchema={serviceSchema}
      />

      <div className="max-w-5xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-10 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="mb-10">
            {/* Header Badges: Category, Icon & Price */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {categoryName && (
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50">
                  {categoryName}
                </span>
              )}
              {service.icon && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200">
                  {renderServiceIcon(service.icon)}
                  <span>{typeof service.icon === 'string' ? service.icon : 'Feature'}</span>
                </span>
              )}
              {service.price && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <DollarSign size={14} className="text-emerald-600" />
                  <span>{String(service.price).includes('$') ? service.price : `$${service.price}`}</span>
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-6">
              {service.short_description || service.description}
            </p>

            {/* Tags Pills */}
            {Array.isArray(service.tags) && service.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Tag size={14} className="text-slate-400 mr-1" />
                {service.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {service.image && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-sm">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight text-slate-700 leading-relaxed">
            {service.full_description ? (
              <div dangerouslySetInnerHTML={{ __html: service.full_description }} />
            ) : (
              <p>Contact us for detailed information on how we execute this service tailored to your business needs.</p>
            )}
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to start?</h3>
              <p className="text-slate-500">Let's discuss how we can help your business.</p>
            </div>
            <button 
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors w-full sm:w-auto text-center cursor-pointer"
            >
              Get a Proposal
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
