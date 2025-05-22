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
    // ตรวจสอบว่าทุกภาษามีข้อมูลครบถ้วน
    let missingFields = false;

    for (const lang of languages) {
      if (!data[lang.code].title || !data[lang.code].content) {
        toast.error(`Please fill in all required fields for ${lang.name}`);
        setActiveLanguage(lang.code);
        missingFields = true;
        break;
      }
    }

    if (missingFields) {
      toast.error(`Please fill in all required fields for ${missingFields}`);
      return;
    }

    if (!data.featuredImage) {
      toast.error('Featured image is required');
      return;
    }


    const formData = new FormData();
    formData.append('title', JSON.stringify({
      en: data.en.title,
      th: data.th.title,
      zh: data.zh.title,
      ru: data.ru.title
    }));

    formData.append('content', JSON.stringify({
      en: data.en.content,
      th: data.th.content,
      zh: data.zh.content,
      ru: data.ru.content
    }));

    formData.append('category', data.category);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('featuredImage', data.featuredImage);

    try {
      // ส่งข้อมูลไปยัง API
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, formData,{
        headers: {
          'content-type': 'multipart/form-data',
          "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error('Failed to create blog post');
        return;
      }

      toast.success('Blog post created successfully!');
      //router.push('/backoffice/blog');
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
            {/* Featured Image */}
            <div className="form-group">
              <label>Feature Image</label>
              <Controller
                name="featuredImage"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <ImageUploader
                    image={field.value}
                    onImageChange={handleImageUpload}
                    placeholderText="Upload/Drag photos of your property"
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
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default CreateBlogPage;
