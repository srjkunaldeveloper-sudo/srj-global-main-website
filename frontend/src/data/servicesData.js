import {
  Code,
  Smartphone,
  PenTool,
  Cpu,
  Cloud,
  Database,
  Shield,
  Rocket,
  Laptop,
  Atom,
  Server,
  Layers,
  ShoppingCart,
  Palette,
  Network,
  Users,
  Eye,
  Globe,
  Monitor,
  Settings,
  LineChart,
  Search,
  Lock,
  Megaphone,
  Maximize2
} from "lucide-react";

export const EXISTING_SLUGS = [
  "website-designing",
  "custom-software-development",
  "web-development",
  "backend-development",
  "full-stack-development",
  "e-commerce-development",
  "android-app-development",
  "ios-app-development",
  "cross-platform-app-development",
  "mobile-app-development",
  "mobile-ui-ux",
  "ui-ux-designing",
  "product-design",
  "website-design",
  "user-research",
  "design-systems",
  "prototyping",
  "ai-automation",
  "ai-development",
  "machine-learning",
  "ai-chatbots",
  "computer-vision",
  "natural-language-processing",
  "cloud-computing",
  "cloud-migration",
  "aws-solutions",
  "microsoft-azure",
  "google-cloud",
  "devops-ci-cd",
  "data-analytics",
  "business-intelligence",
  "data-engineering",
  "data-visualization",
  "database-development",
  "data-science",
  "cyber-security",
  "security-audits",
  "penetration-testing",
  "application-security",
  "cloud-security",
  "vulnerability-assessment",
  "startup-tips",
  "startup-launch-support",
  "mvp-planning",
  "product-roadmap",
  "go-to-market-strategy",
  "market-research-analysis",
  "funding-pitch-deck-support",
  "startup-scaling-advisory",
];

