import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../config/api';

/**
 * EMERGENCY FALLBACK DATASET
 * --------------------------
 * DB / API is the primary source of truth for public navigation.
 * This fallback dataset serves as temporary emergency runtime protection only,
 * ensuring public Navbar and Footer never crash or render blank navigation
 * if the backend database connection is temporarily unavailable.
 */
const EMERGENCY_FALLBACK_ITEMS = [
  // Header Top-Level Navigation
  { id: 1, group_location: 'header', parent_id: null, label: 'Home', url: '/', item_type: 'route', target: '_self', sort_order: 1, is_active: 1 },
  { id: 2, group_location: 'header', parent_id: null, label: 'Services', url: '/services', item_type: 'route', target: '_self', sort_order: 2, is_active: 1 },
  { id: 3, group_location: 'header', parent_id: null, label: 'Pricing', url: '/pricing', item_type: 'route', target: '_self', sort_order: 3, is_active: 1 },
  { id: 4, group_location: 'header', parent_id: null, label: 'Collaboration', url: '/collaboration', item_type: 'route', target: '_self', sort_order: 4, is_active: 1 },
  { id: 5, group_location: 'header', parent_id: null, label: 'Industries', url: '/industries', item_type: 'route', target: '_self', sort_order: 5, is_active: 1 },
  { id: 6, group_location: 'header', parent_id: null, label: 'About Us', url: '/about', item_type: 'route', target: '_self', sort_order: 6, is_active: 1 },
  { id: 7, group_location: 'header', parent_id: null, label: 'Contact Us', url: '/contact', item_type: 'route', target: '_self', sort_order: 7, is_active: 1 },

  // Services Submenu Children (under parent_id = 2)
  { id: 8, group_location: 'header', parent_id: 2, label: 'Game Development', url: '/services#game-development', item_type: 'hash', target: '_self', icon_name: 'Rocket', description: 'Immersive 2D/3D games for mobile, PC & console', sort_order: 1, is_active: 1 },
  { id: 9, group_location: 'header', parent_id: 2, label: 'Software Development', url: '/services#software-development', item_type: 'hash', target: '_self', icon_name: 'Code', description: 'Enterprise-grade custom software & web applications', sort_order: 2, is_active: 1 },
  { id: 10, group_location: 'header', parent_id: 2, label: 'Mobile App Development', url: '/services#mobile-app-development', item_type: 'hash', target: '_self', icon_name: 'Smartphone', description: 'Native & cross-platform iOS/Android mobile apps', sort_order: 3, is_active: 1 },
  { id: 11, group_location: 'header', parent_id: 2, label: 'UI/UX & Digital Product Design', url: '/services#ui-ux-design', item_type: 'hash', target: '_self', icon_name: 'PenTool', description: 'User-centric interfaces & engaging digital experiences', sort_order: 4, is_active: 1 },
  { id: 12, group_location: 'header', parent_id: 2, label: 'AI & Intelligent Solutions', url: '/services#ai-intelligent-solutions', item_type: 'hash', target: '_self', icon_name: 'Cpu', description: 'Machine learning, LLMs & intelligent automation', sort_order: 5, is_active: 1 },
  { id: 13, group_location: 'header', parent_id: 2, label: 'Cloud & DevOps', url: '/services#cloud-devops', item_type: 'hash', target: '_self', icon_name: 'Cloud', description: 'Scalable cloud infrastructure & DevOps automation', sort_order: 6, is_active: 1 },
  { id: 14, group_location: 'header', parent_id: 2, label: 'Data & Analytics', url: '/services#data-analytics', item_type: 'hash', target: '_self', icon_name: 'Database', description: 'Data engineering, business intelligence & analytics', sort_order: 7, is_active: 1 },
  { id: 15, group_location: 'header', parent_id: 2, label: 'Cybersecurity', url: '/services#cybersecurity', item_type: 'hash', target: '_self', icon_name: 'Shield', description: 'Security audits, penetration testing & compliance', sort_order: 8, is_active: 1 },
  { id: 16, group_location: 'header', parent_id: 2, label: 'Startup Launch Support', url: '/services#startup-launch-support', item_type: 'hash', target: '_self', icon_name: 'Rocket', description: 'MVP development & technical advisory for startups', sort_order: 9, is_active: 1 },

  // Pricing Submenu Children (under parent_id = 3)
  { id: 17, group_location: 'header', parent_id: 3, label: 'Base Architecture', url: '/pricing', item_type: 'route', target: '_self', icon_name: 'Code', description: 'Perfect for startups and small business websites.', sort_order: 1, is_active: 1 },
  { id: 18, group_location: 'header', parent_id: 3, label: 'Premium Experience', url: '/pricing', item_type: 'route', target: '_self', icon_name: 'PenTool', description: 'Advanced features, integrations, and performance.', sort_order: 2, is_active: 1 },
  { id: 19, group_location: 'header', parent_id: 3, label: 'Enterprise Suite', url: '/pricing', item_type: 'route', target: '_self', icon_name: 'Database', description: 'Custom tailored platforms for massive scale.', sort_order: 3, is_active: 1 },

  // Footer Quick Links
  { id: 20, group_location: 'footer_quick', parent_id: null, label: 'Contact Us', url: '/contact', item_type: 'route', target: '_self', sort_order: 1, is_active: 1 },
  { id: 21, group_location: 'footer_quick', parent_id: null, label: 'Pricing Plans', url: '/pricing', item_type: 'route', target: '_self', sort_order: 2, is_active: 1 },
  { id: 22, group_location: 'footer_quick', parent_id: null, label: 'Blog', url: '/blog', item_type: 'route', target: '_self', sort_order: 3, is_active: 1 },
  { id: 23, group_location: 'footer_quick', parent_id: null, label: 'Careers', url: '/careers', item_type: 'route', target: '_self', sort_order: 4, is_active: 1 },
  { id: 24, group_location: 'footer_quick', parent_id: null, label: 'Collaboration', url: '/collaboration', item_type: 'route', target: '_self', sort_order: 5, is_active: 1 },

  // Footer Legal Links
  { id: 25, group_location: 'footer_legal', parent_id: null, label: 'Privacy Policy', url: '/privacy', item_type: 'route', target: '_self', sort_order: 1, is_active: 1 },
  { id: 26, group_location: 'footer_legal', parent_id: null, label: 'Cookies', url: '#contact', item_type: 'hash', target: '_self', sort_order: 2, is_active: 1 },
  { id: 27, group_location: 'footer_legal', parent_id: null, label: 'Terms & Conditions', url: '/terms', item_type: 'route', target: '_self', sort_order: 3, is_active: 1 }
];

