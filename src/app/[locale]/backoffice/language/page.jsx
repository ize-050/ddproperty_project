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
  const t = useTranslations('Language');
  
  // State for UI strings data
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentString, setCurrentString] = useState(null);
  
  // Sections corresponding to tabs
  const sections = ['header', 'home', 'rent', 'blog', 'aboutus', 'contact', 'listing', 'footer'];
  
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
      toast.error(t('loadFailed'));
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
    if (!window.confirm(t('confirmDelete'))) return;
    
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success(t('deleteSuccess'));
      fetchStrings();
    } catch (error) {
      console.error('Error deleting UI string:', error);
      toast.error(t('deleteFailed'));
    }
  };
  
  // Handle saving string (create or update)
  const handleSaveString = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Validate required fields
      if (!currentString.slug || !currentString.en || !currentString.th) {
        toast.error(t('requiredFieldsMissing'));
        return;
      }
      
      if (currentString.id) {
        // Update existing string
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings/${currentString.id}`,
          currentString,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success(t('updateSuccess'));
      } else {
        // Create new string
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/ui-strings`,
          currentString,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success(t('createSuccess'));
      }
      
      setEditMode(false);
      setCurrentString(null);
      fetchStrings();
    } catch (error) {
      console.error('Error saving UI string:', error);
      toast.error(t('saveFailed'));
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
            <h2>{t('title')}</h2>
            <p>{t('subtitle')}</p>
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
              {t('addNew')}
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
            <Tab>{t('tabs.header')}</Tab>
            <Tab>{t('tabs.home')}</Tab>
            <Tab>{t('tabs.rent')}</Tab>
            <Tab>{t('tabs.blog')}</Tab>
            <Tab>{t('tabs.about')}</Tab>
            <Tab>{t('tabs.contact')}</Tab>
            <Tab>{t('tabs.listing')}</Tab>
            <Tab>{t('tabs.footer')}</Tab>
          </TabList>
          
          {sections.map((section, index) => (
            <TabPanel key={section}>
              {editMode ? (
                <div className="edit-form">
                  <div className="form-header">
                    <h3>{currentString.id ? t('form.editTitle') : t('form.addTitle')}</h3>
                    <div className="form-actions">
                      <button className="btn btn-light me-2" onClick={handleCancel}>
                        <FaTimes className="me-1" /> {t('form.cancel')}
                      </button>
                      <button className="btn btn-success" style={{
                        color:'#fff'
                      }} onClick={handleSaveString}>
                        <FaSave className="me-1"  /> {t('form.save')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">{t('form.slug')} {t('form.required')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentString.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder={t('form.slugPlaceholder')}
                        required
                      />
                      <small className="form-text text-muted">{t('form.slugDescription')}</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t('form.section')}</label>
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
                        <label className="form-label">{t('form.english')} {t('form.required')}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.en}
                          onChange={(e) => handleInputChange('en', e.target.value)}
                          placeholder={t('form.englishPlaceholder')}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">{t('form.thai')} {t('form.required')}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.th}
                          onChange={(e) => handleInputChange('th', e.target.value)}
                          placeholder={t('form.thaiPlaceholder')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">{t('form.chinese')}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.zhCN}
                          onChange={(e) => handleInputChange('zhCN', e.target.value)}
                          placeholder={t('form.chinesePlaceholder')}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">{t('form.russian')}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentString.ru}
                          onChange={(e) => handleInputChange('ru', e.target.value)}
                          placeholder={t('form.russianPlaceholder')}
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
                        <span className="visually-hidden">{t('loading')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="language-table-container">
                      <table className="language-table">
                        <thead>
                          <tr>
                            <th>{t('table.slug')}</th>
                            <th>{t('table.english')}</th>
                            <th>{t('table.thai')}</th>
                            <th>{t('table.chinese')}</th>
                            <th>{t('table.russian')}</th>
                            <th>{t('table.actions')}</th>
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
                                {t('noStringsFound')}
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
