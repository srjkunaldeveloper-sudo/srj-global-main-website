import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  UserPlus, 
  Users, 
  Sparkles, 
  Info,
  DollarSign,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Edit,
  Folder,
  HelpCircle,
  Layers,
  UsersRound,
  UserCheck,
  UserX,
  Search,
  Eye,
  Clock,
  Building,
  Filter,
  Compass,
  Award
} from 'lucide-react';
import api from '../../config/api';
import { serviceCategories } from '../../data/servicesData';
import SiteSettingsManager from './SiteSettingsManager';
import NavigationManager from './NavigationManager';
import PartnerLogoManager from './PartnerLogoManager';
import ProcessManager from './ProcessManager';
import CompanyStatsManager from './CompanyStatsManager';
import TrustPointsManager from './TrustPointsManager';
import AdminUserManager from './AdminUserManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Testimonial Form State
  const [newTestimonial, setNewTestimonial] = useState({
    quote: '', author: '', role: '', company: '', rating: 5, sort_order: 0, image: null, is_active: 1
  });
  const [editTestimonialId, setEditTestimonialId] = useState(null);

  // Portfolio Form State
  const [newPortfolio, setNewPortfolio] = useState({
    title: '', category: '', tags: '', project_url: '', description: '', sort_order: 0, image: null, is_active: 1
  });
  const [editPortfolioId, setEditPortfolioId] = useState(null);

  // FAQ Form State
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({
    question: '', answer: '', category: 'General', sort_order: 0, is_active: 1
  });
  const [editFaqId, setEditFaqId] = useState(null);

  // Industry Form State
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState({
    id: '', title: '', subtitle: '', icon: '', color: '#3B82F6', description: '', badge: '', features: '', benefits: '', sort_order: 0, is_active: 1
  });
  const [editIndustryId, setEditIndustryId] = useState(null);

  // Team Form State
  const [team, setTeam] = useState([]);
  const [newTeam, setNewTeam] = useState({
    name: '', role: '', role_class: 'dev', bio: '', image: '', featured: 0, online: 1, verified: 0, badge: '', linkedin: '', github: '', twitter: '', email: '', website: '', sort_order: 0, is_active: 1
  });
  const [editTeamId, setEditTeamId] = useState(null);
  const [teamImageFile, setTeamImageFile] = useState(null);
  const [teamImagePreview, setTeamImagePreview] = useState(null);
  
  // Subscriber State
  const [subscribers, setSubscribers] = useState([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  
  // Contact Admin State
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');
  const [selectedContactModal, setSelectedContactModal] = useState(null);
  
  // Services Category Tab State
  const [activeServiceTab, setActiveServiceTab] = useState('all');
  
  // Job Form State
  const [newJob, setNewJob] = useState({
    title: '', location: '', experience: '', type: '', salary: '', category: '', tags: ''
  });
  const [editJobId, setEditJobId] = useState(null);
  
  // Blog Form State
  const [newBlog, setNewBlog] = useState({
    title: '', category: '', type: 'Fresh Perspectives', description: '', content: '', image: '', author: 'SRJ Global Softech'
  });
  const [editBlogId, setEditBlogId] = useState(null);

  // Service Form State
  const [newService, setNewService] = useState({
    title: '', icon: '', image: '', short_description: '', full_description: '', category_id: '', price: '', is_home: false, tags: '', sort_order: 0
  });
  const [editServiceId, setEditServiceId] = useState(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  // Promotion Form State
  const [newPromotion, setNewPromotion] = useState({
    title: '', description: '', cta_text: 'Learn More', cta_link: '', image: null
  });

  // User/Admin Form State
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'admin'
  });

  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{"name": "Administrator"}');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const showNotification = (type, text) => {
    if (type === 'success') {
      setSuccessMessage(text);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(text);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (activeTab === 'blogs') {
        const res = await api.get('/blogs');
        setBlogs(res.data.blogs || res.data || []);
      } else if (activeTab === 'services') {
        const res = await api.get('/services');
        setServices(res.data.services || res.data || []);
      } else if (activeTab === 'contacts') {
        const res = await api.get('/contact');
        setContacts(res.data.contacts || res.data || []);
      } else if (activeTab === 'plans') {
        const res = await api.get('/plans');
        setPlans(res.data.plans || res.data.inquiries || res.data || []);
      } else if (activeTab === 'users') {
        const res = await api.get('/auth/users');
        setUsers(res.data.users || res.data || []);
      } else if (activeTab === 'promotions') {
        const res = await api.get('/promotions');
        setPromotions(res.data.promotions || res.data || []);
      } else if (activeTab === 'testimonials') {
        const res = await api.get('/testimonials/admin');
        setTestimonials(res.data.testimonials || res.data || []);
      } else if (activeTab === 'portfolio') {
        const res = await api.get('/portfolio/admin');
        setPortfolio(res.data.portfolio || res.data || []);
      } else if (activeTab === 'faqs') {
        const res = await api.get('/faqs/admin');
        setFaqs(res.data.faqs || res.data || []);
      } else if (activeTab === 'industries') {
        const res = await api.get('/industries/admin');
        setIndustries(res.data.industries || res.data || []);
      } else if (activeTab === 'team') {
        const res = await api.get('/team/admin');
        setTeam(res.data.team || res.data || []);
      } else if (activeTab === 'subscribers') {
        const res = await api.get('/subscribers/admin');
        setSubscribers(res.data.subscribers || res.data || []);
      } else if (activeTab === 'careers') {
        const res = await api.get('/jobs');
        setJobs(res.data || []);
        const appRes = await api.get('/jobs/applications');
        setApplications(appRes.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', `Failed to load data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CREATE / UPDATE handlers
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newBlog,
        slug: newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      };
      
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      });

      if (editBlogId) {
        await api.put(`/blogs/${editBlogId}`, formData);
        showNotification('success', 'Blog post updated successfully!');
      } else {
        await api.post('/blogs', formData);
        showNotification('success', 'Blog post created successfully!');
      }
      setNewBlog({ title: '', category: '', type: 'Fresh Perspectives', description: '', content: '', image: '', author: 'SRJ Global Softech' });
      setEditBlogId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleEditBlog = (blog) => {
    setNewBlog({
      title: blog.title || '',
      category: blog.category || '',
      type: blog.type || 'Fresh Perspectives',
      description: blog.description || '',
      content: blog.content || '',
      image: blog.image || '',
      author: blog.author || 'SRJ Global Softech'
    });
    setEditBlogId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newService).forEach(key => {
        if (newService[key] !== null && newService[key] !== undefined && newService[key] !== '') {
          formData.append(key, newService[key]);
        }
      });

      if (editServiceId) {
        await api.put(`/services/${editServiceId}`, formData);
        showNotification('success', 'Service updated successfully!');
        setIsEditServiceModalOpen(false);
      } else {
        await api.post('/services', formData);
        showNotification('success', 'Service created successfully!');
      }
      setNewService({ title: '', icon: '', image: '', short_description: '', full_description: '', category_id: '', price: '', is_home: false, tags: '', sort_order: 0 });
      setEditServiceId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEditService = (service) => {
    setNewService({
      title: service.title || '',
      icon: service.icon || '',
      image: service.image || '',
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      category_id: service.category_id || '',
      price: service.price || '',
      is_home: Boolean(service.is_home),
      tags: Array.isArray(service.tags) ? service.tags.join(', ') : (service.tags || ''),
      sort_order: service.sort_order || 0
    });
    setEditServiceId(service.id);
    setIsEditServiceModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      showNotification('success', 'Admin user registered successfully!');
      setNewUser({ name: '', email: '', password: '', role: 'admin' });
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to register user');
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newPromotion.title);
      formData.append('description', newPromotion.description);
      formData.append('cta_text', newPromotion.cta_text);
      formData.append('cta_link', newPromotion.cta_link);
      if (newPromotion.image) {
        formData.append('image', newPromotion.image);
      }

      await api.post('/promotions', formData);
      const res = await api.get('/promotions');
      setPromotions(res.data.promotions || res.data || []);
      setNewPromotion({ title: '', description: '', cta_text: 'Learn More', cta_link: '', image: null });
      setSuccessMessage('Promotion created successfully');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePromotion = async (id, currentStatus) => {
    try {
      await api.put(`/promotions/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Announcement launch status toggled!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle launch status');
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this launch announcement?')) return;
    try {
      await api.delete(`/promotions/${id}`);
      showNotification('success', 'Announcement deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  // TESTIMONIAL handlers
  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newTestimonial).forEach(key => {
        if (newTestimonial[key] !== null && newTestimonial[key] !== undefined) {
          formData.append(key, newTestimonial[key]);
        }
      });

      if (editTestimonialId) {
        await api.put(`/testimonials/${editTestimonialId}`, formData);
        showNotification('success', 'Testimonial updated successfully!');
      } else {
        await api.post('/testimonials', formData);
        showNotification('success', 'Testimonial created successfully!');
      }
      setNewTestimonial({ quote: '', author: '', role: '', company: '', rating: 5, sort_order: 0, image: null, is_active: 1 });
      setEditTestimonialId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestimonial = (item) => {
    setNewTestimonial({
      quote: item.quote || '',
      author: item.author || '',
      role: item.role || '',
      company: item.company || '',
      rating: item.rating || 5,
      sort_order: item.sort_order || 0,
      image: item.image || null,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditTestimonialId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTestimonial = async (id, currentStatus) => {
    try {
      await api.put(`/testimonials/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Testimonial status updated!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      showNotification('success', 'Testimonial deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  // PORTFOLIO handlers
  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.title.trim()) {
      showNotification('error', 'Project title is required');
      return;
    }
    if (!newPortfolio.category || !newPortfolio.category.trim()) {
      showNotification('error', 'Category is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newPortfolio).forEach(key => {
        if (newPortfolio[key] !== null && newPortfolio[key] !== undefined) {
          formData.append(key, newPortfolio[key]);
        }
      });

      if (editPortfolioId) {
        await api.put(`/portfolio/${editPortfolioId}`, formData);
        showNotification('success', 'Portfolio project updated successfully!');
      } else {
        await api.post('/portfolio', formData);
        showNotification('success', 'Portfolio project created successfully!');
      }

      setNewPortfolio({ title: '', category: '', tags: '', project_url: '', description: '', sort_order: 0, image: null, is_active: 1 });
      setEditPortfolioId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save portfolio project');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPortfolio = (item) => {
    const formattedTags = Array.isArray(item.tags) 
      ? item.tags.join(', ') 
      : (typeof item.tags === 'string' ? item.tags : '');

    setNewPortfolio({
      title: item.title || '',
      category: item.category || '',
      tags: formattedTags,
      project_url: item.project_url || '',
      description: item.description || '',
      sort_order: item.sort_order || 0,
      image: item.image || null,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditPortfolioId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePortfolio = async (id, currentStatus) => {
    try {
      await api.put(`/portfolio/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Portfolio status updated!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      showNotification('success', 'Portfolio project deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete portfolio project');
    }
  };

  // FAQ handlers
  const handleCreateFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.question.trim()) {
      showNotification('error', 'Question is required');
      return;
    }
    if (!newFaq.answer || !newFaq.answer.trim()) {
      showNotification('error', 'Answer is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        category: newFaq.category && newFaq.category.trim() ? newFaq.category.trim() : 'General',
        sort_order: parseInt(newFaq.sort_order, 10) || 0,
        is_active: parseInt(newFaq.is_active, 10) === 1 ? 1 : 0
      };

      if (editFaqId) {
        await api.put(`/faqs/${editFaqId}`, payload);
        showNotification('success', 'FAQ updated successfully!');
      } else {
        await api.post('/faqs', payload);
        showNotification('success', 'FAQ created successfully!');
      }

      setNewFaq({ question: '', answer: '', category: 'General', sort_order: 0, is_active: 1 });
      setEditFaqId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaq = (item) => {
    setNewFaq({
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || 'General',
      sort_order: item.sort_order !== undefined ? item.sort_order : 0,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditFaqId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFaq = async (id) => {
    try {
      await api.put(`/faqs/${id}/toggle`);
      showNotification('success', 'FAQ status updated!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      showNotification('success', 'FAQ deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  // INDUSTRY handlers
  const handleCreateIndustry = async (e) => {
    e.preventDefault();
    if (!newIndustry.id || !newIndustry.id.trim()) {
      showNotification('error', 'Industry ID / Slug is required');
      return;
    }
    if (!newIndustry.title || !newIndustry.title.trim()) {
      showNotification('error', 'Industry title is required');
      return;
    }
    if (!newIndustry.subtitle || !newIndustry.subtitle.trim()) {
      showNotification('error', 'Subtitle is required');
      return;
    }
    if (!newIndustry.icon || !newIndustry.icon.trim()) {
      showNotification('error', 'Icon name is required');
      return;
    }
    if (!newIndustry.color || !newIndustry.color.trim()) {
      showNotification('error', 'Hex color code is required');
      return;
    }
    if (!newIndustry.description || !newIndustry.description.trim()) {
      showNotification('error', 'Description is required');
      return;
    }
    if (!newIndustry.badge || !newIndustry.badge.trim()) {
      showNotification('error', 'Badge label is required');
      return;
    }

    setLoading(true);
    try {
      const featuresArray = typeof newIndustry.features === 'string'
        ? newIndustry.features.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(newIndustry.features) ? newIndustry.features : []);

      const benefitsArray = typeof newIndustry.benefits === 'string'
        ? newIndustry.benefits.split(',').map(s => s.trim()).filter(Boolean)
        : (Array.isArray(newIndustry.benefits) ? newIndustry.benefits : []);

      const payload = {
        id: newIndustry.id.trim().toLowerCase(),
        title: newIndustry.title.trim(),
        subtitle: newIndustry.subtitle.trim(),
        icon: newIndustry.icon.trim(),
        color: newIndustry.color.trim(),
        description: newIndustry.description.trim(),
        badge: newIndustry.badge.trim(),
        features: featuresArray,
        benefits: benefitsArray,
        sort_order: parseInt(newIndustry.sort_order, 10) || 0,
        is_active: parseInt(newIndustry.is_active, 10) === 1 ? 1 : 0
      };

      if (editIndustryId) {
        await api.put(`/industries/${editIndustryId}`, payload);
        showNotification('success', 'Industry updated successfully!');
      } else {
        await api.post('/industries', payload);
        showNotification('success', 'Industry created successfully!');
      }

      setNewIndustry({
        id: '', title: '', subtitle: '', icon: '', color: '#3B82F6', description: '', badge: '', features: '', benefits: '', sort_order: 0, is_active: 1
      });
      setEditIndustryId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save industry');
    } finally {
      setLoading(false);
    }
  };

  const handleEditIndustry = (item) => {
    const formattedFeatures = Array.isArray(item.features)
      ? item.features.join(', ')
      : (typeof item.features === 'string' ? item.features : '');

    const formattedBenefits = Array.isArray(item.benefits)
      ? item.benefits.join(', ')
      : (typeof item.benefits === 'string' ? item.benefits : '');

    setNewIndustry({
      id: item.id || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      icon: item.icon || '',
      color: item.color || '#3B82F6',
      description: item.description || '',
      badge: item.badge || '',
      features: formattedFeatures,
      benefits: formattedBenefits,
      sort_order: item.sort_order !== undefined ? item.sort_order : 0,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditIndustryId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleIndustry = async (id) => {
    try {
      await api.put(`/industries/${id}/toggle`);
      showNotification('success', 'Industry status updated!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteIndustry = async (id) => {
    if (!window.confirm(`Are you sure you want to delete the industry "${id}"?`)) return;
    try {
      await api.delete(`/industries/${id}`);
      showNotification('success', 'Industry deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete industry');
    }
  };

  // TEAM handlers
  const handleTeamImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamImageFile(file);
      setTeamImagePreview(URL.createObjectURL(file));
      setNewTeam(prev => ({ ...prev, image: file }));
    }
  };

  const handleRemoveTeamImage = () => {
    setTeamImageFile(null);
    setTeamImagePreview(null);
    setNewTeam(prev => ({ ...prev, image: 'REMOVE' }));
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.name.trim()) {
      showNotification('error', 'Member name is required');
      return;
    }
    if (!newTeam.role || !newTeam.role.trim()) {
      showNotification('error', 'Member role is required');
      return;
    }
    if (!newTeam.bio || !newTeam.bio.trim()) {
      showNotification('error', 'Biography is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append('name', newTeam.name.trim());
      formData.append('role', newTeam.role.trim());
      formData.append('role_class', newTeam.role_class ? newTeam.role_class.trim() : 'dev');
      formData.append('bio', newTeam.bio.trim());
      formData.append('featured', newTeam.featured ? 1 : 0);
      formData.append('online', newTeam.online ? 1 : 0);
      formData.append('verified', newTeam.verified ? 1 : 0);
      formData.append('badge', newTeam.badge ? newTeam.badge.trim() : '');
      formData.append('linkedin', newTeam.linkedin ? newTeam.linkedin.trim() : '');
      formData.append('github', newTeam.github ? newTeam.github.trim() : '');
      formData.append('twitter', newTeam.twitter ? newTeam.twitter.trim() : '');
      formData.append('email', newTeam.email ? newTeam.email.trim() : '');
      formData.append('website', newTeam.website ? newTeam.website.trim() : '');
      formData.append('sort_order', parseInt(newTeam.sort_order, 10) || 0);
      formData.append('is_active', parseInt(newTeam.is_active, 10) === 1 ? 1 : 0);

      if (teamImageFile) {
        formData.append('image', teamImageFile);
      } else if (newTeam.image === 'REMOVE') {
        formData.append('image', 'REMOVE');
      } else if (typeof newTeam.image === 'string' && newTeam.image) {
        formData.append('image', newTeam.image);
      }

      if (editTeamId) {
        await api.put(`/team/${editTeamId}`, formData);
        showNotification('success', 'Team member updated successfully!');
      } else {
        await api.post('/team', formData);
        showNotification('success', 'Team member created successfully!');
      }

      setNewTeam({
        name: '', role: '', role_class: 'dev', bio: '', image: '', featured: 0, online: 1, verified: 0, badge: '', linkedin: '', github: '', twitter: '', email: '', website: '', sort_order: 0, is_active: 1
      });
      setEditTeamId(null);
      setTeamImageFile(null);
      setTeamImagePreview(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save team member');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeamMember = (item) => {
    setNewTeam({
      name: item.name || '',
      role: item.role || '',
      role_class: item.role_class || 'dev',
      bio: item.bio || '',
      image: item.image || '',
      featured: item.featured ? 1 : 0,
      online: item.online !== undefined ? (item.online ? 1 : 0) : 1,
      verified: item.verified ? 1 : 0,
      badge: item.badge || '',
      linkedin: item.linkedin || '',
      github: item.github || '',
      twitter: item.twitter || '',
      email: item.email || '',
      website: item.website || '',
      sort_order: item.sort_order !== undefined ? item.sort_order : 0,
      is_active: item.is_active !== undefined ? (item.is_active ? 1 : 0) : 1
    });
    setEditTeamId(item.id);
    setTeamImageFile(null);
    setTeamImagePreview(item.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTeamMember = async (id) => {
    try {
      await api.put(`/team/${id}/toggle`);
      showNotification('success', 'Team member status updated!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await api.delete(`/team/${id}`);
      showNotification('success', 'Team member deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete team member');
    }
  };

  // SUBSCRIBER handlers
  const handleToggleSubscriber = async (id) => {
    try {
      const res = await api.put(`/subscribers/${id}/toggle`);
      showNotification('success', 'Subscriber status updated!');
      if (res.data && res.data.subscriber) {
        setSubscribers(prev => prev.map(s => s.id === id ? res.data.subscriber : s));
      } else {
        fetchData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle subscriber status');
    }
  };

  const handleDeleteSubscriber = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete subscriber "${email}"?`)) return;
    try {
      await api.delete(`/subscribers/${id}`);
      showNotification('success', 'Subscriber deleted successfully!');
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete subscriber');
    }
  };

  const formatSubscriberDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Contact Handlers
  const handleUpdateContactStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/contact/${id}/status`, { status: newStatus });
      showNotification('success', `Contact status updated to "${newStatus}"`);
      setContacts(prev => prev.map(c => c.id === id ? { 
        ...c, 
        status: newStatus, 
        updated_at: res.data.contact?.updated_at || new Date().toISOString() 
      } : c));
      if (selectedContactModal && selectedContactModal.id === id) {
        setSelectedContactModal(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update contact status');
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete contact inquiry from "${name}"?`)) return;
    try {
      await api.delete(`/contact/${id}`);
      showNotification('success', 'Contact inquiry deleted successfully!');
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContactModal && selectedContactModal.id === id) {
        setSelectedContactModal(null);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete contact inquiry');
    }
  };

  const formatContactDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // JOB handlers
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newJob };
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(t => t);
      }
      
      if (editJobId) {
        await api.put(`/jobs/${editJobId}`, payload);
        showNotification('success', 'Job updated successfully!');
      } else {
        await api.post('/jobs', payload);
        showNotification('success', 'Job created successfully!');
      }
      setNewJob({ title: '', location: '', experience: '', type: '', salary: '', category: '', tags: '' });
      setEditJobId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleEditJob = (job) => {
    setNewJob({
      title: job.title || '',
      location: job.location || '',
      experience: job.experience || '',
      type: job.type || '',
      salary: job.salary || '',
      category: job.category || '',
      tags: Array.isArray(job.tags) ? job.tags.join(', ') : (job.tags || '')
    });
    setEditJobId(job.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      showNotification('success', 'Job deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete job');
    }
  };

  // DELETE handlers
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      showNotification('success', 'Blog deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      showNotification('success', 'Service deleted successfully!');
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete service');
    }
  };

  const renderServiceForm = () => (
    <form onSubmit={handleCreateService} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Title</label>
        <input
          type="text" required value={newService.title}
          onChange={(e) => setNewService({...newService, title: e.target.value})}
          placeholder="Mobile Development"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <input
          type="checkbox"
          id="is_home_checkbox"
          checked={newService.is_home}
          onChange={(e) => setNewService({...newService, is_home: e.target.checked})}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="is_home_checkbox" className="text-sm font-semibold text-slate-700 cursor-pointer">
          Show on Home Page Services Section
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Home Sort Order (1-6)</label>
          <input
            type="number" min="0" value={newService.sort_order}
            onChange={(e) => setNewService({...newService, sort_order: parseInt(e.target.value, 10) || 0})}
            placeholder="1"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon Name (Lucide Icon)</label>
          <input
            type="text" value={newService.icon}
            onChange={(e) => setNewService({...newService, icon: e.target.value})}
            placeholder="Lightbulb, Code, Rocket..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Feature Tags (Comma Separated)</label>
        <input
          type="text" value={newService.tags}
          onChange={(e) => setNewService({...newService, tags: e.target.value})}
          placeholder="Market Research, Feasibility Analysis, MVP Scope"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category (Optional)</label>
        <select
          value={newService.category_id}
          onChange={(e) => setNewService({...newService, category_id: e.target.value})}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
        >
          <option value="">-- No Category (Custom Solutions) --</option>
          {serviceCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Image</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => setNewService({...newService, image: e.target.files[0]})}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
        />
        {typeof newService.image === 'string' && newService.image && (
          <p className="text-xs text-slate-500 mt-2">Current Image: <a href={newService.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a></p>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Short Description</label>
        <textarea
          required value={newService.short_description} rows={3}
          onChange={(e) => setNewService({...newService, short_description: e.target.value})}
          placeholder="Brief summary of service features..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Detailed Description</label>
        <textarea
          required value={newService.full_description} rows={5}
          onChange={(e) => setNewService({...newService, full_description: e.target.value})}
          placeholder="Long form details of deliverables, roadmap..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>
      <button
        type="button"
        onClick={handleCreateService}
        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
      >
        {editServiceId ? 'Update Service' : 'Publish Service'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-150 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">SRJ Global Technologies</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Panel</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'blogs' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText size={18} />
              Blogs
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'services' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Briefcase size={18} />
              Services
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'contacts' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Mail size={18} />
              Contact Inquiries
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'plans' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <DollarSign size={18} />
              Plan Quotes
            </button>

            <button
              onClick={() => setActiveTab('careers')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'careers' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Briefcase size={18} />
              Careers
            </button>

            <button
              onClick={() => setActiveTab('promotions')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'promotions' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Sparkles size={18} />
              Announcements
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'testimonials' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={18} />
              Testimonials
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'portfolio' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Folder size={18} />
              Portfolio
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'faqs' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <HelpCircle size={18} />
              FAQs
            </button>

            <button
              onClick={() => setActiveTab('industries')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'industries' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Layers size={18} />
              Industries
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'team' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              Team
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'subscribers' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UsersRound size={18} />
              Subscribers
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'users' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              Admin Users
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings size={18} />
              Site Settings
            </button>

            <button
              onClick={() => setActiveTab('navigation')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'navigation' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Compass size={18} />
              Navigation Manager
            </button>

            <button
              onClick={() => setActiveTab('partner-logos')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'partner-logos' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building size={18} />
              Partner Logos
            </button>

            <button
              onClick={() => setActiveTab('process-steps')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'process-steps' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Compass size={18} />
              Process & Roadmap
            </button>

            <button
              onClick={() => setActiveTab('company-stats')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'company-stats' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Award size={18} />
              Company Stats
            </button>

            <button
              onClick={() => setActiveTab('trust-points')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'trust-points' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 size={18} />
              Trust Points
            </button>
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-4">
            <p className="text-sm font-bold text-slate-800">{adminUser.name}</p>
            <p className="text-xs text-slate-400">{adminUser.email || 'admin@srjglobal.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 text-sm font-semibold border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Notifications */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">{activeTab} Management</h1>
          <p className="text-slate-500 text-sm mt-1">Add, update, or remove entries from your website's database.</p>
        </div>

        {loading && <div className="text-slate-500 text-center my-10 font-medium">Loading content from MySQL...</div>}

        {/* Tab content */}
        {!loading && (
          <div className="space-y-10">
            
            {/* CAREERS TAB */}
            {activeTab === 'careers' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit Job */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editJobId ? 'Edit Job Posting' : 'New Job Posting'}
                    </h3>
                    {editJobId && (
                      <button 
                        onClick={() => {
                          setEditJobId(null);
                          setNewJob({ title: '', location: '', experience: '', type: '', salary: '', category: '', tags: '' });
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job Title</label>
                      <input type="text" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                        <input type="text" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Remote / Mumbai" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                        <input type="text" required value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} placeholder="Full-time" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Experience</label>
                        <input type="text" required value={newJob.experience} onChange={(e) => setNewJob({...newJob, experience: e.target.value})} placeholder="3-5 Years" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary</label>
                        <input type="text" required value={newJob.salary} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} placeholder="Competitive" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                      <select required value={newJob.category} onChange={(e) => setNewJob({...newJob, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900">
                        <option value="">Select Category</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Product & Design">Product & Design</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Customer Experience">Customer Experience</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tags (Comma Separated)</label>
                      <input type="text" value={newJob.tags} onChange={(e) => setNewJob({...newJob, tags: e.target.value})} placeholder="React, Node.js, AWS" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900" />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md mt-4">
                      {editJobId ? 'Update Job' : 'Publish Job'}
                    </button>
                  </form>
                </div>

                {/* Job List & Applications */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Active Jobs */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Briefcase size={18} />
                      Active Job Postings
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold ml-2">{jobs.length}</span>
                    </h3>
                    <div className="space-y-4">
                      {jobs.map(job => (
                        <div key={job.id} className="p-5 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors bg-slate-50/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                                <span>{job.location}</span> • <span>{job.type}</span> • <span>{job.experience}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditJob(job)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                <Settings size={18} />
                              </button>
                              <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold">{job.category}</span>
                            {Array.isArray(job.tags) && job.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {jobs.length === 0 && (
                        <p className="text-slate-500 text-center py-6">No jobs posted yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Applications List */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Users size={18} />
                      Job Applications
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold ml-2">{applications.length}</span>
                    </h3>
                    <div className="space-y-4">
                      {applications.map(app => (
                        <div key={app.id} className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900">{app.full_name}</h4>
                              <p className="text-sm text-slate-500 mt-0.5">{app.email} • {app.phone}</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                              {app.job_title}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.message}</p>
                          </div>
                          <div className="mt-3 text-xs text-slate-400 font-medium text-right">
                            Received: {new Date(app.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {applications.length === 0 && (
                        <p className="text-slate-500 text-center py-6">No applications received yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create Blog */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editBlogId ? 'Edit Blog Post' : 'New Blog Post'}
                    </h3>
                    {editBlogId && (
                      <button 
                        onClick={() => {
                          setEditBlogId(null);
                          setNewBlog({ title: '', category: '', type: 'Fresh Perspectives', description: '', content: '', image: '', author: 'SRJ Global Softech' });
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateBlog} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                      <input
                        type="text" required value={newBlog.title}
                        onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                        placeholder="Latest tech developments"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                      <input
                        type="text" required value={newBlog.category}
                        onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                        placeholder="Technology"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type of Blog</label>
                      <select
                        value={newBlog.type}
                        onChange={(e) => setNewBlog({...newBlog, type: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                      >
                        <option value="Fresh Perspectives">Fresh Perspectives</option>
                        <option value="Editor's Pick">Editor's Pick</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Author Name</label>
                      <input
                        type="text" value={newBlog.author}
                        onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Blog Image</label>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => setNewBlog({...newBlog, image: e.target.files[0]})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                      {typeof newBlog.image === 'string' && newBlog.image && (
                        <p className="text-xs text-slate-500 mt-2">Current Image: <a href={newBlog.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a></p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        required value={newBlog.description} rows={3}
                        onChange={(e) => setNewBlog({...newBlog, description: e.target.value})}
                        placeholder="Short summary of the blog..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Content (Markdown/HTML supported)</label>
                      <textarea
                        required value={newBlog.content} rows={6}
                        onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                        placeholder="Detailed body content of the blog..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
                    >
                      {editBlogId ? 'Update Post' : 'Publish Post'}
                    </button>
                  </form>
                </div>

                {/* List of Blogs */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Active Blog Posts ({blogs.length})</h3>
                  {blogs.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No blog posts found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogs.map((b) => (
                        <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-start gap-4">
                          <div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                              {b.category}
                            </span>
                            <h4 className="text-lg font-extrabold text-slate-900 mt-3">{b.title}</h4>
                            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{b.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-slate-400 text-xs">
                              <span className="font-bold text-slate-600">By {b.author || 'Admin'}</span>
                              <span>•</span>
                              <span>Published on: {new Date(b.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBlog(b)}
                              className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create Service */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      New Service
                    </h3>
                  </div>
                  {renderServiceForm()}
                </div>

                {/* List of Services */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-slate-900">Active Services ({services.length})</h3>
                    
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <button
                        onClick={() => setActiveServiceTab('all')}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                          activeServiceTab === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All Services
                      </button>
                      {serviceCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveServiceTab(cat.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                            activeServiceTab === cat.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat.title}
                        </button>
                      ))}
                      <button
                        onClick={() => setActiveServiceTab('uncategorized')}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                          activeServiceTab === 'uncategorized'
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Custom / Uncategorized
                      </button>
                    </div>
                  </div>

                  {services.filter(s => {
                    if (activeServiceTab === 'all') return true;
                    if (activeServiceTab === 'uncategorized') return !s.category_id;
                    return s.category_id === activeServiceTab;
                  }).length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No services found for this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {services.filter(s => {
                        if (activeServiceTab === 'all') return true;
                        if (activeServiceTab === 'uncategorized') return !s.category_id;
                        return s.category_id === activeServiceTab;
                      }).map((s) => (
                        <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-start gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                              {s.category_id && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">{serviceCategories.find(c => c.id === s.category_id)?.title || s.category_id}</span>}
                              {s.is_home && <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Home Pillar #{s.sort_order}</span>}
                            </div>
                            <h4 className="text-lg font-extrabold text-slate-900">{s.title}</h4>
                            <p className="text-slate-500 text-sm mt-2">{s.short_description}</p>
                            {Array.isArray(s.tags) && s.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {s.tags.map((tag, tIdx) => (
                                  <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600 border border-slate-200">{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-3">
                              {s.price && <span className="text-sm font-semibold text-slate-900 flex items-center gap-1"><DollarSign size={14}/> {s.price}</span>}
                              {s.icon && <span className="text-xs font-medium text-slate-500 flex items-center gap-1">Icon: {s.icon}</span>}
                            </div>
                          </div>
                          {s.image && (
                            <img src={s.image} alt={s.title} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditService(s)}
                              className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(s.id)}
                              className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONTACT INQUIRIES TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                {/* Stats Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">{contacts.length}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">
                        {contacts.filter(c => c.status === 'new').length}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                      <Clock size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacted</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">
                        {contacts.filter(c => c.status === 'contacted').length}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">
                        {contacts.filter(c => c.status === 'resolved').length}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Filter & Contact Table Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Contact Inquiries</h3>
                      <p className="text-xs text-slate-500 font-medium">View, filter, track status, and manage client direct inquiry messages</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                      {/* Status Filter Dropdown */}
                      <div className="relative">
                        <select
                          value={contactStatusFilter}
                          onChange={(e) => setContactStatusFilter(e.target.value)}
                          className="w-full sm:w-40 pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
                        >
                          <option value="all">All Statuses ({contacts.length})</option>
                          <option value="new">New ({contacts.filter(c => c.status === 'new').length})</option>
                          <option value="contacted">Contacted ({contacts.filter(c => c.status === 'contacted').length})</option>
                          <option value="resolved">Resolved ({contacts.filter(c => c.status === 'resolved').length})</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      {/* Search Bar */}
                      <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          placeholder="Search name, email, phone, company..."
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* List / Table */}
                  {contacts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <Mail size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
                      <h4 className="text-base font-bold text-slate-700">No contact inquiries yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Inquiries submitted by clients via the contact form will appear here in real time.
                      </p>
                    </div>
                  ) : (() => {
                    const filteredContacts = contacts.filter((c) => {
                      if (contactStatusFilter !== 'all' && c.status !== contactStatusFilter) return false;
                      const q = contactSearch.trim().toLowerCase();
                      if (!q) return true;
                      const fullName = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
                      const email = (c.email || '').toLowerCase();
                      const phone = (c.phone || '').toLowerCase();
                      const company = (c.company || '').toLowerCase();
                      const service = (c.service || '').toLowerCase();
                      return fullName.includes(q) || email.includes(q) || phone.includes(q) || company.includes(q) || service.includes(q);
                    });

                    if (filteredContacts.length === 0) {
                      return (
                        <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                          <p>No contact inquiries match your search and filter criteria.</p>
                          <button
                            onClick={() => { setContactSearch(''); setContactStatusFilter('all'); }}
                            className="text-blue-600 font-semibold hover:underline text-xs"
                          >
                            Reset filters
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                              <th className="py-3 px-4">Client Name</th>
                              <th className="py-3 px-4">Contact Info</th>
                              <th className="py-3 px-4">Company & Service</th>
                              <th className="py-3 px-4">Budget</th>
                              <th className="py-3 px-4">Message</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Received At</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredContacts.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                  {c.first_name} {c.last_name}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="space-y-0.5">
                                    <div className="text-slate-800 font-medium">{c.email}</div>
                                    <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="space-y-1">
                                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                      {c.service || 'General'}
                                    </span>
                                    {c.company && (
                                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                        <Building size={11} className="text-slate-400" />
                                        {c.company}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                  {c.budget ? c.budget : <span className="text-slate-400 font-normal">—</span>}
                                </td>
                                <td className="py-3.5 px-4 max-w-xs">
                                  <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed" title={c.message}>
                                    {c.message}
                                  </p>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <select
                                    value={c.status || 'new'}
                                    onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer focus:outline-none transition-colors ${
                                      c.status === 'new'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                        : c.status === 'contacted'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                  >
                                    <option value="new" className="bg-white text-slate-900 font-medium">NEW</option>
                                    <option value="contacted" className="bg-white text-slate-900 font-medium">CONTACTED</option>
                                    <option value="resolved" className="bg-white text-slate-900 font-medium">RESOLVED</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap font-medium">
                                  {formatContactDate(c.created_at)}
                                </td>
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setSelectedContactModal(c)}
                                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                                      title="View Full Details"
                                    >
                                      <Eye size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteContact(c.id, `${c.first_name} ${c.last_name}`)}
                                      className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                                      title="Delete Inquiry"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* PLAN QUOTES TAB */}
            {activeTab === 'plans' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Enterprise Plan Quotes ({plans.length})</h3>
                {plans.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                    No plan inquiries registered in the database.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((p) => (
                      <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{p.full_name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{p.email} | {p.phone}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700">
                            {p.plan_name}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-medium">
                          <div>
                            <span className="text-slate-400 block">Company:</span>
                            <span className="text-slate-800">{p.company_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Project:</span>
                            <span className="text-slate-800">{p.project_type || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Budget:</span>
                            <span className="text-slate-900 font-extrabold">{p.budget || 'N/A'}</span>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 whitespace-pre-line">{p.requirements}</p>
                        <span className="text-[10px] text-slate-400 block mt-4 font-semibold">{new Date(p.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB (Super Admin Exclusive) */}
            {activeTab === 'users' && <AdminUserManager />}

            {/* ANNOUNCEMENTS TAB */}
            {activeTab === 'promotions' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create Promotion */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Plus size={18} />
                    New Launch Banner
                  </h3>
                  <form onSubmit={handleCreatePromotion} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Launch Title</label>
                      <input
                        type="text" required value={newPromotion.title}
                        onChange={(e) => setNewPromotion({...newPromotion, title: e.target.value})}
                        placeholder="Aviator Game Development"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        required value={newPromotion.description} rows={4}
                        onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                        placeholder="Write dynamic details about this product launch..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CTA Text (Button text)</label>
                      <input
                        type="text" value={newPromotion.cta_text}
                        onChange={(e) => setNewPromotion({...newPromotion, cta_text: e.target.value})}
                        placeholder="Learn More"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CTA Link (URL)</label>
                      <input
                        type="text" value={newPromotion.cta_link}
                        onChange={(e) => setNewPromotion({...newPromotion, cta_link: e.target.value})}
                        placeholder="/services or external link"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Banner Image (Optional)</label>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => setNewPromotion({...newPromotion, image: e.target.files[0]})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
                    >
                      Create Announcement
                    </button>
                  </form>
                </div>

                {/* List of Promotions */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Announcements List ({promotions.length})</h3>
                  <p className="text-slate-400 text-xs mt-1">Note: Only one announcement can be active at a time. Toggling one on will deactivate others.</p>
                  {promotions.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No launch announcements found in database.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {promotions.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-extrabold text-slate-900">{p.title}</h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                                p.is_active 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{p.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTogglePromotion(p.id, p.is_active)}
                              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                p.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {p.is_active ? 'Deactivate' : 'Activate Popup'}
                            </button>
                            
                            <button
                              onClick={() => handleDeletePromotion(p.id)}
                              className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit Testimonial */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editTestimonialId ? 'Edit Testimonial' : 'New Testimonial'}
                    </h3>
                    {editTestimonialId && (
                      <button
                        onClick={() => {
                          setEditTestimonialId(null);
                          setNewTestimonial({ quote: '', author: '', role: '', company: '', rating: 5, sort_order: 0, image: null, is_active: 1 });
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateTestimonial} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Author Name *</label>
                      <input
                        type="text" required value={newTestimonial.author}
                        onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role / Designation *</label>
                      <input
                        type="text" required value={newTestimonial.role}
                        onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                        placeholder="e.g. CEO & Co-Founder"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company</label>
                      <input
                        type="text" value={newTestimonial.company}
                        onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                        placeholder="e.g. Apex Global Solutions"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rating (1 to 5) *</label>
                      <select
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value, 10)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                      >
                        <option value={5}>5 Stars (★★★★★)</option>
                        <option value={4}>4 Stars (★★★★☆)</option>
                        <option value={3}>3 Stars (★★★☆☆)</option>
                        <option value={2}>2 Stars (★★☆☆☆)</option>
                        <option value={1}>1 Star (★☆☆☆☆)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Testimonial Quote *</label>
                      <textarea
                        required value={newTestimonial.quote} rows={4}
                        onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                        placeholder="Write client review / feedback here..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                        <input
                          type="number" value={newTestimonial.sort_order}
                          onChange={(e) => setNewTestimonial({...newTestimonial, sort_order: parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={newTestimonial.is_active}
                          onChange={(e) => setNewTestimonial({...newTestimonial, is_active: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Avatar Image (Optional)</label>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => setNewTestimonial({...newTestimonial, image: e.target.files[0]})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                      />
                      {typeof newTestimonial.image === 'string' && newTestimonial.image && (
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                          <span>Current Image: <a href={newTestimonial.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Avatar</a></span>
                          <button
                            type="button"
                            onClick={() => setNewTestimonial({...newTestimonial, image: 'REMOVE'})}
                            className="text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Remove Avatar
                          </button>
                        </div>
                      )}
                      {newTestimonial.image === 'REMOVE' && (
                        <p className="text-xs text-amber-600 font-semibold mt-2">
                          Avatar will be removed upon saving.
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
                    >
                      {editTestimonialId ? 'Save Changes' : 'Create Testimonial'}
                    </button>
                  </form>
                </div>

                {/* List of Testimonials */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Testimonials List ({testimonials.length})</h3>
                  {testimonials.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No testimonials found in database.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              {t.image && typeof t.image === 'string' ? (
                                <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-sm">
                                  {t.author ? t.author.charAt(0).toUpperCase() : 'T'}
                                </div>
                              )}
                              <div>
                                <h4 className="text-base font-extrabold text-slate-900">{t.author}</h4>
                                <p className="text-xs text-slate-500">{t.role}{t.company ? ` • ${t.company}` : ''}</p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                                t.is_active 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {t.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                Order: {t.sort_order || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 my-2">
                              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" />
                              ))}
                              <span className="text-xs text-slate-400 font-medium ml-1">({t.rating || 5}/5)</span>
                            </div>
                            <p className="text-slate-600 text-sm italic line-clamp-3">"{t.quote}"</p>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                              onClick={() => handleToggleTestimonial(t.id, t.is_active)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                t.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {t.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleEditTestimonial(t)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                              title="Edit Testimonial"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                              title="Delete Testimonial"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit Portfolio Item */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editPortfolioId ? 'Edit Portfolio Project' : 'New Portfolio Project'}
                    </h3>
                    {editPortfolioId && (
                      <button
                        onClick={() => {
                          setEditPortfolioId(null);
                          setNewPortfolio({ title: '', category: '', tags: '', project_url: '', description: '', sort_order: 0, image: null, is_active: 1 });
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreatePortfolio} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Title *</label>
                      <input
                        type="text" required value={newPortfolio.title}
                        onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                        placeholder="e.g. Aura Fintech Platform"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
                      <input
                        type="text" required value={newPortfolio.category}
                        onChange={(e) => setNewPortfolio({...newPortfolio, category: e.target.value})}
                        placeholder="e.g. Financial Technology"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tech Tags (Comma-separated)</label>
                      <input
                        type="text" value={newPortfolio.tags}
                        onChange={(e) => setNewPortfolio({...newPortfolio, tags: e.target.value})}
                        placeholder="e.g. React, Next.js, PostgreSQL"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project / Demo URL (Optional)</label>
                      <input
                        type="text" value={newPortfolio.project_url}
                        onChange={(e) => setNewPortfolio({...newPortfolio, project_url: e.target.value})}
                        placeholder="e.g. https://aura-fintech.example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                      <textarea
                        value={newPortfolio.description} rows={3}
                        onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                        placeholder="Short summary of the project architecture and features..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                        <input
                          type="number" value={newPortfolio.sort_order}
                          onChange={(e) => setNewPortfolio({...newPortfolio, sort_order: parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={newPortfolio.is_active}
                          onChange={(e) => setNewPortfolio({...newPortfolio, is_active: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Image (Optional)</label>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => setNewPortfolio({...newPortfolio, image: e.target.files[0]})}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                      />
                      {typeof newPortfolio.image === 'string' && newPortfolio.image && (
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                          <span>Current Image: <a href={newPortfolio.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Image</a></span>
                          <button
                            type="button"
                            onClick={() => setNewPortfolio({...newPortfolio, image: 'REMOVE'})}
                            className="text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                      {newPortfolio.image === 'REMOVE' && (
                        <p className="text-xs text-amber-600 font-semibold mt-2">
                          Image will be removed upon saving.
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
                    >
                      {editPortfolioId ? 'Save Changes' : 'Create Project'}
                    </button>
                  </form>
                </div>

                {/* List of Portfolio Projects */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Portfolio Projects ({portfolio.length})</h3>
                  {portfolio.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No portfolio projects found in database.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {portfolio.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              {p.image && typeof p.image === 'string' ? (
                                <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-xs">
                                  No Img
                                </div>
                              )}
                              <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.category}</span>
                                <h4 className="text-base font-extrabold text-slate-900">{p.title}</h4>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                                p.is_active 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                Order: {p.sort_order || 0}
                              </span>
                            </div>
                            
                            {p.description && (
                              <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
                            )}

                            {/* Tags list */}
                            {Array.isArray(p.tags) && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {p.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {p.project_url && (
                              <p className="text-xs text-blue-600 mt-2 truncate">
                                URL: <a href={p.project_url} target="_blank" rel="noreferrer" className="underline">{p.project_url}</a>
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                              onClick={() => handleTogglePortfolio(p.id, p.is_active)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                p.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {p.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleEditPortfolio(p)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                              title="Edit Portfolio Project"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeletePortfolio(p.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                              title="Delete Portfolio Project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit FAQ */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editFaqId ? 'Edit FAQ Entry' : 'New FAQ Entry'}
                    </h3>
                    {editFaqId && (
                      <button
                        onClick={() => {
                          setEditFaqId(null);
                          setNewFaq({ question: '', answer: '', category: 'General', sort_order: 0, is_active: 1 });
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateFaq} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Question *</label>
                      <textarea
                        required value={newFaq.question} rows={2}
                        onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                        placeholder="e.g. What is your typical project timeline?"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Answer *</label>
                      <textarea
                        required value={newFaq.answer} rows={5}
                        onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                        placeholder="Detailed answer explanation..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                      <input
                        type="text" value={newFaq.category}
                        onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                        placeholder="General / Pricing / Services"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                        <input
                          type="number" value={newFaq.sort_order}
                          onChange={(e) => setNewFaq({...newFaq, sort_order: parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Lower number = appears earlier</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={newFaq.is_active}
                          onChange={(e) => setNewFaq({...newFaq, is_active: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 font-semibold text-white transition-all cursor-pointer"
                    >
                      {editFaqId ? 'Save Changes' : 'Create FAQ'}
                    </button>
                  </form>
                </div>

                {/* List of FAQs */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions ({faqs.length})</h3>
                  {faqs.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No FAQs found in database. Use the form on the left to create your first FAQ entry.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {faqs.map((f) => (
                        <div key={f.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{f.category || 'General'}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                                f.is_active 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {f.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                Order: {f.sort_order || 0}
                              </span>
                            </div>

                            <h4 className="text-base font-extrabold text-slate-900 mb-2">{f.question}</h4>
                            <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{f.answer}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => handleToggleFaq(f.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                f.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {f.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleEditFaq(f)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                              title="Edit FAQ"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteFaq(f.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* INDUSTRIES TAB */}
            {activeTab === 'industries' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit Industry */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editIndustryId ? 'Edit Industry' : 'New Industry'}
                    </h3>
                    {editIndustryId && (
                      <button
                        onClick={() => {
                          setEditIndustryId(null);
                          setNewIndustry({
                            id: '', title: '', subtitle: '', icon: '', color: '#3B82F6', description: '', badge: '', features: '', benefits: '', sort_order: 0, is_active: 1
                          });
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateIndustry} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Industry ID / Slug *</label>
                      <input
                        type="text" required value={newIndustry.id}
                        disabled={!!editIndustryId}
                        onChange={(e) => setNewIndustry({...newIndustry, id: e.target.value})}
                        placeholder="e.g. ecommerce (lowercase, hyphens)"
                        className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                          editIndustryId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                        }`}
                      />
                      {editIndustryId && (
                        <p className="text-[10px] text-slate-400 mt-1">ID / Slug cannot be changed during edit.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title *</label>
                      <input
                        type="text" required value={newIndustry.title}
                        onChange={(e) => setNewIndustry({...newIndustry, title: e.target.value})}
                        placeholder="e.g. E-Commerce Solutions"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subtitle / Tagline *</label>
                      <input
                        type="text" required value={newIndustry.subtitle}
                        onChange={(e) => setNewIndustry({...newIndustry, subtitle: e.target.value})}
                        placeholder="e.g. Scalable Digital Stores & Payment Gateway Integration"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon Name *</label>
                        <input
                          type="text" required value={newIndustry.icon}
                          onChange={(e) => setNewIndustry({...newIndustry, icon: e.target.value})}
                          placeholder="FaStore / FaRocket"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Theme Color *</label>
                        <div className="flex gap-2">
                          <input
                            type="color" value={newIndustry.color}
                            onChange={(e) => setNewIndustry({...newIndustry, color: e.target.value})}
                            className="w-10 h-10 rounded-xl border border-slate-200 bg-white p-1 cursor-pointer"
                          />
                          <input
                            type="text" required value={newIndustry.color}
                            onChange={(e) => setNewIndustry({...newIndustry, color: e.target.value})}
                            placeholder="#3B82F6"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-mono text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Badge Label *</label>
                      <input
                        type="text" required value={newIndustry.badge}
                        onChange={(e) => setNewIndustry({...newIndustry, badge: e.target.value})}
                        placeholder="e.g. Retail & Sales"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description *</label>
                      <textarea
                        required value={newIndustry.description} rows={4}
                        onChange={(e) => setNewIndustry({...newIndustry, description: e.target.value})}
                        placeholder="Detailed overview of industry capabilities and target value proposition..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Features (Comma-separated) *</label>
                      <textarea
                        required value={newIndustry.features} rows={3}
                        onChange={(e) => setNewIndustry({...newIndustry, features: e.target.value})}
                        placeholder="Feature 1, Feature 2, Feature 3"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Benefits (Comma-separated) *</label>
                      <textarea
                        required value={newIndustry.benefits} rows={3}
                        onChange={(e) => setNewIndustry({...newIndustry, benefits: e.target.value})}
                        placeholder="Benefit 1, Benefit 2, Benefit 3"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                        <input
                          type="number" value={newIndustry.sort_order}
                          onChange={(e) => setNewIndustry({...newIndustry, sort_order: parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={newIndustry.is_active}
                          onChange={(e) => setNewIndustry({...newIndustry, is_active: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 font-semibold text-white transition-all cursor-pointer"
                    >
                      {editIndustryId ? 'Save Changes' : 'Create Industry'}
                    </button>
                  </form>
                </div>

                {/* List of Industries */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Industries Modules ({industries.length})</h3>
                  {industries.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No industries found in database. Use the form on the left to create your first industry record.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {industries.map((ind) => (
                        <div key={ind.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-200"
                                style={{ backgroundColor: ind.color || '#3B82F6' }}
                                title={`Color: ${ind.color}`}
                              />
                              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {ind.id}
                              </span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {ind.badge}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                                ind.is_active 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                {ind.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                Order: {ind.sort_order || 0}
                              </span>
                            </div>

                            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                              {ind.title}
                              <span className="text-xs font-mono font-normal text-slate-400">({ind.icon})</span>
                            </h4>
                            <p className="text-xs font-semibold text-slate-500 mb-2">{ind.subtitle}</p>
                            <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed line-clamp-3 mb-3">{ind.description}</p>

                            {/* Features & Benefits Pills */}
                            <div className="flex flex-wrap gap-2 text-xs">
                              {Array.isArray(ind.features) && ind.features.length > 0 && (
                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium">
                                  {ind.features.length} Features
                                </span>
                              )}
                              {Array.isArray(ind.benefits) && ind.benefits.length > 0 && (
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                                  {ind.benefits.length} Benefits
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => handleToggleIndustry(ind.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                ind.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {ind.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleEditIndustry(ind)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                              title="Edit Industry"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteIndustry(ind.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                              title="Delete Industry"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form to Create/Edit Team Member */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus size={18} />
                      {editTeamId ? 'Edit Team Member' : 'New Team Member'}
                    </h3>
                    {editTeamId && (
                      <button
                        onClick={() => {
                          setEditTeamId(null);
                          setTeamImageFile(null);
                          setTeamImagePreview(null);
                          setNewTeam({
                            name: '', role: '', role_class: 'dev', bio: '', image: '', featured: 0, online: 1, verified: 0, badge: '', linkedin: '', github: '', twitter: '', email: '', website: '', sort_order: 0, is_active: 1
                          });
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleCreateTeamMember} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        type="text" required value={newTeam.name}
                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                        placeholder="John Anderson"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role / Position *</label>
                      <input
                        type="text" required value={newTeam.role}
                        onChange={(e) => setNewTeam({...newTeam, role: e.target.value})}
                        placeholder="Chief Executive Officer"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role Class</label>
                        <input
                          type="text" value={newTeam.role_class}
                          onChange={(e) => setNewTeam({...newTeam, role_class: e.target.value})}
                          placeholder="ceo, cto, dev, design"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Special Badge Tag</label>
                        <input
                          type="text" value={newTeam.badge}
                          onChange={(e) => setNewTeam({...newTeam, badge: e.target.value})}
                          placeholder="Team Lead, AI Expert"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Biography *</label>
                      <textarea
                        required value={newTeam.bio} rows={4}
                        onChange={(e) => setNewTeam({...newTeam, bio: e.target.value})}
                        placeholder="Short professional biography..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-xs"
                      />
                    </div>

                    {/* Image Input & Preview */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Profile Photo</label>
                      <input
                        type="file" accept="image/*"
                        onChange={handleTeamImageChange}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900 text-xs mb-2"
                      />
                      {teamImagePreview && teamImagePreview !== 'REMOVE' && (
                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                          <img src={teamImagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-semibold text-slate-700 truncate">{teamImageFile ? teamImageFile.name : 'Current Profile Image'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveTeamImage}
                            className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {newTeam.image === 'REMOVE' && (
                        <p className="text-xs text-amber-600 font-medium">Image marked for removal on save.</p>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Social Links</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn</label>
                          <input
                            type="text" value={newTeam.linkedin}
                            onChange={(e) => setNewTeam({...newTeam, linkedin: e.target.value})}
                            placeholder="https://linkedin.com/in/... or #"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub</label>
                          <input
                            type="text" value={newTeam.github}
                            onChange={(e) => setNewTeam({...newTeam, github: e.target.value})}
                            placeholder="https://github.com/... or #"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Twitter / X</label>
                          <input
                            type="text" value={newTeam.twitter}
                            onChange={(e) => setNewTeam({...newTeam, twitter: e.target.value})}
                            placeholder="https://twitter.com/... or #"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                          <input
                            type="text" value={newTeam.email}
                            onChange={(e) => setNewTeam({...newTeam, email: e.target.value})}
                            placeholder="john@example.com or #"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personal / Portfolio Website</label>
                        <input
                          type="text" value={newTeam.website}
                          onChange={(e) => setNewTeam({...newTeam, website: e.target.value})}
                          placeholder="https://john.dev or #"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    {/* Checkboxes / Toggles for Featured, Online, Verified */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!newTeam.featured}
                          onChange={(e) => setNewTeam({...newTeam, featured: e.target.checked ? 1 : 0})}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0"
                        />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!newTeam.online}
                          onChange={(e) => setNewTeam({...newTeam, online: e.target.checked ? 1 : 0})}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0"
                        />
                        Online
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!newTeam.verified}
                          onChange={(e) => setNewTeam({...newTeam, verified: e.target.checked ? 1 : 0})}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0"
                        />
                        Verified
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                        <input
                          type="number" value={newTeam.sort_order}
                          onChange={(e) => setNewTeam({...newTeam, sort_order: parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={newTeam.is_active}
                          onChange={(e) => setNewTeam({...newTeam, is_active: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 font-semibold text-white transition-all cursor-pointer"
                    >
                      {editTeamId ? 'Save Changes' : 'Create Team Member'}
                    </button>
                  </form>
                </div>

                {/* List of Team Members */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Team Members ({team.length})</h3>
                  {team.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                      No team members found in database. Use the form on the left to add your first member.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {team.map((m) => (
                        <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Member Avatar */}
                            <div className="relative shrink-0">
                              {m.image ? (
                                <img src={m.image} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg border border-slate-200">
                                  {m.name.charAt(0)}
                                </div>
                              )}
                              {m.online === 1 && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Online Status" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {m.role_class || 'dev'}
                                </span>
                                {m.badge && (
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                    {m.badge}
                                  </span>
                                )}
                                {m.featured === 1 && (
                                  <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                    FEATURED
                                  </span>
                                )}
                                {m.verified === 1 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    VERIFIED
                                  </span>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                                  m.is_active 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-slate-100 text-slate-400 border-slate-200'
                                }`}>
                                  {m.is_active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                  Order: {m.sort_order || 0}
                                </span>
                              </div>

                              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                {m.name}
                                <span className="text-xs font-semibold text-slate-500">— {m.role}</span>
                              </h4>
                              <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-1 mb-2">{m.bio}</p>

                              {/* Social link tags */}
                              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
                                {m.linkedin && <span>LI: {m.linkedin}</span>}
                                {m.github && <span>GH: {m.github}</span>}
                                {m.twitter && <span>TW: {m.twitter}</span>}
                                {m.email && <span>EM: {m.email}</span>}
                                {m.website && <span>WEB: {m.website}</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => handleToggleTeamMember(m.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                m.is_active
                                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                              }`}
                            >
                              {m.is_active ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleEditTeamMember(m)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                              title="Edit Member"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTeamMember(m.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6">
                {/* Stats Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                      <UsersRound size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">{subscribers.length}</h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                      <UserCheck size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">
                        {subscribers.filter(s => s.status === 'active').length}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                      <UserX size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unsubscribed</p>
                      <h4 className="text-2xl font-extrabold text-slate-900">
                        {subscribers.filter(s => s.status === 'unsubscribed').length}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Filter & Subscriber Table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Subscribers List</h3>
                      <p className="text-xs text-slate-500 font-medium">Manage audience newsletter subscriptions and status</p>
                    </div>

                    <div className="relative w-full md:w-72">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                        placeholder="Search by email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  {/* List / Table */}
                  {subscribers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <UsersRound size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
                      <h4 className="text-base font-bold text-slate-700">No subscribers yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Newsletter subscriber records will appear here when visitors subscribe through the website footer or blog section.
                      </p>
                    </div>
                  ) : subscribers.filter(s => (s.email || '').toLowerCase().includes(subscriberSearch.trim().toLowerCase())).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No subscribers match search term "{subscriberSearch}".
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Source</th>
                            <th className="py-3 px-4">Subscribed At</th>
                            <th className="py-3 px-4">Unsubscribed At</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {subscribers
                            .filter(s => (s.email || '').toLowerCase().includes(subscriberSearch.trim().toLowerCase()))
                            .map((sub) => (
                              <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-3.5 px-4 font-semibold text-slate-900">
                                  {sub.email}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                                    sub.status === 'active'
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {sub.status ? sub.status.toUpperCase() : 'ACTIVE'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                    {sub.source || 'website_footer_blog'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 font-medium">
                                  {formatSubscriberDate(sub.subscribed_at || sub.created_at)}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500">
                                  {sub.unsubscribed_at ? formatSubscriberDate(sub.unsubscribed_at) : '—'}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleToggleSubscriber(sub.id)}
                                      className={`px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                        sub.status === 'active'
                                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                                      }`}
                                    >
                                      {sub.status === 'active' ? 'Deactivate' : 'Reactivate'}
                                    </button>

                                    <button
                                      onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                                      className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                                      title="Delete Subscriber"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <SiteSettingsManager />
            )}

            {activeTab === 'navigation' && (
              <NavigationManager />
            )}

            {activeTab === 'partner-logos' && (
              <PartnerLogoManager />
            )}

            {activeTab === 'process-steps' && (
              <ProcessManager />
            )}

            {activeTab === 'company-stats' && (
              <CompanyStatsManager />
            )}

            {activeTab === 'trust-points' && (
              <TrustPointsManager />
            )}
          </div>
        )}
      </main>

      {/* Edit Service Modal */}
      {isEditServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Service</h3>
                <button 
                  onClick={() => { 
                    setIsEditServiceModalOpen(false); 
                    setEditServiceId(null); 
                    setNewService({ title: '', icon: '', image: '', short_description: '', full_description: '', category_id: '', price: '' });
                  }} 
                  className="text-slate-400 hover:text-red-500 font-semibold text-sm"
                >
                  Cancel
                </button>
             </div>
             {renderServiceForm()}
          </div>
        </div>
      )}

      {/* Contact Inquiry Detail Modal */}
      {selectedContactModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border mb-2 ${
                  selectedContactModal.status === 'new'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : selectedContactModal.status === 'contacted'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  STATUS: {(selectedContactModal.status || 'new').toUpperCase()}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedContactModal.first_name} {selectedContactModal.last_name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Inquiry ID: #{selectedContactModal.id}</p>
              </div>
              <button 
                onClick={() => setSelectedContactModal(null)} 
                className="text-slate-400 hover:text-slate-700 font-semibold text-sm p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Email Address</span>
                <a href={`mailto:${selectedContactModal.email}`} className="text-blue-600 font-semibold hover:underline break-all">
                  {selectedContactModal.email}
                </a>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Phone Number</span>
                <a href={`tel:${selectedContactModal.phone}`} className="text-slate-800 font-semibold hover:underline">
                  {selectedContactModal.phone}
                </a>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Company</span>
                <span className="text-slate-800 font-semibold">
                  {selectedContactModal.company || '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Service Required</span>
                <span className="text-slate-800 font-semibold">
                  {selectedContactModal.service || '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Project Budget</span>
                <span className="text-slate-800 font-semibold">
                  {selectedContactModal.budget || '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Submitted Date</span>
                <span className="text-slate-800 font-semibold">
                  {formatContactDate(selectedContactModal.created_at)}
                </span>
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Update Inquiry Status</span>
                <span className="text-[11px] text-slate-500">Select new status to update database record</span>
              </div>
              <select
                value={selectedContactModal.status || 'new'}
                onChange={(e) => handleUpdateContactStatus(selectedContactModal.id, e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-slate-900 cursor-pointer shadow-sm"
              >
                <option value="new">Mark as NEW</option>
                <option value="contacted">Mark as CONTACTED</option>
                <option value="resolved">Mark as RESOLVED</option>
              </select>
            </div>

            {/* Full Message content */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Inquiry Message</span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {selectedContactModal.message}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <button
                onClick={() => handleDeleteContact(selectedContactModal.id, `${selectedContactModal.first_name} ${selectedContactModal.last_name}`)}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Trash2 size={14} />
                Delete Inquiry
              </button>
              <button
                onClick={() => setSelectedContactModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