/**
 * Pure Data Transformation & Sorting Helper
 * -----------------------------------------
 * Converts flat navigation array into structured header & footer hierarchies.
 */
function transformNavigationData(flatItems = []) {
  if (!Array.isArray(flatItems) || flatItems.length === 0) {
    return { headerNav: [], footerQuickNav: [], footerLegalNav: [] };
  }

  // Filter only active records
  const activeItems = flatItems.filter((item) => item && (item.is_active === 1 || item.is_active === true));

  // Sort helper: sort_order ASC, then id ASC
  const sortByOrder = (a, b) => {
    const orderA = a.sort_order !== undefined ? Number(a.sort_order) : 0;
    const orderB = b.sort_order !== undefined ? Number(b.sort_order) : 0;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id || 0) - (b.id || 0);
  };

  // Header Items
  const headerItems = activeItems.filter((item) => item.group_location === 'header');
  const topLevelHeaderMap = new Map();
  const topLevelHeaderList = [];

  headerItems.forEach((item) => {
    if (!item.parent_id) {
      const parentObj = { ...item, children: [] };
      topLevelHeaderMap.set(item.id, parentObj);
      topLevelHeaderList.push(parentObj);
    }
  });

  // Attach children to parents
  headerItems.forEach((item) => {
    if (item.parent_id && topLevelHeaderMap.has(item.parent_id)) {
      const parentObj = topLevelHeaderMap.get(item.parent_id);
      parentObj.children.push({ ...item });
    }
  });

  // Sort top-level header items and their respective children
  topLevelHeaderList.sort(sortByOrder);
  topLevelHeaderList.forEach((parent) => {
    if (Array.isArray(parent.children)) {
      parent.children.sort(sortByOrder);
    }
  });

  // Footer Quick Links
  const footerQuickNav = activeItems
    .filter((item) => item.group_location === 'footer_quick')
    .sort(sortByOrder)
    .map((item) => ({ ...item }));

  // Footer Legal Links
  const footerLegalNav = activeItems
    .filter((item) => item.group_location === 'footer_legal')
    .sort(sortByOrder)
    .map((item) => ({ ...item }));

  return {
    headerNav: topLevelHeaderList,
    footerQuickNav,
    footerLegalNav
  };
}

const initialFallbackNav = transformNavigationData(EMERGENCY_FALLBACK_ITEMS);

const NavigationContext = createContext({
  headerNav: initialFallbackNav.headerNav,
  footerQuickNav: initialFallbackNav.footerQuickNav,
  footerLegalNav: initialFallbackNav.footerLegalNav,
  loading: true,
  error: null,
  refreshNavigation: async () => {}
});

export const NavigationProvider = ({ children }) => {
  const [navData, setNavData] = useState(initialFallbackNav);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNavigation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/navigation');
      if (res.data && res.data.success && Array.isArray(res.data.navigation || res.data.data)) {
        const rawList = res.data.navigation || res.data.data;
        const transformed = transformNavigationData(rawList);
        setNavData(transformed);
        setError(null);
      } else {
        setError('Invalid response format received from navigation API.');
      }
    } catch (err) {
      console.warn('NavigationProvider: API fetch failed, retaining emergency fallback dataset:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch live navigation data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavigation();
  }, [fetchNavigation]);

  const value = useMemo(
    () => ({
      headerNav: navData.headerNav,
      footerQuickNav: navData.footerQuickNav,
      footerLegalNav: navData.footerLegalNav,
      loading,
      error,
      refreshNavigation: fetchNavigation
    }),
    [navData, loading, error, fetchNavigation]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationContext;