export const serviceCategories = [
  {
    id: "software-development",
    title: "Software Development",
    description:
      "Build powerful digital products engineered for performance, scale, and long-term reliability.",
    icon: Code,
    light: true,
    accent: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    services: [
      { title: "Website Designing", description: "Responsive, high-performing websites engineered around your brand and goals.", icon: Laptop, image: "/src/assets/services/website-designing.jpg" },
      { title: "Custom Software Development", description: "Tailored web, desktop, and enterprise applications built to your exact workflows.", icon: Laptop, image: "/src/assets/services/custom-software.jpg" },
      { title: "Web Development", description: "Fast, modern web platforms with clean architecture and scalable foundations.", icon: Atom, image: "/src/assets/services/web-dev.jpg" },
      { title: "Backend Development", description: "Secure APIs, databases, and services that power your product behind the scenes.", icon: Server, image: "/src/assets/services/backend-dev.jpg" },
      { title: "Full-Stack Development", description: "End-to-end engineering across frontend, backend, and infrastructure.", icon: Layers, image: "/src/assets/services/fullstack-dev.jpg" },
      { title: "E-Commerce Development", description: "Online stores with secure payments and a smooth shopping experience.", icon: ShoppingCart, image: "/src/assets/services/ecommerce-dev.jpg" },
    ],
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile products that feel effortless on every device.",
    icon: Smartphone,
    accent: "gradient-primary",
    services: [
      { title: "Android App Development", description: "Performance-focused native Android apps for phones and tablets.", icon: Smartphone, image: "/src/assets/services/android-dev.jpg" },
      { title: "iOS App Development", description: "Polished native iOS applications with a refined user experience.", icon: Smartphone, image: "/src/assets/services/ios-dev.jpg" },
      { title: "Cross-Platform App Development", description: "One codebase, every platform — built with modern cross-platform tools.", icon: Smartphone, image: "/src/assets/services/cross-platform.jpg" },
      { title: "Mobile App Development", description: "End-to-end mobile products for startups and enterprises alike.", icon: Smartphone, image: "/src/assets/services/mobile-dev.jpg" },
      { title: "Mobile UI/UX", description: "Interfaces designed for touch, clarity, and effortless engagement.", icon: Palette, image: "/src/assets/services/mobile-uiux.jpg" },
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX & Digital Product Design",
    description:
      "Interfaces and product experiences that are intuitive, accessible, and conversion-focused.",
    icon: PenTool,
    light: true,
    accent: "gradient-primary",
    services: [
      { title: "UI/UX Designing", description: "Visually compelling, user-centered interfaces for web and mobile.", icon: PenTool, image: "/src/assets/services/uiux-designing.jpg" },
      { title: "Product Design", description: "Complete product experiences from first concept to final pixel.", icon: Network, image: "/src/assets/services/product-design.jpg" },
      { title: "Website Design", description: "Modern, responsive website design systems built around your users.", icon: Laptop, image: "/src/assets/services/website-design.jpg" },
      { title: "User Research", description: "Evidence-based insights that shape better product decisions.", icon: Users, image: "/src/assets/services/user-research.jpg" },
      { title: "Design Systems", description: "Reusable component libraries that keep experiences consistent.", icon: Layers, image: "/src/assets/services/design-systems.jpg" },
      { title: "Prototyping", description: "Interactive prototypes that validate ideas before development.", icon: Network, image: "/src/assets/services/prototyping.jpg" },
    ],
  },
  {
    id: "ai-intelligent-solutions",
    title: "AI & Intelligent Solutions",
    description:
      "Applied intelligence that turns data and automation into measurable business advantage.",
    icon: Cpu,
    accent: "gradient-primary",
    services: [
      { title: "AI Automation", description: "Intelligent automation that reduces manual work and boosts productivity.", icon: Cpu, image: "/src/assets/services/ai-automation.jpg" },
      { title: "AI Development", description: "Custom AI systems built around your data and business goals.", icon: Cpu, image: "/src/assets/services/ai-dev.jpg" },
      { title: "Machine Learning", description: "Predictive models that learn from your data to drive decisions.", icon: Cpu, image: "/src/assets/services/machine-learning.jpg" },
      { title: "AI Chatbots", description: "Conversational assistants that scale support and engagement.", icon: Cpu, image: "/src/assets/services/ai-chatbots.jpg" },
      { title: "Computer Vision", description: "Image and video intelligence for detection, analysis, and automation.", icon: Eye, image: "/src/assets/services/computer-vision.jpg" },
      { title: "Natural Language Processing", description: "Language understanding for search, content, and insights.", icon: Cpu, image: "/src/assets/services/nlp.jpg" },
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    description:
      "Resilient cloud infrastructure and automation that helps you ship faster and scale safely.",
    icon: Cloud,
    light: true,
    accent: "gradient-primary",
    services: [
      { title: "Cloud Computing", description: "Scalable cloud infrastructure designed for performance and cost efficiency.", icon: Cloud, image: "/src/assets/services/cloud-computing.jpg" },
      { title: "Cloud Migration", description: "Move legacy systems to the cloud with minimal risk and downtime.", icon: Cloud, image: "/src/assets/services/cloud-migration.jpg" },
      { title: "AWS Solutions", description: "Architecture and managed services on Amazon Web Services.", icon: Cloud, image: "/src/assets/services/aws-solutions.jpg" },
      { title: "Microsoft Azure", description: "Cloud and DevOps solutions built on Microsoft Azure.", icon: Monitor, image: "/src/assets/services/azure-solutions.jpg" },
      { title: "Google Cloud", description: "Scalable data and compute solutions on Google Cloud.", icon: Globe, image: "/src/assets/services/gcp-solutions.jpg" },
      { title: "DevOps & CI/CD", description: "Automated pipelines that ship code reliably and continuously.", icon: Settings, image: "/src/assets/services/devops.jpg" },
    ],
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    description:
      "Turn raw data into clear, actionable intelligence across your business.",
    icon: Database,
    accent: "gradient-primary",
    services: [
      { title: "Data Analytics", description: "Analyze and visualize data to uncover growth opportunities.", icon: LineChart, image: "/src/assets/services/data-analytics.jpg" },
      { title: "Business Intelligence", description: "Dashboards and reporting that keep teams aligned.", icon: LineChart, image: "/src/assets/services/business-intelligence.jpg" },
      { title: "Data Engineering", description: "Robust pipelines that move and prepare data at scale.", icon: Database, image: "/src/assets/services/data-engineering.jpg" },
      { title: "Data Visualization", description: "Clear, interactive visual stories from complex datasets.", icon: Network, image: "/src/assets/services/data-visualization.jpg" },
      { title: "Database Development", description: "Performant, secure databases designed for your workload.", icon: Server, image: "/src/assets/services/database-dev.jpg" },
      { title: "Data Science", description: "Modeling and analysis that turn data into foresight.", icon: Cpu, image: "/src/assets/services/data-science.jpg" },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description:
      "Protect your business with proactive security, audits, and continuous monitoring.",
    icon: Shield,
    light: true,
    accent: "gradient-primary",
    services: [
      { title: "Cyber Security", description: "End-to-end security solutions that safeguard your digital assets.", icon: Shield, image: "/src/assets/services/cyber-security.jpg" },
      { title: "Security Audits", description: "Comprehensive reviews that expose and close security gaps.", icon: Search, image: "/src/assets/services/security-audits.jpg" },
      { title: "Penetration Testing", description: "Authorized testing that finds vulnerabilities before attackers do.", icon: Users, image: "/src/assets/services/pentesting.jpg" },
      { title: "Application Security", description: "Secure coding and testing across your software lifecycle.", icon: Lock, image: "/src/assets/services/app-security.jpg" },
      { title: "Cloud Security", description: "Protect cloud infrastructure, identities, and workloads.", icon: Cloud, image: "/src/assets/services/cloud-security.jpg" },
      { title: "Vulnerability Assessment", description: "Continuous scanning and prioritization of risks.", icon: Eye, image: "/src/assets/services/vulnerability-assessment.jpg" },
    ],
  },
  {
    id: "startup-launch-support",
    title: "Startup Launch Support",
    description:
      "From MVP planning to go-to-market strategy, we help entrepreneurs launch successfully. We de-risk your launch with a proven product roadmap and execution framework.",
    icon: Rocket,
    accent: "gradient-primary",
    services: [
      { title: "MVP Planning", description: "Validate and scope your minimum viable product for maximum impact.", icon: Rocket, image: "/src/assets/services/mvp-planning.jpg" },
      { title: "Product Roadmap", description: "Strategic execution plans that keep your launch on track.", icon: Network, image: "/src/assets/services/product-roadmap.jpg" },
      { title: "Go-to-Market Strategy", description: "Launch frameworks that drive adoption and growth from day one.", icon: Megaphone, image: "/src/assets/services/gtm-strategy.jpg" },
      { title: "Market Research & Analysis", description: "Data-driven insights that shape product-market fit and reduce launch risk.", icon: Search, image: "/src/assets/services/market-research.jpg" },
      { title: "Funding & Pitch Deck Support", description: "Investor-ready pitch decks and financial models to secure early-stage funding.", icon: LineChart, image: "/src/assets/services/funding-pitch.jpg" },
      { title: "Startup Scaling Advisory", description: "Growth strategies and operational frameworks to scale beyond initial traction.", icon: Maximize2, image: "/src/assets/services/startup-scaling.jpg" },
    ],
  },
];

export const technologies = [
  "React",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "AWS",
  "Azure",
  "Google Cloud",
  "Kubernetes",
  "Docker",
  "AI & ML",
  "PostgreSQL",
  "MongoDB",
  "Flutter",
  "React Native",
  "Figma",
  "GraphQL",
];

export const processSteps = [
  {
    num: "01",
    title: "Discover",
    desc: "Understand your business, users, and the real problem to solve.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Create a clear strategy and a digital experience people love.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Develop secure, scalable technology in agile, visible iterations.",
  },
  {
    num: "04",
    title: "Launch",
    desc: "Deploy, measure, optimize, and grow long after go-live.",
  },
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getServiceHref(title) {
  const slug = slugify(title);
  return EXISTING_SLUGS.includes(slug) ? `/services/${slug}` : "/services";
}
