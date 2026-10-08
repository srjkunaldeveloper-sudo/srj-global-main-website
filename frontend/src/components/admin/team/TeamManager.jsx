import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import TeamMemberForm from './TeamMemberForm';
import TeamMemberList from './TeamMemberList';

const INITIAL_TEAM_STATE = {
  name: '',
  role: '',
  role_class: 'dev',
  bio: '',
  image: '',
  featured: 0,
  online: 1,
  verified: 0,
  badge: '',
  linkedin: '',
  github: '',
  twitter: '',
  email: '',
  website: '',
  sort_order: 0,
  is_active: 1
};

export default function TeamManager({ onNotify }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newTeam, setNewTeam] = useState(INITIAL_TEAM_STATE);
  const [editTeamId, setEditTeamId] = useState(null);
  const [teamImageFile, setTeamImageFile] = useState(null);
  const [teamImagePreview, setTeamImagePreview] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team');
      setTeam(Array.isArray(res.data) ? res.data : (res.data?.team || []));
    } catch (err) {
      console.error('Error fetching team:', err);
      showNotification('error', 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleTeamImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamImageFile(file);
      setTeamImagePreview(URL.createObjectURL(file));
      setNewTeam((prev) => ({ ...prev, image: file }));
    }
  };

  const handleRemoveTeamImage = () => {
    setTeamImageFile(null);
    setTeamImagePreview(null);
    setNewTeam((prev) => ({ ...prev, image: 'REMOVE' }));
  };

  const handleCreateOrUpdateTeamMember = async (e) => {
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

      setNewTeam(INITIAL_TEAM_STATE);
      setEditTeamId(null);
      setTeamImageFile(null);
      setTeamImagePreview(null);
      fetchTeam();
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
      fetchTeam();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await api.delete(`/team/${id}`);
      showNotification('success', 'Team member deleted successfully!');
      fetchTeam();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete team member');
    }
  };

  const handleCancelEdit = () => {
    setEditTeamId(null);
    setTeamImageFile(null);
    setTeamImagePreview(null);
    setNewTeam(INITIAL_TEAM_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <TeamMemberForm
          editTeamId={editTeamId}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          teamImageFile={teamImageFile}
          teamImagePreview={teamImagePreview}
          handleTeamImageChange={handleTeamImageChange}
          handleRemoveTeamImage={handleRemoveTeamImage}
          onSubmit={handleCreateOrUpdateTeamMember}
          onCancelEdit={handleCancelEdit}
          loading={loading}
        />

        <TeamMemberList
          team={team}
          onEditTeamMember={handleEditTeamMember}
          onToggleTeamMember={handleToggleTeamMember}
          onDeleteTeamMember={handleDeleteTeamMember}
        />
      </div>
    </div>
  );
}
