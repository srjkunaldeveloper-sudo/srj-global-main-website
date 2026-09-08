import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import "../../styles/services.css";

import ServicesHero from "./ServicesHero";
import GameDevelopment from "./GameDevelopment";
import ServicesIntro from "./ServicesIntro";
import ServiceCategory from "./ServiceCategory";
import ServiceCard from "./ServiceCard";
import TechnologyStrip from "./TechnologyStrip";
import { serviceCategories } from "../../data/servicesData";
import SEO from "../SEO";

export default function ServicesPage() {
  const location = useLocation();
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        if (Array.isArray(res.data)) {
          setDbServices(res.data);
        } else if (res.data && Array.isArray(res.data.services)) {
          setDbServices(res.data.services);
        }
      } catch (err) {
        console.error("Error fetching services from DB:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="services-page pt-4">
      <SEO 
        title="Our Services"
        description="Explore our wide range of software development and IT consulting services designed to accelerate your business growth."
        keywords="software services, web development, app development, IT consulting, SRJ Global Technologies services"
        url="https://srjglobaltechnology.com/services"
      />

      {/* 1. HERO */}
      <ServicesHero />

      {/* 2. GAME DEVELOPMENT */}
      <GameDevelopment />

      {/* 3. DIRECTORY INTRO */}
      <ServicesIntro />

      {/* 4. CATEGORY DIRECTORY */}
      <section className="services-directory">
        {serviceCategories.map((category) => {
          // Find DB services belonging to this category
          const categoryDbServices = dbServices.filter(s => s.category_id === category.id).map(s => ({
            ...s,
            description: s.short_description || s.description, // Map db field to expected prop
          }));
          
          // Use only DB services, omitting static ones to prevent duplication
          const mergedCategory = {
            ...category,
            services: categoryDbServices
          };

          return <ServiceCategory key={category.id} category={mergedCategory} />;
        })}
        
        {/* Dynamic Database Services Section (Uncategorized only) */}
        {dbServices.filter(s => !s.category_id).length > 0 && (
          <div className="max-w-9xl mx-auto px-6 py-16 border-t border-slate-100">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Custom Solutions & Add-on Services
            </h2>
            <p className="text-lg text-slate-500 mb-12 max-w-3xl">
              Specialized, dynamic capabilities launched from our control center to cater to unique client requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbServices.filter(s => !s.category_id).map((service, index) => {
                const formattedService = {
                  ...service,
                  description: service.short_description || service.description,
                };
                return (
                  <div key={service.id} className="h-[420px]">
                    <ServiceCard
                      service={formattedService}
                      href={`/services/${service.id}`}
                      index={index}
                      categoryTitle="Custom Solution"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 5. TECHNOLOGY STRIP */}
      <TechnologyStrip />
    </div>
  );
}
