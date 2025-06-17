'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSort, FaEye, FaEyeSlash } from 'react-icons/fa';

// Import SCSS
import '@/styles/backoffice/menu.scss';

const MenuPage = () => {
  const t = useTranslations('Menu');
  
  // State for menu items data
  const [menuItems, setMenuItems] = useState([]);
  const [uiStrings, setUiStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  
  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch UI strings for labels
  const fetchUiStrings = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/ui-strings`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setUiStrings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching UI strings:', error);
      toast.error('Failed to load UI strings');
    }
  };
  
  // Handle adding new menu item
  const handleAddMenuItem = () => {
    setCurrentMenuItem({
      path: '',
      icon: '',
      sortOrder: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.sortOrder)) + 1 : 0,
      active: true,
      labelSlug: ''
    });
    setEditMode(true);
  };
  
  // Handle editing menu item
  const handleEditMenuItem = (menuItem) => {
    setCurrentMenuItem({ ...menuItem });
    setEditMode(true);
  };
  
  // Handle deleting menu item
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success(t('deleteSuccess'));
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error(t('deleteFailed'));
    }
  };
  
  // Handle toggling menu item active status
  const handleToggleActive = async (id, currentActive) => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${id}`,
        { active: !currentActive },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success(t('updateSuccess'));
      fetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error(t('updateFailed'));
    }
  };
  
  // Handle saving menu item (create or update)
  const handleSaveMenuItem = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Validate required fields
      if (!currentMenuItem.path || !currentMenuItem.labelSlug) {
        toast.error(t('requiredFields'));
        return;
      }
      
      if (currentMenuItem.id) {
        // Update existing menu item
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${currentMenuItem.id}`,
          currentMenuItem,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success(t('updateSuccess'));
      } else {
        // Create new menu item
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/menu-items`,
          currentMenuItem,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success(t('createSuccess'));
      }
      
      setEditMode(false);
      setCurrentMenuItem(null);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(t('saveFailed'));
    }
  };
  
  // Handle input change
  const handleInputChange = (field, value) => {
    setCurrentMenuItem({
      ...currentMenuItem,
      [field]: field === 'sortOrder' ? parseInt(value) : value
    });
  };
  
  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
    setCurrentMenuItem(null);
  };
  
  // Handle reordering menu items
  const handleMoveItem = async (id, direction) => {
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && itemIndex === 0) || 
      (direction === 'down' && itemIndex === menuItems.length - 1)
    ) {
      return; // Can't move further up/down
    }
    
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const currentItem = menuItems[itemIndex];
    const targetItem = menuItems[targetIndex];
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Swap sort orders
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${currentItem.id}`,
        { sortOrder: targetItem.sortOrder },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/menu-items/${targetItem.id}`,
        { sortOrder: currentItem.sortOrder },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      fetchMenuItems();
    } catch (error) {
      console.error('Error reordering menu items:', error);
      toast.error(t('reorderFailed'));
    }
  };
  
  // Get label text by slug
  const getLabelText = (slug) => {
    const string = uiStrings.find(s => s.slug === slug);
    return string ? string.en : slug;
  };
  
  useEffect(() => {
    fetchMenuItems();
    fetchUiStrings();
  }, []);
  
  return (
    <div className="menu-page">
      <div className="row align-items-center pb40">
        <div className="col-xxl-6">
          <div className="dashboard_title_area">
            <h2>{t('title')}</h2>
            <p>{t('description')}</p>
          </div>
        </div>
        <div className="col-xxl-6 text-end">
          <button 
            className="btn btn-primary" 
            onClick={handleAddMenuItem}
            disabled={editMode}
          >
            <FaPlus className="me-2" />
            {t('addNew')}
          </button>
        </div>
      </div>
      
      <div className="menu-container">
        {editMode ? (
          <div className="edit-form">
            <div className="form-header">
              <h3>{currentMenuItem.id ? t('editMenuItem') : t('addMenuItem')}</h3>
              <div className="form-actions">
                <button className="btn btn-light me-2" onClick={handleCancel}>
                  <FaTimes className="me-1" /> {t('cancel')}
                </button>
                <button className="btn btn-success" onClick={handleSaveMenuItem}>
                  <FaSave className="me-1" /> {t('save')}
                </button>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">{t('path')} *</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMenuItem.path}
                  onChange={(e) => handleInputChange('path', e.target.value)}
                  placeholder="/home, /about, etc."
                  required
                />
                <small className="form-text text-muted">{t('pathHelp')}</small>
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('icon')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMenuItem.icon || ''}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  placeholder="fa-home, fa-info, etc."
                />
                <small className="form-text text-muted">{t('iconHelp')}</small>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">{t('labelSlug')} *</label>
                <select
                  className="form-select"
                  value={currentMenuItem.labelSlug}
                  onChange={(e) => handleInputChange('labelSlug', e.target.value)}
                  required
                >
                  <option value="">{t('selectLabel')}</option>
                  {uiStrings.map(string => (
                    <option key={string.slug} value={string.slug}>
                      {string.slug} - {string.en}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">{t('labelHelp')}</small>
              </div>
              <div className="col-md-3">
                <label className="form-label">{t('sortOrder')}</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentMenuItem.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">{t('active')}</label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={currentMenuItem.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                  />
                  <label className="form-check-label">
                    {currentMenuItem.active ? t('activeYes') : t('activeNo')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="menu-table-container">
                <table className="menu-table">
                  <thead>
                    <tr>
                      <th>{t('order')}</th>
                      <th>{t('path')}</th>
                      <th>{t('label')}</th>
                      <th>{t('icon')}</th>
                      <th>{t('status')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length > 0 ? (
                      menuItems.sort((a, b) => a.sortOrder - b.sortOrder).map(item => (
                        <tr key={item.id} className={!item.active ? 'inactive-row' : ''}>
                          <td className="order-cell">
                            <div className="order-actions">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleMoveItem(item.id, 'up')}
                                disabled={item === menuItems.sort((a, b) => a.sortOrder - b.sortOrder)[0]}
                              >
                                ↑
                              </button>
                              <span className="mx-2">{item.sortOrder}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleMoveItem(item.id, 'down')}
                                disabled={item === menuItems.sort((a, b) => a.sortOrder - b.sortOrder)[menuItems.length - 1]}
                              >
                                ↓
                              </button>
                            </div>
                          </td>
                          <td>{item.path}</td>
                          <td>
                            <div className="label-info">
                              <span className="label-slug">{item.labelSlug}</span>
                              <span className="label-text">{getLabelText(item.labelSlug)}</span>
                            </div>
                          </td>
                          <td>{item.icon || '-'}</td>
                          <td>
                            <span className={`status-badge ${item.active ? 'active' : 'inactive'}`}>
                              {item.active ? t('activeYes') : t('activeNo')}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="btn btn-sm btn-outline-secondary me-1"
                              onClick={() => handleToggleActive(item.id, item.active)}
                              title={item.active ? t('deactivate') : t('activate')}
                            >
                              {item.active ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditMenuItem(item)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteMenuItem(item.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          {t('noMenuItems')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
