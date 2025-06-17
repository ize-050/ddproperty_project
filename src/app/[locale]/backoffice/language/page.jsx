'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaFileExport } from 'react-icons/fa';

// Import SCSS
import '@/styles/backoffice/language.scss';

const LanguagePage = () => {
  
  // State for UI strings data
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentString, setCurrentString] = useState(null);
  
  // Sections corresponding to tabs
  const sections = ['header', 'home', 'rent', 'blog', 'about', 'contact'];
  
  // Fetch UI strings from API
  const fetchStrings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/ui-strings`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setStrings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching UI strings:', error);
      toast.error('Failed to load language data');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding new string
  const handleAddString = () => {
    setCurrentString({
      section: sections[activeTab],
      slug: '',
      en: '',
      th: '',
      zhCN: '',
      ru: ''
    });
    setEditMode(true);
  };
  
  // Handle editing string
  const handleEditString = (string) => {
    setCurrentString({ ...string });
    setEditMode(true);
  };
  
  // Handle deleting string
  const handleDeleteString = async (id) => {
    if (!window.confirm('Are you sure you want to delete this language data?')) return;
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success('Delete language data successfully');
      fetchStrings();
    } catch (error) {
      console.error('Error deleting UI string:', error);
      toast.error('Failed to delete language data');
    }
  };
  
  // Handle saving string (create or update)
  const handleSaveString = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Validate required fields
      if (!currentString.slug || !currentString.en || !currentString.th) {
        toast.error('Required fields are missing');
        return;
      }
      
      if (currentString.id) {
        // Update existing string
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/${currentString.id}`,
          currentString,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success('Update language data successfully');
      } else {
        // Create new string
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings`,
          currentString,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success('Create language data successfully');
      }
      
      setEditMode(false);
      setCurrentString(null);
      fetchStrings();
    } catch (error) {
      console.error('Error saving UI string:', error);
      toast.error('Failed to save language data');
    }
  };
  
  // Handle input change
  const handleInputChange = (field, value) => {
    setCurrentString({
      ...currentString,
      [field]: value
    });
  };
  
  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
    setCurrentString(null);
  };
  
  // Filter strings by section
  const getStringsBySection = (section) => {
    return strings.filter(string => string.section === section);
  };
  

  
 
  
  useEffect(() => {
    fetchStrings();
  }, []);
  
  return (
    <div className="language-page">
      <div className="row align-items-center pb40">
        <div className="col-xxl-6">
          <div className="dashboard_title_area">
            <h2> Language </h2>
            <p>We are glad to see you again!</p>
          </div>
        </div>
        <div className="col-xxl-6 text-end">
          <div className="d-flex justify-content-end gap-2">
        
            <button 
              className="btn btn-primary" 
              style={{
                color:'#fff',
                background:'#dc3545',
                border: '1px #dc3545 solid'
              }}
              onClick={handleAddString}
              disabled={editMode}
            >
              <FaPlus className="me-2" />
              Add New
            </button>
          </div>
        </div>
      </div>
      
      <div className="language-container">
        <Tabs 
          selectedIndex={activeTab} 
          onSelect={index => setActiveTab(index)}
          className="language-tabs"
        >
          <TabList className="nav nav-tabs">
            <Tab>Header</Tab>
            <Tab>Home</Tab>
            <Tab>Rent</Tab>
            <Tab>Blog</Tab>
            <Tab>About</Tab>
            <Tab>Contact</Tab>
          </TabList>
          
          {sections.map((section, index) => (
            <TabPanel key={section}>
              {editMode ? (
                <div className="edit-form">
                  <div className="form-header">
                    <h3>{currentString.id ? 'Edit String' : 'Add String'}</h3>
                    <div className="form-actions">
                      <button className="btn btn-light me-2" onClick={handleCancel}>
                        <FaTimes className="me-1" /> Cancel
                      </button>
                      <button className="btn btn-success" style={{
                        color:'#fff'
                      }} onClick={handleSaveString}>
                        <FaSave className="me-1"  /> Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Slug *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentString.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="Slug"
                        required
                      />
                      <small className="form-text text-muted">Slug</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Section</label>
                      <select
                        className="form-select"
                        value={currentString.section}
                        onChange={(e) => handleInputChange('section', e.target.value)}
                      >
                        {sections.map(section => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="language-inputs">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">English *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.en}
                          onChange={(e) => handleInputChange('en', e.target.value)}
                          placeholder="English text"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Thai *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.th}
                          onChange={(e) => handleInputChange('th', e.target.value)}
                          placeholder="Thai text"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Chinese</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.zhCN}
                          onChange={(e) => handleInputChange('zhCN', e.target.value)}
                          placeholder="Chinese text"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Russian</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.ru}
                          onChange={(e) => handleInputChange('ru', e.target.value)}
                          placeholder="Russian text"
                        />
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
                    <div className="language-table-container">
                      <table className="language-table">
                        <thead>
                          <tr>
                            <th>Slug</th>
                            <th>English</th>
                            <th>Thai</th>
                            <th>Chinese</th>
                            <th>Russian</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getStringsBySection(section).length > 0 ? (
                            getStringsBySection(section).map(string => (
                              <tr key={string.id}>
                                <td className="slug-cell">{string.slug}</td>
                                <td>{string.en}</td>
                                <td>{string.th}</td>
                                <td>{string.zhCN || '-'}</td>
                                <td>{string.ru || '-'}</td>
                                <td className="actions-cell">
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEditString(string)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteString(string.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-4">
                                No strings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default LanguagePage;
