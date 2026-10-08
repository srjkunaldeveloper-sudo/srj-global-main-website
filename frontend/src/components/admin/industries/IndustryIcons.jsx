import React from 'react';
import {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
} from 'react-icons/fa';

export const PRESET_ICONS = [
  { name: 'FaRocket', label: 'Rocket (Startups / Innovation)', icon: FaRocket },
  { name: 'FaBuilding', label: 'Building (Enterprise / Real Estate)', icon: FaBuilding },
  { name: 'FaGraduationCap', label: 'Graduation Cap (EdTech / Education)', icon: FaGraduationCap },
  { name: 'FaShoppingCart', label: 'Shopping Cart (E-Commerce & Retail)', icon: FaShoppingCart },
  { name: 'FaShieldAlt', label: 'Shield (Cybersecurity & Fintech)', icon: FaShieldAlt },
  { name: 'FaUsers', label: 'Users (Social Networks & Community)', icon: FaUsers },
  { name: 'FaHeartbeat', label: 'Heartbeat (Healthcare & MedTech)', icon: FaHeartbeat },
  { name: 'FaCalendarAlt', label: 'Calendar (Events & Bookings)', icon: FaCalendarAlt },
  { name: 'FaUtensils', label: 'Utensils (Hospitality & FoodTech)', icon: FaUtensils },
  { name: 'FaTicketAlt', label: 'Ticket (Entertainment & Travel)', icon: FaTicketAlt },
  { name: 'FaBriefcase', label: 'Briefcase (Corporate & B2B Services)', icon: FaBriefcase },
  { name: 'FaStore', label: 'Store (Retail Outlets & POS)', icon: FaStore },
];

export const PRESET_COLORS = [
  '#2563EB', '#3B82F6', '#06B6D4', '#10B981', '#14B8A6',
  '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
];

export const ICON_MAP = {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
};

export function renderIndustryIcon(iconName, color = '#2563EB', size = 18) {
  const IconComp = ICON_MAP[iconName] || FaRocket;
  return <IconComp size={size} style={{ color }} />;
}
