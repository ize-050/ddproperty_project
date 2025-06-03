'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackofficeLayout from '@/components/backoffice/layout/BackofficeLayout';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';

import 'react-toastify/dist/ReactToastify.css';

// Import Components
import ImageUploader from '@/components/common/ImageUploader';

// Import SCSS
import '@/styles/backoffice/blog.scss';

// Rich Text Editor
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

const CreateBlogPage = () => {
  const router = useRouter();
  const t = useTranslations('Blog');

  // State for active language tab
  const [activeLanguage, setActiveLanguage] = useState('en');

  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      en: { title: '', content: '' },
      th: { title: '', content: '' },
      zh: { title: '', content: '' },
      ru: { title: '', content: '' },
      category: '',
      tags: [],
      featuredImage: null,
    }
  });

  // Watch form values for validation
  const formValues = watch();

  // Language tabs
  const languages = [
    { code: 'en', name: 'ENGLISH (Main)', flag: '🇬🇧' },
    { code: 'th', name: 'THAI', flag: '🇹🇭' },
    { code: 'zh', name: 'CHINESE', flag: '🇨🇳' },
    { code: 'ru', name: 'RUSSIAN', flag: '🇷🇺' },
  ];

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Handle language change
  const handleLanguageChange = (langCode) => {
    setActiveLanguage(langCode);
  };

  // Handle image upload
  const handleImageUpload = (file, preview) => {
    setValue('featuredImage', file);
  };

  // ฟังก์ชัน onSubmit ที่ปรับปรุงแล้ว
  const onSubmit = async (data) => {
    console.log('Submitting form data:', data);
    
    const formData = new FormData();
    
    // ใช้ title ภาษาอังกฤษเป็นหลัก
    formData.append('title', data.en.title);
    
    // สร้าง translated_titles ที่รวมภาษาอังกฤษด้วย
    const translatedTitles = {
      en: data.en.title,
      th: data.th.title,
      zh: data.zh.title,
      ru: data.ru.title
    };
    
    // ตรวจสอบว่า translated_titles เป็น JSON ที่ถูกต้องก่อนส่ง
    try {
      const translatedTitlesJson = JSON.stringify(translatedTitles);
      console.log('Translated titles JSON:', translatedTitlesJson);
      formData.append('translated_titles', translatedTitlesJson);
    } catch (e) {
      console.error('Error stringifying translated titles:', e);
      toast.error('Error processing title translations');
      return;
    }
    
    // สร้าง translated_contents
    const translatedContents = {
      en: data.en.content,
      th: data.th.content,
      zh: data.zh.content,
      ru: data.ru.content
    };
    
    // ตรวจสอบว่า translated_contents เป็น JSON ที่ถูกต้องก่อนส่ง
    try {
      const translatedContentsJson = JSON.stringify(translatedContents);
      console.log('Translated contents JSON:', translatedContentsJson);
      formData.append('translated_contents', translatedContentsJson);
    } catch (e) {
      console.error('Error stringifying translated contents:', e);
      toast.error('Error processing content translations');
      return;
    }
    
    // ใช้ content ภาษาอังกฤษเป็นหลัก
    formData.append('content', data.en.content);
    
    // ข้อมูลภาษาอื่นๆ ส่งตามรูปแบบที่ backend คาดหวัง
    // แก้ไขเป็นการใช้ JSON.stringify เพียงอย่างเดียวแทนการส่งแบบ nested
    // เอา nested fields ออกเพื่อลดความสับสน
    // formData.append('th[title]', data.th.title);
    // formData.append('th[content]', data.th.content);
    // 
    // formData.append('zh[title]', data.zh.title);
    // formData.append('zh[content]', data.zh.content);
    // 
    // formData.append('ru[title]', data.ru.title);
    // formData.append('ru[content]', data.ru.content);

    formData.append('category', data.category);
    
    // ตรวจสอบว่า tags เป็น JSON ที่ถูกต้องก่อนส่ง
    try {
      const tagsJson = JSON.stringify(data.tags);
      console.log('Tags JSON:', tagsJson);
      formData.append('tags', tagsJson);
    } catch (e) {
      console.error('Error stringifying tags:', e);
      toast.error('Error processing tags');
      return;
    }
    
    if (data.featuredImage) {
      formData.append('featuredImage', data.featuredImage);
    }

    try {
      // ส่งข้อมูลไปยัง API
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('You must be logged in to create a blog post');
        router.push('/backoffice/login');
        return;
      }
      
      // ดู formData ที่จะส่ง
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY
        }
      });

      console.log("response", response);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to create blog post');
      }

      toast.success('Blog post created successfully!');
      router.push('/backoffice/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post. Please try again.');
    }
  };
  return (
    <BackofficeLayout>
      <div className="blog-page">
        <div className="blog-container">
          <div className="page-header">
            <h1>Create New Blog Post</h1>
            <p>Add a new blog post with multilingual support</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
            {/* Language Tabs */}
            <div className="language-tabs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`language-tab ${activeLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                </button>
              ))}
            </div>

            {/* Title Input */}
            <div className="form-group">
            <label htmlFor="title">Title*</label>
            {languages.map((lang) => (
              <div key={lang.code} style={{ display: activeLanguage === lang.code ? 'block' : 'none' }}>
            
                  <Controller
                    name={`${lang.code}.title`}
                    control={control}
                    rules={{ required: true }}
                render={({ field: { onChange, ...restField } }) => (
                  <input
                    type="text"
                    id="title"
                    {...restField}
                    onChange={(e) => {
                      onChange(e);
                      
                    }}
                    placeholder={`Enter title in ${languages.find(l => l.code === activeLanguage).name}`}
                    className={`form-control ${errors[activeLanguage]?.title ? 'is-invalid' : ''}`}
                  />
                )}
              />
            </div>
                        
          ))}
              {errors[activeLanguage]?.title && (
                <div className="invalid-feedback">{languages.find(l => l.code === activeLanguage).name} title is required</div>
              )}
              </div>
  
            {/* Rich Text Editor */}
            <div className="form-group editor-container">
              <label htmlFor="content">Content*</label>
              {languages.map((lang) => (
                <div key={lang.code} style={{ display: activeLanguage === lang.code ? 'block' : 'none' }}>
                  <Controller
                    name={`${lang.code}.content`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...restField } }) => (
                      <ReactQuill
                        theme="snow"
                        {...restField}
                        onChange={(value) => {
                          onChange(value)
                        }}
                        modules={modules}
                        placeholder={`Enter content in ${lang.name}`}
                      />
                    )}
                  />
                </div>
              ))}
              {errors[activeLanguage]?.content && (
                <div className="invalid-feedback">{languages.find(l => l.code === activeLanguage).name} content is required</div>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    id="category"
                    {...field}
                    placeholder="Enter category"
                    className="form-control"
                  />
                )}
              />
            </div>

            {/* Featured Image */}
            <div className="form-group">
              <label>Feature Image*</label>
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    image={field.value}
                    onImageChange={handleImageUpload}
                    placeholderText="Upload/Drag photos of your blog"
                    hintText="Recommended width is at least 1080px"
                  />
                )}
              />
              {errors.featuredImage && (
                <div className="invalid-feedback">Featured image is required</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => router.push('/backoffice/blog')}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Create Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default CreateBlogPage;
