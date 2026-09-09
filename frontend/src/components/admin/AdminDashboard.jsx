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
  Edit
} from 'lucide-react';
import api from '../../config/api';
import { serviceCategories } from '../../data/servicesData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
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
    title: '', icon: '', image: '', short_description: '', full_description: '', category_id: '', price: ''
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
      setNewService({ title: '', icon: '', image: '', short_description: '', full_description: '', category_id: '', price: '' });
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
      price: service.price || ''
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
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon Name (Lucide/React Icon)</label>
        <input
          type="text" value={newService.icon}
          onChange={(e) => setNewService({...newService, icon: e.target.value})}
          placeholder="Smartphone"
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
                            <h4 className="text-lg font-extrabold text-slate-900">{s.title}</h4>
                            {s.category_id && <span className="inline-block mt-1 mb-2 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">{serviceCategories.find(c => c.id === s.category_id)?.title || s.category_id}</span>}
                            <p className="text-slate-500 text-sm mt-2">{s.short_description}</p>
                            <div className="flex items-center gap-4 mt-4">
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
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Client Contacts Form Messages ({contacts.length})</h3>
                {contacts.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
                    No contact form inquiries registered in the database.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contacts.map((c) => (
                      <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{c.first_name} {c.last_name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{c.email} | {c.phone}</p>
                          </div>
                          <span className="px-3 py-1 rounded bg-slate-50 text-xs font-bold text-slate-700 border border-slate-150">
                            {c.service}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{c.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-4 font-semibold">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
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

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Add admin user form */}
                <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <UserPlus size={18} />
                    Register Admin
                  </h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text" required value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input
                        type="email" required value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="johndoe@srjglobal.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                      <input
                        type="password" required value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer"
                    >
                      Add Admin Account
                    </button>
                  </form>
                </div>

                {/* Admins list */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Active Database Admins ({users.length})</h3>
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-4 px-6">Name</th>
                          <th className="py-4 px-6">Email</th>
                          <th className="py-4 px-6">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-slate-100 last:border-none text-sm text-slate-600">
                            <td className="py-4 px-6 font-semibold text-slate-900">{u.name}</td>
                            <td className="py-4 px-6">{u.email}</td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-bold uppercase">
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
    </div>
  );
}
