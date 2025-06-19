'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { FaSearch, FaEdit, FaTrash, FaUser, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import userService from '@/services/userService';
import UserFormModal from '@/components/backoffice/user/UserFormModal';

// Import SCSS
import '@/styles/backoffice/all-user.scss';

const AllUserPage = () => {
  const t = useTranslations('Users');
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // State for user form modal
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Load users data
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);
  
  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role: selectedRole || undefined
      };
      
      const response = await userService.getAllUsers(params);
      console.log("Response from getAllUsers:", response);
      if (response.status === 'success') {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setPagination({
          ...pagination,
          total: response.meta.total,
          totalPages: response.meta.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Reset to first page when searching
    setPagination({
      ...pagination,
      page: 1
    });
    
    // If term is empty, fetch all users
    if (!term && !selectedRole) {
      fetchUsers();
      return;
    }
    
    // Otherwise filter locally for better UX
    let filtered = users;
    
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name && user.name.toLowerCase().includes(lowerTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerTerm))
      );
    }
    
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  };
  
  // Handle role filter
  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    
    // Reset to first page when filtering
    setPagination({
      ...pagination,
      page: 1
    });
    
    // If no role and no search term, fetch all users
    if (!role && !searchTerm) {
      fetchUsers();
      return;
    }
    
    // Otherwise filter locally
    let filtered = users;
    
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name && user.name.toLowerCase().includes(lowerTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerTerm))
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  // Handle add user
  const handleAddUser = () => {
    setCurrentUser(null);
    setModalMode('add');
    setShowModal(true);
  };
  
  // Handle edit user
  const handleEditUser = async (userId) => {
    try {
      setLoading(true);
      const response = await userService.getUserById(userId);
      
      if (response.status === 'success') {
        setCurrentUser(response.data);
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error(error.response?.data?.message || 'Failed to get user details');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: t('confirmDelete'),
      text: t('deleteUserConfirmation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userService.deleteUser(userId);
          
          if (response.status === 'success') {
            toast.success(t('userDeleted'));
            fetchUsers(); // Refresh the user list
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error(error.response?.data?.message || 'Failed to delete user');
        }
      }
    });
  };
  
  // Handle form submission from modal
  const handleFormSubmit = async (userData) => {
    try {
      if (modalMode === 'add') {
        await userService.createUser(userData);
        toast.success(t('userCreated'));
      } else {
        await userService.updateUser(currentUser.id, userData);
        toast.success(t('userUpdated'));
      }
      
      setShowModal(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.response?.data?.message || `Failed to ${modalMode === 'add' ? 'create' : 'update'} user`);
    }
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };
  
  // Generate pagination controls
  const renderPagination = () => {
    const pages = [];
    const { page, totalPages } = pagination;
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="pagination-button"
      >
        &laquo;
      </button>
    );
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${page === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="pagination-button"
      >
        &raquo;
      </button>
    );
    
    return pages;
  };
  
  return (
    <>
      <div className="all-user-page">
        <div className="page-header">
          <div className="title-section">
            <h1>{t('allUser')}</h1>
            <p>{t('manageAllUsers')}</p>
          </div>
          <button 
            className="add-user-button" 
            onClick={handleAddUser}
          >
            <FaPlus /> {t('addUser')}
          </button>
        </div>
        

        <div className="users-table-container">
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-data-message">{t('noUsersFound')}</div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input type="checkbox" />
                    </th>
                    <th>{t('name')}</th>
                    <th>{t('email')}</th>
                    <th>{t('phone')}</th>
                    <th>{t('role')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="checkbox-column">
                        <input type="checkbox" />
                      </td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUser />
                          </div>
                          <span>{user.name || '-'}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="pagination-container">
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* User Form Modal */}
      {showModal && (
        <UserFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
          user={currentUser}
          mode={modalMode}
        />
      )}
    </>
  );
};

export default AllUserPage;
