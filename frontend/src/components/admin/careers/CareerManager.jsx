import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import JobForm, { STANDARD_JOB_CATEGORIES } from './JobForm';
import JobList from './JobList';
import JobApplicationsList from './JobApplicationsList';

const INITIAL_JOB_STATE = {
  title: '',
  location: '',
  experience: '',
  type: 'Full-time',
  salary: '',
  category: '',
  tags: '',
  description: '',
  responsibilities: '',
  requirements: '',
  perks: ''
};

export default function CareerManager({ onNotify }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newJob, setNewJob] = useState(INITIAL_JOB_STATE);
  const [editJobId, setEditJobId] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.allSettled([
        api.get('/jobs'),
        api.get('/jobs/applications')
      ]);

      if (jobsRes.status === 'fulfilled') {
        setJobs(Array.isArray(jobsRes.value.data) ? jobsRes.value.data : (jobsRes.value.data?.jobs || []));
      } else {
        console.error('Failed to load jobs:', jobsRes.reason);
      }

      if (appsRes.status === 'fulfilled') {
        setApplications(Array.isArray(appsRes.value.data) ? appsRes.value.data : (appsRes.value.data?.applications || []));
      } else {
        console.error('Failed to load job applications:', appsRes.reason);
      }

      if (jobsRes.status === 'rejected' && appsRes.status === 'rejected') {
        showNotification('error', 'Failed to load career data');
      }
    } catch (err) {
      console.error('Error fetching career data:', err);
      showNotification('error', 'Error loading career data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const finalCategory = isCustomCategory ? customCategory.trim() : (newJob.category || '').trim();
      if (!finalCategory) {
        showNotification('error', 'Please select or enter a job category');
        return;
      }

      const payload = { 
        ...newJob, 
        category: finalCategory 
      };

      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      }

      if (editJobId) {
        await api.put(`/jobs/${editJobId}`, payload);
        showNotification('success', 'Job posting updated successfully!');
      } else {
        await api.post('/jobs', payload);
        showNotification('success', 'Job opening published live successfully!');
      }

      setNewJob(INITIAL_JOB_STATE);
      setIsCustomCategory(false);
      setCustomCategory('');
      setEditJobId(null);
      fetchData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || 'Failed to save job');
    }
  };

  const handleEditJob = (job) => {
    const isCustom = Boolean(job.category && !STANDARD_JOB_CATEGORIES.includes(job.category));
    setIsCustomCategory(isCustom);
    setCustomCategory(isCustom ? (job.category || '') : '');

    setNewJob({
      title: job.title || '',
      location: job.location || '',
      experience: job.experience || '',
      type: job.type || 'Full-time',
      salary: job.salary || '',
      category: job.category || '',
      tags: Array.isArray(job.tags) ? job.tags.join(', ') : (job.tags || ''),
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) 
        ? job.responsibilities.join('\n') 
        : (job.responsibilities || ''),
      requirements: Array.isArray(job.requirements) 
        ? job.requirements.join('\n') 
        : (job.requirements || ''),
      perks: Array.isArray(job.perks) 
        ? job.perks.join('\n') 
        : (job.perks || '')
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

  const handleCancelEdit = () => {
    setEditJobId(null);
    setIsCustomCategory(false);
    setCustomCategory('');
    setNewJob(INITIAL_JOB_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <JobForm
          editJobId={editJobId}
          newJob={newJob}
          setNewJob={setNewJob}
          isCustomCategory={isCustomCategory}
          setIsCustomCategory={setIsCustomCategory}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
          onSubmit={handleCreateJob}
          onCancelEdit={handleCancelEdit}
        />

        <div className="xl:col-span-2 space-y-8">
          <JobList
            jobs={jobs}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
          />

          <JobApplicationsList
            applications={applications}
            onRefresh={fetchData}
            showNotification={showNotification}
          />
        </div>
      </div>
    </div>
  );
}
