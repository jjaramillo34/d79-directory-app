'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  UserPlus, 
  Edit3, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Activity,
  School,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';

const CollaborationDashboard = ({ user }) => {
  const [schoolUsers, setSchoolUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [userForms, setUserForms] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  // Form creation state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    title: '',
    level: 3,
    canCollaborate: true,
    collaborationLevel: 'edit'
  });

  // Form sharing state
  const [shareForm, setShareForm] = useState({
    formId: '',
    userIds: [],
    permissions: 'edit',
    sections: []
  });

  useEffect(() => {
    if (user && user.level >= 4) {
      fetchSchoolUsers();
      fetchUserForms();
    }
  }, [user]);

  const fetchSchoolUsers = async () => {
    try {
      const response = await fetch('/api/admin/users/school');
      if (response.ok) {
        const data = await response.json();
        setSchoolUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching school users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched forms data:', data);
        setUserForms(data.forms || []);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/users/school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        setSchoolUsers(prev => [...prev, data.user]);
        setShowCreateUser(false);
        setNewUser({ name: '', email: '', title: '', level: 3, canCollaborate: true, collaborationLevel: 'edit' });
        alert('User created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleShareForm = async (e) => {
    e.preventDefault();
    
    console.log('Share form data:', shareForm);
    console.log('Selected form:', selectedForm);
    
    if (!shareForm.formId || shareForm.userIds.length === 0) {
      alert(`Please select a form and at least one user. Form ID: ${shareForm.formId}, Users: ${shareForm.userIds.length}`);
      return;
    }

    try {
      const response = await fetch('/api/admin/forms/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareForm)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setShowShareForm(false);
        setShareForm({ formId: '', userIds: [], permissions: 'edit', sections: [] });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sharing form:', error);
      alert('Failed to share form');
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        setSchoolUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, isActive } : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getLevelLabel = (level) => {
    const levels = { 1: 'Staff', 2: 'Teacher', 3: 'Admin', 4: 'Principal' };
    return levels[level] || 'Unknown';
  };

  const getCollaborationLevelColor = (level) => {
    const colors = { view: 'text-blue-600', edit: 'text-green-600', admin: 'text-purple-600' };
    return colors[level] || 'text-gray-600';
  };

  if (!user || user.level < 4) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Access Denied</h2>
        <p className="text-gray-500">Only principals can access the collaboration dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaboration Dashboard</h1>
        <p className="text-gray-600">Manage your school staff and form collaborations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            School Staff ({schoolUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'collaboration'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Form Collaboration
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Activity Log
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">School Staff Management</h2>
            <button
              onClick={() => setShowCreateUser(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </button>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.title}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{getLevelLabel(user.level)}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <School className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{user.schoolName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <UserCheck className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={`${getCollaborationLevelColor(user.collaborationLevel)}`}>
                      {user.collaborationLevel} permissions
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Share2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{user.assignedFormsCount} forms assigned</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user.id, !user.isActive)}
                    className={`px-3 py-1 text-xs rounded ${
                      user.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collaboration Tab */}
      {activeTab === 'collaboration' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Form Collaboration</h2>
            <button
              onClick={() => {
                setSelectedForm(null);
                setShareForm({ formId: '', userIds: [], permissions: 'edit', sections: [] });
                setShowShareForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Form
            </button>
          </div>

          {/* Forms List */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Forms</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {userForms.filter(form => !form.isShared).map((form) => (
                <div key={form._id || form.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{form.schoolName}</h4>
                    <p className="text-sm text-gray-500">Status: {form.status}</p>
                    <p className="text-xs text-gray-400">Owner: {form.userId?.name || 'Unknown'}</p>
                  </div>
                  <button
                    onClick={() => {
                      console.log('Form selected:', form);
                      setSelectedForm(form);
                      const formId = form._id || form.id;
                      setShareForm({ formId: formId.toString(), userIds: [], permissions: 'edit', sections: [] });
                      console.log('Share form updated:', { formId: formId.toString(), userIds: [], permissions: 'edit', sections: [] });
                      setShowShareForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Forms List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Forms Shared With You</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {userForms.filter(form => form.isShared).length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  <p>No forms have been shared with you yet.</p>
                </div>
              ) : (
                userForms.filter(form => form.isShared).map((form) => (
                  <div key={form._id || form.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{form.schoolName}</h4>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Shared
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Status: {form.status}</p>
                      <p className="text-xs text-gray-400">
                        Shared by: {form.userId?.name || 'Unknown'} | 
                        Permissions: {form.collaborationPermissions || 'view'} |
                        Assigned: {form.assignedAt ? new Date(form.assignedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-500">
                        {form.collaborationPermissions} access
                      </span>
                      <button
                        onClick={() => {
                          // Navigate to the shared form
                          window.location.href = `/form/${form._id || form.id}`;
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">Activity log coming soon...</p>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Staff Member</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newUser.title}
                  onChange={(e) => setNewUser(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Form Modal */}
      {showShareForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Share Form for Collaboration</h3>
            
            {/* Debug info */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <p><strong>Selected Form:</strong> {selectedForm?.schoolName || 'None'}</p>
              <p><strong>Form ID:</strong> {shareForm.formId || 'None'}</p>
              <p><strong>Selected Users:</strong> {shareForm.userIds.length}</p>
            </div>
            
            <form onSubmit={handleShareForm} className="space-y-4">
              {!selectedForm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Form</label>
                  <select
                    value={shareForm.formId}
                    onChange={(e) => setShareForm(prev => ({ ...prev, formId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a form...</option>
                    {userForms.map((form) => (
                      <option key={form._id || form.id} value={form._id || form.id}>
                        {form.schoolName} - {form.status}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Users</label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {schoolUsers.filter(u => u.isActive && u.canCollaborate).map((user) => (
                    <label key={user.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        value={user.id}
                        checked={shareForm.userIds.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShareForm(prev => {
                              const newUserIds = [...prev.userIds, user._id || user.id];
                              console.log('User added:', user._id || user.id, 'New userIds:', newUserIds);
                              return { ...prev, userIds: newUserIds };
                            });
                          } else {
                            setShareForm(prev => {
                              const newUserIds = prev.userIds.filter(id => id !== (user._id || user.id));
                              console.log('User removed:', user._id || user.id, 'New userIds:', newUserIds);
                              return { ...prev, userIds: newUserIds };
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{user.name} ({user.title})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <select
                  value={shareForm.permissions}
                  onChange={(e) => setShareForm(prev => ({ ...prev, permissions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Edit</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Share Form
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationDashboard;
