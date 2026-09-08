import AboutHero from "./about/AboutHero";
import TrustedBy from "./TrustedBy";
import { BrandLogo } from "./TrustedBy";
import OurJourney from "./about/OurJourney";
import ClientReviews from "./about/ClientReviews";
import Stats from "./Stats";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Trophy, Target, Shield, Zap, Code, Cpu } from "lucide-react";
import SEO from "./SEO";

export default function About() {
  const clientLogos = [
    { name: "Google Cloud", forceUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", domain: "googlecloud.com", id: "google-cloud", scale: 1 },
    { name: "AWS Partner", forceUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", domain: "aws.amazon.com", id: "aws", scale: 0.85 },
    { name: "ISO Certified", forceUrl: "", domain: "iso.org", id: "iso", scale: 1.2 },
    { name: "Microsoft", forceUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", domain: "microsoft.com", id: "microsoft", scale: 1 },
    { name: "Salesforce", forceUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg", domain: "salesforce.com", id: "salesforce", scale: 1.15 },
    { name: "Intel Partner", forceUrl: "", domain: "intel.com", id: "intel", scale: 1.1 }
  ];

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-slate-50 min-h-screen">
      <SEO 
        title="About Us"
        description="Learn more about SRJ Global Technologies, our mission, vision, and the expert team driving digital transformation for businesses worldwide."
        keywords="about SRJ Global Technologies, IT company, digital transformation, tech experts"
        url="https://srjglobaltechnology.com/about"
      />
      <AboutHero />

      <TrustedBy />

      <OurJourney />

      <Stats />

      {/* RECOGNIZED & TRUSTED WORLDWIDE */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto text-center w-full">
          <div className="mb-8">
            <p className="text-slate-500 text-[11px] font-bold tracking-[2.5px] uppercase inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              Recognized & Trusted Worldwide
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 w-full">
            {clientLogos.map((logo, i) => (
              <motion.div
                key={i}
                className="h-10 flex items-center justify-center cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.95 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <BrandLogo 
                  domain={logo.domain}
                  id={logo.id}
                  alt={logo.name} 
                  forceUrl={logo.forceUrl}
                  customStyle={{ 
                    height: "100%", 
                    width: "auto", 
                    objectFit: "contain",
                    transform: `scale(${logo.scale})`,
                    transition: "all 0.3s ease"
                  }} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ClientReviews />

    </div>
  );
}
