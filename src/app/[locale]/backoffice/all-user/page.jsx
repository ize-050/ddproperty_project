'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaSearch, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Import SCSS
import '@/styles/backoffice/all-user.scss';

// Mock user data
const mockUsers = [
  { id: 1, username: 'Alex', name: 'Alex', email: 'alex@abc.com', role: 'editor' },
  { id: 2, username: 'Admin', name: 'Admin', email: 'Admin@abc.com', role: 'admin' },
  { id: 3, username: 'JohnDoe', name: 'John Doe', email: 'john@abc.com', role: 'user' },
  { id: 4, username: 'JaneSmith', name: 'Jane Smith', email: 'jane@abc.com', role: 'editor' },
  { id: 5, username: 'RobertJohnson', name: 'Robert Johnson', email: 'robert@abc.com', role: 'user' },
];

const AllUserPage = () => {
  const t = useTranslations('Users');
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // Load users data
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(term, selectedRole);
  };
  
  // Handle role filter
  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    filterUsers(searchTerm, role);
  };
  
  // Filter users based on search term and role
  const filterUsers = (term, role) => {
    let filtered = users;
    
    // Filter by search term
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(lowerTerm) ||
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm)
      );
    }
    
    // Filter by role
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    
    setFilteredUsers(filtered);
  };
  
  // Handle edit user
  const handleEditUser = (userId) => {
    toast.info(`Editing user with ID: ${userId}`);
    // In a real app, this would navigate to an edit page or open a modal
  };
  
  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm(t('confirmDelete'))) {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => 
        (selectedRole ? user.role === selectedRole : true) &&
        (searchTerm ? 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
          : true
        )
      ));
      toast.success(t('userDeleted'));
    }
  };
  
  // Handle view user
  const handleViewUser = (userId) => {
    toast.info(`Viewing user with ID: ${userId}`);
    // In a real app, this would navigate to a user details page
  };
  
  return (
    <BackofficeLayout>
      <div className="all-user-page">
        <div className="page-header">
          <h1>{t('allUser')}</h1>
          <p>{t('manageAllUsers')}</p>
        </div>
        
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('searchUsers')} 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="role-filter">
            <select 
              value={selectedRole} 
              onChange={handleRoleFilter}
            >
              <option value="">{t('allRoles')}</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input type="checkbox" />
                </th>
                <th className="username-column">{t('username')}</th>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('role')}</th>
                <th>{t('actions')}</th>
                <th>{t('view')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="checkbox-column">
                    <input type="checkbox" />
                  </td>
                  <td className="username-column">
                    <div className="user-info">
                      <div className="user-avatar">
                        <FaUser />
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions-column">
                    <button 
                      className="action-button edit-button" 
                      onClick={() => handleEditUser(user.id)}
                      aria-label={t('edit')}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-button delete-button" 
                      onClick={() => handleDeleteUser(user.id)}
                      aria-label={t('delete')}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="view-column">
                    <button 
                      className="view-button" 
                      onClick={() => handleViewUser(user.id)}
                    >
                      {t('view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default AllUserPage;
